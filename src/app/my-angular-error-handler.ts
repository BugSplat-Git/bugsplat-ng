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