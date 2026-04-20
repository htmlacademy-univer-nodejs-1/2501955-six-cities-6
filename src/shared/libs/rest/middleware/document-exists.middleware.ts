import { Request, Response, NextFunction } from 'express';
import { IDocumentExists } from '../interfaces/document-exists.interface.js';
import { IMiddleware } from './interfaces/middleware.interface.js';
import { HttpError } from '../errors/http.error.js';
import { StatusCodes } from 'http-status-codes';

export class DocumentExistsMiddleware implements IMiddleware {
  constructor(
    private readonly _service: IDocumentExists,
    private readonly _entityName: string,
    private readonly _paramName: string
  ) {}

  public async execute({ params }: Request, _res: Response, next: NextFunction): Promise<void> {
    const raw = params[this._paramName];
    const documentId = Array.isArray(raw) ? raw[0] : raw;

    if (!await this._service.exists(documentId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `${this._entityName} with ${documentId} not found`,
        'DocumentExistsMiddleware'
      );
    }

    next();
  }
}
