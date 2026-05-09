import { CreateCommentDto } from './dto/comment/create-comment-dto';
import { CreateOfferDto } from './dto/offer/create-offer-dto';
import { UpdateOfferDto } from './dto/offer/update-offer-dto';
import { Comment, NewOffer, Offer } from './types/types';

export const adaptCreateOfferToServer = (offer: NewOffer): CreateOfferDto => ({
  title: offer.title,
  description: offer.description,
  city: offer.city.name,
  previewImage: offer.previewImage,
  housingImages: offer.images,
  isPremium: offer.isPremium,
  housingType: offer.type,
  roomsCount: offer.bedrooms,
  guestsCount: offer.maxAdults,
  price: offer.price,
  amenities: offer.goods,
  coordinates: offer.city.location
});

export const adaptUpdateOfferToServer = (offer: Offer): UpdateOfferDto => ({
  title: offer.title,
  description: offer.description,
  city: offer.city.name,
  previewImage: offer.previewImage,
  housingImages: offer.images,
  isPremium: offer.isPremium,
  housingType: offer.type,
  roomsCount: offer.bedrooms,
  guestsCount: offer.maxAdults,
  price: offer.price,
  amenities: offer.goods,
  coordinates: offer.city.location
});

export const adaptCreateCommentToServer = (comment: Pick<Comment, 'comment' | 'rating'>): CreateCommentDto => ({
  text: comment.comment,
  rating: comment.rating
});
