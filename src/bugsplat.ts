import { BugSplatConfig } from "./bugsplat-config";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs/Subject";
import { BugSplatPostEvent, BugSplatPostEventType } from "./bugsplat-post-event";

export class BugSplat {
  public appKey: string = "";
  public user: string = "";
  public email: string = "";
  public description: string = "";

  public bugSplatPostEventSubject = new Subject<BugSplatPostEvent>();

  private files: File[] = [];

  constructor(private config: BugSplatConfig, private http: HttpClient) { }

  getObsevable() {
    return this.bugSplatPostEventSubject.asObservable();
  }

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
    this.http.post(url, body).subscribe(data => {
      console.log("BugSplat POST Success:", data);
      const event = new BugSplatPostEvent(BugSplatPostEventType.Success, data);
      this.bugSplatPostEventSubject.next(event);
    }, err => {
      console.log("BugSplat POST Error:", err);
      const event = new BugSplatPostEvent(BugSplatPostEventType.Error, err);
      this.bugSplatPostEventSubject.next(event);
    });
  }

  addAddtionalFile(file: File) {
    const currentUploadSize = this.files.reduce((previous, current) => { return previous + current.size; }, 0);
    const newUploadSize = currentUploadSize + file.size;
    if (newUploadSize >= 2 * 1024 * 1024) {
      console.error("BugSplat Error: Could not add file " + file.name + ". Upload bundle size limit exceeded!");
    } else {
      this.files.push(file);
    }
  }
}
