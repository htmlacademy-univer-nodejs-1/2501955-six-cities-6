import { Coordinates } from './coordinates.type.js';
import { AmenityType } from './enums/amenity-type.enum.js';
import { HousingType } from './enums/housing-type.enum.js';
import { User } from './user.type.js';

export type Offer = {
  title: string;
  description: string;
  city: string;
  previewImage: string;
  housingImages: string[];
  isPremium: boolean;
  housingType: HousingType;
  roomsCount: number;
  guestsCount: number;
  price: number;
  amenities: AmenityType[];
  author: User;
  coordinates: Coordinates;
};
