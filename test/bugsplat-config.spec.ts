import { async } from '@angular/core/testing';
import { TestBedInitializer } from './init';
import { BugSplatConfiguration } from '../src/bugsplat-config';

describe('BugSplatConfiguration', () => {
    
    let TestBed;

    beforeAll(() => {
        TestBed = TestBedInitializer.getTestBed();
    });

    it('should throw if appName is null or empty', async(() => {
        expect(() => new BugSplatConfiguration(null, "1.0.0.0", "Fred")).toThrow();
        expect(() => new BugSplatConfiguration("", "1.0.0.0", "Fred")).toThrow();
    }));

    it('should throw if appVersion is null or empty', async(() => {
        expect(() => new BugSplatConfiguration("MyApp", null, "Fred")).toThrow();
        expect(() => new BugSplatConfiguration("MyApp", "", "Fred")).toThrow();
    }));

    it('should throw if database is null or empty', async(() => {
        expect(() => new BugSplatConfiguration("MyApp", "1.0.0.0", null)).toThrow();
        expect(() => new BugSplatConfiguration("MyApp", "1.0.0.0", "")).toThrow();
    }));

    it('should throw if database contains invalid characters', async(() => {
        expect(() => new BugSplatConfiguration("MyApp", "1.0.0.0", "@#$%^&*()")).toThrow();
    }));

    it('should not throw if constructor is called with valid parameters', async(() => {
        expect(() => new BugSplatConfiguration("MyApp", "1.0.0.0", "Fred")).not.toThrow();
    }));
});
