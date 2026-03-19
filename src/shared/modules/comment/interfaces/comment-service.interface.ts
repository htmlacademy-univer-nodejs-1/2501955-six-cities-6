import { CreateCommentDto } from '../dto/create-comment.dto.js';
import { CommentDto } from '../dto/comment-dto.type.js';

export interface ICommentService {
  create(dto: CreateCommentDto): Promise<CommentDto>;
  findByOfferId(offerId: string): Promise<CommentDto[]>;
  deleteByOfferId(offerId: string): Promise<number | null>;
}
