import { UmbracoManagementClient } from "@umb-management-client";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { postDocumentBlueprintBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { CurrentUserResponseModel } from "@/umb-management-api/schemas/index.js";

const CreateDocumentBlueprintTool = CreateUmbracoTool(
  "create-document-blueprint",
  "Creates a new document blueprint",
  postDocumentBlueprintBody.shape,
  async (model) => {
    const client = UmbracoManagementClient.getClient();
    var response = await client.postDocumentBlueprint(model);
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(response),
        },
      ],
    };
  },
  (user: CurrentUserResponseModel) => user.fallbackPermissions.includes("Umb.Document.CreateBlueprint")
);

export default CreateDocumentBlueprintTool;
