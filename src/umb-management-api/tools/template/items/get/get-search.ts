import { UmbracoManagementClient } from "@umb-management-client";
import { CreateUmbracoTool } from "@/helpers/mcp/create-umbraco-tool.js";
import { getItemTemplateSearchQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetTemplateSearchTool = CreateUmbracoTool(
  "get-template-search",
  "Searches the template tree for a template by name. It does NOT allow for searching for template folders.",
  getItemTemplateSearchQueryParams.shape,
  async (params) => {
    const client = UmbracoManagementClient.getClient();
    var response = await client.getItemTemplateSearch(params);

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

export default GetTemplateSearchTool;
