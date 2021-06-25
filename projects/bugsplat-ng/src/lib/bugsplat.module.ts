import { HttpClientModule } from "@angular/common/http";
import { ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BugSplat as BugSplatJs } from 'bugsplat';
import { BugSplat } from "./bugsplat";
import { BugSplatSettings } from "./bugsplat-settings";
import { BugSplatErrorHandler } from "./bugsplat-error-handler";
import { BugSplatLogger } from "./bugsplat-logger";

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule
    ]
})
export class BugSplatModule { 
    static initializeApp(
        settings: BugSplatSettings
    ): ModuleWithProviders<BugSplatModule> {
        return {
            ngModule: BugSplatModule,
            providers: [
                BugSplat,
                BugSplatErrorHandler,
                {
                    provide: BugSplatJs,
                    useValue: new BugSplatJs(
                        settings.database,
                        settings.application,
                        settings.version
                    )
                },
                {
                    provide: BugSplatLogger,
                    useValue: new BugSplatLogger()
                }
            ]
          };
    }
}