import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { enableProdMode, ErrorHandler, importProvidersFrom, provideZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { BugSplatLogger, BugSplatLogLevel, BugSplatModule } from 'bugsplat-ng';
import { AppComponent } from './app/app.component';
import { MyAngularErrorHandler } from './app/my-angular-error-handler';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
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
