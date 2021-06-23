import { HttpClient } from "@angular/common/http";
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BugSplatConfiguration } from '../lib/bugsplat-config';
import { BugSplatErrorHandler } from '../lib/bugsplat-error-handler';
import { BugSplatLogger, BugSplatLogLevel } from '../lib/bugsplat-logger';

describe('BugSplatErrorHandler', () => {

    let sut: BugSplatErrorHandler;
    let expectedError: Error;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        const config = new BugSplatConfiguration("bugsplat-ng-tests", "1.0.0.0", "fred");
        const httpClient = TestBed.get(HttpClient);
        const logger = new BugSplatLogger(BugSplatLogLevel.None);
        sut = new BugSplatErrorHandler(config, httpClient, logger);
        expectedError = new Error("BugSplat rocks!");
    });

    it('should call bugsplat.post when handleError is called', async () => {
        sut.bugsplat.post = async (error) => { expect(error).toBe(expectedError) };
        sut.handleError(expectedError);
    });


    it('should create instance of BugSplat at construction time', () => {
        expect(sut.bugsplat).not.toBe(null);
    });

    it('should throw if handleError is called with null', async () => {
        try {
            await sut.handleError(null);
            fail('Handle error should have thrown!');
        } catch (error) {
            expect(error.message).toEqual(BugSplatErrorHandler.ERROR_CANNOT_BE_NULL);
        }
    });
});
