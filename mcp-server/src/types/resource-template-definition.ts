import { ResourceTemplate, ReadResourceTemplateCallback } from "@modelcontextprotocol/sdk/server/mcp.js";


export interface ResourceTemplateDefinition {
  name: string;
  description: string;
  template: ResourceTemplate;
  handler: ReadResourceTemplateCallback;
}
