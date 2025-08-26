import { UmbracoManagementClient } from "@umb-management-client";
import { CreateUmbracoTemplateResource } from "@/helpers/create-umbraco-template-resource.js";
import { getDictionaryByIdParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";

const GetDictionaryItemResource = CreateUmbracoTemplateResource(
  "Get Dictionary Item",
  "Get a dictionary item by ID",
  new ResourceTemplate("umbraco://dictionary/item/{id}", {
    list: undefined,
    complete: {
      id: (value: string) => [], // This will be populated dynamically
    },
  }),
  async (uri, variables) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const params = getDictionaryByIdParams.parse(variables);
      const response = await client.getDictionaryById(params.id);
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify(response, null, 2),
            mimeType: "application/json",
          },
        ],
      };
    } catch (error) {
      console.error("Error in GetDictionaryItemResource:", error);
      throw error;
    }
  }
);

export default GetDictionaryItemResource;
