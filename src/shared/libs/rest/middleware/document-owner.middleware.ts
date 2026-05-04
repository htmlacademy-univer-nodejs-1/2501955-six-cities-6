import { Request, Response, NextFunction } from 'express';
import { IDocumentOwnerCheck } from '../interfaces/document-owner-check.interface.js';
import { IMiddleware } from './interfaces/middleware.interface.js';
import { HttpError } from '../errors/index.js';
import { StatusCodes } from 'http-status-codes';

export class DocumentOwnerMiddleware implements IMiddleware {
  constructor(
    private readonly _service: IDocumentOwnerCheck,
    private readonly _entityName: string,
    private readonly _paramName: string
  ) {}

  public async execute({ params, tokenPayload }: Request, _res: Response, next: NextFunction): Promise<void> {
    const raw = params[this._paramName];
    const documentId = Array.isArray(raw) ? raw[0] : raw;

    const ownerId = await this._service.getOwnerId(documentId);
    if (ownerId !== tokenPayload.id) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        `You are not the owner of this ${this._entityName}`,
        'DocumentOwnerMiddleware'
      );
    }

    next();
  }
}
