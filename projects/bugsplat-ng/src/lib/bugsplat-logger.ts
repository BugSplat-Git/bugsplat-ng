import { InjectionToken } from "@angular/core";

export enum BugSplatLogLevel {
    None,
    Error,
    Warn,
    Info,
    Log
}

export interface Logger {
    error(msg: string): void;
    warn(msg: string): void;
    info(msg: string): void;
    log(msg: string): void;
}

export class BugSplatLogger {

    static readonly LEVEL_CANNOT_BE_NULL = "BugSplatLogger Error: level cannot be null!";
    static readonly LOGGER_CANNOT_BE_NULL = "BugSplatLogger Error: logger cannot be null!";

    constructor(private level: BugSplatLogLevel = BugSplatLogLevel.None, private logger: Logger = console) {
        if (this.level == null) {
            throw new Error(BugSplatLogger.LEVEL_CANNOT_BE_NULL)
        }
        if (!this.logger) {
            throw new Error(BugSplatLogger.LOGGER_CANNOT_BE_NULL);
        }
    }
    error(msg: string): void {
        if (this.level >= BugSplatLogLevel.Error) {
            this.logger.error(msg);
        }
    }
    warn(msg: string): void {
        if (this.level >= BugSplatLogLevel.Warn) {
            this.logger.warn(msg);
        }
    }
    info(msg: string): void {
        if (this.level >= BugSplatLogLevel.Info) {
            this.logger.info(msg);
        }
    }
    log(msg: string): void {
        if (this.level >= BugSplatLogLevel.Log) {
            this.logger.log(msg);
        }
    }
}