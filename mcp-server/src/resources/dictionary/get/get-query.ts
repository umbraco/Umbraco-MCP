import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTemplateResource } from "@/helpers/create-umbraco-template-resource.js";
import { getDictionaryQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";

const GetDictionaryQueryResource = CreateUmbracoTemplateResource(
  "List Dictionary Items",
  "List dictionary items with optional filtering",
  new ResourceTemplate("umbraco://dictionary/list?filter={filter}&skip={skip}&take={take}", {
    list: undefined,
    complete: {
      filter: (value: string) => [], // This will be populated dynamically
      skip: (value: string) => ["0", "10", "20", "30", "40", "50", "60", "70", "80", "90", "100"],
      take: (value: string) => ["10", "20", "50", "100"]
    }
  }),
  async (uri, variables) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const params = getDictionaryQueryParams.parse(variables);
      const response = await client.getDictionary(params);
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify(response, null, 2),
          mimeType: "application/json"
        }]
      };
    } catch (error) {
      console.error('Error in GetDictionaryListResource:', error);
      throw error;
    }
  }
);

export default GetDictionaryQueryResource; 