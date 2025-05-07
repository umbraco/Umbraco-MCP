import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTemplateResource } from "@/helpers/create-umbraco-template-resource.js";
import { getDocumentBlueprintFolderByIdParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";

const GetDocumentBlueprintFolderResource = CreateUmbracoTemplateResource(
  "Get Document Blueprint Folder",
  "Get a document blueprint folder by ID",
  new ResourceTemplate("umbraco://document-blueprint/folder/{id}", {
    list: undefined,
    complete: {
      id: (value: string) => [] // This will be populated dynamically
    }
  }),
  async (uri, variables) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const params = getDocumentBlueprintFolderByIdParams.parse(variables);
      const response = await client.getDocumentBlueprintFolderById(params.id);
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify(response, null, 2),
          mimeType: "application/json"
        }]
      };
    } catch (error) {
      console.error('Error in GetDocumentBlueprintFolderResource:', error);
      throw error;
    }
  }
);

export default GetDocumentBlueprintFolderResource; 