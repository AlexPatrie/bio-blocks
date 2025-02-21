// method param/setup types //

export type RequestInit = {
  method: "POST" | "GET",  // TODO: add more when needed
  body?: FormData
}

export type QueryParams = Record<string, number | string | any>;


// return data types //

export type BigraphSchemaType = {
  typeId: string,
  defaultValue: string | {} | [] | number,
  description: string | null
}
