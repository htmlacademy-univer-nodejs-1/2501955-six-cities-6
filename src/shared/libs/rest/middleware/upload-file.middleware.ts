import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from './interfaces/middleware.interface.js';
import multer, { diskStorage } from 'multer';
import { extension } from 'mime-types';
import { nanoid } from 'nanoid';

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
        const fileName = nanoid();
        callback(null, `${fileName}.${fileExtension}`);
      }
    });

    const uploadSingleFileMiddleware = multer({ storage })
      .single(this._fieldName);

    uploadSingleFileMiddleware(req, res, next);
  }
}
