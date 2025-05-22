import { getUmbracoManagementAPI } from "@/umb-management-api/api/umbracoManagementAPI.js";
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
