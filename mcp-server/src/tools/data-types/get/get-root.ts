import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { GetTreeDataTypeRootParams } from "@/umb-management-api/schemas/index.js";
import { getCultureQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetDataTypeRootTool = CreateUmbracoTool(
  "get-data-type-root",
  "Gets the root level of the data type tree.",
  getCultureQueryParams.shape,
  async (params: GetTreeDataTypeRootParams) => {
    const client = UmbracoManagementClient.getClient();
    var response = await client.getTreeDataTypeRoot(params);
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

export default GetDataTypeRootTool;
