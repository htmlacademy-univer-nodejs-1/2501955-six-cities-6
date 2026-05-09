import { CityName, Location } from '../../types/types.js';

export class UpdateOfferDto {
  public title?: string;

  public description?: string;

  public city?: CityName;

  public previewImage?: string;

  public housingImages?: string[];

  public isPremium?: boolean;

  public housingType?: string;

  public roomsCount?: number;

  public guestsCount?: number;

  public price?: number;

  public amenities?: string[];

  public coordinates?: Location;
}
