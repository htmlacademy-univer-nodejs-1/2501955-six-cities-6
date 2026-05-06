import { Coordinates, UserType, Offer, User, AmenityType, HousingType } from '../types/index.js';

export function createOffer(offerData: string): Offer {
  if (!offerData) {
    throw new Error('File was not read');
  }

  const parseBoolean = (value: string): boolean => value === 'true';
  const parseInt = (value: string): number => Number.parseInt(value, 10);
  const parseFloat = (value: string): number => Number.parseFloat(value);
  const parseArray = (value: string): string[] => value.split(';');
  const parseCoordinates = (value: string): Coordinates => {
    const [latitude, longitude] = value.split(';').map(Number);
    return { latitude, longitude };
  };

  const [
    title,
    description,
    publishDate,
    city,
    previewImage,
    housingImages,
    isPremium,
    isFavorite,
    rating,
    housingType,
    roomsCount,
    guestsCount,
    price,
    amenities,
    authorName,
    authorEmail,
    authorAvatar,
    authorType,
    commentsCount,
    coordinates,
  ] = offerData.replace('\n', '').split('\t');

  const user: User = {
    name: authorName,
    email: authorEmail,
    avatar: authorAvatar,
    type: authorType as UserType
  };

  return {
    title,
    description,
    publishDate: new Date(publishDate),
    city,
    previewImage,
    housingImages: parseArray(housingImages),
    isPremium: parseBoolean(isPremium),
    isFavorite: parseBoolean(isFavorite),
    rating: parseFloat(rating),
    housingType: housingType as HousingType,
    roomsCount: parseInt(roomsCount),
    guestsCount: parseInt(guestsCount),
    price: parseInt(price),
    amenities: parseArray(amenities) as AmenityType[],
    author: user,
    commentsCount: parseInt(commentsCount),
    coordinates: parseCoordinates(coordinates)
  } satisfies Offer;
}
