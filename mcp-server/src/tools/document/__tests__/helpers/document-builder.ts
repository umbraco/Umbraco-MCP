import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateDocumentRequestModel } from "@/umb-management-api/schemas/index.js";
import { postDocumentBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { DocumentTestHelper } from "./document-test-helper.js";

export class DocumentBuilder {
  private model: Partial<CreateDocumentRequestModel> = {
    values: [],
    variants: [],
    parent: null,
    template: null,
    documentType: { id: '' }
  };
  private createdItem: any = null;

  withName(name: string): DocumentBuilder {
    this.model.variants = [
      {
        culture: null,
        segment: null,
        name: name
      }
    ];
    return this;
  }

  withParent(parentId: string): DocumentBuilder {
    this.model.parent = { id: parentId };
    return this;
  }

  withDocumentType(documentTypeId: string): DocumentBuilder {
    this.model.documentType = { id: documentTypeId };
    return this;
  }

  withValue(alias: string, value: any, culture: string | null = null, segment: string | null = null): DocumentBuilder {
    if (!this.model.values) this.model.values = [];
    this.model.values.push({ alias, value, culture, segment });
    return this;
  }

  withVariant(name: string, culture: string | null = null, segment: string | null = null): DocumentBuilder {
    if (!this.model.variants) this.model.variants = [];
    this.model.variants.push({ name, culture, segment });
    return this;
  }

  build(): CreateDocumentRequestModel {
    return this.model as CreateDocumentRequestModel;
  }

  async create(): Promise<DocumentBuilder> {
    const client = UmbracoManagementClient.getClient();
    const validatedModel = postDocumentBody.parse(this.model);
    await client.postDocument(validatedModel);
    // Find the created document by name
    const name = this.model.variants && this.model.variants[0]?.name;
    if (!name) {
      throw new Error("Document must have a name");
    }

    this.createdItem = await DocumentTestHelper.findDocument(name);
    
    if (!this.createdItem) {
      throw new Error(`Failed to find created document with name: ${name}`);
    }
    return this;
  }

  getId(): string {
    if (!this.createdItem) {
      throw new Error("No document has been created yet");
    }
    return this.createdItem.id;
  }

  getCreatedItem(): any {
    if (!this.createdItem) {
      throw new Error("No document has been created yet");
    }
    return this.createdItem;
  }
} 