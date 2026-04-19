import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController, HttpError, HttpMethod, HttpRequest, RequestQuery, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { IOfferService } from './interfaces/offer-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { OfferPreviewRdo } from './rdo/offer-preview.rdo.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { StatusCodes } from 'http-status-codes';
import { OfferIdRequestParam } from './types/offer-id-request-param.type.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { CommentRdo, CreateCommentDto, ICommentService } from '../comment/index.js';
import { CityRequestParam } from './types/city-request-param.type.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: ILogger,
    @inject(Component.OfferService) private readonly _offerService: IOfferService,
    @inject(Component.CommentService) private readonly _commentService: ICommentService
  ) {
    super(logger);

    this.logger.info('Registering routes for OfferController...');
    this.addRoutes([
      { path: '/', method: HttpMethod.Get, handler: this.index },
      { path: '/', method: HttpMethod.Post, handler: this.create },
      { path: '/favorite', method: HttpMethod.Get, handler: this.indexFavorite },
      { path: '/premium/:city', method: HttpMethod.Get, handler: this.indexPremium },
      {
        path: '/:offerId',
        method: HttpMethod.Get,
        handler: this.show,
        middlewares: [new ValidateObjectIdMiddleware('offerId')]
      },
      {
        path: '/:offerId',
        method: HttpMethod.Patch,
        handler: this.update,
        middlewares: [new ValidateObjectIdMiddleware('offerId')]
      },
      {
        path: '/:offerId',
        method: HttpMethod.Delete,
        handler: this.delete,
        middlewares: [new ValidateObjectIdMiddleware('offerId')]
      },
      {
        path: '/:offerId/favorite',
        method: HttpMethod.Post,
        handler: this.makeFavorite ,
        middlewares: [new ValidateObjectIdMiddleware('offerId')]
      },
      {
        path: '/:offerId/favorite',
        method: HttpMethod.Delete,
        handler: this.removeFavorite,
        middlewares: [new ValidateObjectIdMiddleware('offerId')]
      },
      {
        path: '/:offerId/comments',
        method: HttpMethod.Get,
        handler: this.indexComments,
        middlewares: [new ValidateObjectIdMiddleware('offerId')]
      },
      {
        path: '/:offerId/comments',
        method: HttpMethod.Post,
        handler: this.createComment,
        middlewares: [new ValidateObjectIdMiddleware('offerId')]
      }
    ]);
  }

  public async index(
    { query }: Request<unknown, unknown, unknown, RequestQuery>,
    res: Response
  ): Promise<void> {
    const offers = await this._offerService.find(query.limit);
    this.ok(res, fillDTO(OfferPreviewRdo, offers));
  }

  public async create(
    { body }: HttpRequest<CreateOfferDto>,
    res: Response
  ): Promise<void> {
    const offer = await this._offerService.create(body);
    this.created(res, fillDTO(OfferRdo, offer));
  }

  public async show(
    { params }: Request<OfferIdRequestParam>,
    res: Response
  ): Promise<void> {
    const offerId = Array.isArray(params.offerId)
      ? params.offerId[0]
      : params.offerId;
    const offer = await this._offerService.findById(offerId);
    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found`,
        'OfferController'
      );
    }

    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async update(
    { body, params }: Request<OfferIdRequestParam, unknown, UpdateOfferDto>,
    res: Response
  ): Promise<void> {
    const offerId = Array.isArray(params.offerId)
      ? params.offerId[0]
      : params.offerId;
    const updatedOffer = await this._offerService.updateById(offerId, body);
    if (!updatedOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found`,
        'OfferController'
      );
    }

    this.ok(res, fillDTO(OfferRdo, updatedOffer));
  }

  public async delete(
    { params }: Request<OfferIdRequestParam>,
    res: Response
  ): Promise<void> {
    const offerId = Array.isArray(params.offerId)
      ? params.offerId[0]
      : params.offerId;
    const deletedOffer = this._offerService.deleteById(offerId);
    if (!deletedOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found`,
        'OfferController'
      );
    }

    await this._commentService.deleteByOfferId(offerId);
    this.noContent(res, void 0);
  }

  public async indexPremium(
    { params }: Request<CityRequestParam>,
    res: Response
  ): Promise<void> {
    const city = Array.isArray(params.city)
      ? params.city[0]
      : params.city;
    const premiumOffers = await this._offerService.findPremium(city);
    this.ok(res, fillDTO(OfferPreviewRdo, premiumOffers));
  }

  public async indexFavorite(
    _req: Request,
    res: Response
  ): Promise<void> {
    const favoriteOffers = await this._offerService.findFavorite();
    this.ok(res, fillDTO(OfferPreviewRdo, favoriteOffers));
  }

  public async makeFavorite(
    { params }: Request<OfferIdRequestParam>,
    res: Response
  ): Promise<void> {
    const offerId = Array.isArray(params.offerId)
      ? params.offerId[0]
      : params.offerId;
    if (!await this._offerService.exists(offerId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found`,
        'OfferController'
      );
    }

    await this._offerService.addToFavorite(offerId);
    this.created(res, void 0);
  }

  public async removeFavorite(
    { params }: Request<OfferIdRequestParam>,
    res: Response
  ): Promise<void> {
    const offerId = Array.isArray(params.offerId)
      ? params.offerId[0]
      : params.offerId;
    if (!await this._offerService.exists(offerId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found`,
        'OfferController'
      );
    }

    await this._offerService.removeFromFavorite(offerId);
    this.noContent(res, void 0);
  }

  public async indexComments(
    { params }: Request<OfferIdRequestParam>,
    res: Response
  ): Promise<void> {
    const offerId = Array.isArray(params.offerId)
      ? params.offerId[0]
      : params.offerId;
    if (!await this._offerService.exists(offerId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found`,
        'OfferController'
      );
    }

    const comments = await this._commentService.findByOfferId(offerId);
    this.ok(res, fillDTO(CommentRdo, comments));
  }

  public async createComment(
    { body, params }: Request<OfferIdRequestParam, unknown, CreateCommentDto>,
    res: Response
  ): Promise<void> {
    const offerId = Array.isArray(params.offerId)
      ? params.offerId[0]
      : params.offerId;
    if (!await this._offerService.exists(offerId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found`,
        'OfferController'
      );
    }

    const comment = await this._commentService.create(offerId, body);
    this.created(res, fillDTO(CommentRdo, comment));
  }
}
