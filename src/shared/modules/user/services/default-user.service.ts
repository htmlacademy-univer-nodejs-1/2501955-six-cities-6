import { types } from '@typegoose/typegoose';
import { CreateUserDto } from '../dto/create-user.dto.js';
import { IUserService } from '../interfaces/user-service.interface.js';
import { UserEntity } from '../user.entity.js';
import { inject } from 'inversify';
import { Component } from '../../../types/index.js';
import { ILogger } from '../../../libs/logger/index.js';
import { UserDto } from '../dto/user-dto.type.js';
import { toUserDto } from '../utils/user.util.js';

export class DefaultUserService implements IUserService {
  constructor(
    @inject(Component.Logger) private readonly _logger: ILogger,
    @inject(Component.UserModel) private readonly _userModel: types.ModelType<UserEntity>
  ) {}

  public async create(dto: CreateUserDto, salt: string): Promise<UserDto> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    const result = await this._userModel.create(user);
    this._logger.info(`New user created: ${user.email}`);

    return toUserDto(result);
  }

  public async findByEmail(email: string): Promise<UserDto | null> {
    const user = await this._userModel.findOne({ email }).exec();
    return user ? toUserDto(user) : null;
  }

  public async findById(userId: string): Promise<UserDto | null> {
    const user = await this._userModel.findById(userId).exec();
    return user ? toUserDto(user) : null;
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<UserDto> {
    const existedUser = await this.findByEmail(dto.email);
    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }
}
