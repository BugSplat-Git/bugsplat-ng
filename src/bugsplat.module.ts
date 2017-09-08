
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { BugSplatErrorHandler, BugSplat, BugSplatConfig } from "./bugsplat-error-handler";

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule
    ],
    providers: [
        BugSplatErrorHandler
    ],
    exports: [
        BugSplat
    ]
})
export class BugSplatModule { }