[![BugSplat](https://s3.amazonaws.com/bugsplat-public/npm/header.png)](https://www.bugsplat.com)

[![travis-ci](https://travis-ci.org/BugSplat-Git/bugsplat-ng.svg?branch=master)](https://travis-ci.org/Zoolouie/bugsplat-ng)
## Introduction
BugSplat supports the collection of errors in Angular applications. The bugsplat-ng npm package implements Angular’s [ErrorHandler](https://angular.io/api/core/ErrorHandler) interface in order to post errors to BugSplat where they can be tracked and managed. Adding BugSplat to your Angular application is extremely easy. Before getting started please complete the following tasks:

* [Sign up](http://www.bugsplat.com/account-registration/) for BugSplat
* Create a new [database](https://www.bugsplat.com/databases/) for your application
* Check out the [live demo](http://newayz.net/my-angular-crasher/) of BugSplat’s Angular error reporting

## Simple Configuration
To collect errors and crashes in your Angular application, run the following command in terminal or cmd at the root of your project to install bugsplat-ng:

```shell
npm install bugsplat-ng --save
```

Import BugSplatErrorHandler and BugSplatConfiguration into your app module from bugsplat-ng:

[app.module.ts](https://github.com/BugSplat-Git/bugsplat-ng/blob/master/src/app/app.module.ts)
```typescript
import { BugSplatErrorHandler, BugSplatConfiguration } from 'bugsplat-ng';
```

Add a provider for ErrorHandler with the useClass property set to BugSplatErrorHandler:

[app.module.ts](https://github.com/BugSplat-Git/bugsplat-ng/blob/master/src/app/app.module.ts)
```typescript
...
@NgModule({
  providers: [
    { provide: ErrorHandler, useClass: BugSplatErrorHandler }
  ],
  ...
})
```

In your app module, add a provider for BugSplatConfiguration with the useValue property set to an instance of your BugSplat configuration:

[app.module.ts](https://github.com/BugSplat-Git/bugsplat-ng/blob/master/src/app/app.module.ts)
```typescript
...
const appName = "my-angular-crasher";
const appVersion = "1.0.0.0";
const database = "fred";

@NgModule({
  providers: [
    { provide: ErrorHandler, useClass: BugSplatErrorHandler },
    { provide: BugSplatConfiguration, useValue: new BugSplatConfiguration(appName, appVersion, database) }
  ],
  ...
})
```

Import HttpClientModule from @angular/common/http and add it to your module’s imports:

[app.module.ts](https://github.com/BugSplat-Git/bugsplat-ng/blob/master/src/app/app.module.ts)
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
    { provide: BugSplatConfiguration, useValue: new BugSplatConfiguration(appName, appVersion, database) },
  ],
  ...
})
```

Throw a new error in your application to test the bugsplat-ng integration:

[app.component.ts](https://github.com/BugSplat-Git/bugsplat-ng/blob/master/src/app/app.component.ts)
```typescript
throw new Error("foobar!");
```

Navigate to the [All Crashes](http://www.bugsplat.com/allcrash/) page in BugSplat and you should see a new crash report for the application you just configured. Click the link in the Id column to see details about your crash on the Individual Crash page:

![AllCrash](https://s3.amazonaws.com/bugsplat-public/npm/allCrash.png)

![IndividualCrash](https://s3.amazonaws.com/bugsplat-public/npm/individualCrash.png)

## Extended Configuration
You can post additional information to BugSplat by creating a wrapper around the BugSplat object. To do so, create a new class that implements Angular’s ErrorHandler interface. In the handlerError method make a call to BugSplat.post passing it the error object:

[my-angular-error-handler.ts](https://github.com/BugSplat-Git/bugsplat-ng/blob/master/src/app/my-angular-error-handler.ts)
```typescript
import { ErrorHandler, Injectable, Inject, Optional } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BugSplat, BugSplatConfiguration, BugSplatLogger } from 'bugsplat-ng';

@Injectable()
export class MyAngularErrorHandler implements ErrorHandler {
    public bugsplat: BugSplat;
    constructor(@Inject(BugSplatConfiguration)public config: BugSplatConfiguration,
        @Inject(HttpClient)private http: HttpClient,
        @Optional()private logger: BugSplatLogger) {
            this.database = this.config.database;
            this.bugsplat = new BugSplat(this.config, this.http, this.logger);
    }
    handleError(error) {
        // Add additional functionality here
        this.bugsplat.post(error);
    }
}
```

BugSplat provides the following properties and methods that allow you to customize its functionality:

[bugsplat.ts](https://github.com/BugSplat-Git/bugsplat-ng/blob/master/projects/bugsplat-ng/src/lib/bugsplat.ts)
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

[app.module.ts](https://github.com/BugSplat-Git/bugsplat-ng/blob/master/src/app/app.module.ts)
```typescript
...
@NgModule({
  providers: [
    { provide: ErrorHandler, useClass: MyAngularErrorHandler },
    { provide: BugSplatConfiguration, useValue: new BugSplatConfiguration(appName, appVersion, database) },
  ]
  ...
})
```

You can also configure BugSplat's logging preferences. Start by adding BugSplatLogger and BugSplatLogLevel to the existing list of imports for bugsplat-ng. Create a provider for BugSplatLogger with useValue set to a new instance of BugSplatLogger. Pass one of the BugSplatLogLevel options as the first parameter to BugSplatLogger. You can provide an instance of your own custom logger as the second parameter granted it has error, warn, info and log methods. If no custom logger is provided console will be used. The BugSplatLogger dependency is marked as optional so if you are not interested in log statements emitted by BugSplat you may omit this provider:

[app.module.ts](https://github.com/BugSplat-Git/bugsplat-ng/blob/master/src/app/app.module.ts)
```typescript
import { ..., BugSplatLogger, BugSplatLogLevel } from 'bugsplat-ng';
...
@NgModule({
  providers: [
    { provide: ErrorHandler, useClass: BugSplatErrorHandler },
    { provide: BugSplatConfiguration, useValue: new BugSplatConfiguration(appName, appVersion, database) },
    { provide: BugSplatLogger, useValue: new BugSplatLogger(BugSplatLogLevel.Log) }
  ],
  ...
})
```

## my-angular-crasher

The my-angular-crasher sample demonstrates how to use BugSplat's npm package to track errors in your Angular application. Follow these steps to get started:

1. Clone this repository or download the zip from the releases tab
2. Open terminal or command prompt in this project's root directory
3. run 'npm install'
4. run 'ng build bugsplat-ng' then 'ng serve'
5. Navigate to https://localhost:4200
6. Click the 'Crash!' button, then follow the link that appears to view the crash on the BugSplat website
7. When prompted to log in, use the username "Fred" and password "Flintstone"

## Contributing
BugSplat loves open source software! If you have suggestions on how we can improve this integration, please reach out to support@bugsplat.com, create an [issue](https://github.com/BugSplat-Git/bugsplat-ng/issues) in our [GitHub repo](https://github.com/BugSplat-Git/bugsplat-ng) or send us a [pull request](https://github.com/BugSplat-Git/bugsplat-ng/pulls). 

With :heart:,

The BugSplat Team
