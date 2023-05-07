import { Container } from "inversify";
import { App } from "./app.js";
import { ExceptionFilter } from "./errors/exception.filter.js";
import { LoggerService } from "./logger/logger.service.js";
import { UserController } from "./users/user.controller.js";
import { ILogger } from "./logger/logger.interface.js";
import { TYPES } from "./types.js";
import { IExceptionFilter } from "./errors/excection.filter.interface.js";

const appContainer = new Container();
appContainer.bind<ILogger>(TYPES.ILogger).to(LoggerService);
appContainer.bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
appContainer.bind<UserController>(TYPES.UserController).to(UserController);
appContainer.bind<App>(TYPES.Application).to(App);

const app = appContainer.get<App>(TYPES.Application);
app.init();
export { app, appContainer };
