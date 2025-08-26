import { UmbracoManagementClient } from "@umb-management-client";
import { CreateUmbracoTemplateResource } from "@/helpers/create-umbraco-template-resource.js";
import { getTreeDictionaryRootQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";

const GetDictionaryRootResource = CreateUmbracoTemplateResource(
  "List Dictionary Root",
  "List dictionary items at the root level",
  new ResourceTemplate("umbraco://dictionary/root?skip={skip}&take={take}", {
    list: undefined,
    complete: {
      skip: (value: string) => [
        "0",
        "10",
        "20",
        "30",
        "40",
        "50",
        "60",
        "70",
        "80",
        "90",
        "100",
      ],
      take: (value: string) => ["10", "20", "50", "100"],
    },
  }),
  async (uri, variables) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const params = getTreeDictionaryRootQueryParams.parse(variables);
      const response = await client.getTreeDictionaryRoot(params);
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
      console.error("Error in GetDictionaryRootResource:", error);
      throw error;
    }
  }
);

export default GetDictionaryRootResource;
