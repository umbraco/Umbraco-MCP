import env from "./env.js";
import { CollectionConfiguration, DEFAULT_COLLECTION_CONFIG } from "../../types/collection-configuration.js";

export class CollectionConfigLoader {
  static loadFromEnv(): CollectionConfiguration {
    return {
      enabledCollections: env.UMBRACO_INCLUDE_TOOL_COLLECTIONS ?? DEFAULT_COLLECTION_CONFIG.enabledCollections,
      disabledCollections: env.UMBRACO_EXCLUDE_TOOL_COLLECTIONS ?? DEFAULT_COLLECTION_CONFIG.disabledCollections,
      enabledTools: env.UMBRACO_INCLUDE_TOOLS ?? DEFAULT_COLLECTION_CONFIG.enabledTools,
      disabledTools: env.UMBRACO_EXCLUDE_TOOLS ?? DEFAULT_COLLECTION_CONFIG.disabledTools,
    };
  }
}