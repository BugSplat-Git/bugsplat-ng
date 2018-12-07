import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { BugSplatErrorHandler } from "./bugsplat-error-handler";
import { BugSplat } from "./bugsplat";

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule
    ],
    providers: [
        BugSplatErrorHandler,
        BugSplat
    ]
})
export class BugSplatModule { }