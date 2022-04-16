import { HydratedDocument } from 'mongoose';
import { IUser } from '../../models/user';

declare module 'express-serve-static-core' {
  interface Request {
    user?: HydratedDocument<IUser>;
  }
}
