import { UmbracoManagementClient } from "@umb-management-client";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { putRecycleBinDocumentByIdRestoreParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { CurrentUserResponseModel } from "@/umb-management-api/schemas/index.js";

const RestoreFromRecycleBinTool = CreateUmbracoTool(
  "restore-document-from-recycle-bin",
  "Restores a document from the recycle bin.",
  putRecycleBinDocumentByIdRestoreParams.shape,
  async ({ id }) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.putRecycleBinDocumentByIdRestore(id, {
      target: null,
    });
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

export default RestoreFromRecycleBinTool;
