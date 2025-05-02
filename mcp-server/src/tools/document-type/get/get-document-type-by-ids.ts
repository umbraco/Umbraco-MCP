import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getDocumentTypeByIdParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetDocumentTypesByIdArrayTool = CreateUmbracoTool(
  "get-document-types-by-id-array",
  "Gets a collection of document types b their Ids",
  getDocumentTypeByIdParams.shape,
  async ({ id }) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.getDocumentTypeById(id);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error getting document type:", error);
      return {
        content: [
          {
            type: "text" as const,
            text: `Error: ${error}`,
          },
        ],
      };
    }
  }
);

export default GetDocumentTypesByIdArrayTool; 