import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { postDocumentBlueprintBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";

export const DEFAULT_DOCUMENT_TYPE_ID = "e68abe48-7646-4ef4-abb8-f1a5b24b27cc";

export class DocumentBlueprintBuilder {
  private model: {
    values: Array<{
      culture: string | null;
      segment: string | null;
      alias: string;
      value: any | null;
    }>;
    variants: Array<{
      culture: string | null;
      segment: string | null;
      name: string;
    }>;
    id?: string;
    parent?: { id: string } | null;
    isFolder?: boolean;
    documentType: { id: string };
  };

  constructor(name: string) {
    this.model = {
      values: [],
      variants: [
        {
          culture: null,
          segment: null,
          name: name
        }
      ],
      documentType: {
        id: DEFAULT_DOCUMENT_TYPE_ID
      }
    };
  }

  withId(id: string): DocumentBlueprintBuilder {
    this.model.id = id;
    return this;
  }

  withParent(parentId: string): DocumentBlueprintBuilder {
    this.model.parent = { id: parentId };
    return this;
  }

  withDocumentType(documentTypeId: string): DocumentBlueprintBuilder {
    this.model.documentType.id = documentTypeId;
    return this;
  }

  withValue(alias: string, value: any, culture: string | null = null, segment: string | null = null): DocumentBlueprintBuilder {
    this.model.values.push({
      culture,
      segment,
      alias,
      value
    });
    return this;
  }

  withVariant(name: string, culture: string | null = null, segment: string | null = null): DocumentBlueprintBuilder {
    this.model.variants.push({
      culture,
      segment,
      name
    });
    return this;
  }

  build(): any {
    return this.model;
  }

  async create(): Promise<any> {
    try {
      const client = UmbracoManagementClient.getClient();
      const validatedModel = postDocumentBlueprintBody.parse(this.model);
      return await client.postDocumentBlueprint(validatedModel);
    } catch (error) {
      console.error("Error creating document blueprint:", error);
      throw error;
    }
  }
} 