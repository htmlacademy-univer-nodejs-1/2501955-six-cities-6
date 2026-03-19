import { CreateUserDto } from '../dto/create-user.dto.js';
import { UserDto } from '../dto/user-dto.type.js';

export interface IUserService {
  create(dto: CreateUserDto, salt: string): Promise<UserDto>;
  findById(userId: string): Promise<UserDto | null>;
  findByEmail(email: string): Promise<UserDto | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<UserDto>;
}
