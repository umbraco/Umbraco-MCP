import { UmbracoManagementClient } from "@umb-management-client";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import {
  getDocumentByIdAuditLogParams,
  getDocumentByIdAuditLogQueryParams,
} from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { z } from "zod";
import { CurrentUserResponseModel } from "@/umb-management-api/schemas/index.js";

const GetDocumentAuditLogTool = CreateUmbracoTool(
  "get-document-audit-log",
  "Fetches the audit log for a document by Id.",
  {
    id: getDocumentByIdAuditLogParams.shape.id,
    data: z.object(getDocumentByIdAuditLogQueryParams.shape),
  },
  async (model: { id: string; data: any }) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getDocumentByIdAuditLog(model.id, model.data);
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(response),
        },
      ],
    };
  },
  (user: CurrentUserResponseModel) => user.fallbackPermissions.includes("Umb.Document.Read")
);

export default GetDocumentAuditLogTool;
