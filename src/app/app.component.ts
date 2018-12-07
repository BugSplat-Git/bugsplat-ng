import { Component, ErrorHandler, OnInit, OnDestroy } from '@angular/core';
import { MyAngularErrorHandler } from "./my-angular-error-handler";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  title = "my-angular-crasher";

  crashId = "";
  database = "";
  link = "https://www.bugsplat.com";
  linkText = "";
  logs = "";

  bugSplatEventSubscription: Subscription;

  constructor(private errorHandler: ErrorHandler) { }

  ngOnInit() {
    const myAngularErrorHandler = (<MyAngularErrorHandler>this.errorHandler);
    this.bugSplatEventSubscription = myAngularErrorHandler.bugsplat.getObservable()
      .subscribe((event) => {
        this.database = myAngularErrorHandler.config.database;
        this.crashId = "" + event.responseData.crash_id;
        this.link = "https://app.bugsplat.com/individualCrash?database=" + this.database + "&id=" + this.crashId;
        this.linkText = "Crash " + this.crashId + " in database " + this.database;
      });
  }

  ngOnDestroy(): void {
    if (this.bugSplatEventSubscription) {
      this.bugSplatEventSubscription.unsubscribe();
    }
  }

  myEvent(event) {
    const error = new Error("foobar!");
    this.logs += "BugSplat!" + "<br/>" + error.message + "<br/>" + error.stack + "<br/><br/>";
    throw error;
  }
}