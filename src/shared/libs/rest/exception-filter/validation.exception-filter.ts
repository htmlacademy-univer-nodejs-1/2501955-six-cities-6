import { inject, injectable } from 'inversify';
import { IExceptionFilter } from './interfaces/exception-filter.interface.js';
import { Component } from '../../../types/index.js';
import { ILogger } from '../../logger/index.js';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../errors/index.js';
import { createErrorObject } from '../../../helpers/index.js';
import { ApplicationError } from '../enums/index.js';

@injectable()
export class ValidationExceptionFilter implements IExceptionFilter {
  constructor(
    @inject(Component.Logger) private readonly _logger: ILogger
  ) {
    this._logger.info('ValidationExceptionFilter registered');
  }

  public catch(error: unknown, _req: Request, res: Response, next: NextFunction): void {
    if (!(error instanceof ValidationError)) {
      return next(error);
    }

    this._logger.error(`[ValidationException]: ${error.message}`, error);
    error.details.forEach((errorField) => this._logger.debug(`[${errorField.property}] — ${errorField.messages}`));

    res
      .status(error.httpStatusCode)
      .json(createErrorObject(ApplicationError.ValidationError, error.message, error.details));
  }
}
