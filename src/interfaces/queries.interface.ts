export interface QueryString {
  [key: string]: string | number | undefined;
  sort: string;
  fields: string;
  page: string;
  limit: string;
}

export interface filterObj {
  [key: string]: string | undefined;
}
