import { ErrorHandler, Injectable, Inject, InjectionToken, NgZone } from '@angular/core';
import { HttpClient } from "@angular/common/http";

export let BugSplatConfigToken = new InjectionToken<BugSplatConfig>('bugsplat.config');
export interface BugSplatConfig {
  appName: string;
  appVersion: string;
  database: string;
}

@Injectable()
export class BugSplatErrorHandler implements ErrorHandler {
  constructor(@Inject(BugSplatConfigToken) private config: BugSplatConfig, private http: HttpClient, private zone: NgZone) { }
  handleError(error) {
    console.log('Exception caught by BugSplat!')
    console.log('BugSplat AppName:', this.config.appName);
    console.log('BugSplat AppVersion:', this.config.appVersion);
    console.log('BugSplat Database:', this.config.database);
    const bugsplat = new BugSplat(this.config, this.http);
    bugsplat.post(error);
  }
}

export class BugSplat {
  public appKey: string = "";
  public user: string = "";
  public email: string = "";
  public description: string = "";
  private callback: Function = null;
  private callbackContext: Object = null;
  private files: File[] = [];
  
  constructor(private config: BugSplatConfig,
    private http: HttpClient
  ) { }

  post(error) {
    const url = "https://" + this.config.database + ".bugsplat.com/post/js/";
    const callstack = error.stack == null ? error : error.stack;
    const body = new FormData();
    body.append("appName", this.config.appName);
    body.append("appVersion", this.config.appVersion);
    body.append("database", this.config.database);
    body.append("callstack", callstack);
    body.append("appKey", this.appKey);
    body.append("user", this.user);
    body.append("email", this.email);
    body.append("description", this.description);
    this.files.forEach(file => {
      body.append(file.name, file, file.name);
    });
    this.http.post(url, body).subscribe(
      data => {
        console.log("BugSplat POST Success:", data);
        if(this.callback !== null) {
          this.callback(null, data, this.callbackContext);
        }
      },
      err => {
        console.log("BugSplat POST Error:", err);
        if(this.callback !== null) {
          this.callback(err, null, this.callbackContext);
        }
      }
    );
  }

  addAddtionalFile(file: File) {
    const currentUploadSize = this.files.reduce((previous, current) => { return previous + current.size; }, 0);
    const newUploadSize = currentUploadSize + file.size;
    if(newUploadSize >= 2 * 1024 * 1024) {
      console.error("BugSplat Error: Could not add file " + file.name + ". Upload bundle size limit exceeded!");
    } else {
      this.files.push(file);
    }
  }

  // TODO type check context?
  setCallback(callback: Function, context?: Object) {
    this.callback = callback;
    this.callbackContext = context;
  }
}