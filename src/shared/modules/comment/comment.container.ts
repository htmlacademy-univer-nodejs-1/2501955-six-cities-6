import { ContainerModule } from 'inversify';
import { ICommentService } from './interfaces/comment-service.interface.js';
import { Component } from '../../types/index.js';
import { DefaultCommentService } from './services/default-comment.service.js';
import { types } from '@typegoose/typegoose';
import { CommentEntity, CommentModel } from './comment.entity.js';

export function createCommentContainer(): ContainerModule {
  return new ContainerModule(({ bind }) => {
    bind<ICommentService>(Component.CommentService)
      .to(DefaultCommentService);

    bind<types.ModelType<CommentEntity>>(Component.CommentModel)
      .toConstantValue(CommentModel);
  });
}
