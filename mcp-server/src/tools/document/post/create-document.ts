import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { postDocumentBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const CreateDocumentTool = CreateUmbracoTool(
  "create-document",
  `Creates a document,
  Before creating always search for another document of the same document type and copy that, 
  updating the new document as needed.`,
  postDocumentBody.shape,
  async (model) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.postDocument(model);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error creating document:", error);
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

export default CreateDocumentTool; 