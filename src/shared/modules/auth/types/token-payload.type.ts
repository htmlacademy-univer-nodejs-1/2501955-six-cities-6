import { UserType } from '../../../types/index.js';

export type TokenPayload = {
  id: string;
  email: string;
  name: string;
  type: UserType;
};
