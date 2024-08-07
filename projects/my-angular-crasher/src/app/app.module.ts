import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BugSplatLogger, BugSplatLogLevel, BugSplatModule } from 'bugsplat-ng';
import { environment } from 'projects/my-angular-crasher/src/environments/environment';
import { AppComponent } from './app.component';
import { MyAngularErrorHandler } from './my-angular-error-handler';

//Uncomment this to use the simple error handler
// @NgModule({
//   declarations: [
//     AppComponent
//   ],
//   imports: [
//     BrowserModule,
//     HttpClientModule,
//     BugSplatModule.initializeApp(environment.bugsplat)
//   ],
//   bootstrap: [AppComponent]
// })
// Comment this to use the simple error handler

@NgModule({ declarations: [
        AppComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        BugSplatModule.initializeApp(environment.bugsplat)], providers: [
        {
            provide: ErrorHandler,
            useClass: MyAngularErrorHandler
        },
        {
            provide: BugSplatLogger,
            useValue: new BugSplatLogger(BugSplatLogLevel.info, console)
        },
        provideHttpClient(withInterceptorsFromDi())
    ] })

export class AppModule { }
