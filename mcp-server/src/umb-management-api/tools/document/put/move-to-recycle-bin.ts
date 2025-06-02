import { UmbracoManagementClient } from "@umb-management-client";
import { putDocumentByIdMoveToRecycleBinParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { CurrentUserResponseModel } from "@/umb-management-api/schemas/index.js";

const MoveDocumentToRecycleBinTool = CreateUmbracoTool(
  "move-document-to-recycle-bin",
  "Move a document to the recycle bin",
  putDocumentByIdMoveToRecycleBinParams.shape,
  async ({ id }) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.putDocumentByIdMoveToRecycleBin(id);
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(response),
        },
      ],
    };
  },
  (user: CurrentUserResponseModel) => user.fallbackPermissions.includes("Umb.Document.Delete")
);

export default MoveDocumentToRecycleBinTool;
