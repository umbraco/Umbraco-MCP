import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTemplateResource } from "@/helpers/create-umbraco-template-resource.js";
import { getDataTypeByIdIsUsedParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";

const GetDataTypeIsUsedResource = CreateUmbracoTemplateResource(
  "Check Data Type Usage",
  "Check if a data type is used within Umbraco",
  new ResourceTemplate("umbraco://data-type/{id}/is-used", {
    list: undefined,
    complete: {
      id: (value: string) => [] // This will be populated dynamically
    }
  }),
  async (uri, variables) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const params = getDataTypeByIdIsUsedParams.parse(variables);
      const response = await client.getDataTypeByIdIsUsed(params.id);
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify(response, null, 2),
          mimeType: "application/json"
        }]
      };
    } catch (error) {
      console.error('Error in GetDataTypeIsUsedResource:', error);
      throw error;
    }
  }
);

export default GetDataTypeIsUsedResource; 