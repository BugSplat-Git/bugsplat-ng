import { async, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Http, BaseRequestOptions, ConnectionBackend, RequestOptions } from "@angular/http";
import { MockBackend } from '@angular/http/testing';
import { BugSplatResponseData } from '../src/bugsplat-response-data';
import { TestBedInitializer } from './init';

describe('BugSplatResponseData', () => {

    let testBed: typeof TestBed;

    beforeAll(() => {
        testBed = TestBedInitializer.getTestBed();
    });

    beforeEach(() => testBed.configureTestingModule({
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
    }));

    it('should throw if success is null', async(() => {
        expect(() => new BugSplatResponseData(null)).toThrowError(BugSplatResponseData.SUCCESS_CANNOT_BE_NULL);
    }));

    it('should throw if current_server_time is null', async(() => {
        expect(() => new BugSplatResponseData(false, null)).toThrowError(BugSplatResponseData.CURRENT_SERVER_TIME_CANNOT_BE_NULL);
    }));

    it('should throw if message is null', async(() => {
        expect(() => new BugSplatResponseData(false, 0, null)).toThrowError(BugSplatResponseData.MESSAGE_CANNOT_BE_NULL);
    }));

    it('should throw if url is null', async(() => {
        expect(() => new BugSplatResponseData(false, 0, "message", null)).toThrowError(BugSplatResponseData.URL_CANNOT_BE_NULL);
    }));

    it('should throw if crash_id is null', async(() => {
        expect(() => new BugSplatResponseData(false, 0, "message", "url", null)).toThrowError(BugSplatResponseData.CRASH_ID_CANNOT_BE_NULL);
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

    it('should use default values if createFromHttpErrorResponse is called with an object with no properties', async(() => {
        const result = BugSplatResponseData.createFromSuccessResponseObject({});
        expect(result.success).toEqual(BugSplatResponseData.SUCCESS_DEFAULT);
        expect(result.current_server_time).toEqual(BugSplatResponseData.SERVER_TIME_DEFAULT);
        expect(result.message).toEqual(BugSplatResponseData.MESSAGE_DEFAULT);
        expect(result.url).toEqual(BugSplatResponseData.URL_DEFAULT);
        expect(result.crash_id).toEqual(BugSplatResponseData.CRASH_ID_DEFAULT);
    }));

    it('should throw when createFromSuccessResponseObject is called with null response', async(() => {
        expect(() => BugSplatResponseData.createFromSuccessResponseObject(null)).toThrowError(BugSplatResponseData.RESPONSE_CANNOT_BE_NULL);
    }));

    it('should return BugSplatResponseData when createFromHttpErrorResponse is called with null HttpErrorResponse', async(() => {
        expect(() => BugSplatResponseData.createFromHttpErrorResponse(null)).toThrowError(BugSplatResponseData.ERROR_CANNOT_BE_NULL);
    }));
});
