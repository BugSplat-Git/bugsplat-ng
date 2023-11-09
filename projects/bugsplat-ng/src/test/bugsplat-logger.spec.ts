import { BugSplatLogger, BugSplatLogLevel, Logger } from '../lib/bugsplat-logger';

describe('BugSplatLogger', () => {
    it('should log errors when log level is set to Error', () => {
        const fakeLogger = createFakeLogger();
        const errorSpy = spyOn(fakeLogger, 'error');
        const warnSpy = spyOn(fakeLogger, 'warn');
        const infoSpy = spyOn(fakeLogger, 'info');
        const logSpy = spyOn(fakeLogger, 'log');
        const expectedMessage = 'BugSplat rocks!';
        const sut = new BugSplatLogger(BugSplatLogLevel.error, fakeLogger);
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
        const errorSpy = spyOn(fakeLogger, 'error');
        const warnSpy = spyOn(fakeLogger, 'warn');
        const infoSpy = spyOn(fakeLogger, 'info');
        const logSpy = spyOn(fakeLogger, 'log');
        const expectedMessage = 'BugSplat rocks!';
        const sut = new BugSplatLogger(BugSplatLogLevel.warn, fakeLogger);
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
        const errorSpy = spyOn(fakeLogger, 'error');
        const warnSpy = spyOn(fakeLogger, 'warn');
        const infoSpy = spyOn(fakeLogger, 'info');
        const logSpy = spyOn(fakeLogger, 'log');
        const expectedMessage = 'BugSplat rocks!';
        const sut = new BugSplatLogger(BugSplatLogLevel.info, fakeLogger);
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
        const errorSpy = spyOn(fakeLogger, 'error');
        const warnSpy = spyOn(fakeLogger, 'warn');
        const infoSpy = spyOn(fakeLogger, 'info');
        const logSpy = spyOn(fakeLogger, 'log');
        const expectedMessage = 'BugSplat rocks!';
        const sut = new BugSplatLogger(BugSplatLogLevel.log, fakeLogger);
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
        const errorSpy = spyOn(fakeLogger, 'error');
        const warnSpy = spyOn(fakeLogger, 'warn');
        const infoSpy = spyOn(fakeLogger, 'info');
        const logSpy = spyOn(fakeLogger, 'log');
        const expectedMessage = 'BugSplat rocks!';
        const sut = new BugSplatLogger(BugSplatLogLevel.none, fakeLogger);
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
        const consoleSpy = spyOn(console, 'log');
        const expectedMessage = 'BugSplat rocks!';
        const sut = new BugSplatLogger(BugSplatLogLevel.log);
        sut.log(expectedMessage);
        expect(consoleSpy).toHaveBeenCalledWith(expectedMessage);
    });
});

const createFakeLogger: () => Logger = () => {
    return {
        error: () => { },
        warn: () => { },
        info: () => { },
        log: () => { }
    }
}
