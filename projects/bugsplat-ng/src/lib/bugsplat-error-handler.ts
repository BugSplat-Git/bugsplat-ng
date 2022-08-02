import { ErrorHandler, Injectable } from '@angular/core';
import { BugSplat } from './bugsplat';

@Injectable()
export class BugSplatErrorHandler implements ErrorHandler {
  constructor(public bugsplat: BugSplat) { }

  async handleError(error: Error): Promise<void> {
    return this.bugsplat.post(error);
  }
}