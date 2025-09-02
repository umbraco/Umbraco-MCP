import { UmbracoManagementClient } from "@umb-management-client";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { GetTreeScriptChildrenParams } from "@/umb-management-api/schemas/index.js";
import { getTreeScriptChildrenQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetScriptTreeChildrenTool = CreateUmbracoTool(
  "get-script-tree-children",
  "Gets script tree children",
  getTreeScriptChildrenQueryParams.shape,
  async (model: GetTreeScriptChildrenParams) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getTreeScriptChildren(model);

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

export default GetScriptTreeChildrenTool;