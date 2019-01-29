import { async } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from "@angular/common/http";
import { Http, BaseRequestOptions, ConnectionBackend, RequestOptions } from "@angular/http";
import { MockBackend } from '@angular/http/testing';
import { BugSplatErrorHandler } from '../lib/bugsplat-error-handler';
import { BugSplatLogger } from '../lib/bugsplat-logger';
import { BugSplatConfiguration } from '../lib/bugsplat-config';
import { TestBed } from '@angular/core/testing';

describe('BugSplatErrorHandler', () => {

    let sut: BugSplatErrorHandler;
    let expectedError: Error;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                HttpClient,
                MockBackend,
                BaseRequestOptions,
                {
                    provide: Http,
                    useFactory: (backend: ConnectionBackend, options: RequestOptions) => new Http(backend, options),
                    deps: [MockBackend, BaseRequestOptions]
                }
            ]
        });
        const config = new BugSplatConfiguration("bugsplat-ng6-tests", "1.0.0.0", "fred");
        const httpClient = TestBed.get(HttpClient);
        const logger = new BugSplatLogger();
        sut = new BugSplatErrorHandler(config, httpClient, logger);
        expectedError = new Error("BugSplat rocks!");
    });

    it('should call bugsplat.post when handleError is called', () => {
        sut.bugsplat.post = (error) => expect(error).toBe(expectedError);
        sut.handleError(expectedError);
    });


    it('should create instance of BugSplat at construction time', () => {
        expect(sut.bugsplat).not.toBe(null);
    });

    it('should throw if handleError is called with null', () => {
        expect(() => sut.handleError(null)).toThrowError(BugSplatErrorHandler.ERROR_CANNOT_BE_NULL);
    });
});
