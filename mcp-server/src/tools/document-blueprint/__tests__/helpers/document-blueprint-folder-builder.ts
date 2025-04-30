import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";

export class DocumentBlueprintFolderBuilder {
  private parentId?: string;

  constructor(private name: string) {}

  withParent(parentId: string): this {
    this.parentId = parentId;
    return this;
  }

  async create() {
    const client = UmbracoManagementClient.getClient();
    return await client.postDocumentBlueprintFolder({
      name: this.name,
      parentId: this.parentId
    });
  }
} 