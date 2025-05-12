import { enableProdMode, importProvidersFrom, ErrorHandler } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { BugSplatLogger, BugSplatLogLevel, BugSplatModule } from 'bugsplat-ng';
import { MyAngularErrorHandler } from './app/my-angular-error-handler';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BugSplatModule.initializeApp(environment.bugsplat)
    ),
    {
      provide: ErrorHandler,
      useClass: MyAngularErrorHandler
    },
    {
      provide: BugSplatLogger,
      useValue: new BugSplatLogger(BugSplatLogLevel.info, console)
    },
    provideHttpClient(withInterceptorsFromDi())
  ]
})
.catch(err => console.log(err));
