import React, { useState } from "react";
import {BigraphSchemaType, QueryParams} from "../components/datamodel/requests";


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
    setter?: (data: any) => any,
  ): Promise<void> => {
    try {
      // parse query params and body form data
      const requestUrl = this.formatUrl(path, queryParams);
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
      const data = await response.json();
      if (setter) {
        setter(data);
      }
      
      return data;
      
    } catch (error) {
      console.error("There was an error in the request:", error);
      throw error;
    }
  }
  
  private formatUrl(path: string, queryParams?: QueryParams): string {
    const endpoint = this.getEndpoint(path);
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
  
  public getBigraphSchemaTypes = async (): Promise<BigraphSchemaType[]> => {
  
  }
  
  public submitProcessMetadata = async (
    configFile: File | null,
    genericFile: File | null,
    processId: string,
    setResponse: (data: any) => any,
    returnCompositeState: boolean = true
  ): Promise<void> => {
    if (!configFile || !genericFile) {
      alert("Please select both files before uploading!");
      return;
    };
    
    const queryParams: QueryParams = {
      process_id: processId,
      return_composite_state: String(returnCompositeState),
    };
    
    const formData = new FormData();
    formData.append("config", configFile);
    formData.append("model_files", genericFile);

    try {
      const response = await this.submitRequest(this.paths.Metadata, "POST", formData, queryParams, setResponse);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };
  
  public getEndpoint(path: string): string {
    return this.apiUrlRoot + path;
  };
}

export default ComposeService;


// `${apiUrl}?process_id=${encodeURIComponent(processId)}&return_composite_state=${returnCompositeState}`,
