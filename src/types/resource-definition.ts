import { ReadResourceCallback } from "@modelcontextprotocol/sdk/server/mcp.js";

export interface ResourceDefinition {
  name: string;
  description: string;
  uri: string;
  handler: ReadResourceCallback;
}
