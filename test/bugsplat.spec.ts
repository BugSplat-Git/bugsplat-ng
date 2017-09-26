import { async } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Http, BaseRequestOptions } from "@angular/http";
import { BugSplat } from '../src/bugsplat';
import { BugSplatPostEventType } from '../src/bugsplat-post-event';
import { TestBedInitializer } from './init';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import { BugSplatLogger } from '../src/bugsplat-logger';

const testDatabase = "Fred"

describe('BugSplat', () => {

    let TestBed;

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
        const config = {
            appName: "bugsplat-ng4-tests",
            appVersion: "1.0.0.0",
            database: testDatabase
        };
        const http = TestBed.get(HttpClient);
        http.post = (url, body) => {
            return Observable.of(mockSuccessResponse);
        };
        const bugsplat = new BugSplat(config, http, new BugSplatLogger());
        bugsplat.getObservable().subscribe(event => {
            expect(event.type).toEqual(BugSplatPostEventType.Success);
            expect(event.responseData.message).toEqual("Crash successfully posted");
            expect(event.responseData.success).toEqual(true);
            expect(event.responseData.crash_id).toMatch(/\d{1,}/);
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
        })
        const config = {
            appName: "",
            appVersion: "",
            database: testDatabase
        };
        const http = TestBed.get(HttpClient);
        http.post = (url, body) => {
            return Observable.throw(mockFailureResponse);
        };
        const bugsplat = new BugSplat(config, http, new BugSplatLogger());
        bugsplat.getObservable().subscribe(event => {
            expect(event.type).toEqual(BugSplatPostEventType.Error);
            expect(event.responseData.success).toBe(false);
            expect(event.responseData.message).toContain("400 Bad Request");
        }, err => {
            throw err;
        });
        bugsplat.post(new Error("foobar!"));
    }));

    it('should log a warning if asked to upload a file that exceeds maximum bundle size', async(() => {
        const http = TestBed.get(HttpClient);
        const logger = new BugSplatLogger();
        const spy = spyOn(logger, "warn");
        const config = {
            appName: "Foobar",
            appVersion: "1.0.0.0",
            database: testDatabase
        }
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