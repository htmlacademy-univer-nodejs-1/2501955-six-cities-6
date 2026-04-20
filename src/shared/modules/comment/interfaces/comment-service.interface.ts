import { DocumentType } from '@typegoose/typegoose';
import { CreateCommentDto } from '../dto/create-comment.dto.js';
import { CommentEntity } from '../comment.entity.js';

export interface ICommentService {
  create(offerId: string, dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  findByOfferId(offerId: string): Promise<Array<DocumentType<CommentEntity>>>;
  deleteByOfferId(offerId: string): Promise<number | null>;
}
