export class BugSplatResponseData {

    static readonly successDefault = false;
    static readonly messageDefault = '';
    static readonly crashIdDefault = 0;
    static readonly infoUrlDefault = '';

    static readonly responseCannotBeNull = 'BugSplatResponseData.createFromSuccessResponseObject Error: response cannot be null, undefined, or empty!';
    static readonly errorCannotBeNull = 'BugSplatResponseData.createFromError Error: error cannot be null, undefined, or empty!';

    constructor(
        public readonly success: boolean = false,
        public readonly message: string = '',
        public readonly crashId: number = 0,
        public readonly infoUrl: string = ''
    ) { }

    static createFromSuccessResponseObject(response: SuccessResponse) {
        if (!response) {
            throw new Error(BugSplatResponseData.responseCannotBeNull);
        }

        const success = response.status === 'success' || this.successDefault;
        const crashId = response.crashId || this.crashIdDefault;
        const infoUrl = response.infoUrl || this.infoUrlDefault;

        return new BugSplatResponseData(success, `Crash ${crashId} posted successfully`, crashId, infoUrl);
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
    crashId: number;
    stackKeyId: number;
    messageId: number;
    infoUrl: string;
}
