import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsEnum, IsIn, IsInt, IsMongoId, IsUrl, Max, MaxLength, Min, MinLength } from 'class-validator';
import { AmenityType, Coordinates, HousingType } from '../../../types/index.js';
import { CreateOfferValidationMessage } from './create-offer.messages.js';
import { IsCoordinates } from '../../../libs/rest/index.js';

export class CreateOfferDto {
  @MinLength(10, { message: CreateOfferValidationMessage.title.minLength })
  @MaxLength(100, { message: CreateOfferValidationMessage.title.maxLength })
  public title!: string;

  @MinLength(20, { message: CreateOfferValidationMessage.description.minLength })
  @MaxLength(1024, { message: CreateOfferValidationMessage.description.maxLength })
  public description!: string;

  @IsIn([
    'Paris',
    'Cologne',
    'Brussels',
    'Amsterdam',
    'Hamburg',
    'Dusseldorf'
  ], { message: CreateOfferValidationMessage.city.invalid })
  public city!: string;

  @IsUrl({}, { message: CreateOfferValidationMessage.previewImage.invalid })
  public previewImage!: string;

  @IsArray({ message: CreateOfferValidationMessage.housingImages.isArray })
  @ArrayMinSize(6, { message: CreateOfferValidationMessage.housingImages.arraySize })
  @ArrayMaxSize(6, { message: CreateOfferValidationMessage.housingImages.arraySize })
  @IsUrl({}, { each: true, message: CreateOfferValidationMessage.housingImages.invalid })
  public housingImages!: string[];

  @IsBoolean({ message: CreateOfferValidationMessage.isPremium.invalid })
  public isPremium!: boolean;

  @IsBoolean({ message: CreateOfferValidationMessage.isFavorite.invalid })
  public isFavorite!: boolean;

  @IsEnum(HousingType, { message: CreateOfferValidationMessage.housingType.invalid })
  public housingType!: HousingType;

  @IsInt({ message: CreateOfferValidationMessage.roomsCount.invalid })
  @Min(1, { message: CreateOfferValidationMessage.roomsCount.min })
  @Max(8, { message: CreateOfferValidationMessage.roomsCount.max })
  public roomsCount!: number;

  @IsInt({ message: CreateOfferValidationMessage.guestsCount.invalid })
  @Min(1, { message: CreateOfferValidationMessage.guestsCount.min })
  @Max(10, { message: CreateOfferValidationMessage.guestsCount.max })
  public guestsCount!: number;

  @IsInt({ message: CreateOfferValidationMessage.price.invalid })
  @Min(100, { message: CreateOfferValidationMessage.price.min })
  @Max(100_000, { message: CreateOfferValidationMessage.price.max })
  public price!: number;

  @IsArray({ message: CreateOfferValidationMessage.amenities.isArray })
  @IsEnum(AmenityType, { each: true, message: CreateOfferValidationMessage.amenities.invalid })
  public amenities!: AmenityType[];

  @IsMongoId({ message: CreateOfferValidationMessage.authorId.invalid })
  public authorId!: string;

  @IsCoordinates()
  public coordinates!: Coordinates;
}
