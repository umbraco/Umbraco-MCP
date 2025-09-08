import GetMemberTool from "./get/get-member.js";
import CreateMemberTool from "./post/create-member.js";
import DeleteMemberTool from "./delete/delete-member.js";
import UpdateMemberTool from "./put/update-member.js";
import FindMemberTool from "./get/find-member.js";
import { CurrentUserResponseModel } from "@/umb-management-api/schemas/index.js";
import { AuthorizationPolicies } from "@/helpers/auth/umbraco-auth-policies.js";
import { ToolDefinition } from "types/tool-definition.js";
import { ToolCollectionExport } from "types/tool-collection.js";

export const MemberCollection: ToolCollectionExport = {
  metadata: {
    name: 'member',
    displayName: 'Members',
    description: 'Member account management and administration',
    dependencies: []
  },
  tools: (user: CurrentUserResponseModel) => {
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
};

// Backwards compatibility export
export const MemberTools = (user: CurrentUserResponseModel) => {
  return MemberCollection.tools(user);
}; 