import { ErrorHandler, Injectable, Inject, Optional } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BugSplat } from "./bugsplat";
import { BugSplatConfiguration } from "./bugsplat-config";
import { Logger, BugSplatLogger, BugSplatLogLevel } from './bugsplat-logger';

@Injectable()
export class BugSplatErrorHandler implements ErrorHandler {
  public bugsplat: BugSplat;

  static readonly ERROR_CANNOT_BE_NULL = "BugSplatErrorHandler Error: handleError was passed a null error!";
  static readonly CONFIG_CANNOT_BE_NULL = "BugSplatErrorHandler Error: config cannot be null!";
  static readonly HTTP_CANNOT_BE_NULL = "BugSplatErrorHandler Error: http cannot be null!";

  constructor( @Inject(BugSplatConfiguration) private config: BugSplatConfiguration,
    @Inject(HttpClient) private http: HttpClient,
    @Optional() private logger: BugSplatLogger) {
    if (!this.config) {
      throw new Error(BugSplatErrorHandler.CONFIG_CANNOT_BE_NULL);
    }
    if (!this.http) {
      throw new Error(BugSplatErrorHandler.HTTP_CANNOT_BE_NULL);
    }
    this.bugsplat = new BugSplat(this.config, this.http, this.logger);
  }

  handleError(error: Error) {
    if (!error) {
      throw new Error(BugSplatErrorHandler.ERROR_CANNOT_BE_NULL);
    } else {
      this.logger.info('Exception caught by BugSplat!')
      this.bugsplat.post(error);
    }
  }
}