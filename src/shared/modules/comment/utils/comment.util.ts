import { DocumentType } from '@typegoose/typegoose';
import { CommentEntity } from '../comment.entity.js';
import { CommentDto } from '../dto/comment-dto.type.js';
import { toUserDto, UserEntity } from '../../user/index.js';

export const toCommentDto = (comment: DocumentType<CommentEntity>): CommentDto => ({
  id: comment._id.toString(),
  text: comment.text,
  publishDate: comment.createdAt?.toISOString() ?? Date.now().toString(),
  rating: comment.rating,
  author: toUserDto(comment.authorId as DocumentType<UserEntity>)
});
