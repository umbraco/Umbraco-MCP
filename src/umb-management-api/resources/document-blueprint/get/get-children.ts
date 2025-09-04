import { UmbracoManagementClient } from "@umb-management-client";
import { CreateUmbracoTemplateResource } from "@/helpers/mcp/create-umbraco-template-resource.js";
import { getTreeDocumentBlueprintChildrenQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";

const GetDocumentBlueprintChildrenResource = CreateUmbracoTemplateResource(
  "List Document Blueprint Children",
  "List children of a document blueprint",
  new ResourceTemplate(
    "umbraco://document-blueprint/children?parentId={parentId}&skip={skip}&take={take}&foldersOnly={foldersOnly}",
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
      const params =
        getTreeDocumentBlueprintChildrenQueryParams.parse(variables);
      const response = await client.getTreeDocumentBlueprintChildren(params);
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
      console.error("Error in GetDocumentBlueprintChildrenResource:", error);
      throw error;
    }
  }
);

export default GetDocumentBlueprintChildrenResource;
