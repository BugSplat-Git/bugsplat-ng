import { HttpErrorResponse } from "@angular/common/http";
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BugSplatResponseData } from '../lib/bugsplat-response-data';

describe('BugSplatResponseData', () => {

    beforeEach(() => TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
    }));

    it('should return BugSplatResponseData when createFromSuccessResponseObject is called with valid parameters', () => {
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
    });

    it('should return BugSplatResponseData when createFromError is called with valid parameters', () => {
        const message = "Bad Request";
        const error = new Error(message)
        const result = BugSplatResponseData.createFromError(error);
        expect(result.success).toEqual(false);
        expect(result.message).toContain(message);
        expect(result.current_server_time).toEqual(0);
        expect(result.url).toEqual("");
        expect(result.crash_id).toEqual(0);
    });

    it('should use default values if createFromError is called with an object with no properties', () => {
        const result = BugSplatResponseData.createFromSuccessResponseObject({});
        expect(result.success).toEqual(BugSplatResponseData.SUCCESS_DEFAULT);
        expect(result.current_server_time).toEqual(BugSplatResponseData.SERVER_TIME_DEFAULT);
        expect(result.message).toEqual(BugSplatResponseData.MESSAGE_DEFAULT);
        expect(result.url).toEqual(BugSplatResponseData.URL_DEFAULT);
        expect(result.crash_id).toEqual(BugSplatResponseData.CRASH_ID_DEFAULT);
    });

    it('should throw when createFromSuccessResponseObject is called with null response', () => {
        expect(() => BugSplatResponseData.createFromSuccessResponseObject(null as any)).toThrowError(BugSplatResponseData.RESPONSE_CANNOT_BE_NULL);
    });

    it('should return BugSplatResponseData when createFromError is called with null HttpErrorResponse', () => {
        expect(() => BugSplatResponseData.createFromError(null as any)).toThrowError(BugSplatResponseData.ERROR_CANNOT_BE_NULL);
    });
});
