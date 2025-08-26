import DeleteDictionaryItemTool from "./delete/delete-dictionary-item.js";
import FindDictionaryItemTool from "./get/find-dictionary-item.js";
import GetDictionaryItemTool from "./get/get-dictionary-item.js";
import CreateDictionaryItemTool from "./post/create-dictionary-item.js";
import UpdateDictionaryItemTool from "./put/update-dictionary-item.js";
import MoveDictionaryItemTool from "./put/move-dictionary-item.js";
import GetDictionaryRootTool from "./items/get/get-root.js";
import GetDictionaryChildrenTool from "./items/get/get-children.js";
import GetDictionaryAncestorsTool from "./items/get/get-ancestors.js";
import { AuthorizationPolicies } from "@/helpers/umbraco-auth-policies.js";
import { CurrentUserResponseModel } from "@/umb-management-api/schemas/index.js";
import { ToolDefinition } from "types/tool-definition.js";

export const DictionaryTools = (user: CurrentUserResponseModel) => {

  const tools: ToolDefinition<any>[] = [FindDictionaryItemTool()];
  if (AuthorizationPolicies.TreeAccessDictionary(user)) {
    tools.push(CreateDictionaryItemTool());
    tools.push(GetDictionaryItemTool());
    tools.push(DeleteDictionaryItemTool());
    tools.push(UpdateDictionaryItemTool());
    tools.push(MoveDictionaryItemTool());
  }

  if (AuthorizationPolicies.TreeAccessDictionaryOrTemplates(user)) {
    tools.push(GetDictionaryRootTool());
    tools.push(GetDictionaryChildrenTool());
    tools.push(GetDictionaryAncestorsTool());
  }

  return tools
};
