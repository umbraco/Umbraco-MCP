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
import { PartialViewTools } from "./partial-view/index.js";
import { PropertyTypeTools } from "./property-type/index.js";
import { TemplateTools } from "./template/index.js";
import { WebhookTools } from "./webhook/index.js";
import { ServerTools } from "./server/index.js";
import { RedirectTools } from "./redirect/index.js";
import { UserGroupTools } from "./user-group/index.js";
import { TemporaryFileTools } from "./temporary-file/index.js";
import { MediaTools } from "./media/index.js";
import { CurrentUserResponseModel } from "@/umb-management-api/schemas/index.js";
import { ToolDefinition } from "types/tool-definition.js";
import env from "@/helpers/env.js";

const mapTools = (server: McpServer,
  user: CurrentUserResponseModel,
  tools: ToolDefinition<any>[]) => {
  return tools.forEach(tool => {
    if ((tool.enabled === undefined || tool.enabled(user)) && !env.EXCLUDE_MANAGEMENT_TOOLS?.includes(tool.name)) {
      server.tool(tool.name, tool.description, tool.schema, tool.handler);
    }
  })
}

export function UmbracoToolFactory(server: McpServer, user: CurrentUserResponseModel) {
  mapTools(server, user, CultureTools(user));
  mapTools(server, user, DataTypeTools(user));
  mapTools(server, user, DictionaryTools(user));
  mapTools(server, user, DocumentBlueprintTools(user));
  mapTools(server, user, DocumentTypeTools(user));
  mapTools(server, user, DocumentTools(user));
  mapTools(server, user, MediaTools(user));
  mapTools(server, user, MediaTypeTools(user));
  mapTools(server, user, MemberGroupTools(user));
  mapTools(server, user, MemberTools(user));
  mapTools(server, user, MemberTypeTools(user));
  mapTools(server, user, LogViewerTools(user));
  mapTools(server, user, LanguageTools(user));
  mapTools(server, user, PartialViewTools(user));
  mapTools(server, user, PropertyTypeTools(user));
  mapTools(server, user, TemplateTools(user));
  mapTools(server, user, WebhookTools(user));
  mapTools(server, user, ServerTools(user));
  mapTools(server, user, RedirectTools(user));
  mapTools(server, user, UserGroupTools(user));
  mapTools(server, user, TemporaryFileTools(user));
}
