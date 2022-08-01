import { BugSplatLogger, BugSplatLogLevel, Logger } from '../lib/bugsplat-logger';

describe('BugSplatLogger', () => {

    it('should throw if level is null', () => {
        expect(() => new BugSplatLogger(null as any)).toThrowError(BugSplatLogger.LEVEL_CANNOT_BE_NULL);
    });

    it('should throw if logger is null', () => {
        expect(() => new BugSplatLogger(BugSplatLogLevel.Info, null as any)).toThrowError(BugSplatLogger.LOGGER_CANNOT_BE_NULL);
    });

    it('should log errors when log level is set to Error', () => {
        const fakeLogger = createFakeLogger();
        const errorSpy = spyOn(fakeLogger, "error");
        const warnSpy = spyOn(fakeLogger, "warn");
        const infoSpy = spyOn(fakeLogger, "info");
        const logSpy = spyOn(fakeLogger, "log");
        const expectedMessage = "BugSplat rocks!";
        const sut = new BugSplatLogger(BugSplatLogLevel.Error, fakeLogger);
        sut.error(expectedMessage);
        sut.warn(expectedMessage);
        sut.info(expectedMessage);
        sut.log(expectedMessage);
        expect(errorSpy).toHaveBeenCalledWith(expectedMessage);
        expect(warnSpy).not.toHaveBeenCalled();
        expect(infoSpy).not.toHaveBeenCalled();
        expect(logSpy).not.toHaveBeenCalled();
    });

    it('should log errors and warnings when log level is set to Warn', () => {
        const fakeLogger = createFakeLogger();
        const errorSpy = spyOn(fakeLogger, "error");
        const warnSpy = spyOn(fakeLogger, "warn");
        const infoSpy = spyOn(fakeLogger, "info");
        const logSpy = spyOn(fakeLogger, "log");
        const expectedMessage = "BugSplat rocks!";
        const sut = new BugSplatLogger(BugSplatLogLevel.Warn, fakeLogger);
        sut.error(expectedMessage);
        sut.warn(expectedMessage);
        sut.info(expectedMessage);
        sut.log(expectedMessage);
        expect(errorSpy).toHaveBeenCalledWith(expectedMessage);
        expect(warnSpy).toHaveBeenCalledWith(expectedMessage);
        expect(infoSpy).not.toHaveBeenCalled();
        expect(logSpy).not.toHaveBeenCalled();
    });

    it('should log errors, warnings and info when log level is set to Info', () => {
        const fakeLogger = createFakeLogger();
        const errorSpy = spyOn(fakeLogger, "error");
        const warnSpy = spyOn(fakeLogger, "warn");
        const infoSpy = spyOn(fakeLogger, "info");
        const logSpy = spyOn(fakeLogger, "log");
        const expectedMessage = "BugSplat rocks!";
        const sut = new BugSplatLogger(BugSplatLogLevel.Info, fakeLogger);
        sut.error(expectedMessage);
        sut.warn(expectedMessage);
        sut.info(expectedMessage);
        sut.log(expectedMessage);
        expect(errorSpy).toHaveBeenCalledWith(expectedMessage);
        expect(warnSpy).toHaveBeenCalledWith(expectedMessage);
        expect(infoSpy).toHaveBeenCalledWith(expectedMessage);
        expect(logSpy).not.toHaveBeenCalled();
    });

    it('should log errors, warnings, info and log when log level is set to Log', () => {
        const fakeLogger = createFakeLogger();
        const errorSpy = spyOn(fakeLogger, "error");
        const warnSpy = spyOn(fakeLogger, "warn");
        const infoSpy = spyOn(fakeLogger, "info");
        const logSpy = spyOn(fakeLogger, "log");
        const expectedMessage = "BugSplat rocks!";
        const sut = new BugSplatLogger(BugSplatLogLevel.Log, fakeLogger);
        sut.error(expectedMessage);
        sut.warn(expectedMessage);
        sut.info(expectedMessage);
        sut.log(expectedMessage);
        expect(errorSpy).toHaveBeenCalledWith(expectedMessage);
        expect(warnSpy).toHaveBeenCalledWith(expectedMessage);
        expect(infoSpy).toHaveBeenCalledWith(expectedMessage);
        expect(logSpy).toHaveBeenCalledWith(expectedMessage);
    });

    it('should not log when log level is set to None', () => {
        const fakeLogger = createFakeLogger();
        const errorSpy = spyOn(fakeLogger, "error");
        const warnSpy = spyOn(fakeLogger, "warn");
        const infoSpy = spyOn(fakeLogger, "info");
        const logSpy = spyOn(fakeLogger, "log");
        const expectedMessage = "BugSplat rocks!";
        const sut = new BugSplatLogger(BugSplatLogLevel.None, fakeLogger);
        sut.error(expectedMessage);
        sut.warn(expectedMessage);
        sut.info(expectedMessage);
        sut.log(expectedMessage);
        expect(errorSpy).not.toHaveBeenCalled();
        expect(warnSpy).not.toHaveBeenCalled();
        expect(infoSpy).not.toHaveBeenCalled();
        expect(logSpy).not.toHaveBeenCalled();
    });

    it('should use console for logging if no logger is provided', () => {
        const consoleSpy = spyOn(console, "log");
        const expectedMessage = "BugSplat rocks!";
        const sut = new BugSplatLogger(BugSplatLogLevel.Log);
        sut.log(expectedMessage);
        expect(consoleSpy).toHaveBeenCalledWith(expectedMessage);
    });

    function createFakeLogger(): Logger {
        return {
            error: (msg) => { },
            warn: (msg) => { },
            info: (msg) => { },
            log: (msg) => { }
        }
    }
});
