import { CreateOfferDto } from '../dto/create-offer.dto.js';
import { UpdateOfferDto } from '../dto/update-offer.dto.js';
import { OfferFullDto } from '../dto/offer-full-dto.type.js';
import { OfferPreviewDto } from '../dto/offer-preview-dto.type.js';

export interface IOfferService {
  create(dto: CreateOfferDto): Promise<OfferFullDto>;
  findById(offerId: string): Promise<OfferFullDto | null>;
  find(count?: number): Promise<OfferPreviewDto[]>;
  deleteById(offerId: string): Promise<void>;
  updateById(offerId: string, dto: UpdateOfferDto): Promise<OfferFullDto| null>;
  findPremium(city: string): Promise<OfferPreviewDto[]>;
  findFavorite(): Promise<OfferPreviewDto[]>;
  addToFavorite(offerId: string): Promise<void>;
  removeFromFavorite(offerId: string): Promise<void>;
  exists(documentId: string): Promise<boolean>;
}
