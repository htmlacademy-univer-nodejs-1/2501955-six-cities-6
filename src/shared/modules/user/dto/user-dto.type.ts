import { UserType } from '../../../types/index.js';

export type UserDto = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  type: UserType
};
