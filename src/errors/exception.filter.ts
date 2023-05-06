import { NextFunction, Request, Response } from "express";
import { LoggerService } from "../logger/logger.service";
import { IExceptionFilter } from "./excection.filter.interface";
import { HttpError } from "./https-error";

export class ExceptionFilter implements IExceptionFilter {
  logger: LoggerService;

  constructor(logger: LoggerService) {
    this.logger = logger;
  }

  catch(
    err: Error | HttpError,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (err instanceof HttpError) {
      this.logger.error(
        err.context
          ? `[${err.context}] Ошибка ${err.statusCode}: ${err.message}`
          : `Ошибка ${err.statusCode}: ${err.message}`
      );
      res.status(err.statusCode);
    } else {
      this.logger.error(`${err.message}`);
      res.status(500);
    }
    res.send({ err: err.message });
  }
}
