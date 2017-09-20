import { ErrorHandler, Injectable, Inject, InjectionToken } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BugSplat } from "./bugsplat";
import { BugSplatConfig, BugSplatConfigToken } from "./bugsplat-config";

@Injectable()
export class BugSplatErrorHandler implements ErrorHandler {
  private bugsplat: BugSplat;
  
  constructor( @Inject(BugSplatConfigToken) private config: BugSplatConfig, private http: HttpClient) {
    this.bugsplat = new BugSplat(this.config, this.http);
  }

  handleError(error) {
    console.log('Exception caught by BugSplat!')
    console.log('BugSplat AppName:', this.config.appName);
    console.log('BugSplat AppVersion:', this.config.appVersion);
    console.log('BugSplat Database:', this.config.database);
    this.bugsplat.post(error);
  }
}