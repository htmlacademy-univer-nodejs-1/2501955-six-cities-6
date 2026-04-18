import { inject, injectable } from 'inversify';
import { Response } from 'express';
import { BaseController, HttpError, HttpMethod } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { IUserService } from './interfaces/user-service.interface.js';
import { CreateUserRequest } from './types/create-user-request.type.js';
import { StatusCodes } from 'http-status-codes';
import { IConfig, RestSchema } from '../../libs/config/index.js';
import { fillDTO } from '../../helpers/common.helper.js';
import { UserRdo } from './rdo/user.rdo.js';
import { LoginUserRequest } from './types/login-user-request.type.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: ILogger,
    @inject(Component.UserService) private readonly _userService: IUserService,
    @inject(Component.Config) private readonly _config: IConfig<RestSchema>
  ) {
    super(logger);

    this.logger.info('Registering routes for UserController...');
    this.addRoute({ path: '/register', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/auth/login', method: HttpMethod.Post, handler: this.login });
  }

  public async create(
    { body }: CreateUserRequest,
    res: Response
  ): Promise<void> {
    const existsUser = await this._userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email ${body.email} already exists`,
        'UserController'
      );
    }

    const result = await this._userService.create(body, this._config.get('SALT'));
    this.created(res, fillDTO(UserRdo, result));
  }

  public async login(
    { body }: LoginUserRequest,
    _res: Response
  ): Promise<void> {
    const existsUser = await this._userService.findByEmail(body.email);

    if (!existsUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with email ${body.email} not found`,
        'UserController'
      );
    }

    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController'
    );
  }
}
