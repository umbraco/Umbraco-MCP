import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { CopyDocumentTypeRequestModel } from "@/umb-management-api/schemas/index.js";
import {
  postDocumentTypeByIdCopyParams,
  postDocumentTypeByIdCopyBody,
} from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { z } from "zod";

const CopyDocumentTypeTool = CreateUmbracoTool(
  "copy-document-type",
  "Copies a document type",
  {
    id: postDocumentTypeByIdCopyParams.shape.id,
    data: z.object(postDocumentTypeByIdCopyBody.shape),
  },
  async (model: { id: string; data: CopyDocumentTypeRequestModel }) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.postDocumentTypeByIdCopy(model.id, model.data);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error copying document type:", error);
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

export default CopyDocumentTypeTool; 