import { HttpErrorResponse } from "@angular/common/http";

export class BugSplatResponseData {
    constructor(public success: boolean = false,
        public current_server_time: number = 0,
        public message: string = "",
        public url: string = "",
        public crash_id: number = 0) { }

    static createFromSuccessResponseObject(response: object) {
        const responseAny = <any>response;
        let success = false;
        let current_server_time = 0;
        let message = "";
        let url = "";
        let crash_id = 0;

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
        return new BugSplatResponseData(false, 0, error.message, "", 0);
    }
}