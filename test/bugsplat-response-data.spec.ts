import { async } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Http, BaseRequestOptions } from "@angular/http";
import { MockBackend } from '@angular/http/testing';
import { BugSplatResponseData } from '../src/bugsplat-response-data';
import { TestBedInitializer } from './init';

describe('BugSplatResponseData', () => {
    
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

    it('should return BugSplatResponseData when createFromSuccessResponseObject is called with valid parameters', async(() => {
        const status = "success";
        const current_server_time = 1506381722;
        const message = "Crash successfully posted";
        const url = "https://app.bugsplat.com/browse/crashInfo.php?vendor=octomore&version=1.0.0.0&key=Key!&id=99999999&row=933";
        const crash_id = 933;
        const response = {
            status,
            current_server_time,
            message,
            url,
            crash_id
        }
        const result = BugSplatResponseData.createFromSuccessResponseObject(response);
        expect(result.success).toEqual(true);
        expect(result.current_server_time).toEqual(current_server_time);
        expect(result.message).toEqual(message);
        expect(result.url).toEqual(url);
        expect(result.crash_id).toEqual(crash_id);
    }));

    it('should return BugSplatResponseData when createFromHttpErrorResponse is called with valid parameters', async(() => {
        const url = "https://octomore.bugsplat.com/post/js/"
        const httpErrorResponse = new HttpErrorResponse({
            status: 400,
            statusText: "Bad Request",
            url: url
        });
        const result = BugSplatResponseData.createFromHttpErrorResponse(httpErrorResponse);
        expect(result.success).toEqual(false);
        expect(result.current_server_time).toEqual(0);
        expect(result.message).toContain("400 Bad Request");
        expect(result.url).toEqual(url);
        expect(result.crash_id).toEqual(0);
    }));

    it('should throw when createFromSuccessResponseObject is called with valid parameters', async(() => {
        expect(() => BugSplatResponseData.createFromSuccessResponseObject(null)).toThrow();
    }));

    it('should return BugSplatResponseData when createFromHttpErrorResponse is called with valid parameters', async(() => {
        expect(() => BugSplatResponseData.createFromHttpErrorResponse(null)).toThrow();
    }));
});
