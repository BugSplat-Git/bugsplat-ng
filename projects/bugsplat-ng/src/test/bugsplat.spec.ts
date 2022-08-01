import { take } from 'rxjs/operators';
import { BugSplat } from '../lib/bugsplat';
import { BugSplatLogger, BugSplatLogLevel } from '../lib/bugsplat-logger';
import { BugSplatPostEventType } from '../lib/bugsplat-post-event';

describe('BugSplat', () => {
        let bugsplatJs: any;
        let nullLogger: any;
        let bugsplat: BugSplat;

        beforeEach(() => {
                nullLogger = new BugSplatLogger(BugSplatLogLevel.none);
                bugsplatJs = {
                        post: jasmine.createSpy(),
                        setDefaultAppKey: jasmine.createSpy(),
                        setDefaultDescription: jasmine.createSpy(),
                        setDefaultEmail: jasmine.createSpy(),
                        setDefaultUser: jasmine.createSpy(),
                        database: 'fred',
                        application: 'my-ng-crasher',
                        version: '14.0.0'
                };
                bugsplat = new BugSplat(bugsplatJs, nullLogger);
        });

        it('should publish an event on post success', async () => {
                const response = {} as Record<string, string | number>;
                response['status'] = 'success';
                response['current_server_time'] = 1505832461;
                response['message'] = 'Crash successfully posted';
                response['crash_id'] = 785
                bugsplatJs.post.and.resolveTo({ response });

                bugsplat = new BugSplat(bugsplatJs, nullLogger);
                const promise = bugsplat.getObservable().pipe(take(1)).toPromise();

                await bugsplat.post(new Error('foobar!'));

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
                bugsplat = new BugSplat(bugsplatJs, nullLogger);
                const promise = bugsplat.getObservable().pipe(take(1)).toPromise();

                await bugsplat.post(new Error('foobar!'));

                const event = await promise;
                expect(event?.type).toEqual(BugSplatPostEventType.error);
                expect(event?.responseData.success).toEqual(false);
                expect(event?.responseData.message).toContain('Bad Request');
        });

        it('should call setDefaultAppKey when key is set', () => {
                const key = '🔑';
                
                bugsplat.key = key;

                expect(bugsplatJs.setDefaultAppKey).toHaveBeenCalledWith(key);
        });

        it('should call setDefaultDescription when description is set', () => {
                const description = '💭';
                
                bugsplat.description = description;

                expect(bugsplatJs.setDefaultDescription).toHaveBeenCalledWith(description);
        });

        it('should call setDefaultEmail when email is set', () => {
                const email = '💌';
                
                bugsplat.email = email;

                expect(bugsplatJs.setDefaultEmail).toHaveBeenCalledWith(email);
        });

        it('should call setDefaultUser when user is set', () => {
                const user = '⛄️';
                
                bugsplat.email = user;

                expect(bugsplatJs.setDefaultEmail).toHaveBeenCalledWith(user);
        });

        it('should return database from bugsplat-js', () => {
                expect(bugsplat.database).toEqual(bugsplatJs.database);
        });

        it('should return application from bugsplat-js', () => {
                expect(bugsplat.application).toEqual(bugsplatJs.application);
        });

        it('should return version from bugsplat-js', () => {
                expect(bugsplat.version).toEqual(bugsplatJs.version);
        });

});