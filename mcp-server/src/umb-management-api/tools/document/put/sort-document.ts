import { UmbracoManagementClient } from "@umb-management-client";
import { putDocumentSortBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { CurrentUserResponseModel } from "@/umb-management-api/schemas/index.js";

const SortDocumentTool = CreateUmbracoTool(
  "sort-document",
  "Sorts the order of documents under a parent.",
  putDocumentSortBody.shape,
  async (model: any) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.putDocumentSort(model);
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(response),
        },
      ],
    };
  },
  (user: CurrentUserResponseModel) => user.fallbackPermissions.includes("Umb.Document.Sort")
);

export default SortDocumentTool;
