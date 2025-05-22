import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTemplateResource } from "@/helpers/create-umbraco-template-resource.js";
import { getDocumentBlueprintByIdParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";

const GetDocumentBlueprintResource = CreateUmbracoTemplateResource(
  "Get Document Blueprint",
  "Get a document blueprint by ID",
  new ResourceTemplate("umbraco://document-blueprint/{id}", {
    list: undefined,
    complete: {
      id: (value: string) => [] // This will be populated dynamically
    }
  }),
  async (uri, variables) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const params = getDocumentBlueprintByIdParams.parse(variables);
      const response = await client.getDocumentBlueprintById(params.id);
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify(response, null, 2),
          mimeType: "application/json"
        }]
      };
    } catch (error) {
      console.error('Error in GetDocumentBlueprintResource:', error);
      throw error;
    }
  }
);

export default GetDocumentBlueprintResource; 