import { getUmbracoWorkflowManagementAPI } from "@/umb-workflow-api/api/umbracoWorkflowManagementAPI.js";

export class UmbracoWorkflowClient {
  private static instance: ReturnType<
    typeof getUmbracoWorkflowManagementAPI
  > | null = null;

  private constructor() {}

  public static getClient() {
    if (this.instance === null) {
      this.instance = getUmbracoWorkflowManagementAPI();
    }
    return this.instance;
  }
}
