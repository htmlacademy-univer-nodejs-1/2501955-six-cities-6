import { inject, injectable } from 'inversify';
import { IExceptionFilter } from './interfaces/exception-filter.interface.js';
import { Component } from '../../../types/index.js';
import { ILogger } from '../../logger/index.js';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../errors/index.js';
import { createErrorObject } from '../../../helpers/common.helper.js';

@injectable()
export class DefaultExceptionFilter implements IExceptionFilter {
  constructor(
    @inject(Component.Logger) private readonly _logger: ILogger
  ) {
    this._logger.info('Register DefaultExceptionFilter');
  }

  public catch(
    error: Error | HttpError,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    if (error instanceof HttpError) {
      return this.handleHttpError(error, req, res, next);
    }

    return this.handleOtherError(error, req, res, next);
  }

  private handleHttpError(
    error: HttpError,
    _req: Request,
    res: Response,
    _next: NextFunction
  ): void {
    this._logger.error(`[${error.detail}]: ${error.httpStatusCode} — ${error.message}`, error);
    res
      .status(error.httpStatusCode)
      .json(createErrorObject(error.message));
  }

  private handleOtherError(
    error: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
  ): void {
    this._logger.error(error.message, error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createErrorObject(error.message));
  }
}
