import { Logger } from "tslog";
import { ILogObj } from "tslog/dist/types/interfaces";

export class LoggerService {
  private logger: Logger<ILogObj>;
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