export enum BugSplatPostEventType {
    Success,
    Error
}

export class BugSplatPostEvent {
    // TODO BG type for data
    constructor(public type: BugSplatPostEventType, public data: Object) { }
}