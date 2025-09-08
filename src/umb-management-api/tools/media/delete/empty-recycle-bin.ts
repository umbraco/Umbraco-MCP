import { UmbracoManagementClient } from "@umb-management-client";
import { CreateUmbracoTool } from "@/helpers/mcp/create-umbraco-tool.js";

const EmptyRecycleBinTool = CreateUmbracoTool(
  "empty-media-recycle-bin",
  "Empties the media recycle bin.",
  {},
  async () => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.deleteRecycleBinMedia();
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

export default EmptyRecycleBinTool;
