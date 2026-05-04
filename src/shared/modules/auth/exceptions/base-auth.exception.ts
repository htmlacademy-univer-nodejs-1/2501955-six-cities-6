import { HttpError } from '../../../libs/rest/index.js';

export abstract class BaseAuthException extends HttpError {
  constructor(httpStatusCode: number, message: string) {
    super(httpStatusCode, message);
  }
}
