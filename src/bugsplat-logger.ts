import { InjectionToken } from "@angular/core";

export let LoggerToken = new InjectionToken<Logger>('bugsplat.logger');

export enum BugSplatLogLevel {
    None,
    Error,
    Warn,
    Info,
    Debug,
    Log
}

export interface Logger {
    error(msg: string): void;
    warn(msg: string): void;
    info(msg: string): void;
    debug(msg: string): void;
    log(msg: string): void;
}

export class BugSplatLogger implements Logger {
    constructor(private level: BugSplatLogLevel = BugSplatLogLevel.None, private logger: Logger = null) {
        if (!this.logger) {
            this.logger = new BugSplatLogger(level, {
                error: (msg) => console.error(msg),
                warn: (msg) => console.warn(msg),
                info: (msg) => console.info(msg),
                debug: (msg) => console.debug(msg),
                log: (msg) => console.log(msg)
            });
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
    debug(msg: string): void {
        if (this.level >= BugSplatLogLevel.Debug) {
            this.logger.info(msg);
        }
    }
    log(msg: string): void {
        if (this.level >= BugSplatLogLevel.Log) {
            this.logger.log(msg);
        }
    }
}