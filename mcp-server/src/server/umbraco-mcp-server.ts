import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export class UmbracoMcpServer {
  private static instance: McpServer | null = null;

  private constructor() {}

  public static GetServer(): McpServer {
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
