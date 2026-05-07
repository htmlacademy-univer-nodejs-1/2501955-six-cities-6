import { createWriteStream, WriteStream } from 'node:fs';
import { IFileWriter } from './interfaces/file-writer.interface.js';

export class TSVFileWriter implements IFileWriter {
  private readonly _stream: WriteStream;

  constructor(filName: string) {
    this._stream = createWriteStream(filName, {
      flags: 'w',
      encoding: 'utf-8',
      autoClose: true
    });
  }

  public async write(row: string): Promise<unknown> {
    const writeSuccess = this._stream.write(`${row}\n`);
    if (!writeSuccess) {
      return new Promise((resolve) =>
        this._stream.once('drain', () => resolve(true))
      );
    }

    return Promise.resolve();
  }
}
