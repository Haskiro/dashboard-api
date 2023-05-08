import { NextFunction, Request, Response } from 'express';
import { IExceptionFilter } from './excection.filter.interface';
import { HttpError } from './https-error';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import 'reflect-metadata';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {}

	catch(err: Error | HttpError, req: Request, res: Response, next: NextFunction): void {
		if (err instanceof HttpError) {
			this.logger.error(
				err.context
					? `[${err.context}] Ошибка ${err.statusCode}: ${err.message}`
					: `Ошибка ${err.statusCode}: ${err.message}`,
			);
			res.status(err.statusCode);
		} else {
			this.logger.error(`${err.message}`);
			res.status(500);
		}
		res.send({ err: err.message });
	}
}
