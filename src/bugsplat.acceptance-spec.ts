import { TestBed, async } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { RequestOptions } from "@angular/http";
import { BugSplat } from "./bugsplat";

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
    }), 30000);
});
