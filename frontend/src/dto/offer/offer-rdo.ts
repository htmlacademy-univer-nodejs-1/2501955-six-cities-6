import { Location } from '../../types/types';
import { UserRdo } from '../user/user-rdo';
import { OfferPreviewRdo } from './offer-preview-rdo';

export class OfferRdo extends OfferPreviewRdo {
  public description!: string;

  public housingImages!: string[];

  public roomsCount!: number;

  public guestsCount!: number;

  public amenities!: string[];

  public author!: UserRdo;

  public coordinates!: Location;
}
