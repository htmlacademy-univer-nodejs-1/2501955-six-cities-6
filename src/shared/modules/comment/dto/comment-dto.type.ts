import { UserDto } from '../../user/index.js';

export type CommentDto = {
  id: string;
  text: string;
  publishDate: string;
  rating: number;
  author: UserDto;
};
