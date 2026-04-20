export const CreateOfferValidationMessage = {
  title: {
    minLength: 'Minimum title length must be 10',
    maxLength: 'Maximum title length must be 100'
  },
  description: {
    minLength: 'Minimum description length must be 20',
    maxLength: 'Maximum description length must be 1024'
  },
  city: {
    invalid: 'city must be Paris | Cologne | Brussels | Amsterdam | Hamburg | Dusseldorf'
  },
  previewImage: {
    invalid: 'previewImage must be a valid url string'
  },
  housingImages: {
    isArray: 'housingImages must be an array',
    arraySize: 'housingImages length must be 6',
    invalid: 'housingImages items must be the valid url strings'
  },
  isPremium: {
    invalid: 'isPremium must be a boolean type'
  },
  isFavorite: {
    invalid: 'isFavorite must be a boolean type'
  },
  housingType: {
    invalid: 'housingType must be apartment | house | room | hotel'
  },
  roomsCount: {
    invalid: 'roomsCount must be an integer',
    min: 'Minimum roomsCount value must be 1',
    max: 'Maximum roomsCount value must be 8'
  },
  guestsCount: {
    invalid: 'guestsCount must be an integer',
    min: 'Minimum guestsCount value must be 1',
    max: 'Maximum guestsCount value must be 10'
  },
  price: {
    invalid: 'price must be an integer',
    min: 'Minimum price value must be 100',
    max: 'Maximum price value must be 100000'
  },
  amenities: {
    isArray: 'amenities must be an array',
    invalid: 'amenities items must be Breakfast | Air conditioning | Laptop friendly workspace | Baby seat | Washer | Towels | Fridge'
  },
  authorId: {
    invalid: 'authorId must be a valid ObjectID'
  }
};
