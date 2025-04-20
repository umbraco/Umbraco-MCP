import { UmbracoManagementClient } from "../../clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "../../helpers/create-umbraco-tool.js";
import { z } from "zod";

const GetCulturesTool = CreateUmbracoTool(
  "get-culture",
  "Retrieves a paginated list of cultures that Umbraco can be configured to use",
  {
    skip: z.number().nonnegative().default(0),
    take: z.number().positive().default(100),
  },
  async ({ skip, take }) => {
    const client = UmbracoManagementClient.getClient();
    var response = await client.getCulture({ skip, take });
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(response),
        },
      ],
    };
  }
);

export default GetCulturesTool;
