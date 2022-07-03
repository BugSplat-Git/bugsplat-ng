import { Injectable, Optional } from '@angular/core';
import { BugSplat as BugSplatJs, BugSplatOptions } from 'bugsplat';
import { Observable, Subject } from 'rxjs';
import { BugSplatLogger } from './bugsplat-logger';
import { BugSplatPostEvent, BugSplatPostEventType } from './bugsplat-post-event';
import { BugSplatResponseData } from './bugsplat-response-data';

@Injectable()
export class BugSplat {

  // TODO BG replace with calls to bugsplat.setDefault
  public description: string = '';
  public files: Array<File> = [];
  public key: string = '';
  public email: string = '';
  public user: string = '';

  get database(): string {
    return this.bugsplatJs.database;
  }

  get application(): string {
    return this.bugsplatJs.application;
  }

  get version(): string {
    return this.bugsplatJs.version;
  }

  private bugSplatPostEventSubject = new Subject<BugSplatPostEvent>();
  private bugsplatPostEventObserverable!: Observable<BugSplatPostEvent>;

  constructor(
    private bugsplatJs: BugSplatJs,
    @Optional() private logger: BugSplatLogger = new BugSplatLogger(),
  ) { }

  getObservable(): Observable<BugSplatPostEvent> {
    if (!this.bugsplatPostEventObserverable) {
      this.bugsplatPostEventObserverable = this.bugSplatPostEventSubject.asObservable();
    }

    return this.bugsplatPostEventObserverable;
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

    for (let i = 0; i < this.files.length; i++) {
      const file = this.files[i];
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
      const responseData = BugSplatResponseData.createFromError(result.error);
      const event = new BugSplatPostEvent(BugSplatPostEventType.Error, responseData);
      this.logger.error('BugSplat POST Error: ' + JSON.stringify(error));
      this.bugSplatPostEventSubject.next(event);
      return;
    }

    const responseData = BugSplatResponseData.createFromSuccessResponseObject(result.response);
    const event = new BugSplatPostEvent(BugSplatPostEventType.Success, responseData);
    this.logger.info('BugSplat POST Success: ' + JSON.stringify(result));
    this.bugSplatPostEventSubject.next(event);
  }
}