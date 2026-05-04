import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from './interfaces/middleware.interface.js';
import { HttpError } from '../errors/index.js';
import { StatusCodes } from 'http-status-codes';

export class PrivateRouteMiddleware implements IMiddleware {
  public async execute({ tokenPayload }: Request, _res: Response, next: NextFunction): Promise<void> {
    if (!tokenPayload) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'PrivateRouteMiddleware'
      );
    }

    return next();
  }
}
