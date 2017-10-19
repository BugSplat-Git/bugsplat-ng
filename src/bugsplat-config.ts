export class BugSplatConfiguration {

  readonly DATABASE_AZ_09_UNDERSCORES_ONLY = /^[a-zA-Z0-9_]*$/;
  static readonly APP_NAME_IS_REQUIRED = "BugSplatConfiguration Error: appName is required!";
  static readonly APP_VERSION_IS_REQUIRED = "BugSplatConfiguration Error: appVersion is required!";
  static readonly DATABASE_IS_REQUIRED = "BugSplatConfiguration Error: Database is required!";
  static readonly DATABASE_INVALID_CHARACTERS = "BugSplatConfiguration Error: Database contains invalid character(s)! Valid characters are A-Z, 0-9 and underscores only."

  constructor(public appName: string, public appVersion: string, public database: string) {
    if (!appName || appName == "") {
      throw new Error(BugSplatConfiguration.APP_NAME_IS_REQUIRED);
    }
    if (!appVersion || appVersion == "") {
      throw new Error(BugSplatConfiguration.APP_VERSION_IS_REQUIRED);
    }
    if (!database || database == "") {
      throw new Error(BugSplatConfiguration.DATABASE_IS_REQUIRED);
    }
    if (!database.match(this.DATABASE_AZ_09_UNDERSCORES_ONLY)) {
      throw new Error(BugSplatConfiguration.DATABASE_INVALID_CHARACTERS);
    }
  }
}