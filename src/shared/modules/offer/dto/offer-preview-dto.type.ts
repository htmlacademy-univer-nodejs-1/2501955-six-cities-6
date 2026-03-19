export type OfferPreviewDto = {
  id: string;
  title: string;
  publishDate: Date;
  city: string;
  previewImage: string;
  isPremium: boolean;
  isFavorite: boolean;
  housingType: string;
  price: number;
  rating: number;
  commentsCount: number;
};
