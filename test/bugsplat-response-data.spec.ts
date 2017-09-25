import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { XHRBackend, ResponseOptions, Http, BaseRequestOptions } from "@angular/http";
import { MockBackend } from '@angular/http/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { BugSplat } from '../src/bugsplat';
import { BugSplatErrorHandler } from '../src/bugsplat-error-handler';
import { TestBedInitializer } from './init';
import { async } from '@angular/core/testing';

const testUser = "Fred";
const testPassword = "Flintstone";
const testDatabase = "octomore"

describe('BugSplatErrorHandler', () => {
    let TestBed;

    beforeAll(() => {
        TestBed = TestBedInitializer.getTestBed();
    });

    beforeEach(() => TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
            HttpClient,
            MockBackend,
            BaseRequestOptions,
            {
                provide: Http,
                useFactory: (backend, options) => new Http(backend, options),
                deps: [MockBackend, BaseRequestOptions]
            }
        ]
    }));

    it('should call bugsplat.post when handleError is called', async(() => {
        const httpClient = TestBed.get(HttpClient);
        const config = {
            appName: "bugsplat-ng4-tests",
            appVersion: "1.0.0.0",
            database: testDatabase
        };
        const expectedError = new Error("BugSplat rocks!");
        const sut = new BugSplatErrorHandler(config, httpClient);
        sut.bugsplat.post = (error) => {
            expect(error).toBe(expectedError);
        };
        sut.handleError(expectedError);
    }));

    it('should create instance of BugSplat at construction time', async(() => {
        const httpClient = TestBed.get(HttpClient);
        const config = {
            appName: "bugsplat-ng4-tests",
            appVersion: "1.0.0.0",
            database: testDatabase
        };
        const sut = new BugSplatErrorHandler(config, httpClient);
        expect(sut.bugsplat).not.toBe(null);
    }));
});
