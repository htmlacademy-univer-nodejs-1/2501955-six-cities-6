import { PipelineStage } from 'mongoose';

export const statsPipeline: PipelineStage[] = [
  {
    $lookup: {
      from: 'users',
      localField: 'authorId',
      foreignField: '_id',
      as: 'author'
    }
  },
  { $unwind: '$author' },
  {
    $lookup: {
      from: 'comments',
      let: { offerId: '$_id' },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ['$offerId', '$$offerId'] }
          }
        },
        {
          $group: {
            _id: null,
            rating: { $avg: '$rating' },
            commentsCount: { $sum: 1 }
          }
        }
      ],
      as: 'stats'
    }
  },
  {
    $addFields: {
      rating: {
        $ifNull: [{ $arrayElemAt: ['$stats.rating', 0] }, 5]
      },
      commentsCount: {
        $ifNull: [{ $arrayElemAt: ['$stats.commentsCount', 0] }, 0]
      }
    }
  }
];
