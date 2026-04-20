import { DocumentType } from '@typegoose/typegoose';
import { CreateOfferDto } from '../dto/create-offer.dto.js';
import { UpdateOfferDto } from '../dto/update-offer.dto.js';
import { OfferEntity } from '../offer.entity.js';
import { IDocumentExists } from '../../../libs/rest/index.js';

export interface IOfferService extends IDocumentExists {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  find(count?: number): Promise<Array<DocumentType<OfferEntity>>>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  findPremium(city: string): Promise<Array<DocumentType<OfferEntity>>>;
  findFavorite(): Promise<Array<DocumentType<OfferEntity>>>;
  addToFavorite(offerId: string): Promise<void>;
  removeFromFavorite(offerId: string): Promise<void>;
}
