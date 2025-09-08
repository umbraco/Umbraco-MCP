import { UmbracoManagementClient } from "@umb-management-client";
import { CreateUmbracoTool } from "@/helpers/mcp/create-umbraco-tool.js";
import { getTreeDocumentChildrenQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetDocumentChildrenTool = CreateUmbracoTool(
  "get-document-children",
  "Gets child items for a document.",
  getTreeDocumentChildrenQueryParams.shape,
  async (params) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getTreeDocumentChildren(params);
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(response),
        },
      ],
    };
  }
);

export default GetDocumentChildrenTool;
