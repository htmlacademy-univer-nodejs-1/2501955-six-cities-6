import { ClassConstructor, plainToInstance } from 'class-transformer';
import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { IMiddleware } from './interfaces/middleware.interface.js';
import { ValidationError } from '../errors/index.js';
import { reduceValidationErrors } from '../../../helpers/index.js';

export class ValidateDtoMiddleware implements IMiddleware {
  constructor (private readonly _dto: ClassConstructor<object>) {}

  public async execute({ body, path }: Request, _res: Response, next: NextFunction): Promise<void> {
    const dtoInstance = plainToInstance(this._dto, body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      throw new ValidationError(`Validation error: ${path}`, reduceValidationErrors(errors));
    }

    next();
  }
}
