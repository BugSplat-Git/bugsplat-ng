import { ErrorHandler, Injectable, Inject, InjectionToken } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BugSplat } from "./bugsplat";
import { BugSplatConfiguration } from "./bugsplat-config";
import { Logger, BugSplatLogger, BugSplatLogLevel } from './bugsplat-logger';

@Injectable()
export class BugSplatErrorHandler implements ErrorHandler {
  public bugsplat: BugSplat;
  
  constructor(private config: BugSplatConfiguration,
    private http: HttpClient,
    private logger: BugSplatLogger = new BugSplatLogger()) {
      this.bugsplat = new BugSplat(this.config, this.http, this.logger);
  }

  handleError(error) {
    this.logger.info('Exception caught by BugSplat!')
    this.bugsplat.post(error);
  }
}