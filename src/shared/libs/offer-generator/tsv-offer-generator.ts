import { generateRandomValue, getRandomItem, getRandomItems } from '../../helpers/index.js';
import { AmenityType, HousingType, MockServerData, UserType } from '../../types/index.js';
import { IOfferGenerator } from './interfaces/offer-generator.interface.js';

const MIN_ROOMS_COUNT = 1;
const MAX_ROOMS_COUNT = 8;

const MIN_GUESTS_COUNT = 1;
const MAX_GUESTS_COUNT = 10;

const MIN_PRICE = 100;
const MAX_PRICE = 100_000;

export class TSVOfferGenerator implements IOfferGenerator {
  constructor(private readonly _mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem(this._mockData.titles);
    const description = getRandomItem(this._mockData.descriptions);
    const city = getRandomItem(this._mockData.cities);
    const previewImage = getRandomItem(this._mockData.previewImages);
    const housingImages = getRandomItems(this._mockData.housingImages, 6).join(';');
    const isPremium = String(generateRandomValue(0, 1) === 1);
    const housingType = getRandomItem<string>(Object.values(HousingType));
    const roomsCount = generateRandomValue(MIN_ROOMS_COUNT, MAX_ROOMS_COUNT).toString();
    const guestsCount = generateRandomValue(MIN_GUESTS_COUNT, MAX_GUESTS_COUNT).toString();
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE).toString();
    const amenities = getRandomItems<string>(Object.values(AmenityType)).join(';');
    const authorName = getRandomItem(this._mockData.authorNames);
    const authorEmail = getRandomItem(this._mockData.authorEmails);
    const authorType = getRandomItem<string>(Object.values(UserType));
    const coordinates = getRandomItem(this._mockData.coordinatesValues).join(';');

    return [
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
      coordinates
    ].join('\t');
  }
}
