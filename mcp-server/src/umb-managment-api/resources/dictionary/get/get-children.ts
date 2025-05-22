import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTemplateResource } from "@/helpers/create-umbraco-template-resource.js";
import { getTreeDictionaryChildrenQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";

const GetDictionaryChildrenResource = CreateUmbracoTemplateResource(
  "List Dictionary Children",
  "List children of a dictionary item",
  new ResourceTemplate("umbraco://dictionary/children?parentId={parentId}&skip={skip}&take={take}", {
    list: undefined,
    complete: {
      parentId: (value: string) => [], // This will be populated dynamically
      skip: (value: string) => ["0", "10", "20", "30", "40", "50", "60", "70", "80", "90", "100"],
      take: (value: string) => ["10", "20", "50", "100"]
    }
  }),
  async (uri, variables) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const params = getTreeDictionaryChildrenQueryParams.parse(variables);
      const response = await client.getTreeDictionaryChildren(params);
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify(response, null, 2),
          mimeType: "application/json"
        }]
      };
    } catch (error) {
      console.error('Error in GetDictionaryChildrenResource:', error);
      throw error;
    }
  }
);

export default GetDictionaryChildrenResource; 