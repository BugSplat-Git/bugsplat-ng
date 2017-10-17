[![BugSplat](https://s3.amazonaws.com/bugsplat-public/npm/header.png)](https://www.bugsplat.com)

![travis-ci](https://travis-ci.org/BugSplat-Git/bugsplat-ng4.svg?branch=master)
## Introduction
BugSplat supports the collection of errors in Angular 4 applications. The bugsplat-ng4 npm package implements Angular’s [ErrorHandler](https://angular.io/api/core/ErrorHandler) interface in order to post errors to BugSplat where they can be tracked and managed. Adding BugSplat to your Angular application is extremely easy. Before getting started please complete the following tasks:

* [Sign up](http://www.bugsplat.com/account-registration/) for BugSplat
* Create a new [database](https://www.bugsplat.com/databases/) for your application
* Check out the [live demo](http://newayz.net/my-angular-4-crasher/) of BugSplat’s Angular 4 error reporting
* Download the [my-angular-4-crasher](https://github.com/bobbyg603/my-angular-4-crasher) application to see an example BugSplat integration

## Simple Configuration
To collect errors and crashes in your Angular 4 application, run the following command in terminal or cmd at the root of your project to install bugsplat-ng4:

```shell
npm install bugsplat-ng4 --save
```

Import BugSplatErrorHandler, BugSplatConfiguration, BugSplatConfigToken, LoggerToken, BugSplatLogger and BugSplatLogLevel into your app module from bugsplat-ng4:

[app.module.ts](https://github.com/BugSplat-Git/my-angular-4-crasher/blob/master/src/app/app.module.ts)
```typescript
import { BugSplatErrorHandler, BugSplatConfiguration, BugSplatConfigToken, LoggerToken, BugSplatLogger, BugSplatLogLevel } from 'bugsplat-ng4';
```

Add a provider for ErrorHandler with the useClass property set to BugSplatErrorHandler:

[app.module.ts](https://github.com/BugSplat-Git/my-angular-4-crasher/blob/master/src/app/app.module.ts)
```typescript
...
@NgModule({
  providers: [
    { provide: ErrorHandler, useClass: BugSplatErrorHandler }
  ],
  ...
})
```

Create a configuration for BugSplat in your app module and add a provider for BugSplatConfigToken with the useValue property set to the value of your configuration:

[app.module.ts](https://github.com/BugSplat-Git/my-angular-4-crasher/blob/master/src/app/app.module.ts)
```typescript
...
const appName = "my-angular-4-crasher";
const appVersion = "1.0.0.0";
const database = "fred";
const BUGSPLAT_CONFIG = new BugSplatConfiguration(appName, appVersion, database);

@NgModule({
  providers: [
    { provide: ErrorHandler, useClass: BugSplatErrorHandler },
    { provide: BugSplatConfigToken, useValue: BUGSPLAT_CONFIG }
  ],
  ...
})
```

Configure logging by creating a new instance of BugSplatLogger and set the log level to one of the BugSplatLogLevel options. You can provide an instance of your own custom logger as the second parameter granted it has error, warn, info and log methods. If no custom logger is provided console will be used:

[app.module.ts](https://github.com/BugSplat-Git/my-angular-4-crasher/blob/master/src/app/app.module.ts)
```typescript
...
@NgModule({
  providers: [
    { provide: ErrorHandler, useClass: BugSplatErrorHandler },
    { provide: BugSplatConfigToken, useValue: BUGSPLAT_CONFIG },
    { provide: LoggerToken, useValue: new BugSplatLogger(BugSplatLogLevel.Log) }
  ],
  ...
})
```

Import the HttpClient module from @angular/common/http and add it to your module’s imports:

[app.module.ts](https://github.com/BugSplat-Git/my-angular-4-crasher/blob/master/src/app/app.module.ts)
```typescript
import { HttpClientModule } from '@angular/common/http';
...
@NgModule({
  imports: [
    ...
    HttpClientModule
  ],
  providers: [
    { provide: ErrorHandler, useClass: BugSplatErrorHandler },
    { provide: BugSplatConfigToken, useValue: BUGSPLAT_CONFIG },
    { provide: LoggerToken, useValue: new BugSplatLogger(BugSplatLogLevel.Log) }
  ],
  ...
})
```

Throw a new error in your application to test the bugsplat-ng4 integration:

[app.component.ts](https://github.com/BugSplat-Git/my-angular-4-crasher/blob/master/src/app/app.component.ts)
```typescript
throw new Error("foobar!");
```

Navigate to the [All Crashes](http://www.bugsplat.com/allcrash/) page in BugSplat and you should see a new crash report for the application you just configured. Click the link in the Id column to see details about your crash on the Individual Crash page:

![AllCrashNg4](https://s3.amazonaws.com/bugsplat-public/npm/allCrashNg4.png)

![IndividualCrashNg4](https://s3.amazonaws.com/bugsplat-public/npm/individualCrashNg4.png)

## Extended Configuration
You can post additional information to BugSplat by creating a wrapper around the BugSplat object. To do so, create a new class that implements Angular’s ErrorHandler interface. In the handlerError method make a call to BugSplat.post passing it the error object:

[my-angular-error-handler.ts](https://github.com/bobbyg603/my-angular-4-crasher/blob/master/src/app/my-angular-error-handler.ts)
```typescript
import { ErrorHandler, Injectable, Inject, InjectionToken } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BugSplat, BugSplatConfigToken, BugSplatConfig, LoggerToken, Logger } from 'bugsplat-ng4';

@Injectable()
export class MyAngularErrorHandler implements ErrorHandler {
    public bugsplat: BugSplat;
    constructor(@Inject(BugSplatConfigToken) public config: BugSplatConfig,
    private http: HttpClient,
    @Inject(LoggerToken) private logger: Logger) {
        this.bugsplat = new BugSplat(this.config, this.http, this.logger);
    }
    handleError(error) {
        // Add additional functionality here
        this.bugsplat.post(error);
    }
}
```

BugSplat provides the following properties and methods that allow you to customize its functionality:

[bugsplat.ts](https://github.com/BugSplat-Git/bugsplat-ng4/blob/master/src/bugsplat.ts)
```typescript
BugSplat.appkey: string; // A unique identifier for your application
BugSplat.user: string; // The name or id of your user
BugSplat.email: string; // The email of your user 
BugSplat.description: string; // Additional info about your crash that gets reset after every post
BugSplat.addAdditionalFile(file); // Add a file to a list of files to be uploaded at post time (total upload limit 2MB)
BugSplat.getObservable(); // Returns an Observable<BugSplatPostEvent>. Subscribing to this method will allow you to hook into the results of BugSplatPost events in your components. Make sure to unsubscribe in ngOnDestroy.
BugSplat.post(error); // Post an arbitrary Error object to BugSplat
```

In your app module, update the useClass property in your ErrorHandler provider to the name of the class you just created:

[app.module.ts](https://github.com/BugSplat-Git/my-angular-4-crasher/blob/master/src/app/app.module.ts)
```typescript
...
@NgModule({
  providers: [
    { provide: ErrorHandler, useClass: MyAngularErrorHandler },
    { provide: BugSplatConfigToken, useValue: BUGSPLAT_CONFIG },
    { provide: LoggerToken, useValue: new BugSplatLogger(BugSplatLogLevel.Log) }
  ]
  ...
})
```

## Contributing
BugSplat loves open source software! If you have suggestions on how we can improve this integration, please reach out to support@bugsplat.com, create an [issue](https://github.com/BugSplat-Git/bugsplat-ng4/issues) in our [GitHub repo](https://github.com/BugSplat-Git/bugsplat-ng4) or send us a [pull request](https://github.com/BugSplat-Git/bugsplat-ng4/pulls). 
