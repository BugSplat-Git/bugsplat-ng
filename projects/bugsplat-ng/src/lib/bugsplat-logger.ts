
export enum BugSplatLogLevel {
    none,
    error,
    warn,
    info,
    log
}

export interface Logger {
    error(...params: (string | object)[]): void;
    warn(...params: (string | object)[]): void;
    info(...params: (string | object)[]): void;
    log(...params: (string | object)[]): void;
}

export class BugSplatLogger {

    static readonly levelCannotBeNull = 'BugSplatLogger Error: level cannot be null or undefined!';
    static readonly loggerCannotBeNull = 'BugSplatLogger Error: logger cannot be null or undefined!';

    constructor(private level: BugSplatLogLevel = BugSplatLogLevel.error, private logger: Logger = console) {
        if (this.level === null || this.level === undefined) {
            throw new Error(BugSplatLogger.levelCannotBeNull)
        }
        if (!this.logger) {
            throw new Error(BugSplatLogger.loggerCannotBeNull);
        }
    }
    error(...params: (string | object)[]): void {
        if (this.level >= BugSplatLogLevel.error) {
            this.logger.error(...params);
        }
    }
    warn(...params: (string | object)[]): void {
        if (this.level >= BugSplatLogLevel.warn) {
            this.logger.warn(...params);
        }
    }
    info(...params: (string | object)[]): void {
        if (this.level >= BugSplatLogLevel.info) {
            this.logger.info(...params);
        }
    }
    log(...params: (string | object)[]): void {
        if (this.level >= BugSplatLogLevel.log) {
            this.logger.log(...params);
        }
    }
}