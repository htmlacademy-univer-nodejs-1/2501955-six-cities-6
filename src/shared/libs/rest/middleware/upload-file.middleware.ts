import { Request, Response, NextFunction } from 'express';
import multer, { diskStorage } from 'multer';
import { extension } from 'mime-types';
import { nanoid } from 'nanoid';
import { IMiddleware } from './interfaces/middleware.interface.js';
import { HttpError } from '../errors/http.error.js';
import { StatusCodes } from 'http-status-codes';

export class UploadFileMiddleware implements IMiddleware {
  constructor(
    private readonly _uploadDirectory: string,
    private readonly _fieldName: string
  ) {}

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const storage = diskStorage({
      destination: this._uploadDirectory,
      filename: (_req, file, callback) => {
        const fileExtension = extension(file.mimetype);
        if (!fileExtension) {
          callback(new HttpError(
            StatusCodes.BAD_REQUEST,
            `Cannot resolve extension for mimetype ${file.mimetype}`,
            'UploadFileMiddleware',
          ), '');

          return;
        }

        const fileName = nanoid();
        callback(null, `${fileName}.${fileExtension}`);
      }
    });

    const uploadSingleFileMiddleware = multer({
      storage,
      fileFilter: (_req, file, callback) => {
        const isFileAllowed = ['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype);
        if (!isFileAllowed) {
          callback(new HttpError(
            StatusCodes.BAD_REQUEST,
            'Only .png and .jpg images are allowed',
            'UploadFileMiddleware',
          ));

          return;
        }

        callback(null, true);
      }
    })
      .single(this._fieldName);

    uploadSingleFileMiddleware(req, res, next);
  }
}
