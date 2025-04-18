import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import axios from "axios";
import * as delivery from "./api/umbraco/delivery/umbracoDeliveryAPI.js";
// import * as management from "./api/umbraco/management/umbracoManagementAPI.js";
// import * as managementSchemas from "./api/umbraco/management/schemas/index.js";
const server = new McpServer({
    name: "umbraco-api-server",
    version: "1.0.0",
    capabilities: {
        tools: {},
    },
});
server.tool("get_content", "Get content all content items", { input: delivery.getContent20QueryParams }, async ({ input }) => {
    try {
        var parsed = delivery.getContent20QueryParams.parse(input);
        console.info("callTool", parsed);
        const response = await axios.get(`http://localhost:56472/umbraco/delivery/api/v2/content/`, { params: parsed });
        var data = delivery.getContent20Response.parse(response.data);
        console.info("response", data);
        return {
            content: [
                { type: "text", text: `Content: ${JSON.stringify(response.data)}` },
                // http status code
                { type: "text", text: `HTTP Status Code: ${response.status}` },
            ],
        };
    }
    catch (error) {
        console.error(`Error:`, error);
        if (axios.isAxiosError(error) && error.response) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error ${error.response.status}: ${JSON.stringify(error.response.data, null, 2)}`,
                    },
                ],
            };
        }
        return {
            content: [{ type: "text", text: `Error: ${error}` }],
        };
    }
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Umbraco API server running on stdio");
}
main().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
});
