import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { CultureTools } from "./culture/index.js";
import { DataTypeTools } from "./data-type/index.js";
import { DictionaryTools } from "./dictionary/index.js";
import { DocumentTypeTools } from "./document-type/index.js";
import { DocumentBlueprintTools } from "./document-blueprint/index.js";
import { DocumentTools } from "./document/index.js";
import { MemberGroupTools } from "./member-group/index.js";
import { MediaTypeTools } from "./media-type/index.js";
import { MemberTypeTools } from "./member-type/index.js";
import { MemberTools } from "./member/index.js";
import { LogViewerTools } from "./log-viewer/index.js";
import { LanguageTools } from "./language/index.js";
import { PropertyTypeTools } from "./property-type/index.js";
import { WebhookTools } from "./webhook/index.js";
import { ServerTools } from "./server/index.js";
import { RedirectTools } from "./redirect/index.js";
import { UserGroupTools } from "./user-group/index.js";
import { TemporaryFileTools } from "./temporary-file/index.js";
import { MediaTools } from "./media/index.js";
import { CurrentUserResponseModel } from "@/umb-management-api/schemas/index.js";
import { ToolDefinition } from "types/tool-definition.js";


const mapTools = (server: McpServer,
  user: CurrentUserResponseModel,
  tools: ToolDefinition<any>[]) => {
  return tools.forEach(tool => {
    if (tool.enabled === undefined || tool.enabled(user)) {
      server.tool(tool.name, tool.description, tool.schema, tool.handler);
    }
  })
}

export function UmbracoToolFactory(server: McpServer, user: CurrentUserResponseModel) {
  mapTools(server, user, CultureTools());
  mapTools(server, user, DataTypeTools(user));
  mapTools(server, user, DictionaryTools(user));
  mapTools(server, user, DocumentBlueprintTools(user));
  mapTools(server, user, DocumentTypeTools(user));
  mapTools(server, user, DocumentTools(user));
  mapTools(server, user, MediaTypeTools);
  mapTools(server, user, MemberGroupTools);
  mapTools(server, user, MemberTools);
  mapTools(server, user, LogViewerTools);
  mapTools(server, user, LanguageTools);
  mapTools(server, user, PropertyTypeTools);
  mapTools(server, user, MemberTypeTools);
  mapTools(server, user, WebhookTools);
  mapTools(server, user, ServerTools);
  mapTools(server, user, RedirectTools);
  mapTools(server, user, UserGroupTools);
  mapTools(server, user, TemporaryFileTools);
  mapTools(server, user, MediaTools);
}
