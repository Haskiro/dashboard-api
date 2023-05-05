import express, { Express, Router } from "express";
import { userRouter } from "./users/users";
import { Server } from "http";

export class App {
  app: Express;
  port: number;
  server: Server;

  constructor() {
    this.app = express();
    this.port = 8000;
  }

  public async init() {
    this.useRoutes("/users", userRouter);
    this.server = this.app.listen(this.port, () => {
      console.log(`Сервер запущен на http://localhost:${this.port}`);
    });
  }

  public useRoutes(url: string, router: Router) {
    this.app.use(url, router);
  }
}
