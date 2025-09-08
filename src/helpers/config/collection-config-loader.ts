import env from "./env.js";
import { CollectionConfiguration, DEFAULT_COLLECTION_CONFIG } from "../../types/collection-configuration.js";

export class CollectionConfigLoader {
  static loadFromEnv(): CollectionConfiguration {
    return {
      enabledCollections: env.INCLUDE_MANAGEMENT_COLLECTIONS ?? DEFAULT_COLLECTION_CONFIG.enabledCollections,
      disabledCollections: env.EXCLUDE_MANAGEMENT_COLLECTIONS ?? DEFAULT_COLLECTION_CONFIG.disabledCollections,
      enabledTools: env.INCLUDE_MANAGEMENT_TOOLS ?? DEFAULT_COLLECTION_CONFIG.enabledTools,
      disabledTools: env.EXCLUDE_MANAGEMENT_TOOLS ?? DEFAULT_COLLECTION_CONFIG.disabledTools,
    };
  }
}