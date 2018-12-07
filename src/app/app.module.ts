import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BugSplatErrorHandler, BugSplatConfiguration, BugSplatLogger, BugSplatLogLevel } from 'bugsplat-ng';
import { MyAngularErrorHandler } from './my-angular-error-handler';

//Uncomment this to use the simple error handler
// @NgModule({
//   declarations: [
//     AppComponent
//   ],
//   imports: [
//     BrowserModule,
//     HttpClientModule
//   ],
//   providers: [
//     { provide: ErrorHandler, useClass: BugSplatErrorHandler },
//     { provide: BugSplatConfiguration, useValue: new BugSplatConfiguration("my-angular-crasher", "1.0.0.0", "fred") }
//   ],
//   bootstrap: [AppComponent]
// })
// Comment this to use the simple error handler

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    { provide: ErrorHandler, useClass: MyAngularErrorHandler },
    { provide: BugSplatConfiguration, useValue: new BugSplatConfiguration("my-angular-crasher", "1.0.0.0", "fred") },
    { provide: BugSplatLogger, useValue: new BugSplatLogger(BugSplatLogLevel.Log) }
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
