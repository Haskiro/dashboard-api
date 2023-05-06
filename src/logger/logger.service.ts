import { Logger } from "tslog";
import { ILogObj } from "tslog/dist/types/interfaces";
import { ILogger } from "./logger.interface";

export class LoggerService implements ILogger {
  public logger: Logger<ILogObj>;
  constructor() {
    this.logger = new Logger({
      prettyLogTemplate:
        "{{yyyy}}.{{mm}}.{{dd}} {{hh}}:{{MM}}:{{ss}}:{{ms}}\t{{logLevelName}}\t",
    });
  }

  public log(...args: unknown[]) {
    this.logger.info(...args);
  }

  public error(...args: unknown[]) {
    this.logger.error(...args);
  }

  public warn(...args: unknown[]) {
    this.logger.warn(...args);
  }
}
