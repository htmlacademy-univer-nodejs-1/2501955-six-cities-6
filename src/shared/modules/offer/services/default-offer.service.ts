import { inject, injectable } from 'inversify';
import { IOfferService } from '../interfaces/offer-service.interface.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { CreateOfferDto } from '../dto/create-offer.dto.js';
import { OfferEntity } from '../offer.entity.js';
import { Component, SortType } from '../../../types/index.js';
import { ILogger } from '../../../libs/logger/index.js';
import { UpdateOfferDto } from '../dto/update-offer.dto.js';
import { DEFAULT_OFFER_COUNT, PREMIUM_OFFER_COUNT } from '../constants/offer.constant.js';
import { buildFavoritePipeline, fullProjection, previewProjection, statsPipeline } from '../utils/index.js';
import { Types } from 'mongoose';
import type { FavoriteEntity } from '../../favorite/favorite.entity.js';

@injectable()
export class DefaultOfferService implements IOfferService {
  constructor(
    @inject(Component.Logger) private readonly _logger: ILogger,
    @inject(Component.OfferModel) private readonly _offerModel: types.ModelType<OfferEntity>,
    @inject(Component.FavoriteModel) private readonly _favoriteModel: types.ModelType<FavoriteEntity>
  ) { }

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const created = await this._offerModel.create(dto);
    this._logger.info(`New offer created: ${dto.title}`);

    const [offer] = await this._offerModel
      .aggregate([
        { $match: { _id: created._id } },
        ...statsPipeline,
        fullProjection
      ])
      .exec();

    return offer;
  }

  public async findById(offerId: string, userId?: string): Promise<DocumentType<OfferEntity> | null> {
    const [offer] = await this._offerModel
      .aggregate([
        { $match: { _id: new Types.ObjectId(offerId) } },
        ...statsPipeline,
        ...buildFavoritePipeline(userId),
        fullProjection
      ]);

    return offer ?? null;
  }

  public async find(count?: number, userId?: string): Promise<Array<DocumentType<OfferEntity>>> {
    const limit = count ?? DEFAULT_OFFER_COUNT;

    return this._offerModel
      .aggregate([
        ...statsPipeline,
        ...buildFavoritePipeline(userId),
        previewProjection,
        { $sort: { publishDate: SortType.Down } },
        { $limit: limit }
      ])
      .exec();
  }

  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    await this._offerModel.findByIdAndUpdate(offerId, dto).exec();

    return this.findById(offerId);
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return await this._offerModel
      .findByIdAndDelete(offerId)
      .exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this._offerModel.exists({ _id: documentId }) !== null);
  }

  public async findPremium(city: string, userId?: string): Promise<Array<DocumentType<OfferEntity>>> {
    return this._offerModel
      .aggregate([
        { $match: { city, isPremium: true } },
        ...statsPipeline,
        ...buildFavoritePipeline(userId),
        previewProjection,
        { $limit: PREMIUM_OFFER_COUNT }
      ])
      .exec();
  }

  public async findFavorite(userId: string): Promise<Array<DocumentType<OfferEntity>>> {
    return this._offerModel
      .aggregate([
        ...buildFavoritePipeline(userId),
        { $match: { isFavorite: true } },
        ...statsPipeline,
        previewProjection
      ])
      .exec();
  }

  public async addToFavorite(offerId: string, userId: string): Promise<void> {
    await this._favoriteModel
      .updateOne(
        { userId, offerId },
        { userId, offerId },
        { upsert: true }
      )
      .exec();
  }

  public async removeFromFavorite(offerId: string, userId: string): Promise<void> {
    await this._favoriteModel
      .deleteOne({ userId, offerId })
      .exec();
  }
}
