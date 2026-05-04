import { inject, injectable } from 'inversify';
import { IExceptionFilter } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { Request, Response, NextFunction } from 'express';
import { BaseAuthException } from './exceptions/base-auth.exception.js';

@injectable()
export class AuthExceptionFilter implements IExceptionFilter {
  constructor(
    @inject(Component.Logger) private readonly _logger: ILogger
  ) {
    this._logger.info('AuthExceptionFilter registered');
  }

  public catch(error: Error, _req: Request, res: Response, next: NextFunction): void {
    if (!(error instanceof BaseAuthException)) {
      return next(error);
    }

    this._logger.error(`[AuthModule] ${error.message}`, error);
    res
      .status(error.httpStatusCode)
      .json({
        type: 'AUTHORIZATION',
        error: error.message
      });
  }
}
