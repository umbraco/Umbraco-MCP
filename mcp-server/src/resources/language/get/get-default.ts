import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoReadResource } from "@/helpers/create-umbraco-read-resource.js";

const GetLangagueDefaultResource = CreateUmbracoReadResource(
  "umbraco://item/langage/default",
  "List default language",
  "List the default language for the current Umbraco instance",
  async (uri) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.getItemLanguageDefault();
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify(response, null, 2),
          mimeType: "application/json"
        }]
      };
    } catch (error) {
      console.error('Error in GetItemLanguageDefault:', error);
      throw error;
    }
  }
);

export default GetLangagueDefaultResource;