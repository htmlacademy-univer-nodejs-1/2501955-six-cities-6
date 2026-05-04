import { ContainerModule } from 'inversify';
import { IAuthService } from './interfaces/auth-service.interface.js';
import { Component } from '../../types/index.js';
import { DefaultAuthService } from './services/default-auth.service.js';
import { IExceptionFilter } from '../../libs/rest/index.js';
import { AuthExceptionFilter } from './auth.exception-filter.js';

export function createAuthContainer(): ContainerModule {
  return new ContainerModule(({ bind }) => {
    bind<IAuthService>(Component.AuthService)
      .to(DefaultAuthService)
      .inSingletonScope();

    bind<IExceptionFilter>(Component.AuthExceptionFilter)
      .to(AuthExceptionFilter)
      .inSingletonScope();
  });
}
