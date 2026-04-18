import { ContainerModule } from 'inversify';
import { IOfferService } from './interfaces/offer-service.interface.js';
import { Component } from '../../types/index.js';
import { DefaultOfferService } from './services/default-offer.service.js';
import { types } from '@typegoose/typegoose';
import { OfferEntity, OfferModel } from './offer.entity.js';
import { IController } from '../../libs/rest/index.js';
import { OfferController } from './offer.controller.js';

export function createOfferContainer(): ContainerModule {
  return new ContainerModule(({ bind }) => {
    bind<IOfferService>(Component.OfferService)
      .to(DefaultOfferService);

    bind<types.ModelType<OfferEntity>>(Component.OfferModel)
      .toConstantValue(OfferModel);

    bind<IController>(Component.OfferController)
      .to(OfferController)
      .inSingletonScope();
  });
}
