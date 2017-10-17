import { async } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Http, BaseRequestOptions } from "@angular/http";
import { BugSplat } from '../src/bugsplat';
import { BugSplatPostEventType } from '../src/bugsplat-post-event';
import { TestBedInitializer } from './init';
import { Observable } from 'rxjs/Observable';
import { BugSplatConfiguration } from '../src/bugsplat-config';
import { BugSplatLogger } from '../src/bugsplat-logger';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

const testDatabase = "Fred"

describe('BugSplat', () => {

    let TestBed;
    const config = new BugSplatConfiguration("bugsplat-ng4-tests", "1.0.0.0", testDatabase);

    beforeAll(() => {
        TestBed = TestBedInitializer.getTestBed();
    });
    
    beforeEach(() => TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
    }));

    it('should publish an event on post success', async(() => {
        const mockSuccessResponse = {
            status: 'success',
            current_server_time: 1505832461,
            message: 'Crash successfully posted',
            crash_id: 785
        };
        const expectedResponse = {
            success: true,
            message: "Crash successfully posted",
            crash_id: /\d{1,}/
        };
        const http = TestBed.get(HttpClient);
        http.post = (url, body) => {
            return Observable.of(mockSuccessResponse);
        };
        const bugsplat = new BugSplat(config, http, new BugSplatLogger());
        bugsplat.getObservable().subscribe(event => {
            expect(event.type).toEqual(BugSplatPostEventType.Success);
            expect(event.responseData.message).toEqual(expectedResponse.message);
            expect(event.responseData.success).toEqual(expectedResponse.success);
            expect(event.responseData.crash_id).toMatch(expectedResponse.crash_id);
        }, err => {
            throw err;
        });
        bugsplat.post(new Error("foobar!"));
    }));

    it('should publish an event on post error', async(() => {
        const mockFailureStatus = 400;
        const mockFailureResponse = new HttpErrorResponse({
            status: mockFailureStatus,
            statusText: 'Bad Request',
            url: 'https://octomore.bugsplat.com/post/js/',
            error: null
        });
        const expectedResponse = {
            type: BugSplatPostEventType.Error,
            success: false,
            message: "400 Bad Request"
        };
        const http = TestBed.get(HttpClient);
        http.post = (url, body) => {
            return Observable.throw(mockFailureResponse);
        };
        const bugsplat = new BugSplat(config, http, new BugSplatLogger());
        bugsplat.getObservable().subscribe(event => {
            expect(event.type).toEqual(expectedResponse.type);
            expect(event.responseData.success).toEqual(expectedResponse.success);
            expect(event.responseData.message).toContain(expectedResponse.message);
        }, err => {
            throw err;
        });
        bugsplat.post(new Error("foobar!"));
    }));

    it('should log a warning if asked to upload a file that exceeds maximum bundle size', async(() => {
        const http = TestBed.get(HttpClient);
        const logger = new BugSplatLogger();
        const spy = spyOn(logger, "warn");
        const sizeLimitBytes = 2 * 1024 * 1024;
        const fileName = "mario.png";
        const blob = new Blob([new Array(sizeLimitBytes + 1)], { type: 'image/png' });
        const file = new File([blob], fileName);
        const bugsplat = new BugSplat(config, http, logger);
        const expectedMessage = "BugSplat Error: Could not add file " + file.name + ". Upload bundle size limit exceeded!";
        bugsplat.addAddtionalFile(file);
        expect(spy).toHaveBeenCalledWith(expectedMessage);
    }));
});