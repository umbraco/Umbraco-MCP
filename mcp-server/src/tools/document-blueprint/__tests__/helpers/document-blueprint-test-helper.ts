import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { DocumentBlueprintTreeItemResponseModel } from "@/umb-management-api/schemas/index.js";

export const BLANK_UUID = "00000000-0000-0000-0000-000000000000";
export const DEFAULT_DOCUMENT_TYPE_ID = "e68abe48-7646-4ef4-abb8-f1a5b24b27cc"; // This should be replaced with a real document type ID in your environment

export class DocumentBlueprintTestHelper {

  private static findByName(items: DocumentBlueprintTreeItemResponseModel[], name: string): DocumentBlueprintTreeItemResponseModel | undefined {
    return items.find((item: any) => item.name === name);
  }

  static normaliseIds(items: DocumentBlueprintTreeItemResponseModel | DocumentBlueprintTreeItemResponseModel[]): DocumentBlueprintTreeItemResponseModel | DocumentBlueprintTreeItemResponseModel[] {
    if (Array.isArray(items)) {
      return items.map(item => ({ ...item, id: BLANK_UUID }));
    }
    return { ...items, id: BLANK_UUID };
  }

  static async cleanup(name: string): Promise<void> {
    try {
      const client = UmbracoManagementClient.getClient();
      const item = await this.findDocumentBlueprint(name);
      
      if (item) {
        try {
          if(item.isFolder) {
            await client.deleteDocumentBlueprintFolderById(item.id);
          } else {
            await client.deleteDocumentBlueprintById(item.id);
          }
        } catch (deleteError) {
          console.log(`Error deleting blueprint ${item.id}:`, deleteError);
        }
      }

    } catch (error) {
      console.log(`Error cleaning up document blueprint '${name}':`, error);
    }
  }

  static async findDocumentBlueprint(name: string): Promise<DocumentBlueprintTreeItemResponseModel | undefined> {
    try {
      const client = UmbracoManagementClient.getClient();
      
      // First check root level
      const rootResponse = await client.getTreeDocumentBlueprintRoot({});
      const rootMatch = this.findByName(rootResponse.items, name);
      if (rootMatch) {
        return rootMatch;
      }

      // Only check children if we haven't found the blueprint
      for (const item of rootResponse.items) {
        if (item.hasChildren) {
          try {
            const childrenResponse = await client.getTreeDocumentBlueprintChildren({
              parentId: item.id
            });
            const childMatch = this.findByName(childrenResponse.items, name);
            if (childMatch) {
              return childMatch;
            }
          } catch (error) {
            console.log(`Error getting children for blueprint ${item.id}:`, error);
          }
        }
      }

      return undefined;
    } catch (error) {
      console.log(`Error finding document blueprints with name '${name}':`, error);
      return undefined;
    }
  }
} 