import { inject, injectable } from 'inversify';
import { IExceptionFilter } from './interfaces/exception-filter.interface.js';
import { Component } from '../../../types/index.js';
import { ILogger } from '../../logger/index.js';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class DefaultExceptionFilter implements IExceptionFilter {
  constructor(
    @inject(Component.Logger) private readonly _logger: ILogger
  ) {
    this._logger.info('Register DefaultExceptionFilter');
  }

  public catch(error: Error, _req: Request, res: Response, _next: NextFunction): void {
    this._logger.error(error.message, error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
}
