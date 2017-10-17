export class BugSplatConfiguration {

  readonly DATABASE_AZ_09_UNDERSCORES_ONLY = /^[a-zA-Z0-9_]*$/;

  constructor(public appName: string, public appVersion: string, public database: string) {
    if(!appName || appName == "") {
      throw new Error("BugSplat Error: AppName is required!");
    }
    if(!appVersion || appVersion == "") {
      throw new Error("BugSplat Error: AppVersion is required!");
    }
    if(!database || database == "") {
      throw new Error("BugSplat Error: Database is required!");
    }
    if(!database.match(this.DATABASE_AZ_09_UNDERSCORES_ONLY)) {
      throw new Error("BugSplat Error: Database contains invalid character(s)! Valid characters are A-Z, 0-9 and underscores only.")
    }
  }
}