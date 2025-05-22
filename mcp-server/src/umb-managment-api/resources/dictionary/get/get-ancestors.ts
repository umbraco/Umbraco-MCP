import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTemplateResource } from "@/helpers/create-umbraco-template-resource.js";
import { getTreeDictionaryAncestorsQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";

const GetDictionaryAncestorsResource = CreateUmbracoTemplateResource(
  "List Dictionary Ancestors",
  "List ancestors of a dictionary item",
  new ResourceTemplate("umbraco://dictionary/ancestors?descendantId={descendantId}", {
    list: undefined,
    complete: {
      descendantId: (value: string) => [] // This will be populated dynamically
    }
  }),
  async (uri, variables) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const params = getTreeDictionaryAncestorsQueryParams.parse(variables);
      const response = await client.getTreeDictionaryAncestors(params);
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify(response, null, 2),
          mimeType: "application/json"
        }]
      };
    } catch (error) {
      console.error('Error in GetDictionaryAncestorsResource:', error);
      throw error;
    }
  }
);

export default GetDictionaryAncestorsResource; 