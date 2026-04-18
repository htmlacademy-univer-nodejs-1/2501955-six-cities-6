import { ContainerModule } from 'inversify';
import { RestApplication } from './rest.application.js';
import { Component } from '../shared/types/index.js';
import { ILogger, PinoLogger } from '../shared/libs/logger/index.js';
import { IConfig, RestConfig, RestSchema } from '../shared/libs/config/index.js';
import { IDatabaseClient, MongoDatabaseClient } from '../shared/libs/database-client/index.js';
import { DefaultExceptionFilter, IExceptionFilter } from '../shared/libs/rest/index.js';

export function createRestApplicationContainer(): ContainerModule {
  return new ContainerModule(({ bind }) => {
    bind<RestApplication>(Component.RestApplication)
      .to(RestApplication)
      .inSingletonScope();

    bind<ILogger>(Component.Logger)
      .to(PinoLogger)
      .inSingletonScope();

    bind<IConfig<RestSchema>>(Component.Config)
      .to(RestConfig)
      .inSingletonScope();

    bind<IDatabaseClient>(Component.DatabaseClient)
      .to(MongoDatabaseClient)
      .inSingletonScope();

    bind<IExceptionFilter>(Component.ExceptionFilter)
      .to(DefaultExceptionFilter)
      .inSingletonScope();
  });
}
