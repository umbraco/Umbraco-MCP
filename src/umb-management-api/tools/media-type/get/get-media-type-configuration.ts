import { UmbracoManagementClient } from "@umb-management-client";
import { CreateUmbracoTool } from "@/helpers/mcp/create-umbraco-tool.js";

const GetMediaTypeConfigurationTool = CreateUmbracoTool(
  "get-media-type-configuration",
  "Gets the configuration for media types",
  {},
  async () => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getMediaTypeConfiguration();

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

export default GetMediaTypeConfigurationTool;
