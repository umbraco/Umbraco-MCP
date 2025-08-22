import { UmbracoManagementClient } from "@umb-management-client";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getItemTemplateQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetTemplatesByIdArrayTool = CreateUmbracoTool(
  "get-templates-by-id-array",
  "Gets templates by IDs (or empty array if no IDs are provided)",
  getItemTemplateQueryParams.shape,
  async (params: { id?: string[] }) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getItemTemplate(params);

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

export default GetTemplatesByIdArrayTool;