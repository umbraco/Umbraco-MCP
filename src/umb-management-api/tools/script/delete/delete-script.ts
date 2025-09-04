import { UmbracoManagementClient } from "@umb-management-client";
import { CreateUmbracoTool } from "@/helpers/mcp/create-umbraco-tool.js";
import { deleteScriptByPathParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const DeleteScriptTool = CreateUmbracoTool(
  "delete-script",
  "Deletes a script by path",
  deleteScriptByPathParams.shape,
  async ({ path }) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.deleteScriptByPath(path);

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

export default DeleteScriptTool;