// method param/setup types //

import {Params} from "next/dist/shared/lib/router/utils/route-matcher";

export type RequestInit = {
  method: "POST" | "GET",  // TODO: add more when needed
  body?: FormData
}

export type QueryParams = Params;


// return data types //

export type BigraphSchemaType = Record<string, any> & {
  typeId: string,
  defaultValue: string | {} | [] | number,
  description: string | null
}

export type RegisteredAddresses = {
  version: string,
  registered_addresses: string[]
}

export type ValidatedComposition = Record<string, any> & {
  valid: boolean,
  invalid_nodes: Record<string, string>[] | null
}

type PortSchema = Record<string, string | string[]>;

export type InputPortSchema = PortSchema;

export type OutputPortSchema = PortSchema;

export type StateData = Record<string, string | number | string[] | number[] | object>;  // TODO: align this with the flow models

export type ProcessMetadata = {
  [key: string]: string | InputPortSchema | OutputPortSchema | StateData | undefined,
  process_address: string,
  input_schema: InputPortSchema,
  output_schema: OutputPortSchema,
  initial_state: StateData,
  state?: StateData,
}
