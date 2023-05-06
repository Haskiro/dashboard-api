import express, { Express } from "express";
import { Server } from "http";
import { LoggerService } from "./logger/logger.service";
import { UserController } from "./users/user.controller";
import { ExceptionFilter } from "./errors/exception.filter";
import { ILogger } from "./logger/logger.interface";

export class App {
  private app: Express;
  private port: number;
  private server: Server;
  private logger: ILogger;
  private userController: UserController;
  private exceptionFilter: ExceptionFilter;

  constructor(
    logger: ILogger,
    userController: UserController,
    exceptionFilter: ExceptionFilter
  ) {
    this.app = express();
    this.port = 8000;
    this.logger = logger;
    this.userController = userController;
    this.exceptionFilter = exceptionFilter;
  }

  public async init() {
    this.useRoutes();
    this.useExceptionFilter();
    this.server = this.app.listen(this.port, () => {
      this.logger.log(`Сервер запущен на http://localhost:${this.port}`);
    });
  }

  public useRoutes() {
    this.app.use("/users", this.userController.router);
  }

  useExceptionFilter() {
    this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }
}
