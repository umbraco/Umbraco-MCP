import { UmbracoManagementClient } from "@umb-management-client";
import { CreateUmbracoTemplateResource } from "@/helpers/create-umbraco-template-resource.js";
import { getItemDataTypeSearchQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";

const GetDataTypeSearchResource = CreateUmbracoTemplateResource(
  "Search Data Types",
  "Search for data types by name",
  new ResourceTemplate(
    "umbraco://data-type/search?query={query}&skip={skip}&take={take}",
    {
      list: undefined,
      complete: {
        query: (value: string) => [], // This will be populated dynamically
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
    }
  ),
  async (uri, variables) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const params = getItemDataTypeSearchQueryParams.parse(variables);
      const response = await client.getItemDataTypeSearch(params);
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
      console.error("Error in GetDataTypeSearchResource:", error);
      throw error;
    }
  }
);

export default GetDataTypeSearchResource;
