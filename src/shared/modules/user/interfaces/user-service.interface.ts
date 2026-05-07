import { DocumentType } from '@typegoose/typegoose';
import { CreateUserDto } from '../dto/create-user.dto.js';
import { UserEntity } from '../user.entity.js';
import { IDocumentExists } from '../../../libs/rest/index.js';
import { UpdateUserDto } from '../dto/update-user.dto.js';

export interface IUserService extends IDocumentExists {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findById(userId: string): Promise<DocumentType<UserEntity> | null>;
  updateById(userId: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
}
