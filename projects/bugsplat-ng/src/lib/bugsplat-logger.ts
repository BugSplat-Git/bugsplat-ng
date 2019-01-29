
export enum BugSplatLogLevel {
    None,
    Error,
    Warn,
    Info,
    Log
}

export interface Logger {
    error(...params: (string | Object)[]): void;
    warn(...params: (string | Object)[]): void;
    info(...params: (string | Object)[]): void;
    log(...params: (string | Object)[]): void;
}

export class BugSplatLogger {

    static readonly LEVEL_CANNOT_BE_NULL = "BugSplatLogger Error: level cannot be null!";
    static readonly LOGGER_CANNOT_BE_NULL = "BugSplatLogger Error: logger cannot be null!";

    constructor(private level: BugSplatLogLevel = BugSplatLogLevel.Error, private logger: Logger = console) {
        if (this.level == null) {
            throw new Error(BugSplatLogger.LEVEL_CANNOT_BE_NULL)
        }
        if (!this.logger) {
            throw new Error(BugSplatLogger.LOGGER_CANNOT_BE_NULL);
        }
    }
    error(...params: (string | Object)[]): void {
        if (this.level >= BugSplatLogLevel.Error) {
            this.logger.error(...params);
        }
    }
    warn(...params: (string | Object)[]): void {
        if (this.level >= BugSplatLogLevel.Warn) {
            this.logger.warn(...params);
        }
    }
    info(...params: (string | Object)[]): void {
        if (this.level >= BugSplatLogLevel.Info) {
            this.logger.info(...params);
        }
    }
    log(...params: (string | Object)[]): void {
        if (this.level >= BugSplatLogLevel.Log) {
            this.logger.log(...params);
        }
    }
}