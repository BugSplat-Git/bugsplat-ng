import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BugSplatErrorHandler, } from '../lib/bugsplat-error-handler';
import { Spy, createSpyFromClass } from 'jasmine-auto-spies';
import { BugSplat } from '../lib/bugsplat';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('BugSplatErrorHandler', () => {
    let bugsplat: Spy<BugSplat>;
    let expectedError: Error;
    let sut: BugSplatErrorHandler;

    beforeEach(() => {
        TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
        bugsplat = createSpyFromClass(BugSplat);
        bugsplat.post.and.resolveWith();
        expectedError = new Error('BugSplat rocks!');
        
        sut = new BugSplatErrorHandler(bugsplat as unknown as BugSplat);
    });
    
    it('should call bugsplat.post when handleError is called', async () => {
        await sut.handleError(expectedError);

        expect(bugsplat.post).toHaveBeenCalledWith(expectedError)
    });
});
