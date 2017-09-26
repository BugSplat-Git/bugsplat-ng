import { async } from '@angular/core/testing';
import { TestBedInitializer } from './init';
import { BugSplatLogger, BugSplatLogLevel, Logger } from '../src/bugsplat-logger';

describe('BugSplatLogger', () => {
    
    let TestBed;

    beforeAll(() => {
        TestBed = TestBedInitializer.getTestBed();
    });

    it('should log errors when log level is set to Error', async(() => {
        const fakeLogger = createFakeLogger(BugSplatLogLevel.Error);
        const sut = new BugSplatLogger(fakeLogger);
        const errorSpy = spyOn(fakeLogger, "error");
        const warnSpy = spyOn(fakeLogger, "warn");
        const infoSpy = spyOn(fakeLogger, "info");
        const debugSpy = spyOn(fakeLogger, "debug");
        const logSpy = spyOn(fakeLogger, "log");
        const expectedMessage = "BugSplat rocks!";
        sut.error(expectedMessage);
        sut.warn(expectedMessage);
        sut.info(expectedMessage);
        sut.debug(expectedMessage);
        sut.log(expectedMessage);
        expect(errorSpy).toHaveBeenCalledWith(expectedMessage);
        expect(warnSpy).not.toHaveBeenCalled();
        expect(infoSpy).not.toHaveBeenCalled();
        expect(debugSpy).not.toHaveBeenCalled();
        expect(logSpy).not.toHaveBeenCalled();
    }));

    it('should log errors and warnings when log level is set to Warn', async(() => {
        const fakeLogger = createFakeLogger(BugSplatLogLevel.Warn);
        const errorSpy = spyOn(fakeLogger, "error");
        const warnSpy = spyOn(fakeLogger, "warn");
        const infoSpy = spyOn(fakeLogger, "info");
        const debugSpy = spyOn(fakeLogger, "debug");
        const logSpy = spyOn(fakeLogger, "log");
        const expectedMessage = "BugSplat rocks!";
        const sut = new BugSplatLogger(fakeLogger);
        sut.error(expectedMessage);
        sut.warn(expectedMessage);
        sut.info(expectedMessage);
        sut.debug(expectedMessage);
        sut.log(expectedMessage);
        expect(errorSpy).toHaveBeenCalledWith(expectedMessage);
        expect(warnSpy).toHaveBeenCalledWith(expectedMessage);
        expect(infoSpy).not.toHaveBeenCalled();
        expect(debugSpy).not.toHaveBeenCalled();
        expect(logSpy).not.toHaveBeenCalled();
    }));

    it('should log errors, warnings and info when log level is set to Info', async(() => {
        const fakeLogger = createFakeLogger(BugSplatLogLevel.Info);
        const sut = new BugSplatLogger(fakeLogger);
        const errorSpy = spyOn(fakeLogger, "error");
        const warnSpy = spyOn(fakeLogger, "warn");
        const infoSpy = spyOn(fakeLogger, "info");
        const debugSpy = spyOn(fakeLogger, "debug");
        const logSpy = spyOn(fakeLogger, "log");
        const expectedMessage = "BugSplat rocks!";
        sut.error(expectedMessage);
        sut.warn(expectedMessage);
        sut.info(expectedMessage);
        sut.debug(expectedMessage);
        sut.log(expectedMessage);
        expect(errorSpy).toHaveBeenCalledWith(expectedMessage);
        expect(warnSpy).toHaveBeenCalledWith(expectedMessage);
        expect(infoSpy).toHaveBeenCalledWith(expectedMessage);
        expect(debugSpy).not.toHaveBeenCalled();
        expect(logSpy).not.toHaveBeenCalled();
    }));

    it('should log errors, warnings, info and debug when log level is set to Debug', async(() => {
        const fakeLogger = createFakeLogger(BugSplatLogLevel.Debug);
        const sut = new BugSplatLogger(fakeLogger);
        const errorSpy = spyOn(fakeLogger, "error");
        const warnSpy = spyOn(fakeLogger, "warn");
        const infoSpy = spyOn(fakeLogger, "info");
        const debugSpy = spyOn(fakeLogger, "debug");
        const logSpy = spyOn(fakeLogger, "log");
        const expectedMessage = "BugSplat rocks!";
        sut.error(expectedMessage);
        sut.warn(expectedMessage);
        sut.info(expectedMessage);
        sut.debug(expectedMessage);
        sut.log(expectedMessage);
        expect(errorSpy).toHaveBeenCalledWith(expectedMessage);
        expect(warnSpy).toHaveBeenCalledWith(expectedMessage);
        expect(infoSpy).toHaveBeenCalledWith(expectedMessage);
        expect(debugSpy).toHaveBeenCalledWith(expectedMessage);
        expect(logSpy).not.toHaveBeenCalled();
    }));

    it('should log errors, warnings, info, debug and log when log level is set to Log', async(() => {
        const fakeLogger = createFakeLogger(BugSplatLogLevel.Log);
        const sut = new BugSplatLogger(fakeLogger);
        const errorSpy = spyOn(fakeLogger, "error");
        const warnSpy = spyOn(fakeLogger, "warn");
        const infoSpy = spyOn(fakeLogger, "info");
        const debugSpy = spyOn(fakeLogger, "debug");
        const logSpy = spyOn(fakeLogger, "log");
        const expectedMessage = "BugSplat rocks!";
        sut.error(expectedMessage);
        sut.warn(expectedMessage);
        sut.info(expectedMessage);
        sut.debug(expectedMessage);
        sut.log(expectedMessage);
        expect(errorSpy).toHaveBeenCalledWith(expectedMessage);
        expect(warnSpy).toHaveBeenCalledWith(expectedMessage);
        expect(infoSpy).toHaveBeenCalledWith(expectedMessage);
        expect(debugSpy).toHaveBeenCalledWith(expectedMessage);
        expect(logSpy).toHaveBeenCalledWith(expectedMessage);
    }));

    it('should not log when log level is set to None', async(() => {
        const fakeLogger = createFakeLogger(BugSplatLogLevel.None);
        const sut = new BugSplatLogger(fakeLogger);
        const errorSpy = spyOn(fakeLogger, "error");
        const warnSpy = spyOn(fakeLogger, "warn");
        const infoSpy = spyOn(fakeLogger, "info");
        const debugSpy = spyOn(fakeLogger, "debug");
        const logSpy = spyOn(fakeLogger, "log");
        const expectedMessage = "BugSplat rocks!";
        sut.error(expectedMessage);
        sut.warn(expectedMessage);
        sut.info(expectedMessage);
        sut.debug(expectedMessage);
        sut.log(expectedMessage);
        expect(errorSpy).not.toHaveBeenCalled();
        expect(warnSpy).not.toHaveBeenCalled();
        expect(infoSpy).not.toHaveBeenCalled();
        expect(debugSpy).not.toHaveBeenCalled();
        expect(logSpy).not.toHaveBeenCalled();
    }));

    function createFakeLogger(level: BugSplatLogLevel): Logger {
        return {
            level: level,
            error: (msg) => {},
            warn: (msg) => {},
            info: (msg) => {},
            debug: (msg) => {},
            log: (msg) => {}
        }
    }
});
