import express, { Express, Router } from "express";
import { userRouter } from "./users/users";
import { Server } from "http";
import { LoggerService } from "./logger/logger.service";

export class App {
  private app: Express;
  private port: number;
  private server: Server;
  private logger: LoggerService;

  constructor(logger: LoggerService) {
    this.app = express();
    this.port = 8000;
    this.logger = logger;
  }

  public async init() {
    this.useRoutes("/users", userRouter);
    this.server = this.app.listen(this.port, () => {
      this.logger.log(`Сервер запущен на http://localhost:${this.port}`);
    });
  }

  public useRoutes(url: string, router: Router) {
    this.app.use(url, router);
  }
}
