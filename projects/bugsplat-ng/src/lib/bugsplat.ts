import { Injectable, Optional } from '@angular/core';
import { BugSplat as BugSplatJs, BugSplatOptions } from 'bugsplat';
import { Observable, Subject } from 'rxjs';
import { BugSplatLogger } from './bugsplat-logger';
import { BugSplatPostEvent, BugSplatPostEventType } from './bugsplat-post-event';
import { BugSplatResponseData } from './bugsplat-response-data';

@Injectable()
export class BugSplat {

  // TODO BG replace with calls to bugsplat.setDefault
  description = '';
  files: Array<File> = [];
  key = '';
  email = '';
  user = '';

  private bugSplatPostEventSubject = new Subject<BugSplatPostEvent>();
  private bugsplatPostEventObservable!: Observable<BugSplatPostEvent>;

  constructor(
    private bugsplatJs: BugSplatJs,
    @Optional() private logger: BugSplatLogger = new BugSplatLogger(),
  ) { }

  get database(): string {
    return this.bugsplatJs.database;
  }

  get application(): string {
    return this.bugsplatJs.application;
  }

  get version(): string {
    return this.bugsplatJs.version;
  }

  getObservable(): Observable<BugSplatPostEvent> {
    if (!this.bugsplatPostEventObservable) {
      this.bugsplatPostEventObservable = this.bugSplatPostEventSubject.asObservable();
    }

    return this.bugsplatPostEventObservable;
  }

  async post(error: Error, options: BugSplatOptions = {}): Promise<void> {
    options = options ?? {}

    // TODO BG move bugsplat-js
    options.appKey = options.appKey ?? this.key;
    options.description = options.description ?? this.description;
    options.email = options.email ?? this.email;
    options.user = options.user ?? this.user;

    if (!options?.additionalFormDataParams?.length) {
      options.additionalFormDataParams = [];
    }

    for (const file of this.files) {
      options.additionalFormDataParams.push({
        key: file.name,
        value: file,
        options: file.name
      });
    }

    // TODO BG move to bugsplat-js
    this.logger.info('Error caught by BugSplat');
    this.logger.info('BugSplat POST callstack:', JSON.stringify(error.stack));
    this.logger.info('BugSplat POST appKey:', options.appKey);
    this.logger.info('BugSplat POST user:', options.user);
    this.logger.info('BugSplat POST email:', options.email);
    this.logger.info('BugSplat POST description:', options.description);
    for (let i = 0; i < options.additionalFormDataParams.length; i++) {
      this.logger.info('BugSplat POST additionalFormDataParams[' + i + ']: ' + options.additionalFormDataParams[i].key);
    }

    const result = await this.bugsplatJs.post(error, options);
    if (result.error) {
      const errorResponseData = BugSplatResponseData.createFromError(result.error);
      const errorEvent = new BugSplatPostEvent(BugSplatPostEventType.error, errorResponseData);
      this.logger.error('BugSplat POST Error: ' + JSON.stringify(error));
      this.bugSplatPostEventSubject.next(errorEvent);
      return;
    }

    const responseData = BugSplatResponseData.createFromSuccessResponseObject(result.response);
    const event = new BugSplatPostEvent(BugSplatPostEventType.success, responseData);
    this.logger.info('BugSplat POST Success: ' + JSON.stringify(result));
    this.bugSplatPostEventSubject.next(event);
  }
}