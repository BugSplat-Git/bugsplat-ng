import { take } from "rxjs/operators";
import { BugSplat } from '../lib/bugsplat';
import { BugSplatLogger, BugSplatLogLevel } from '../lib/bugsplat-logger';
import { BugSplatPostEventType } from '../lib/bugsplat-post-event';

describe('BugSplat', () => {
    let bugsplatJs;
    let nullLogger;

    beforeEach(() => {
        nullLogger = new BugSplatLogger(BugSplatLogLevel.None);
        bugsplatJs = jasmine.createSpyObj('BugSplatJs', ['post']);
    })

    it('should publish an event on post success', async () => {
        bugsplatJs.post.and.resolveTo({
            response: {
                status: 'success',
                current_server_time: 1505832461,
                message: 'Crash successfully posted',
                crash_id: 785
            }
        });
        
        const bugsplat = new BugSplat(bugsplatJs, nullLogger);
        const promise = bugsplat.getObservable().pipe(take(1)).toPromise();
        
        await bugsplat.post(new Error("foobar!"));

        const event = await promise;
        expect(event.type).toEqual(BugSplatPostEventType.Success);
        expect(event.responseData.message).toEqual('Crash successfully posted');
        expect(event.responseData.success).toEqual(true);
        expect(event.responseData.crash_id).toMatch(/\d{1,}/);
    });

    it('should publish an event on post error', async () => {
        const message = 'Bad Request';
        bugsplatJs.post.and.resolveTo({
            error: new Error(message)
        });
        const bugsplat = new BugSplat(bugsplatJs, nullLogger);
        const promise = bugsplat.getObservable().pipe(take(1)).toPromise();
        
        await bugsplat.post(new Error("foobar!"));
        
        const event = await promise;
        expect(event.type).toEqual(BugSplatPostEventType.Error);
        expect(event.responseData.success).toEqual(false);
        expect(event.responseData.message).toContain('Bad Request');
    });

    // TODO BG
    // it('should log a warning if asked to upload a file that exceeds maximum bundle size', () => {
    //     const spy = spyOn(nullLogger, "warn");
    //     const sizeLimitBytes = 2 * 1024 * 1024;
    //     const fileName = "mario.png";
    //     const blob = new Blob([(new Array(sizeLimitBytes + 1)).toString()], { type: 'image/png' });
    //     const file = new File([blob], fileName);
    //     const bugsplat = new BugSplat(config, nullLogger);
    //     const expectedMessage = "BugSplat Error: Could not add file " + file.name + ". Upload bundle size limit exceeded!";
    //     bugsplat.addAdditionalFile(file);
    //     expect(spy).toHaveBeenCalledWith(expectedMessage);
    // });
});