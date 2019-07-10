import { BugSplatConfiguration } from '../lib/bugsplat-config';

describe('BugSplatConfiguration', () => {

    it('should throw if appName is null or empty', () => {
        expect(() => new BugSplatConfiguration(null, "1.0.0.0", "Fred")).toThrowError(BugSplatConfiguration.APP_NAME_IS_REQUIRED);
        expect(() => new BugSplatConfiguration("", "1.0.0.0", "Fred")).toThrowError(BugSplatConfiguration.APP_NAME_IS_REQUIRED);
    });

    it('should throw if appVersion is null or empty', () => {
        expect(() => new BugSplatConfiguration("MyApp", null, "Fred")).toThrowError(BugSplatConfiguration.APP_VERSION_IS_REQUIRED);
        expect(() => new BugSplatConfiguration("MyApp", "", "Fred")).toThrowError(BugSplatConfiguration.APP_VERSION_IS_REQUIRED);
    });

    it('should throw if database is null or empty', () => {
        expect(() => new BugSplatConfiguration("MyApp", "1.0.0.0", null)).toThrowError(BugSplatConfiguration.DATABASE_IS_REQUIRED);
        expect(() => new BugSplatConfiguration("MyApp", "1.0.0.0", "")).toThrowError(BugSplatConfiguration.DATABASE_IS_REQUIRED);
    });

    it('should throw if database contains invalid characters', () => {
        expect(() => new BugSplatConfiguration("MyApp", "1.0.0.0", "@#$%^&*()")).toThrowError(BugSplatConfiguration.DATABASE_INVALID_CHARACTERS);
        expect(() => new BugSplatConfiguration("MyApp", "1.0.0.0", "database with spaces")).toThrowError(BugSplatConfiguration.DATABASE_INVALID_CHARACTERS);
    });

    it('should not throw if constructor is called with valid parameters', () => {
        expect(() => new BugSplatConfiguration("MyApp", "1.0.0.0", "Fred")).not.toThrow();
    });
});
