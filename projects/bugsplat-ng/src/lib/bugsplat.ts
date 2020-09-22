import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { BugSplatConfiguration } from "./bugsplat-config";
import { BugSplatLogger } from "./bugsplat-logger";
import { BugSplatPostEvent, BugSplatPostEventType } from "./bugsplat-post-event";
import { BugSplatResponseData } from "./bugsplat-response-data";
import { Injectable } from "@angular/core";

@Injectable()
export class BugSplat {
  public appKey: string = "";
  public user: string = "";
  public email: string = "";
  public description: string = "";

  public bugSplatPostEventSubject = new Subject<BugSplatPostEvent>();

  private files: File[] = [];

  constructor(private config: BugSplatConfiguration,
    private http: HttpClient,
    public logger: BugSplatLogger = new BugSplatLogger()) {
    if (!this.logger) {
      this.logger = new BugSplatLogger();
    }
  }

  getObservable(): Observable<BugSplatPostEvent> {
    return this.bugSplatPostEventSubject.asObservable();
  }

  async post(error: Error): Promise<void> {
    const url = "https://" + this.config.database + ".bugsplat.com/post/js/";
    const callstack = error.stack == null ? error.toString() : error.stack;
    const body = new FormData();
    body.append("appName", this.config.appName);
    body.append("appVersion", this.config.appVersion);
    body.append("database", this.config.database);
    body.append("callstack", callstack);
    body.append("appKey", this.appKey);
    body.append("user", this.user);
    body.append("email", this.email);
    body.append("description", this.description);
    this.files.forEach(file => body.append(file.name, file, file.name));
    this.logPostInfo(url, callstack);
    this.logError(error);

    try {
      const response = await this.http.post(url, body).toPromise();
      const responseData = BugSplatResponseData.createFromSuccessResponseObject(response);
      const event = new BugSplatPostEvent(BugSplatPostEventType.Success, responseData);
      this.logger.info("BugSplat POST Success: " + JSON.stringify(response));
      this.bugSplatPostEventSubject.next(event);
    } catch(error) {
      const httpErrorResponse = <HttpErrorResponse>error;
      const responseData = BugSplatResponseData.createFromHttpErrorResponse(httpErrorResponse);
      const event = new BugSplatPostEvent(BugSplatPostEventType.Error, responseData);
      this.logger.error("BugSplat POST Error: " + JSON.stringify(error));
      this.bugSplatPostEventSubject.next(event);
    }
  }

  addAdditionalFile(file: File): void {
    const currentUploadSize = this.files.reduce((previous, current) => { return previous + current.size; }, 0);
    const newUploadSize = currentUploadSize + file.size;
    if (newUploadSize >= 2 * 1024 * 1024) {
      this.logger.warn("BugSplat Error: Could not add file " + file.name + ". Upload bundle size limit exceeded!");
    } else {
      this.files.push(file);
      this.logger.info("BugSplat file added successfully");
    }
  }

  private logPostInfo(url: string, callstack: string): void {
    this.logger.info("BugSplat POST url: " + url);
    this.logger.info("BugSplat POST callstack: " + JSON.stringify(callstack));
    this.logger.info("BugSplat POST appName: " + this.config.appName);
    this.logger.info("BugSplat POST appVersion: " + this.config.appVersion);
    this.logger.info("BugSplat POST database: " + this.config.database);
    this.logger.info("BugSplat POST appKey: " + this.appKey);
    this.logger.info("BugSplat POST user: " + this.user);
    this.logger.info("BugSplat POST email: " + this.email);
    this.logger.info("BugSplat POST description: " + this.description);
    for (let i = 0; i < this.files.length; i++) {
      this.logger.info("BugSplat POST file[" + i + "]: " + this.files[i].name);
    }
  }

  private logError(error: Error): void {
    this.logger.error(error);
  }
}