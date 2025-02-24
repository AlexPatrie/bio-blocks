// method param/setup types //

export type RequestInit = {
  method: "POST" | "GET",  // TODO: add more when needed
  body?: FormData
}

export type QueryParams = Record<string, number | string | any>;


// return data types //

export type BigraphSchemaType = Record<string, any> & {
  typeId: string,
  defaultValue: string | {} | [] | number,
  description: string | null
}

type PortSchema = Record<string, string | string[]>;

export type InputPortSchema = PortSchema;

export type OutputPortSchema = PortSchema;

export type StateData = Record<string, string | number | string[] | number[] | object>;  // TODO: align this with the flow models

export type ProcessMetadata = {
  process_address: string,
  input_schema: InputPortSchema,
  output_schema: OutputPortSchema,
  initial_state: StateData,
  state: StateData | null
}

// export type ProcessMetadata = Record<string, string> | Record<string, any> & {
//   process_address: string,
//   input_schema: InputPortSchema,
//   output_schema: OutputPortSchema,
//   initial_state: Record<string, any>,
//   id?: string,
//   state?: StateData
// }
