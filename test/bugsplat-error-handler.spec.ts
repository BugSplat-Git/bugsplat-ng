import { async } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from "@angular/common/http";
import { Http, BaseRequestOptions } from "@angular/http";
import { MockBackend } from '@angular/http/testing';
import { BugSplatErrorHandler } from '../src/bugsplat-error-handler';
import { TestBedInitializer } from './init';
import { BugSplatLogger } from '../src/bugsplat-logger';
import { BugSplatConfiguration } from '../src/bugsplat-config';

describe('BugSplatErrorHandler', () => {
    
    let TestBed;
    const config = new BugSplatConfiguration("bugsplat-ng4-tests", "1.0.0.0", "fred");

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
        const expectedError = new Error("BugSplat rocks!");
        const sut = new BugSplatErrorHandler(config, httpClient, new BugSplatLogger());
        sut.bugsplat.post = (error) => {
            expect(error).toBe(expectedError);
        };
        sut.handleError(expectedError);
    }));

    it('should create instance of BugSplat at construction time', async(() => {
        const httpClient = TestBed.get(HttpClient);
        const sut = new BugSplatErrorHandler(config, httpClient, new BugSplatLogger());
        expect(sut.bugsplat).not.toBe(null);
    }));
});
