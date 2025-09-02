import { UmbracoManagementClient } from "@umb-management-client";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getScriptFolderByPathParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetScriptFolderByPathTool = CreateUmbracoTool(
  "get-script-folder-by-path",
  "Gets a script folder by path",
  getScriptFolderByPathParams.shape,
  async ({ path }) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getScriptFolderByPath(path);

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

export default GetScriptFolderByPathTool;