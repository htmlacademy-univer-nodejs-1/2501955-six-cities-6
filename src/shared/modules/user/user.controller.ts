import { inject, injectable } from 'inversify';
import { Response } from 'express';
import { BaseController, HttpMethod } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { IUserService } from './interfaces/user-service.interface.js';
import { CreateUserRequest } from './types/create-user-request.type.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: ILogger,
    @inject(Component.UserService) private readonly _userService: IUserService
  ) {
    super(logger);

    this.logger.info('Registering routes for UserController...');
    this.addRoute({ path: '/register', method: HttpMethod.Post, handler: this.create });
  }

  public async create(_req: CreateUserRequest, _res: Response): Promise<void> {
    throw new Error('[UserController] Oops');
  }
}
