import { InjectionToken } from "@angular/core";


export let BugSplatConfigToken = new InjectionToken<BugSplatConfig>('bugsplat.config');
export interface BugSplatConfig {
  appName: string;
  appVersion: string;
  database: string;
}