import { ContainerModule } from 'inversify';
import { IUserService } from './interfaces/user-service.interface.js';
import { Component } from '../../types/index.js';
import { DefaultUserService } from './services/default-user.service.js';
import { types } from '@typegoose/typegoose';
import { UserEntity, UserModel } from './user.entity.js';
import { IController } from '../../libs/rest/index.js';
import { UserController } from './user.controller.js';

export function createUserContainer(): ContainerModule {
  return new ContainerModule(({ bind }) => {
    bind<IUserService>(Component.UserService)
      .to(DefaultUserService)
      .inSingletonScope();

    bind<types.ModelType<UserEntity>>(Component.UserModel)
      .toConstantValue(UserModel);

    bind<IController>(Component.UserController)
      .to(UserController)
      .inSingletonScope();
  });
}
