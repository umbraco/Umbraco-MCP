import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTemplateResource } from "@/helpers/create-umbraco-template-resource.js";
import { getTreeDocumentBlueprintAncestorsQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";

const GetDocumentBlueprintAncestorsResource = CreateUmbracoTemplateResource(
  "List Document Blueprint Ancestors",
  "List ancestors of a document blueprint",
  new ResourceTemplate("umbraco://document-blueprint/ancestors?descendantId={descendantId}", {
    list: undefined,
    complete: {
      descendantId: (value: string) => [] // This will be populated dynamically
    }
  }),
  async (uri, variables) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const params = getTreeDocumentBlueprintAncestorsQueryParams.parse(variables);
      const response = await client.getTreeDocumentBlueprintAncestors(params);
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify(response, null, 2),
          mimeType: "application/json"
        }]
      };
    } catch (error) {
      console.error('Error in GetDocumentBlueprintAncestorsResource:', error);
      throw error;
    }
  }
);

export default GetDocumentBlueprintAncestorsResource; 