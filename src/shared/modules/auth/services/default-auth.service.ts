import { inject, injectable } from 'inversify';
import { IAuthService } from '../interfaces/auth-service.interface.js';
import { Component } from '../../../types/index.js';
import { ILogger } from '../../../libs/logger/index.js';
import { IUserService, LoginUserDto, UserEntity } from '../../user/index.js';
import { IConfig, RestSchema } from '../../../libs/config/index.js';
import { createSecretKey } from 'node:crypto';
import { TokenPayload } from '../types/token-payload.type.js';
import { SignJWT } from 'jose';
import { JWT_ALGORITHM, JWT_EXPIRED } from '../constants/auth.constant.js';
import { UserNotFoundException, UserPasswordIncorrectException } from '../exceptions/index.js';

@injectable()
export class DefaultAuthService implements IAuthService {
  constructor(
    @inject(Component.Logger) private readonly _logger: ILogger,
    @inject(Component.UserService) private readonly _userService: IUserService,
    @inject(Component.Config) private readonly _config: IConfig<RestSchema>
  ) {}

  public async authenticate(user: UserEntity): Promise<string> {
    const jwtSecret = this._config.get('JWT_SECRET');
    const secretKey = createSecretKey(jwtSecret, 'utf-8');
    const tokenPayload: TokenPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      type: user.type
    };

    this._logger.info(`Token created for ${user.email}`);
    return new SignJWT(tokenPayload)
      .setProtectedHeader({ alg: JWT_ALGORITHM })
      .setIssuedAt()
      .setExpirationTime(JWT_EXPIRED)
      .sign(secretKey);
  }

  public async verify(dto: LoginUserDto): Promise<UserEntity> {
    const user = await this._userService.findByEmail(dto.email);
    if (!user) {
      this._logger.warn(`User with email: ${dto.email} not found`);
      throw new UserNotFoundException();
    }

    if (!user.verifyPassword(dto.password, this._config.get('SALT'))) {
      this._logger.warn(`Incorrect password for ${dto.email}`);
      throw new UserPasswordIncorrectException();
    }

    return user;
  }
}
