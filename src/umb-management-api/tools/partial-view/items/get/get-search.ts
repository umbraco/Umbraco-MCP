import { UmbracoManagementClient } from "@umb-management-client";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { GetItemPartialViewParams } from "@/umb-management-api/schemas/index.js";
import { getItemPartialViewQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetPartialViewSearchTool = CreateUmbracoTool(
  "get-partial-view-search",
  "Searches for partial views by name or path",
  getItemPartialViewQueryParams.shape,
  async (model: GetItemPartialViewParams) => {
    const client = UmbracoManagementClient.getClient();
    var response = await client.getItemPartialView(model);

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

export default GetPartialViewSearchTool;