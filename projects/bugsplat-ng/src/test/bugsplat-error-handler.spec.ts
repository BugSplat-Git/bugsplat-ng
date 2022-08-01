import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BugSplatErrorHandler } from '../lib/bugsplat-error-handler';

describe('BugSplatErrorHandler', () => {
    let bugsplat: any;
    let expectedError: any;
    let sut: BugSplatErrorHandler;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        bugsplat = jasmine.createSpyObj('BugSplat', ['post']);
        bugsplat.post.and.resolveTo();
        expectedError = new Error('BugSplat rocks!');
        
        sut = new BugSplatErrorHandler(bugsplat);
    });
    
    it('should call bugsplat.post when handleError is called', async () => {
        await sut.handleError(expectedError);

        expect(bugsplat.post).toHaveBeenCalledWith(expectedError)
    });
});
