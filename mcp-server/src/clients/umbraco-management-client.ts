import { getUmbracoManagementAPI } from "../api/umbraco/management/umbracoManagementAPI.js";

export class UmbracoManagementClient {
  private static instance: ReturnType<typeof getUmbracoManagementAPI> | null =
    null;

  private constructor() {}

  public static getClient() {
    if (this.instance === null) {
      this.instance = getUmbracoManagementAPI();
    }
    return this.instance;
  }
}
