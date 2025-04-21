import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { CreateDataTypeRequestModel } from "@/umb-management-api/schemas/createDataTypeRequestModel.js";
import { postDataTypeBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const CreateDataTypeTool = CreateUmbracoTool(
  "create-data-type",
  "Creates a new data type",
  postDataTypeBody.shape,
  async (input) => {
    try {
      console.log("Creating data type with params:", input);
      const client = UmbracoManagementClient.getClient();
      const body = postDataTypeBody.parse(input);
      body.id = "4df462e9-5045-4879-a1e4-0c28c9fb3fdb";
      body.values = [
        { alias: "maxChars", value: "1000"},
        { alias: "inputType", value: "text"},
      ]
      console.log(body);
      var response = await client.postDataType(
        body as CreateDataTypeRequestModel
      );

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
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

export default CreateDataTypeTool;
