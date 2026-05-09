import { Type } from '../../types/types';

export class OfferPreviewRdo {
  public id!: string;

  public title!: string;

  public publishDate!: Date;

  public city!: string;

  public previewImage!: string;

  public isPremium!: boolean;

  public isFavorite!: boolean;

  public housingType!: Type;

  public price!: number;

  public rating!: number;

  public commentsCount!: number;
}
