import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { XHRBackend, ResponseOptions, Http, BaseRequestOptions } from "@angular/http";
import { MockBackend } from '@angular/http/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { BugSplat } from '../src/bugsplat';
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

    it('should pass', async(() => {
        expect(true).toBeTruthy();
    }));
});
