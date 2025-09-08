import { UmbracoManagementClient } from "@umb-management-client";
import { CreateUmbracoTool } from "@/helpers/mcp/create-umbraco-tool.js";
import { CreateStylesheetRequestModel } from "@/umb-management-api/schemas/index.js";
import { postStylesheetBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const CreateStylesheetTool = CreateUmbracoTool(
  "create-stylesheet",
  "Creates a new stylesheet",
  postStylesheetBody.shape,
  async (model: CreateStylesheetRequestModel) => {
    const client = UmbracoManagementClient.getClient();
    var response = await client.postStylesheet(model);

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

export default CreateStylesheetTool;