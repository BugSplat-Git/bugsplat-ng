import { take } from "rxjs/operators";
import { BugSplat } from '../lib/bugsplat';
import { BugSplatLogger, BugSplatLogLevel } from '../lib/bugsplat-logger';
import { BugSplatPostEventType } from '../lib/bugsplat-post-event';

describe('BugSplat', () => {
    let bugsplatJs;
    let nullLogger;

    beforeEach(() => {
        nullLogger = new BugSplatLogger(BugSplatLogLevel.none);
        bugsplatJs = jasmine.createSpyObj('BugSplatJs', ['post']);
    })

    it('should publish an event on post success', async () => {
        const response = {} as Record<string, string | number>;
        response['status'] = 'success';
        response['current_server_time'] = 1505832461;
        response['message'] = 'Crash successfully posted';
        response['crash_id'] = 785
        bugsplatJs.post.and.resolveTo({ response });
        
        const bugsplat = new BugSplat(bugsplatJs, nullLogger);
        const promise = bugsplat.getObservable().pipe(take(1)).toPromise();
        
        await bugsplat.post(new Error("foobar!"));

        const event = await promise;
        expect(event?.type).toEqual(BugSplatPostEventType.success);
        expect(event?.responseData.message).toEqual('Crash successfully posted');
        expect(event?.responseData.success).toEqual(true);
        expect(event?.responseData.crashId).toMatch(/\d{1,}/);
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
        expect(event?.type).toEqual(BugSplatPostEventType.error);
        expect(event?.responseData.success).toEqual(false);
        expect(event?.responseData.message).toContain('Bad Request');
    });
});