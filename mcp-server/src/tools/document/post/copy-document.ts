import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { postDocumentByIdCopyBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { z } from "zod";

const CopyDocumentTool = CreateUmbracoTool(
  "copy-document",
  "Copy a document to a new location",
  {
    id: z.string().uuid(),
    data: z.object(postDocumentByIdCopyBody.shape)
  },
  async (model: { id: string; data: any }) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.postDocumentByIdCopy(model.id, model.data);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response)
          }
        ]
      };
    } catch (error) {
      console.error("Error copying document:", error);
      return {
        content: [
          {
            type: "text" as const,
            text: `Error: ${error}`
          }
        ]
      };
    }
  }
);

export default CopyDocumentTool; 