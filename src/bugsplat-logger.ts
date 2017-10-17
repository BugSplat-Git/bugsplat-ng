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
    constructor(private level: BugSplatLogLevel = BugSplatLogLevel.None, private logger: Logger = console) { }
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