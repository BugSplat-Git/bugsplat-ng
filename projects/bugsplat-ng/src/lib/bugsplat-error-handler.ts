import { ErrorHandler, Injectable } from '@angular/core';
import { BugSplat } from "./bugsplat";

@Injectable()
export class BugSplatErrorHandler implements ErrorHandler {
  static readonly ERROR_CANNOT_BE_NULL = "BugSplatErrorHandler Error: handleError was passed a null error!";

  constructor(public bugsplat: BugSplat) { }

  async handleError(error: Error): Promise<void> {
    return this.bugsplat.post(error);
  }
}