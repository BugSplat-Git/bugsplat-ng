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
    });

    it('should call bugsplat.post when handleError is called', async(() => {
        const expectedError = new Error("BugSplat rocks!");
        sut.bugsplat.post = (error) => expect(error).toBe(expectedError);
        sut.handleError(expectedError);
    }));

    it('should create instance of BugSplat at construction time', async(() => {
        expect(sut.bugsplat).not.toBe(null);
    }));

    it('should throw if handleError is called with null', async(() => {
        expect(() => sut.handleError(null)).toThrowError(BugSplatErrorHandler.ERROR_CANNOT_BE_NULL);
    }));
});
