import GetDocumentBlueprintTool from "./get/get-blueprint.js";
import DeleteDocumentBlueprintTool from "./delete/delete-blueprint.js";
import UpdateDocumentBlueprintTool from "./put/update-blueprint.js";
import CreateDocumentBlueprintTool from "./post/create-blueprint.js";
import GetDocumentBlueprintAncestorsTool from "./get/get-ancestors.js";
import GetDocumentBlueprintChildrenTool from "./get/get-children.js";
import GetDocumentBlueprintRootTool from "./get/get-root.js";
import { AuthorizationPolicies } from "@/helpers/umbraco-auth-policies.js";
import { CurrentUserResponseModel } from "@/umb-management-api/schemas/index.js";
import { ToolDefinition } from "types/tool-definition.js";

export const DocumentBlueprintTools = (user: CurrentUserResponseModel) => {
  const tools: ToolDefinition<any>[] = [];

  if (AuthorizationPolicies.TreeAccessDocumentTypes(user)) {

    tools.push(GetDocumentBlueprintTool());
    tools.push(DeleteDocumentBlueprintTool());
    tools.push(UpdateDocumentBlueprintTool());
    tools.push(CreateDocumentBlueprintTool());

    tools.push(GetDocumentBlueprintAncestorsTool());
    tools.push(GetDocumentBlueprintChildrenTool());
    tools.push(GetDocumentBlueprintRootTool());
  }

  return tools;
}