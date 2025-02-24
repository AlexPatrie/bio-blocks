import React, { useState } from "react";
import {
  BigraphSchemaType,
  ProcessMetadata,
  QueryParams,
  RegisteredAddresses,
  ValidatedComposition
} from "../components/datamodel/requests";
import {Params} from "next/dist/shared/lib/router/utils/route-matcher";


export enum ComposePaths {
  // TODO: add more
  Metadata = "/get-process-metadata",
  Addresses = "/get-process-bigraph-addresses",
  Types = "/get-bigraph-schema-types",
  Validate = "/validate-composition",
  Submit = "/submit",
  State = "/get-composition-state",
  Output = "/get-output"
}



class ComposeService {
  public apiUrlRoot = "https://compose.biosimulations.org";
  public paths = ComposePaths;
  
  public constructor() {}
  
  public handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    fileSetter: (file: File | null) => void
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      fileSetter(event.target.files[0]);
    }
  }
  
  public handleConfigFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setConfigFile: (file: File | null) => void
  )=> {
    this.handleFileChange(event, setConfigFile);
  };
  
  public handleGenericFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setGenericFile: (file: File | null) => void
  ) => {
    this.handleFileChange(event, setGenericFile);
  };
  
  public submitRequest = async (
    path: string,
    method: "POST" | "GET",
    formData?: FormData,
    queryParams?: QueryParams,
    // setter?: (data: any) => any,
  ): Promise<void | any | undefined> => {
    try {
      // parse query params and body form data
      const requestUrl = this.formatRequestUrl(path, queryParams);
      const requestInit: RequestInit = { method: method };
      
      if (formData) {
        requestInit.body = formData;
      }
      
      // submit request and handle error
      const response = await fetch(requestUrl, requestInit);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // get data and possibly set it
      // if (setter) {
      //   setter(data);
      // }
      // return data;
      return await response.json();
    } catch (error) {
      console.error("There was an error in the request:", error);
      throw error;
    }
  }
  
  public getBigraphSchemaTypes = async (): Promise<BigraphSchemaType[]> => {
    try {
      return await this.submitRequest(this.paths.Types, "GET");
    } catch (error) {
      throw error;
    }
  }
  
  public getBigraphSchemaAddresses = async (): Promise<RegisteredAddresses> => {
    try {
      return await this.submitRequest(this.paths.Addresses, "GET");
    } catch (error) {
      throw error;
    }
  }
  
  public validateComposition = async (
    specFile: File | null
  ): Promise<ValidatedComposition | null> => {
    if (!specFile) {
      alert("Please select a composition JSON file.");
      return null;
    }
    try {
      const formData = new FormData();
      formData.append("spec_file", specFile);
      return await this.submitRequest(this.paths.Validate, `POST`);
    } catch (error) {
      throw error;
    }
  }
  
  public submitProcessMetadata = async (
    configFile: File | null,
    genericFile: File | null,
    processId: string,
    // setResponse: (data: any) => any,
    returnCompositeState: boolean = true
  ): Promise<ProcessMetadata | undefined> => {
    if (!configFile || !genericFile) {
      alert("Please select both files before uploading!");
      return;
    }
    
    const queryParams: QueryParams = {
      process_id: processId,
      return_composite_state: String(returnCompositeState),
    };
    
    const formData = new FormData();
    formData.append("config", configFile);
    formData.append("model_files", genericFile);

    try {
      return await this.submitRequest(this.paths.Metadata, "POST", formData, queryParams); // setResponse);
    } catch (error) {
      console.error("Error uploading files:", error);
      throw error;
    }
  };
  
  private getPath(path: string): string {
    return this.apiUrlRoot + path;
  };
  
  private formatRequestUrl(path: string, queryParams?: QueryParams): string {
    const endpoint = this.getPath(path);
    let url = `${endpoint}`;
  
    if (queryParams && Object.keys(queryParams).length > 0) {
      const paramSection = new URLSearchParams(
        Object.entries(queryParams).reduce((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {} as Record<string, string>)
      ).toString();
      
      url += `?${paramSection}`;
    }
  
    return url;
  }
}

export default ComposeService;


// `${apiUrl}?process_id=${encodeURIComponent(processId)}&return_composite_state=${returnCompositeState}`,
