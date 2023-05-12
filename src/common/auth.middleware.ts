import { NextFunction, Request, Response } from 'express';
import { IMiddleware } from './middleware.interface';
import { verify } from 'jsonwebtoken';
import { HttpError } from '../errors/https-error';

export class AuthMiddleware implements IMiddleware {
	constructor(private secret: string) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.headers.authorization) {
			const token = req.headers.authorization.split(' ')[1];
			verify(token, this.secret, (err, payload) => {
				if (err) {
					// next(new HttpError(401, 'Неверный токен', 'AuthMiddleware'));
					next();
				} else if (payload) {
					req.user = payload;
					next();
				}
			});
		}
		next();
	}
}
