import { NextFunction, Request, Response } from 'express';
import { HttpMethod } from '../enums/http-method.enum.js';
import { IMiddleware } from '../middleware/index.js';

export interface IRoute {
  path: string;
  method: HttpMethod;
  handler: (req: Request, res: Response, next: NextFunction) => void;
  middlewares?: IMiddleware[];
}
