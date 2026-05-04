import { types } from '@typegoose/typegoose';
import { ContainerModule } from 'inversify';
import { FavoriteEntity, FavoriteModel } from './favorite.entity.js';
import { Component } from '../../types/index.js';

export function createFavoriteContainer(): ContainerModule {
  return new ContainerModule(({ bind }) => {
    bind<types.ModelType<FavoriteEntity>>(Component.FavoriteModel)
      .toConstantValue(FavoriteModel);
  });
}
