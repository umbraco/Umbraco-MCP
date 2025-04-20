import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { CultureTools } from "./culture/index.js";
import { DataTypeTools } from "./data-types/index.js";

export function ToolFactory(server: McpServer) {
  CultureTools.map((tool) => tool()).forEach((tool) =>
    server.tool(tool.name, tool.description, tool.schema, tool.handler)
  );
  DataTypeTools.map((tool) => tool()).forEach((tool) =>
    server.tool(tool.name, tool.description, tool.schema, tool.handler)
  );
}
