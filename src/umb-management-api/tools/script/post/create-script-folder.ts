import { UmbracoManagementClient } from "@umb-management-client";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { CreateScriptFolderRequestModel } from "@/umb-management-api/schemas/index.js";
import { postScriptFolderBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const CreateScriptFolderTool = CreateUmbracoTool(
  "create-script-folder",
  "Creates a new script folder",
  postScriptFolderBody.shape,
  async (model: CreateScriptFolderRequestModel) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.postScriptFolder(model);

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

export default CreateScriptFolderTool;