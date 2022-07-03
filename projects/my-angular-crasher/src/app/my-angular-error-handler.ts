import { ErrorHandler, Injectable } from '@angular/core';
import { BugSplat } from 'bugsplat-ng';

@Injectable()
export class MyAngularErrorHandler implements ErrorHandler {
  constructor(public bugsplat: BugSplat) {
    this.bugsplat.user = 'Fred';
    this.bugsplat.email = 'fred@bugsplat.com';
    this.bugsplat.key = 'Key!';
  }

  async handleError(error: Error): Promise<void> {
    return this.bugsplat.post(error, { description: 'Something went wrong!' });
  }
}
