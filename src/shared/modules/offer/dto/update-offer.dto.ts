import { AmenityType, Coordinates, HousingType } from '../../../types/index.js';

export class UpdateOfferDto {
  public title?: string;
  public description?: string;
  public city?: string;
  public previewImage?: string;
  public housingImages?: string[];
  public isPremium?: boolean;
  public isFavorite?: boolean;
  public housingType?: HousingType;
  public roomsCount?: number;
  public guestsCount?: number;
  public price?: number;
  public amenities?: AmenityType[];
  public authorId!: string;
  public coordinates?: Coordinates;
}
