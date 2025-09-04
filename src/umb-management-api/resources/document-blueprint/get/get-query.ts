import { UmbracoManagementClient } from "@umb-management-client";
import { CreateUmbracoTemplateResource } from "@/helpers/mcp/create-umbraco-template-resource.js";
import { getItemDocumentBlueprintQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";

const GetDocumentBlueprintQueryResource = CreateUmbracoTemplateResource(
  "Query Document Blueprints",
  "Query document blueprints by Ids",
  new ResourceTemplate("umbraco://document-blueprint/query?id={id}", {
    list: undefined,
    complete: {
      id: (value: string) => [], // This will be populated dynamically
    },
  }),
  async (uri, variables) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const params = getItemDocumentBlueprintQueryParams.parse(variables);
      const response = await client.getItemDocumentBlueprint(params);
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
      console.error("Error in GetDocumentBlueprintQueryResource:", error);
      throw error;
    }
  }
);

export default GetDocumentBlueprintQueryResource;
