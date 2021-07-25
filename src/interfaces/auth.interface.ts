import { Request } from 'express';

export interface DataStoredInToken {
  id: string;
  iat: number;
  exp: number;
}
