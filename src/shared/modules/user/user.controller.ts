import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController, DocumentExistsMiddleware, HttpError, HttpMethod, HttpRequest, PathTransformer, PrivateRouteMiddleware, UploadFileMiddleware, ValidateDtoMiddleware, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { IUserService } from './interfaces/user-service.interface.js';
import { StatusCodes } from 'http-status-codes';
import { IConfig, RestSchema } from '../../libs/config/index.js';
import { fillDTO } from '../../helpers/common.helper.js';
import { UserRdo, LoggerUserRdo } from './rdo/index.js';
import { CreateUserDto, LoginUserDto } from './dto/index.js';
import { IAuthService } from '../auth/index.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: ILogger,
    @inject(Component.PathTransformer) protected readonly pathTransformer: PathTransformer,
    @inject(Component.UserService) private readonly _userService: IUserService,
    @inject(Component.AuthService) private readonly _authService: IAuthService,
    @inject(Component.Config) private readonly _config: IConfig<RestSchema>,
  ) {
    super(logger, pathTransformer);

    this.logger.info('Registering routes for UserController...');
    this.addRoutes([
      {
        path: '/register',
        method: HttpMethod.Post,
        handler: this.create,
        middlewares: [
          new PrivateRouteMiddleware(true),
          new ValidateDtoMiddleware(CreateUserDto)
        ]
      },
      {
        path: '/auth/login',
        method: HttpMethod.Post,
        handler: this.login,
        middlewares: [new ValidateDtoMiddleware(LoginUserDto)]
      },
      {
        path: '/auth/status',
        method: HttpMethod.Get,
        handler: this.getStatus,
        middlewares: [
          new PrivateRouteMiddleware()
        ]
      },
      {
        path: '/:userId/avatar',
        method: HttpMethod.Post,
        handler: this.uploadAvatar,
        middlewares: [
          new PrivateRouteMiddleware(true),
          new ValidateObjectIdMiddleware('userId'),
          new UploadFileMiddleware(this._config.get('UPLOAD_DIRECTORY'), 'avatar'),
          new DocumentExistsMiddleware(this._userService, 'User', 'userId')
        ]
      }
    ]);
  }

  public async create(
    { body }: HttpRequest<CreateUserDto>,
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
    { body }: HttpRequest<LoginUserDto>,
    res: Response
  ): Promise<void> {
    const user = await this._authService.verify(body);
    const token = await this._authService.authenticate(user);

    return this.ok(res, fillDTO(LoggerUserRdo, { email: user.email, token }));
  }

  public async getStatus(
    { tokenPayload }: Request,
    res: Response
  ): Promise<void> {
    const foundedUser = tokenPayload?.id
      ? await this._userService.findById(tokenPayload.id)
      : null;

    if (!foundedUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    this.ok(res, fillDTO(UserRdo, foundedUser));
  }

  public async uploadAvatar({ params, file }: Request, res: Response): Promise<void> {
    const userId = Array.isArray(params.userId)
      ? params.userId[0]
      : params.userId;
    const uploadFile = { avatar: file?.filename };
    await this._userService.updateById(userId, uploadFile);
    this.created(res, { filePath: uploadFile.avatar });
  }
}
