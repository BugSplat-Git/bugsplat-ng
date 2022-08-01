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

    // TODO BG better type
    static createFromSuccessResponseObject(response: object) {
        if (!response) {
            throw new Error(BugSplatResponseData.responseCannotBeNull);
        }

        const responseAny = response as any;
        const success = responseAny.status === 'success' ?? this.successDefault;
        const currentServerTime = responseAny.current_server_time ?? this.serverTimeDefault;
        const message = responseAny.message ?? this.messageDefault;
        const url = responseAny.url ?? this.urlDefault;
        const crashId = responseAny.crash_id ?? this.crashIdDefault;

        return new BugSplatResponseData(success, message, currentServerTime, url, crashId);
    }

    static createFromError(error: Error) {
        if (!error) {
            throw new Error(BugSplatResponseData.errorCannotBeNull);
        }

        return new BugSplatResponseData(false, error.message);
    }
}
