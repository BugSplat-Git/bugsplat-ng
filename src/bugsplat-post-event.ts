import { BugSplatResponseData } from "./bugsplat-response-data";

export enum BugSplatPostEventType {
    Success,
    Error
}

export class BugSplatPostEvent {

    static readonly TYPE_CANNOT_BE_NULL = "BugSplatPostEvent Error: type cannot be null";
    static readonly RESPONSE_DATA_CANNOT_BE_NULL = "BugSplatPostEvent Error: responseData cannot be null";

    constructor(public type: BugSplatPostEventType, public responseData: BugSplatResponseData) {
        if (this.type == null) {
            throw new Error(BugSplatPostEvent.TYPE_CANNOT_BE_NULL);
        }
        if (!this.responseData) {
            throw new Error(BugSplatPostEvent.RESPONSE_DATA_CANNOT_BE_NULL);
        }
    }
}