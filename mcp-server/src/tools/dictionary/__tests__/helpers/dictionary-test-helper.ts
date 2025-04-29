import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateDictionaryItemRequestModel } from "@/umb-management-api/schemas/index.js";
import { postDictionaryBody, getDictionaryByIdResponse, getDictionaryResponse } from "@/umb-management-api/umbracoManagementAPI.zod.js";

export class DictionaryTestHelper {
  private model: Partial<CreateDictionaryItemRequestModel> = {
    translations: []
  };
  private id: string | null = null;

  withName(name: string): DictionaryTestHelper {
    this.model.name = name;
    return this;
  }

  withTranslation(isoCode: string, translation: string): DictionaryTestHelper {
    this.model.translations = [
      ...(this.model.translations || []),
      { isoCode, translation }
    ];
    return this;
  }

  withParent(parentId: string): DictionaryTestHelper {
    this.model.parent = { id: parentId };
    return this;
  }

  async create(): Promise<DictionaryTestHelper> {
    const client = UmbracoManagementClient.getClient();
    const validatedModel = postDictionaryBody.parse(this.model);
    await client.postDictionary(validatedModel);
    
    // Get the created dictionary item by name
    const response = await client.getDictionary({ filter: validatedModel.name });
    const createdItem = response.items.find((item: { name: string | null }) => item.name === validatedModel.name);
    if (!createdItem) {
      throw new Error(`Failed to find created dictionary item with name: ${validatedModel.name}`);
    }
    this.id = createdItem.id;
    return this;
  }

  async verify(): Promise<boolean> {
    if (!this.id) {
      throw new Error("No dictionary item has been created yet");
    }
    try {
      const client = UmbracoManagementClient.getClient();
      await client.getDictionaryById(this.id);
      return true;
    } catch (error) {
      return false;
    }
  }

  getId(): string {
    if (!this.id) {
      throw new Error("No dictionary item has been created yet");
    }
    return this.id;
  }

  async cleanup(): Promise<void> {
    if (this.id) {
      try {
        const client = UmbracoManagementClient.getClient();
        await client.deleteDictionaryById(this.id);
      } catch (error) {
        console.error("Error cleaning up dictionary item:", error);
      }
    }
  }

  async reset(): Promise<void> {
    await this.cleanup();
    this.model = { translations: [] };
    this.id = null;
  }
} 