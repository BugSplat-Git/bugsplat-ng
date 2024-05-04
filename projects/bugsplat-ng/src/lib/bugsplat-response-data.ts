export class BugSplatResponseData {

    static readonly successDefault = false;
    static readonly serverTimeDefault = 0;
    static readonly messageDefault = '';
    static readonly urlDefault = '';
    static readonly crashIdDefault = 0;

    static readonly responseCannotBeNull = 'BugSplatResponseData.createFromSuccessResponseObject Error: response cannot be null, undefined, or empty!';
    static readonly errorCannotBeNull = 'BugSplatResponseData.createFromError Error: error cannot be null, undefined, or empty!';

    constructor(
        public readonly success: boolean = false,
        public readonly message: string = '',
        public readonly currentServerTime: number = 0,
        public readonly url: string = '',
        public readonly crashId: number = 0
    ) { }

    static createFromSuccessResponseObject(response: SuccessResponse) {
        if (!response) {
            throw new Error(BugSplatResponseData.responseCannotBeNull);
        }

        const success = response.status === 'success' || this.successDefault;
        const currentServerTime = response.current_server_time ?? this.serverTimeDefault;
        const message = response.message ?? this.messageDefault;
        const url = response.url ?? this.urlDefault;
        const crashId = response.crash_id ?? this.crashIdDefault;

        return new BugSplatResponseData(success, message, currentServerTime, url, crashId);
    }

    static createFromError(error: Error) {
        if (!error) {
            throw new Error(BugSplatResponseData.errorCannotBeNull);
        }

        return new BugSplatResponseData(false, error.message);
    }
}

export type SuccessResponse = {
    status: string;
    current_server_time: number;
    message: string;
    url: string;
    crash_id: number;
}
