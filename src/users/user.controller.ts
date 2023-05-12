import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller';
import { HttpError } from '../errors/https-error';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { IUserController } from './user.controller.interface';
import { UserLoginDTO } from './dto/user-login.dto';
import { UserRegisterDTO } from './dto/user-register.dto';
import { ValidateMiddleware } from '../common/validate.middleware';
import { sign } from 'jsonwebtoken';
import { IConfigService } from '../config/config.service.interface';
import { IUserService } from './user.service.interface';
import { AuthGuard } from '../common/auth.guard';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) logger: ILogger,
		@inject(TYPES.UserService) private userService: IUserService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		super(logger);
		this.bindRoutes([
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDTO)],
			},
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDTO)],
			},
			{
				path: '/info',
				method: 'get',
				func: this.info,
				middlewares: [new AuthGuard()],
			},
		]);
	}

	public async login(
		{ body }: Request<{}, {}, UserLoginDTO>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.validateUser(body);
		if (!result) {
			return next(new HttpError(401, 'Ошибка авторизации', 'login'));
		}
		const jwt = await this.signJWT(body.email, this.configService.get('SECRET'));
		this.ok(res, { jwt });
	}

	public async register(
		{ body }: Request<{}, {}, UserRegisterDTO>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.createUser(body);
		if (!result) {
			return next(new HttpError(422, 'Такой пользователь уже существует', 'register'));
		}
		this.ok(res, { id: result.id, email: result.email });
	}

	public async info(req: Request, res: Response, next: NextFunction): Promise<void> {
		const user = await this.userService.getUserInfo(req.user.email);
		if (user) {
			this.ok(res, { id: user.id, email: user.email });
		} else {
			// res.status(401).send({ error: 'Такого пользователя не существует' });
			next(new HttpError(401, 'Такого пользователя не сущетсвует', 'info'));
		}
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				// payload
				{
					email,
					iat: Math.floor(Date.now() / 1000), // когда этот токен выпущен
				},
				secret,
				// options
				{
					algorithm: 'HS256',
				},
				// result callback
				(err, token) => {
					if (err) {
						reject(err);
					}
					resolve(token as string);
				},
			);
		});
	}
}
