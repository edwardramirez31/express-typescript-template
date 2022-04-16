/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';

type Handler = (req: Request, res: Response) => any;
export type MiddlewareHandler = (req: Request, res: Response, next: NextFunction) => any;

export default Handler;
