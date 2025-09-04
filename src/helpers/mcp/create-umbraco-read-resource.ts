import { ReadResourceCallback } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ResourceDefinition } from "../../types/resource-definition.js";

export const CreateUmbracoReadResource =
  (
    uri: string,
    name: string,
    description: string,
    handler: ReadResourceCallback
  ): (() => ResourceDefinition) =>
    () => ({
      uri,
      name,
      description,
      handler
    });