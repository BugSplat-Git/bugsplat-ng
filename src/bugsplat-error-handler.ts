import { ErrorHandler, Injectable, Inject, InjectionToken } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BugSplat } from "./bugsplat";
import { BugSplatConfig, BugSplatConfigToken } from "./bugsplat-config";
import { LoggerToken, Logger, BugSplatLogger } from './bugsplat-logger';

@Injectable()
export class BugSplatErrorHandler implements ErrorHandler {
  public bugsplat: BugSplat;
  
  constructor( @Inject(BugSplatConfigToken) private config: BugSplatConfig,
    private http: HttpClient,
    @Inject(LoggerToken) private logger: Logger = null) {
      if(!this.logger) {
        this.logger = new BugSplatLogger();
      }

      this.bugsplat = new BugSplat(this.config, this.http, this.logger);
  }

  handleError(error) {
    this.logger.debug('Exception caught by BugSplat!')
    this.logger.debug('BugSplat AppName: ' + this.config.appName);
    this.logger.debug('BugSplat AppVersion: ' + this.config.appVersion);
    this.logger.debug('BugSplat Database: ' + this.config.database);
    this.bugsplat.post(error);
  }
}