import { inject, injectable } from 'inversify';
import { IConfig, RestSchema } from '../shared/libs/config/index.js';
import { ILogger } from '../shared/libs/logger/index.js';
import { Component } from '../shared/types/index.js';
import { IDatabaseClient } from '../shared/libs/database-client/index.js';
import { getMongoURI } from '../shared/helpers/database.helper.js';
import express, { Express } from 'express';

@injectable()
export class RestApplication {
  private readonly _server: Express;

  constructor(
    @inject(Component.Logger) private readonly _logger: ILogger,
    @inject(Component.Config) private readonly _config: IConfig<RestSchema>,
    @inject(Component.DatabaseClient) private readonly _databaseClient: IDatabaseClient
  ) {
    this._server = express();
  }

  public async init(): Promise<void> {
    this._logger.info('REST application init');

    this._logger.info('Init database...');
    await this.initDb();
    this._logger.info('Database has been inited');

    this._logger.info('Init server...');
    await this.initServer();
    this._logger.info(`Server started on http://localhost:${this._config.get('PORT')}`);
  }

  private async initDb(): Promise<void> {
    const mongoUri: string = getMongoURI(
      this._config.get('DB_USER'),
      this._config.get('DB_PASSWORD'),
      this._config.get('DB_HOST'),
      this._config.get('DB_PORT'),
      this._config.get('DB_NAME')
    );

    return this._databaseClient.connect(mongoUri);
  }

  private async initServer(): Promise<void> {
    const port = this._config.get('PORT');
    this._server.listen(port);
  }
}
