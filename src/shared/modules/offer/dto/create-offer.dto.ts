import { AmenityType, Coordinates, HousingType } from '../../../types/index.js';

export class CreateOfferDto {
  public title!: string;
  public description!: string;
  public city!: string;
  public previewImage!: string;
  public housingImages!: string[];
  public isPremium!: boolean;
  public housingType!: HousingType;
  public roomsCount!: number;
  public guestsCount!: number;
  public price!: number;
  public amenities!: AmenityType[];
  public authorId!: string;
  public coordinates!: Coordinates;
}
