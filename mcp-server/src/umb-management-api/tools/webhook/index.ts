import GetWebhookByIdTool from "./get/get-webhook-by-id.js";
import GetWebhookItemTool from "./get/get-webhook-by-id-array.js";
import DeleteWebhookTool from "./delete/delete-webhook.js";
import UpdateWebhookTool from "./put/update-webhook.js";
import GetWebhookEventsTool from "./get/get-webhook-events.js";
import GetAllWebhookLogsTool from "./get/get-all-webhook-logs.js";
import CreateWebhookTool from "./post/create-webhook.js";
import { CurrentUserResponseModel } from "@/umb-management-api/schemas/index.js";
import { ToolDefinition } from "types/tool-definition.js";
import { AuthorizationPolicies } from "@/helpers/umbraco-auth-policies.js";

export const WebhookTools = (user: CurrentUserResponseModel) => {
  const tools: ToolDefinition<any>[] = [];

  if (AuthorizationPolicies.TreeAccessWebhooks(user)) {

    tools.push(GetWebhookItemTool());

    tools.push(CreateWebhookTool());
    tools.push(GetWebhookByIdTool());
    tools.push(DeleteWebhookTool());
    tools.push(UpdateWebhookTool());
    tools.push(GetWebhookEventsTool());
    tools.push(GetAllWebhookLogsTool());
  }

  return tools;
};