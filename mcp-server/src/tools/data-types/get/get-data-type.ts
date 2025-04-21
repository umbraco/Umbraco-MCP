import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getDataTypeByIdParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetDataTypeTool = CreateUmbracoTool(
  "get-data-type",
  "Gets a data type by Id",
  getDataTypeByIdParams.shape,
  async ({ id }) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.getDataTypeById(id);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
        resource: {
          type: "data-type" as const,
          ...response,
          uri: `${process.env.UMBRACO_BASE_URL}/umbraco/section/settings/workspace/data-type/edit/${response.id}`,
        },
      };
    } catch (error) {
      console.error("Error creating data type:", error);
      return {
        content: [
          {
            type: "text" as const,
            text: `Error: ${error}`,
          },
        ],
      };
    }
  }
);

export default GetDataTypeTool;
