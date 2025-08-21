import { UmbracoManagementClient } from "@umb-management-client";
import { CreateTemplateRequestModel } from "@/umb-management-api/schemas/index.js";
import { postTemplateBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { TemplateTestHelper } from "./template-helper.js";

export class TemplateBuilder {
  private model: Partial<CreateTemplateRequestModel> = {
    name: "",
    alias: "",
    content: null,
  };
  private createdItem: any = null;

  withName(name: string): TemplateBuilder {
    this.model.name = name;
    this.model.alias = name.toLowerCase().replace(/\s+/g, "-");
    return this;
  }

  withAlias(alias: string): TemplateBuilder {
    this.model.alias = alias;
    return this;
  }

  withContent(content: string): TemplateBuilder {
    this.model.content = content;
    return this;
  }

  withParent(parentId: string): TemplateBuilder {
    // Note: Templates don't support parent relationships in the API
    // This method is provided for consistency with other builders
    // but will not affect the actual template creation
    return this;
  }

  build(): Partial<CreateTemplateRequestModel> {
    return this.model;
  }

  async create(): Promise<TemplateBuilder> {
    if (!this.model.name || !this.model.alias) {
      throw new Error("Name and alias are required");
    }

    const client = UmbracoManagementClient.getClient();
    const validatedModel = postTemplateBody.parse(this.model);
    await client.postTemplate(validatedModel);
    
    // Get the created template by name
    const response = await TemplateTestHelper.findTemplates(validatedModel.name);
    const createdItem = response.find(
      (item: { name: string }) => item.name === validatedModel.name
    );
    if (!createdItem) {
      throw new Error(
        `Failed to find created template with name: ${validatedModel.name}`
      );
    }
    this.createdItem = createdItem;
    return this;
  }

  async verify(): Promise<boolean> {
    if (!this.createdItem) {
      throw new Error("No template has been created yet");
    }
    return await TemplateTestHelper.verifyTemplate(this.createdItem.id);
  }

  getId(): string {
    if (!this.createdItem) {
      throw new Error("No template has been created yet");
    }
    return this.createdItem.id;
  }

  getCreatedItem(): any {
    if (!this.createdItem) {
      throw new Error("No template has been created yet");
    }
    return this.createdItem;
  }

  getAlias(): string {
    if (!this.model.alias) {
      throw new Error("No alias has been set yet");
    }
    return this.model.alias;
  }

  async cleanup(): Promise<void> {
    if (this.createdItem) {
      try {
        const client = UmbracoManagementClient.getClient();
        await client.deleteTemplateById(this.createdItem.id);
      } catch (error) {
        console.error("Error cleaning up template:", error);
      }
    }
  }

  static async cleanupByName(name: string): Promise<void> {
    await TemplateTestHelper.cleanup(name);
  }
}
