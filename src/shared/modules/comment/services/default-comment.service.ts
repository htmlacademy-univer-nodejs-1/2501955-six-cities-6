import { inject, injectable } from 'inversify';
import { ICommentService } from '../interfaces/comment-service.interface.js';
import { Component, SortType } from '../../../types/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { CommentEntity } from '../comment.entity.js';
import { CreateCommentDto } from '../dto/create-comment.dto.js';
import { DEFAULT_COMMENT_COUNT } from '../constants/comment.constant.js';

@injectable()
export class DefaultCommentService implements ICommentService {
  constructor(
    @inject(Component.CommentModel) private readonly _commentModel: types.ModelType<CommentEntity>
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this._commentModel.create(dto);
    await comment.populate('authorId');

    return comment;
  }

  public async findByOfferId(offerId: string): Promise<Array<DocumentType<CommentEntity>>> {
    const comments = await this._commentModel
      .find({ offerId })
      .populate('authorId')
      .sort({ createdAt: SortType.Down })
      .limit(DEFAULT_COMMENT_COUNT)
      .exec();

    return comments;
  }

  public async deleteByOfferId(offerId: string): Promise<number | null> {
    const result = await this._commentModel
      .deleteMany({ offerId })
      .exec();

    return result.deletedCount;
  }
}
