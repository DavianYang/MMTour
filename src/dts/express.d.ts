import { UserDocument } from '@interfaces/users.interface';

declare global {
  namespace Express {
    export interface Request {
      user: UserDocument;
    }
  }
}
