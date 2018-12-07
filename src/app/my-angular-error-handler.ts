import { ErrorHandler, Injectable, Inject, InjectionToken, Optional } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BugSplatLogger, BugSplat, BugSplatConfiguration } from 'bugsplat-ng';


@Injectable()
export class MyAngularErrorHandler implements ErrorHandler {
    public bugsplat: BugSplat;
    public database: string;
    
    constructor(@Inject(BugSplatConfiguration)public config: BugSplatConfiguration,
        @Inject(HttpClient)private http: HttpClient,
        @Optional()private logger: BugSplatLogger) {
            this.database = this.config.database;
            this.bugsplat = new BugSplat(this.config, this.http, this.logger);
    }
    
    handleError(error) {
        const additionalFile = this.createAdditionalFile();
        this.bugsplat.appKey = "AppKey";
        this.bugsplat.description = "Description";
        this.bugsplat.email = "fred@bedrock.com";
        this.bugsplat.user = "Fred Flintstone";
        this.bugsplat.addAdditionalFile(additionalFile);
        this.bugsplat.post(error);
    }

    createAdditionalFile() {
        const base64data = "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAADAFBMVEUAAACSbQD/AAD/tgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABC44PiAAABAHRSTlP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AU/cHJQAAAIBJREFUeJydk9EOgCAIRQ3+/5utG0OFdEDnwaac6fRS6wMa9IWWFuhDVbhe+AHj5ohAwKKU5/ePsFPygi6KCNwRgQDYsMkiELAp0bp5TZCCCFbLCXoxDXq9aE6Q5yFiRhmjPFtNkKLiwkoJvmVrApitbn+erGBDOmZxFGyT2Xko3B8VxpwwVaA4AAAAAElFTkSuQmCC";
        const contentType = "image/png";
        const fileName = "mario.png";
        const blob = this.base64toBlob(base64data, contentType, 512);
        return new File([blob], fileName);
    }

    base64toBlob(base64Data, contentType, sliceSize) {
        const byteCharacters = atob(base64Data);
        const byteArrays = [];
        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);
            const byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
      return new Blob(byteArrays, {type: contentType});
    }
}