import { DocumentType } from '@typegoose/typegoose';
import { UserEntity } from '../user.entity.js';
import { UserDto } from '../dto/user-dto.type.js';

export const toUserDto = (user: DocumentType<UserEntity>): UserDto => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  type: user.type,
});
