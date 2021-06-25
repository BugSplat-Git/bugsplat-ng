import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BugSplatModule } from 'bugsplat-ng';
import { BugSplatLogger, BugSplatLogLevel } from 'projects/bugsplat-ng/src/public_api';
import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';
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
//     { provide: BugSplat, useValue: bugsplat }
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
    HttpClientModule,
    BugSplatModule.initializeApp(environment.bugsplat)
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: MyAngularErrorHandler
    },
    {
      provide: BugSplatLogger,
      useValue: new BugSplatLogger(
        BugSplatLogLevel.Info,
        console
      )
    }
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
