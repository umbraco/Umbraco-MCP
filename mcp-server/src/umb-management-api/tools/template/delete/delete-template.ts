import { UmbracoManagementClient } from "@umb-management-client";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { deleteTemplateByIdParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const DeleteTemplateTool = CreateUmbracoTool(
  "delete-template",
  "Deletes a template by Id",
  deleteTemplateByIdParams.shape,
  async ({ id }) => {
    const client = UmbracoManagementClient.getClient();
    var response = await client.deleteTemplateById(id);

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

export default DeleteTemplateTool;
