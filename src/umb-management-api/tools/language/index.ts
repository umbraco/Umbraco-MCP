import GetLanguageItemsTool from "./get/get-language-items.js";
import GetDefaultLanguageTool from "./get/get-default-language.js";
import GetLanguageByIsoCodeTool from "./get/get-language-by-iso-code.js";
import CreateLanguageTool from "./post/create-language.js";
import UpdateLanguageTool from "./put/update-language.js";
import DeleteLanguageTool from "./delete/delete-language.js";
import { CurrentUserResponseModel } from "@/umb-management-api/schemas/index.js";
import { ToolDefinition } from "types/tool-definition.js";
import { AuthorizationPolicies } from "@/helpers/umbraco-auth-policies.js";

export const LanguageTools = (user: CurrentUserResponseModel) => {
  const tools: ToolDefinition<any>[] = [];


  tools.push(GetLanguageItemsTool());
  tools.push(GetDefaultLanguageTool());


  if (AuthorizationPolicies.TreeAccessLanguages(user)) {

    tools.push(CreateLanguageTool());
    tools.push(UpdateLanguageTool());
    tools.push(DeleteLanguageTool());
    tools.push(GetLanguageByIsoCodeTool());
  }

  return tools;
}
