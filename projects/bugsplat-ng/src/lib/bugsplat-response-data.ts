import { HttpErrorResponse } from "@angular/common/http";

export class BugSplatResponseData {

    constructor(
        public readonly success: boolean = false,
        public readonly message: string = "",
        public readonly current_server_time: number = 0,
        public readonly url: string = "",
        public readonly crash_id: number = 0
    ) { }

    static readonly SUCCESS_DEFAULT = false;
    static readonly SERVER_TIME_DEFAULT = 0;
    static readonly MESSAGE_DEFAULT = "";
    static readonly URL_DEFAULT = "";
    static readonly CRASH_ID_DEFAULT = 0;

    static readonly RESPONSE_CANNOT_BE_NULL = "BugSplatResponseData.createFromSuccessResponseObject Error: response cannot be null, undefined, or empty!";
    static readonly ERROR_CANNOT_BE_NULL = "BugSplatResponseData.createFromError Error: error cannot be null, undefined, or empty!";

    // TODO BG better type
    static createFromSuccessResponseObject(response: object) {
        if (!response) {
            throw new Error(BugSplatResponseData.RESPONSE_CANNOT_BE_NULL);
        }

        const responseAny = <any>response;
        const success = responseAny.status === "success" ?? this.SUCCESS_DEFAULT;
        const current_server_time = responseAny.current_server_time ?? this.SERVER_TIME_DEFAULT;
        const message = responseAny.message ?? this.MESSAGE_DEFAULT;
        const url = responseAny.url ?? this.URL_DEFAULT;
        const crash_id = responseAny.crash_id ?? this.CRASH_ID_DEFAULT;

        return new BugSplatResponseData(success, message, current_server_time, url, crash_id);
    }

    static createFromError(error: Error) {
        if (!error) {
            throw new Error(BugSplatResponseData.ERROR_CANNOT_BE_NULL);
        }

        return new BugSplatResponseData(false, error.message);
    }
}

function nullUndefinedOrEmpty(value: unknown): boolean {
    return value === null || value === undefined || value === '';
}