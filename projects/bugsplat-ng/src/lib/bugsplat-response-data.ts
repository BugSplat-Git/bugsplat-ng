import { HttpErrorResponse } from "@angular/common/http";

export class BugSplatResponseData {

    static readonly SUCCESS_CANNOT_BE_NULL = "BugSplatResponseData Error: success cannot be null!";
    static readonly CURRENT_SERVER_TIME_CANNOT_BE_NULL = "BugSplatResponseData Error: current_server_time cannot be null!";
    static readonly MESSAGE_CANNOT_BE_NULL = "BugSplatResponseData Error: message cannot be null!";
    static readonly URL_CANNOT_BE_NULL = "BugSplatResponseData Error: url cannot be null!";
    static readonly CRASH_ID_CANNOT_BE_NULL = "BugSplatResponseData Error: url cannot be null!";

    constructor(public success: boolean = false,
        public current_server_time: number = 0,
        public message: string = "",
        public url: string = "",
        public crash_id: number = 0) {
        if (success == null) {
            throw new Error(BugSplatResponseData.SUCCESS_CANNOT_BE_NULL);
        }
        if (current_server_time == null) {
            throw new Error(BugSplatResponseData.CURRENT_SERVER_TIME_CANNOT_BE_NULL);
        }
        if (message == null) {
            throw new Error(BugSplatResponseData.MESSAGE_CANNOT_BE_NULL);
        }
        if (url == null) {
            throw new Error(BugSplatResponseData.URL_CANNOT_BE_NULL);
        }
        if (crash_id == null) {
            throw new Error(BugSplatResponseData.CRASH_ID_CANNOT_BE_NULL);
        }
    }

    static readonly SUCCESS_DEFAULT = false;
    static readonly SERVER_TIME_DEFAULT = 0;
    static readonly MESSAGE_DEFAULT = "";
    static readonly URL_DEFAULT = "";
    static readonly CRASH_ID_DEFAULT = 0;

    static readonly RESPONSE_CANNOT_BE_NULL = "BugSplatResponseData.createFromSuccessResponseObject Error: response cannot be null!";
    static readonly ERROR_CANNOT_BE_NULL = "BugSplatResponseData.createFromHttpErrorResponse Error: error cannot be null!";

    static createFromSuccessResponseObject(response: object) {

        if (!response) {
            throw new Error(BugSplatResponseData.RESPONSE_CANNOT_BE_NULL);
        }

        const responseAny = <any>response;
        let success = this.SUCCESS_DEFAULT;
        let current_server_time = this.SERVER_TIME_DEFAULT;
        let message = this.MESSAGE_DEFAULT;
        let url = this.URL_DEFAULT;
        let crash_id = this.CRASH_ID_DEFAULT;

        if (responseAny.status) {
            success = responseAny.status == "success";
        }
        if (responseAny.current_server_time) {
            current_server_time = responseAny.current_server_time;
        }
        if (responseAny.message) {
            message = responseAny.message;
        }
        if (responseAny.url) {
            url = responseAny.url;
        }
        if (responseAny.crash_id) {
            crash_id = responseAny.crash_id;
        }

        return new BugSplatResponseData(success, current_server_time, message, url, crash_id);
    }

    static createFromHttpErrorResponse(error: HttpErrorResponse) {

        if (!error) {
            throw new Error(BugSplatResponseData.ERROR_CANNOT_BE_NULL);
        }

        return new BugSplatResponseData(false, 0, error.message, error.url, 0);
    }
}