import { UmbracoManagementClient } from "@umb-management-client";
import { CreateUmbracoTemplateResource } from "@/helpers/mcp/create-umbraco-template-resource.js";
import { getTreeDataTypeAncestorsQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";

const GetDataTypeAncestorsResource = CreateUmbracoTemplateResource(
  "List Ancestor Data Types",
  "List the ancestors of a data type",
  new ResourceTemplate(
    "umbraco://data-type/ancestors?descendantId={descendantId}",
    {
      list: undefined,
      complete: {
        descendantId: (value: string) => [], // This will be populated dynamically
      },
    }
  ),
  async (uri, variables) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const params = getTreeDataTypeAncestorsQueryParams.parse(variables);
      const response = await client.getTreeDataTypeAncestors(params);
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
      console.error("Error in GetDataTypeAncestorsResource:", error);
      throw error;
    }
  }
);

export default GetDataTypeAncestorsResource;
