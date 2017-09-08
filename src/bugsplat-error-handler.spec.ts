import { TestBed, async } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { RequestOptions } from "@angular/http";
import { BugSplat } from "./bugsplat-error-handler";

const testUser = "Fred";
const testPassword = "Flintstone";
const testDatabase = "octomore"

describe('BugSplat', () => {

    beforeAll(() => {
        TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
    });

    beforeEach(() => TestBed.configureTestingModule({
        imports: [HttpClientModule],
        providers: [HttpClient]
    }));

    it('should post crash with all properties', async(() => {
        const http = TestBed.get(HttpClient);
        const appName = "bugsplat-ng4-tests";
        const database = testDatabase;
        const appVersion = "1.0.0.0";
        const appKey = "Key!";
        const user = "Fred Flintstone";
        const email = "fred@bedrock.com";
        const description = "Description!";
        const errorMessage = "foobar!";
        const config = {
            appName,
            appVersion,
            database
        }
        const bugsplat = new BugSplat(config, http);
        bugsplat.appKey = appKey;
        bugsplat.user = user;
        bugsplat.email = email;
        bugsplat.description = description;
        bugsplat.setCallback((err, data, context) => {
            const expectedCrashId = data.crash_id;
            const baseUrl = "http://" + testDatabase + ".bugsplat.com";
            const loginUrl = baseUrl + "/api/authenticate.php";
            const options = new RequestOptions({ withCredentials: true });
            const body = new FormData();
            body.append("email", testUser);
            body.append("password", testPassword);
            http.post(loginUrl, body, options).subscribe(data => {
                const individualCrashUrl = baseUrl + "/browse/individualCrash.php?database=" + testDatabase + "&id=" + expectedCrashId;
                http.get(individualCrashUrl + "&data", options).subscribe(data => {
                    expect(data.additionalInfo).toEqual(description);
                    expect(data.appDescription).toEqual(appKey);
                    expect(data.appName).toEqual(appName);
                    expect(data.appVersion).toEqual(appVersion);
                    expect(data.email).toEqual(email);
                    expect(data.user).toEqual(user);
                }, err => {
                    console.error("IndividualCrash &data GET error:", err);
                    throw new Error(err.message);
                });
            }, err => {
                console.error("Login POST error:", err);
                throw new Error(err.message);
            });
        });
        bugsplat.post(new Error(errorMessage))
    }), 15000);

    it('should pass response data to callback', async(() => {
        const http = TestBed.get(HttpClient);
        const config = {
            appName: "bugsplat-ng4-tests",
            appVersion: "1.0.0.0",
            database: testDatabase
        }
        const bugsplat = new BugSplat(config, http);
        bugsplat.setCallback((err, data, context) => {
            expect(data.message).toEqual("Crash successfully posted");
            expect(data.status).toEqual("success");
            expect(data.crash_id).toMatch(/\d{1,}/);
        });
        bugsplat.post(new Error("foobar!"));
    }), 15000);

    it('should pass response error to callback', async(() => {
        const http = TestBed.get(HttpClient);
        const config = {
            appName: "Foobar",
            appVersion: "1.0.0.0",
            database: ""
        }
        const bugsplat = new BugSplat(config, http);
        bugsplat.setCallback((err, data, context) => {
            expect(err).not.toBeUndefined();
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
});
