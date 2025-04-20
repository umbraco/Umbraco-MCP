import { UmbracoManagementClient } from "../../../clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "../../../helpers/create-umbraco-tool.js";
import { z } from "zod";
const GetDataTypeTool = CreateUmbracoTool("get-data-type-root", "Gets the root level of the data type tree.", {
    skip: z.number().nonnegative().default(0),
    take: z.number().positive().default(100),
    foldersOnly: z
        .boolean()
        .default(false)
        .describe("If true, only folders will be returned."),
}, async (params) => {
    const client = UmbracoManagementClient.getClient();
    var response = await client.getTreeDataTypeRoot(params);
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(response),
            },
        ],
    };
});
export default GetDataTypeTool;
