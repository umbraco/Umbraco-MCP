import { UmbracoManagementClient } from "@umb-management-client";
import { CreateUmbracoTemplateResource } from "@/helpers/mcp/create-umbraco-template-resource.js";
import { getDataTypeFolderByIdParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";

const GetDataTypeFolderResource = CreateUmbracoTemplateResource(
  "Get Data Type Folder",
  "Get details of a data type folder",
  new ResourceTemplate("umbraco://data-type/folder/{id}", {
    list: undefined,
    complete: {
      id: (value: string) => [], // This will be populated dynamically
    },
  }),
  async (uri, variables) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const params = getDataTypeFolderByIdParams.parse(variables);
      const response = await client.getDataTypeFolderById(params.id);
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
      console.error("Error in GetDataTypeFolderResource:", error);
      throw error;
    }
  }
);

export default GetDataTypeFolderResource;
