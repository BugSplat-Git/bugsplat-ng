[![BugSplat](https://s3.amazonaws.com/bugsplat-public/npm/header.png)](https://www.bugsplat.com)

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

Import BugSplat, BugSplatErrorHandler, BugSplatConfig and BugSplatConfigToken into your app module from bugsplat-ng4:

[app.module.ts](https://github.com/BugSplat-Git/my-angular-4-crasher/blob/master/src/app/app.module.ts)
```typescript
import { BugSplatConfig, BugSplatConfigToken, BugSplatErrorHandler } from 'bugsplat-ng4';
```

Create a configuration for BugSplat in your app module and add a provider for BugSplatConfigToken with the useValue property set to the value of your configuration:

[app.module.ts](https://github.com/BugSplat-Git/my-angular-4-crasher/blob/master/src/app/app.module.ts)
```typescript
...
const BUGSPLAT_CONFIG: BugSplatConfig = {
  appName: "my-angular-4-crasher",
  appVersion: "1.0.0.0",
  database: "fred"
};

@NgModule({
  providers: [
    { provide: BugSplatConfigToken, useValue: BUGSPLAT_CONFIG },
  ],
  ...
})
```

Add a provider for ErrorHandler with the useClass property set to BugSplatErrorHandler:

[app.module.ts](https://github.com/BugSplat-Git/my-angular-4-crasher/blob/master/src/app/app.module.ts)
```typescript
...
@NgModule({
  providers: [
    { provide: BugSplatConfigToken, useValue: BUGSPLAT_CONFIG },
    { provide: ErrorHandler, useClass: BugSplatErrorHandler }
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
    { provide: BugSplatConfigToken, useValue: BUGSPLAT_CONFIG },
    { provide: ErrorHandler, useClass: BugSplatErrorHandler }
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

## Extended Configurtion
You can post additional information to BugSplat by creating a wrapper around the BugSplat object. To do so, create a new class that implements Angular’s ErrorHandler interface. In the handlerError method make a call to BugSplat.post passing it the error object:

[my-angular-error-handler.ts](https://github.com/bobbyg603/my-angular-4-crasher/blob/master/src/app/my-angular-error-handler.ts)
```typescript
import { ErrorHandler, Injectable, Inject, InjectionToken } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BugSplat, BugSplatConfigToken, BugSplatConfig } from 'bugsplat-ng4';

@Injectable()
export class MyAngularErrorHandler implements ErrorHandler {
    public bugsplat: BugSplat;
    constructor(@Inject(BugSplatConfigToken) public config: BugSplatConfig, private http: HttpClient) {
        this.bugsplat = new BugSplat(this.config, this.http);
    }
    handleError(error) {
        // Add additional functionality here
        this.bugsplat.post(error);
    }
}
```

BugSplat provides the following properties and methods that allow you to customize its functionality:

[bugsplat-error-handler.ts](https://github.com/BugSplat-Git/bugsplat-ng4/blob/master/src/bugsplat-error-handler.ts)
```typescript
BugSplat.appkey: string; // A unique identifier for your application
BugSplat.user: string; // The name or id of your user
BugSplat.email: string; // The email of your user 
BugSplat.description: string; // Additional info about your crash that gets reset after every post
BugSplat.addAdditionalFile(file); // File object to be added at post time (limit 2MB) 
BugSplat.setCallback(callback, context); // Function that accepts 3 parameters (err, responseBody, context) that runs after post. Context will be passed through to your callback so that you can retrieve properties or invoke functions that originated in a different scope
BugSplat.post(error); // Post an arbitrary Error object to BugSplat
```

In your app module, update the useClass property in your ErrorHandler provider to the name of the class you just created:

[app.module.ts](https://github.com/BugSplat-Git/my-angular-4-crasher/blob/master/src/app/app.module.ts)
```typescript
...
@NgModule({
  providers: [
    { provide: BugSplatConfigToken, useValue: BUGSPLAT_CONFIG },
    { provide: ErrorHandler, useClass: MyAngularErrorHandler }
  ]
  ...
})
```

## Contributing
BugSplat loves open source software! If you have suggestions on how we can improve this integration, please reach out to support@bugsplat.com, create an [issue](https://github.com/BugSplat-Git/bugsplat-ng4/issues) in our [GitHub repo](https://github.com/BugSplat-Git/bugsplat-ng4) or send us a [pull request](https://github.com/BugSplat-Git/bugsplat-ng4/pulls). 