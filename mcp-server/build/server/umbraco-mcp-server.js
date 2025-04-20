import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
export class UmbracoMcpServer {
    static instance = null;
    constructor() { }
    static GetServer() {
        if (UmbracoMcpServer.instance === null) {
            UmbracoMcpServer.instance = new McpServer({
                name: "Umbraco Server",
                version: "1.0.0",
                capabilities: {
                    tools: {},
                },
            });
        }
        return UmbracoMcpServer.instance;
    }
}
