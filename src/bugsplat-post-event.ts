import { BugSplatResponseData } from "./bugsplat-response-data";

export enum BugSplatPostEventType {
    Success,
    Error
}

export class BugSplatPostEvent {
    constructor(public type: BugSplatPostEventType, public responseData: BugSplatResponseData) { }
}