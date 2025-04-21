import { UmbracoManagementClient } from "../../../clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "../../../helpers/create-umbraco-tool.js";
import { postDataTypeBody } from "../../../api/umbraco/management/umbracoManagementAPI.zod.js";
const CreateDataTypeTool = CreateUmbracoTool("create-data-type-root", "Creates a new data type", postDataTypeBody.shape, async (input) => {
    try {
        console.log("Creating data type with params:", input);
        const client = UmbracoManagementClient.getClient();
        const body = postDataTypeBody.parse(input);
        console.log(body);
        var response = await client.postDataType(body);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(response),
                },
            ],
        };
    }
    catch (error) {
        console.error("Error creating data type:", error);
        return {
            content: [
                {
                    type: "text",
                    text: `Error: ${error}`,
                },
            ],
        };
    }
});
export default CreateDataTypeTool;
