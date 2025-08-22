import { UmbracoManagementClient } from "@umb-management-client";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getTemplateByIdParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetTemplateTool = CreateUmbracoTool(
  "get-template",
  "Gets a template by Id",
  getTemplateByIdParams.shape,
  async ({ id }) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getTemplateById(id);

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

export default GetTemplateTool;
