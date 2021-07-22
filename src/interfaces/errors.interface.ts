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

export interface ErrorEventsInter {
  [key: string]: Function;
}
