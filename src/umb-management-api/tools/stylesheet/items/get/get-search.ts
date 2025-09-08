import { UmbracoManagementClient } from "@umb-management-client";
import { CreateUmbracoTool } from "@/helpers/mcp/create-umbraco-tool.js";
import { GetItemStylesheetParams } from "@/umb-management-api/schemas/index.js";
import { getItemStylesheetQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetStylesheetSearchTool = CreateUmbracoTool(
  "get-stylesheet-search",
  "Searches for stylesheets by name or path",
  getItemStylesheetQueryParams.shape,
  async (model: GetItemStylesheetParams) => {
    const client = UmbracoManagementClient.getClient();
    var response = await client.getItemStylesheet(model);

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

export default GetStylesheetSearchTool;