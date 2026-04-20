import { DocumentType, types } from '@typegoose/typegoose';
import { CreateUserDto } from '../dto/create-user.dto.js';
import { IUserService } from '../interfaces/user-service.interface.js';
import { UserEntity } from '../user.entity.js';
import { inject } from 'inversify';
import { Component } from '../../../types/index.js';
import { ILogger } from '../../../libs/logger/index.js';

export class DefaultUserService implements IUserService {
  constructor(
    @inject(Component.Logger) private readonly _logger: ILogger,
    @inject(Component.UserModel) private readonly _userModel: types.ModelType<UserEntity>
  ) {}

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    const result = await this._userModel.create(user);
    this._logger.info(`New user created: ${user.email}`);

    return result;
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return await this._userModel
      .findOne({ email })
      .exec();
  }

  public async findById(userId: string): Promise<DocumentType<UserEntity> | null> {
    return await this._userModel
      .findById(userId)
      .exec();
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);
    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this._userModel.exists({ _id: documentId }) !== null);
  }
}
