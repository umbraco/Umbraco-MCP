import { UmbracoManagementClient } from "../../../clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "../../../helpers/create-umbraco-tool.js";
import { postDataTypeBody } from "../../../api/umbraco/management/umbracoManagementAPI.zod.js";
const CreateDataTypeTool = CreateUmbracoTool("create-data-type-root", "Creates a new data type", { input: postDataTypeBody }, async (input) => {
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
/*
{
"name":"AI test",
"editorAlias":"Umbraco.TextBox",
"editorUiAlias":"Umb.PropertyEditorUi.TextBox",
"values":[]
}

2025-04-20 20:09:19.864 [warning] Failed to parse message: "Creating data type with params: {\n"
2025-04-20 20:09:19.864 [warning] Failed to parse message: "  postDataTypeBody: {\n"
2025-04-20 20:09:19.864 [warning] Failed to parse message: "    name: 'AI test',\n"
2025-04-20 20:09:19.865 [warning] Failed to parse message: "    editorAlias: 'Umbraco.TextBox',\n"
2025-04-20 20:09:19.865 [warning] Failed to parse message: "    editorUiAlias: 'Umb.PropertyEditorUi.TextBox',\n"
2025-04-20 20:09:19.865 [warning] Failed to parse message: "    values: []\n"
2025-04-20 20:09:19.865 [warning] Failed to parse message: "  }\n"
2025-04-20 20:09:19.865 [warning] Failed to parse message: "}\n"

865 [warning] [server stderr] Error creating data type: ZodError: [
2025-04-20 20:09:19.866 [warning] [server stderr]   {
2025-04-20 20:09:19.866 [warning] [server stderr]     "code": "invalid_type",
2025-04-20 20:09:19.866 [warning] [server stderr]     "expected": "string",
2025-04-20 20:09:19.866 [warning] [server stderr]     "received": "undefined",
2025-04-20 20:09:19.866 [warning] [server stderr]     "path": [
2025-04-20 20:09:19.866 [warning] [server stderr]       "name"
2025-04-20 20:09:19.867 [warning] [server stderr]     ],
2025-04-20 20:09:19.867 [warning] [server stderr]     "message": "Required"
2025-04-20 20:09:19.867 [warning] [server stderr]   },
2025-04-20 20:09:19.867 [warning] [server stderr]   {
*/
