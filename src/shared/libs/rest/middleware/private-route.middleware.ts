import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from './interfaces/middleware.interface.js';
import { HttpError } from '../errors/index.js';
import { StatusCodes } from 'http-status-codes';

export class PrivateRouteMiddleware implements IMiddleware {
  constructor(
    private readonly _isForbiddenForAuthorized?: boolean
  ) {}

  public async execute({ tokenPayload }: Request, _res: Response, next: NextFunction): Promise<void> {
    if (!this._isForbiddenForAuthorized && !tokenPayload) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'PrivateRouteMiddleware'
      );
    }

    if (this._isForbiddenForAuthorized && !!tokenPayload) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'This route is for unauthorized users only',
        'PrivateRouteMiddleware'
      );
    }

    return next();
  }
}
