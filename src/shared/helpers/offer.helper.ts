import { Coordinates, UserType, Offer, User, AmenityType, HousingType } from '../types/index.js';

export function createOffer(offerData: string): Offer {
  if (!offerData) {
    throw new Error('File was not read');
  }

  const parseBoolean = (value: string): boolean => value === 'true';
  const parseInt = (value: string): number => Number.parseInt(value, 10);
  const parseArray = (value: string): string[] => value.split(';');
  const parseCoordinates = (value: string): Coordinates => {
    const [latitude, longitude] = value.split(';').map(Number);
    return { latitude, longitude };
  };

  const [
    title,
    description,
    city,
    previewImage,
    housingImages,
    isPremium,
    housingType,
    roomsCount,
    guestsCount,
    price,
    amenities,
    authorName,
    authorEmail,
    authorType,
    coordinates,
  ] = offerData.replace('\n', '').split('\t');

  const user: User = {
    name: authorName,
    email: authorEmail,
    avatar: '',
    type: authorType as UserType
  };

  return {
    title,
    description,
    city,
    previewImage,
    housingImages: parseArray(housingImages),
    isPremium: parseBoolean(isPremium),
    housingType: housingType as HousingType,
    roomsCount: parseInt(roomsCount),
    guestsCount: parseInt(guestsCount),
    price: parseInt(price),
    amenities: parseArray(amenities) as AmenityType[],
    author: user,
    coordinates: parseCoordinates(coordinates)
  } satisfies Offer;
}
