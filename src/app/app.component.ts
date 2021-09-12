import { Component, ErrorHandler, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MyAngularErrorHandler } from './my-angular-error-handler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title: string = 'my-angular-crasher';
  logEntries: Array<string> = [];
  link$: Observable<Link>;

  readonly links = {
    home: {
      href: 'https://bugsplat.com/',
      text: 'BugSplat',
    },
    angular: {
      href: 'https://docs.bugsplat.com/introduction/getting-started/integrations/web/angular',
      text: 'Angular',
    },
    typescript: {
      href: 'https://docs.bugsplat.com/introduction/getting-started/integrations/web/angular#source-maps',
      text: 'TypeScript',
    },
  };

  constructor(private errorHandler: ErrorHandler) {}

  ngOnInit(): void {
    const myAngularErrorHandler = (<MyAngularErrorHandler>this.errorHandler);
    const file = this.createAdditionalFile();
    myAngularErrorHandler.bugsplat.files.push(file);
    this.link$ = myAngularErrorHandler.bugsplat.getObservable()
      .pipe(
        map(bugSplatEvent => {
          const database = myAngularErrorHandler.bugsplat.database;
          const crashId = bugSplatEvent.responseData.crash_id;
          return {
            href: `https://app.bugsplat.com/v2/crash?database=${database}&id=${crashId}`,
            text: `Crash ${crashId} in database ${database}`
          };
        })
      );
  }

  onButtonClick(): void {
    const error = new Error('Crush your bugs!');
    this.logEntries.push('BugSplat!');
    this.logEntries.push(error.message);
    this.logEntries.push(error.stack);
    throw error;
  }

  private createAdditionalFile(): File {
    const base64data = 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAADAFBMVEUAAACSbQD/AAD/tgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABC44PiAAABAHRSTlP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AU/cHJQAAAIBJREFUeJydk9EOgCAIRQ3+/5utG0OFdEDnwaac6fRS6wMa9IWWFuhDVbhe+AHj5ohAwKKU5/ePsFPygi6KCNwRgQDYsMkiELAp0bp5TZCCCFbLCXoxDXq9aE6Q5yFiRhmjPFtNkKLiwkoJvmVrApitbn+erGBDOmZxFGyT2Xko3B8VxpwwVaA4AAAAAElFTkSuQmCC';
    const contentType = 'image/png';
    const fileName = 'mario.png';
    const blob = this.base64toBlob(base64data, contentType, 512);
    return new File([blob], fileName);
  }

  private base64toBlob(base64Data: string, contentType: string, sliceSize: number): Blob {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);

      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      byteArrays.push(new Uint8Array(byteNumbers));
    }

    return new Blob(byteArrays, { type: contentType });
  }
}

interface Link {
  text: string;
  href: string;
}
