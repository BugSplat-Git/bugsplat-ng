import { BugSplatResponseData } from './bugsplat-response-data';

export enum BugSplatPostEventType {
    success,
    error
}

export class BugSplatPostEvent {

    static readonly typeCannotBeNull = 'BugSplatPostEvent Error: type cannot be null, undefined, or empty';
    static readonly responseDataCannotBeNull = 'BugSplatPostEvent Error: responseData cannot be null, undefined, or empty';

    constructor(public type: BugSplatPostEventType, public responseData: BugSplatResponseData) {
        if (this.type === null || this.type === undefined) {
            throw new Error(BugSplatPostEvent.typeCannotBeNull);
        }
        if (!this.responseData) {
            throw new Error(BugSplatPostEvent.responseDataCannotBeNull);
        }
    }
}
