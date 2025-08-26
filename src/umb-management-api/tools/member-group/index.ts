import GetMemberGroupTool from "./get/get-member-group.js";
import GetMemberGroupByIdArrayTool from "./get/get-member-group-by-id-array.js";
import GetMemberGroupRootTool from "./get/get-root.js";
import CreateMemberGroupTool from "./post/create-member-group.js";
import UpdateMemberGroupTool from "./put/update-member-group.js";
import DeleteMemberGroupTool from "./delete/delete-member-group.js";
import { CurrentUserResponseModel } from "@/umb-management-api/schemas/index.js";
import { ToolDefinition } from "types/tool-definition.js";
import { AuthorizationPolicies } from "@/helpers/umbraco-auth-policies.js";

export const MemberGroupTools = (user: CurrentUserResponseModel) => {

  const tools: ToolDefinition<any>[] = [];

  tools.push(GetMemberGroupTool());
  tools.push(GetMemberGroupByIdArrayTool());

  if (AuthorizationPolicies.SectionAccessMembers(user)) {

    tools.push(CreateMemberGroupTool());
    tools.push(UpdateMemberGroupTool());
    tools.push(DeleteMemberGroupTool());
  }

  if (AuthorizationPolicies.TreeAccessMemberGroups(user)) {

    tools.push(GetMemberGroupRootTool());
  }

  return tools;
}