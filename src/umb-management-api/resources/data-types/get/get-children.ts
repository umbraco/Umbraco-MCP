import { UmbracoManagementClient } from "@umb-management-client";
import { CreateUmbracoTemplateResource } from "@/helpers/mcp/create-umbraco-template-resource.js";
import { getTreeDataTypeChildrenQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";

const GetDataTypeChildrenResource = CreateUmbracoTemplateResource(
  "List Data Type Children",
  "List the children of a data type folder",
  new ResourceTemplate(
    "umbraco://data-type/children?parentId={parentId}&skip={skip}&take={take}&foldersOnly={foldersOnly}",
    {
      list: undefined,
      complete: {
        parentId: (value: string) => [], // This will be populated dynamically
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
        foldersOnly: (value: string) => ["true", "false"],
      },
    }
  ),
  async (uri, variables) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const params = getTreeDataTypeChildrenQueryParams.parse(variables);
      const response = await client.getTreeDataTypeChildren(params);
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
      console.error("Error in GetDataTypeChildrenResource:", error);
      throw error;
    }
  }
);

export default GetDataTypeChildrenResource;
