import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController, HttpMethod } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { IUserService } from './interfaces/user-service.interface.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: ILogger,
    @inject(Component.UserService) private readonly _userService: IUserService
  ) {
    super(logger);

    this.logger.info('Registering routes for UserController...');
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
  }

  public index(_req: Request, _res: Response): void {
    // Код обработчика
  }

  public create(_req: Request, _res: Response): void {
    // Код обработчика
  }
}
