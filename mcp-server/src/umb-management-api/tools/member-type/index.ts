import CreateMemberTypeTool from "./post/create-member-type.js";
import GetMemberTypesByIdArrayTool from "./get/get-member-type-by-id-array.js";
import GetMemberTypeByIdTool from "./get/get-member-type-by-id.js";
import DeleteMemberTypeTool from "./delete/delete-member-type.js";
import UpdateMemberTypeTool from "./put/update-member-type.js";
import CopyMemberTypeTool from "./post/copy-member-type.js";
import GetMemberTypeAvailableCompositionsTool from "./post/get-member-type-available-compositions.js";
import GetMemberTypeCompositionReferencesTool from "./get/get-member-type-composition-references.js";
import GetMemberTypeConfigurationTool from "./get/get-member-type-configuration.js";
import GetMemberTypeRootTool from "./items/get/get-root.js";
import { CurrentUserResponseModel } from "@/umb-management-api/schemas/index.js";
import { ToolDefinition } from "types/tool-definition.js";
import { AuthorizationPolicies } from "@/helpers/umbraco-auth-policies.js";

export const MemberTypeTools = (user: CurrentUserResponseModel) => {
  const tools: ToolDefinition<any>[] = [];

  tools.push(GetMemberTypeByIdTool());

  if (AuthorizationPolicies.TreeAccessMembersOrMemberTypes(user)) {

    tools.push(CreateMemberTypeTool());
    tools.push(GetMemberTypesByIdArrayTool());
    tools.push(DeleteMemberTypeTool());
    tools.push(UpdateMemberTypeTool());
    tools.push(CopyMemberTypeTool());
    tools.push(GetMemberTypeAvailableCompositionsTool());
    tools.push(GetMemberTypeCompositionReferencesTool());
    tools.push(GetMemberTypeConfigurationTool());
    tools.push(GetMemberTypeRootTool());
  }

  return tools;
} 