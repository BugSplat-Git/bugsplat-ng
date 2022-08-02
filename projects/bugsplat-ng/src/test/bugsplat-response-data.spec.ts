import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BugSplatResponseData } from '../lib/bugsplat-response-data';

describe('BugSplatResponseData', () => {

    beforeEach(() => TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
    }));

    it('should return BugSplatResponseData when createFromSuccessResponseObject is called with valid parameters', () => {
        const response = {} as Record<string, string | number>;
        response['status'] = 'success';
        response['current_server_time'] = 1506381722;
        response['message'] = 'Crash successfully posted';
        response['url'] = 'https://app.bugsplat.com/browse/crashInfo.php?vendor=octomore&version=1.0.0.0&key=Key!&id=99999999&row=933'
        response['crash_id'] = 933;
        const result = BugSplatResponseData.createFromSuccessResponseObject(response);
        expect(result.success).toEqual(true);
        expect(result.currentServerTime).toEqual(response['current_server_time']);
        expect(result.message).toEqual(response['message']);
        expect(result.url).toEqual(response['url']);
        expect(result.crashId).toEqual(response['crash_id']);
    });

    it('should return BugSplatResponseData when createFromError is called with valid parameters', () => {
        const message = 'Bad Request';
        const error = new Error(message)
        const result = BugSplatResponseData.createFromError(error);
        expect(result.success).toEqual(false);
        expect(result.message).toContain(message);
        expect(result.currentServerTime).toEqual(0);
        expect(result.url).toEqual('');
        expect(result.crashId).toEqual(0);
    });

    it('should use default values if createFromError is called with an object with no properties', () => {
        const result = BugSplatResponseData.createFromSuccessResponseObject({});
        expect(result.success).toEqual(BugSplatResponseData.successDefault);
        expect(result.currentServerTime).toEqual(BugSplatResponseData.serverTimeDefault);
        expect(result.message).toEqual(BugSplatResponseData.messageDefault);
        expect(result.url).toEqual(BugSplatResponseData.urlDefault);
        expect(result.crashId).toEqual(BugSplatResponseData.crashIdDefault);
    });

    it('should throw when createFromSuccessResponseObject is called with null response', () => {
        expect(() => BugSplatResponseData.createFromSuccessResponseObject(null as any)).toThrowError(BugSplatResponseData.responseCannotBeNull);
    });

    it('should return BugSplatResponseData when createFromError is called with null HttpErrorResponse', () => {
        expect(() => BugSplatResponseData.createFromError(null as any)).toThrowError(BugSplatResponseData.errorCannotBeNull);
    });
});
