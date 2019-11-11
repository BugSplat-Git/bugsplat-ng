import { Component, ErrorHandler, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MyAngularErrorHandler } from './my-angular-error-handler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title: string = 'my-angular-crasher';
  database: string = '';
  logEntries: Array<string> = [];
  
  crashId$: Observable<number>;
  crashLink$: Observable<Link>;

  constructor(private errorHandler: ErrorHandler) { }

  ngOnInit(): void {
    const myAngularErrorHandler = (<MyAngularErrorHandler>this.errorHandler);
    const bugSplat$ = myAngularErrorHandler.bugsplat.getObservable();

    this.database = myAngularErrorHandler.config.database;
    this.crashId$ = bugSplat$.pipe(map(bugSplatEvent => bugSplatEvent.responseData.crash_id));
    this.crashLink$ = this.crashId$.pipe(map(crashId => {
      return {
        href: `https://app.bugsplat.com/v2/crash?database=${this.database}&id=${crashId}`,
        text: `Crash ${crashId} in database ${this.database}`
      };
    }));
  }

  onButtonClick(): void {
    const error = new Error('Crush your bugs!');
    this.logEntries.push('BugSplat!');
    this.logEntries.push(error.message);
    this.logEntries.push(error.stack);
    throw error;
  }
}

interface Link {
  text: string;
  href: string;
}