import GetMemberTool from "./get/get-member.js";
import CreateMemberTool from "./post/create-member.js";
import DeleteMemberTool from "./delete/delete-member.js";
import UpdateMemberTool from "./put/update-member.js";
import FindMemberTool from "./get/find-member.js";
import { CurrentUserResponseModel } from "@/umb-management-api/schemas/index.js";
import { AuthorizationPolicies } from "@/helpers/umbraco-auth-policies.js";
import { ToolDefinition } from "types/tool-definition.js";

export const MemberTools = (user: CurrentUserResponseModel) => {
  const tools: ToolDefinition<any>[] = [];
  if (AuthorizationPolicies.SectionAccessMembers(user)) {

    tools.push(GetMemberTool());
    tools.push(CreateMemberTool());
    tools.push(DeleteMemberTool());
    tools.push(UpdateMemberTool());
  }
  tools.push(FindMemberTool());

  return tools;
} 