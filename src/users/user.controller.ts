import { NextFunction, Request, Response } from "express";
import { BaseController } from "../common/base.controller";
import { LoggerService } from "../logger/logger.service";
import { HttpError } from "../errors/https-error";

export class UserController extends BaseController {
  constructor(logger: LoggerService) {
    super(logger);
    this.bindRoutes([
      {
        path: "/login",
        method: "post",
        func: this.login,
      },
      {
        path: "/register",
        method: "post",
        func: this.register,
      },
    ]);
  }

  public login(req: Request, res: Response, next: NextFunction) {
    next(new HttpError(401, "ошибка авторизации", "login"));
    // this.ok(res, "login");
  }

  public register(req: Request, res: Response, next: NextFunction) {
    this.ok(res, "register");
  }
}
