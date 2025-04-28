import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTemplateResource } from "@/helpers/create-umbraco-template-resource.js";
import { getFilterDataTypeQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";

const GetDataTypeFilterResource = CreateUmbracoTemplateResource(
  "Filter Data Types",
  "Filter data types by name, editor UI alias, or editor alias",
  new ResourceTemplate("umbraco://data-type/filter?name={name}&editorUiAlias={editorUiAlias}&editorAlias={editorAlias}&skip={skip}&take={take}", {
    list: undefined,
    complete: {
      name: (value: string) => [], // This will be populated dynamically
      editorUiAlias: (value: string) => [], // This will be populated dynamically
      editorAlias: (value: string) => [], // This will be populated dynamically
      skip: (value: string) => ["0", "10", "20", "30", "40", "50", "60", "70", "80", "90", "100"],
      take: (value: string) => ["10", "20", "50", "100"]
    }
  }),
  async (uri, variables) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const params = getFilterDataTypeQueryParams.parse(variables);
      const response = await client.getFilterDataType(params);
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify(response, null, 2),
          mimeType: "application/json"
        }]
      };
    } catch (error) {
      console.error('Error in GetDataTypeFilterResource:', error);
      throw error;
    }
  }
);

export default GetDataTypeFilterResource; 