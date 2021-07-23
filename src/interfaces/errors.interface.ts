export interface CastError {
  stringValue: string;
  valueType: string;
  kind: string;
  value: string;
  path: string;
  reason: {};
  name: string;
  message: string;
}

export interface ValidationError {
  errors: Object;
}

export interface MongoError {
  code: number;
  message: string;
}

export interface ErrorEventsInter {
  [key: string]: Function;
}
