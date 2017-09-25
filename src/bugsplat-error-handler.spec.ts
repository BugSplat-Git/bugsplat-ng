import { TestBed, async } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { XHRBackend, ResponseOptions } from "@angular/http";
import { BugSplat } from "./bugsplat-error-handler";
import { MockBackend } from '@angular/http/testing';
import { HttpErrorResponse } from '@angular/common/http';

const testUser = "Fred";
const testPassword = "Flintstone";
const testDatabase = "octomore"

describe('BugSplat', () => {

    beforeAll(() => {
        TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
    });

    beforeEach(() => TestBed.configureTestingModule({
        imports: [HttpClientModule],
        providers: [
            HttpClient,
            { provide: XHRBackend, useClass: MockBackend }
        ]
    }));

    it('should pass response data to callback', async(() => {
        const http = TestBed.get(HttpClient);
        const mockBackend = TestBed.get(XHRBackend);
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
        }
        const bugsplat = new BugSplat(config, http);
        setMockBackendSuccessResponse(mockBackend, mockSuccessResponse);
        bugsplat.setCallback((err, data, context) => {
            expect(data.message).toEqual("Crash successfully posted");
            expect(data.status).toEqual("success");
            expect(data.crash_id).toMatch(/\d{1,}/);
        });
        bugsplat.post(new Error("foobar!"));
    }), 15000);

    it('should pass response error to callback', async(() => {
        const http = TestBed.get(HttpClient);
        const mockBackend = TestBed.get(XHRBackend);
        const mockFailureStatus = 400;
        const config = {
            appName: "",
            appVersion: "",
            database: testDatabase
        }
        const bugsplat = new BugSplat(config, http);
        setMockBackendFailureResponse(mockBackend, mockFailureStatus);
        bugsplat.setCallback((err, data, context) => {
            expect(err).not.toBe(null);
            expect(err.status).toEqual(mockFailureStatus);
        });
        bugsplat.post(new Error("foobar!"));
    }));

    it('should log an error if asked to upload a file that exceeds maximum bundle size', async(() => {
        const http = TestBed.get(HttpClient);
        const spy = spyOn(console, "error");
        const config = {
            appName: "Foobar",
            appVersion: "1.0.0.0",
            database: testDatabase
        }
        const sizeLimitBytes = 2 * 1024 * 1024;
        const fileName = "mario.png";
        const blob = new Blob([new Array(sizeLimitBytes + 1)], { type: 'image/png' });
        const file = new File([blob], fileName);
        const bugsplat = new BugSplat(config, http);
        const expectedMessage = "BugSplat Error: Could not add file " + file.name + ". Upload bundle size limit exceeded!";
        bugsplat.addAddtionalFile(file);
        expect(spy).toHaveBeenCalledWith(expectedMessage);
        }));

    function setMockBackendSuccessResponse(mockBackend, body) {
        mockBackend.connections.subscribe((connection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: JSON.stringify(body)
                })));
        });
    }

    function setMockBackendFailureResponse(mockBackend, status) {
        mockBackend.connections.subscribe((connection) => {
            connection.mockFailureResponse(new HttpErrorResponse({
                status: status
            }));
        });
    }
});