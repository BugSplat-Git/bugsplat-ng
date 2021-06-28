[![BugSplat](https://s3.amazonaws.com/bugsplat-public/npm/header.png)](https://www.bugsplat.com)

[![travis-ci](https://travis-ci.org/BugSplat-Git/bugsplat-ng.svg?branch=master)](https://travis-ci.org/BugSplat-Git/bugsplat-ng)

## Introduction
BugSplat supports the collection of errors in Angular applications. The bugsplat-ng npm package implements Angular’s [ErrorHandler](https://angular.io/api/core/ErrorHandler) interface in order to post errors to BugSplat where they can be tracked and managed. Adding BugSplat to your Angular application is extremely easy. Before getting started please complete the following tasks:

* [Sign up](http://www.bugsplat.com/v2/sign-up) for BugSplat
* Create a new [database](https://app.bugsplat.com/v2/options?tab=database) for your application
* Check out the [live demo](https://www.bugsplat.com/samples/my-angular-crasher) of BugSplat’s Angular error reporting

## Sample
This repository includes a sample my-angular-crasher application that has be pre-configured with BugSplat. To test the sample, perform the following steps:

1. `git clone https://github.com/BugSplat-Git/bugsplat-ng`
2. `cd bugsplat-ng && npm i`
3. `ng serve`

Click the button labeled Crash to generate a crash report. A link to the crash report should display below the button. Click the link to the crash report and when prompted to log in use the email 'fred@bugsplat.com' and password 'Flintstone'.

## Integration
To collect errors and crashes in your Angular application, run the following command in terminal or cmd at the root of your project to install bugsplat-ng:

```shell
npm i bugsplat-ng --save
```

Add values for your BugSplat database, application and version to your application's environment files:

[environment.prod.ts](https://github.com/BugSplat-Git/bugsplat-ng/blob/8c12d9b3544f2b618491467e6c40d84b6139eb2a/src/environments/environment.prod.ts#L1)
```typescript
export const environment = {
  production: true,
  bugsplat: {
    database: 'fred',
    application: 'my-angular-crasher',
    version: '1.0.0'
  }
};
```

Add an import for BugSplatModule to your AppModule:

[app.module.ts](hhttps://github.com/BugSplat-Git/bugsplat-ng/blob/8c12d9b3544f2b618491467e6c40d84b6139eb2a/src/app/app.module.ts#L4)
```typescript
import { BugSplatModule } from 'bugsplat-ng';
```

Add a call BugSplatModule.initializeApp in your AppModule's imports array passing it your database, application and version:

[app.module.ts](https://github.com/BugSplat-Git/bugsplat-ng/blob/8c12d9b3544f2b618491467e6c40d84b6139eb2a/src/app/app.module.ts#L31)
```typescript
...
@NgModule({
  imports: [
    BugSplatModule.initializeApp(environment.bugsplat)
  ],
  ...
})
```

Throw a new error in your application to test the bugsplat-ng integration:

[app.component.ts](https://github.com/BugSplat-Git/bugsplat-ng/blob/8c12d9b3544f2b618491467e6c40d84b6139eb2a/src/app/app.component.ts#L37)
```typescript
throw new Error("foobar!");
```

Navigate to the [Crashes](https://app.bugsplat.com/v2/crashes) page in BugSplat and you should see a new crash report for the application you just configured. Click the link in the ID column to see details about your crash on the Crash page:

![Crashes Page](https://s3.amazonaws.com/bugsplat-public/npm/bugsplat-ng/crashes-page.png)

![Crash Page](https://s3.amazonaws.com/bugsplat-public/npm/bugsplat-ng/crash-page.png)

## Extended Integration
You can post additional information by creating a service that implements ErrorHandler. In the handlerError method make a call to BugSplat.post passing it the error and an optional options object:

[my-angular-error-handler.ts](https://github.com/BugSplat-Git/bugsplat-ng/blob/master/src/app/my-angular-error-handler.ts)
```typescript
import { ErrorHandler, Injectable } from '@angular/core';
import { BugSplat } from 'bugsplat-ng';

@Injectable()
export class MyAngularErrorHandler implements ErrorHandler {

    constructor(public bugsplat: BugSplat) { }
    
    async handleError(error: Error): Promise<void> {
        return this.bugsplat.post(error, {
            description: 'New description from MyAngularErrorHandler.ts'
        });
    }
}
```

BugSplat provides the following properties and methods that allow you to customize its functionality:

[bugsplat.ts](https://github.com/BugSplat-Git/bugsplat-ng/blob/master/projects/bugsplat-ng/src/lib/bugsplat.ts)
```typescript
BugSplat.description: string; // Additional info about your crash that gets reset after every post
BugSplat.email: string; // The email of your user 
BugSplat.key: string; // A unique identifier for your application
BugSplat.user: string; // The name or id of your user
BugSplat.files: Array<file>; // A list of files to be uploaded at post time
BugSplat.getObservable(): Observable<BugSplatPostEvent>; // Observable that emits results of BugSplat crash post events in your components.
async BugSplat.post(error): Promise<void>; // Post an Error object to BugSplat manually from within a try/catch
```

In your AppModule's NgModule definition, add a provider for your new ErrorHandler:

[app.module.ts](https://github.com/BugSplat-Git/bugsplat-ng/blob/master/src/app/app.module.ts)
```typescript
import { ErrorHandler, NgModule } from '@angular/core';

@NgModule({
  providers: [
    {
      provide: ErrorHandler,
      useClass: MyAngularErrorHandler
    }
  ]
  ...
})
```

You can also configure BugSplat's logging preferences and provide your own logging implementation. Create a provider for BugSplatLogger with useValue set to a new instance of BugSplatLogger. Pass one of the BugSplatLogLevel options as the first parameter to BugSplatLogger. You can provide an instance of your own custom logger as the second parameter granted it has error, warn, info and log methods. If no custom logger is provided console will be used:

[app.module.ts](https://github.com/BugSplat-Git/bugsplat-ng/blob/master/src/app/app.module.ts)
```typescript
import { ErrorHandler, NgModule } from '@angular/core';
import { BugSplatLogger, BugSplatLogLevel, BugSplatModule } from 'bugsplat-ng';

@NgModule({
  providers: [
    {
      provide: ErrorHandler,
      useClass: BugSplatErrorHandler
    },
    {
      provide: BugSplatLogger,
      useValue: new BugSplatLogger(BugSplatLogLevel.Log)
    }
  ],
  ...
})
```

## Contributing
BugSplat loves open source software! If you have suggestions on how we can improve this integration, please reach out to support@bugsplat.com, create an [issue](https://github.com/BugSplat-Git/bugsplat-ng/issues) in our [GitHub repo](https://github.com/BugSplat-Git/bugsplat-ng) or send us a [pull request](https://github.com/BugSplat-Git/bugsplat-ng/pulls). 

With :heart:,

The BugSplat Team
