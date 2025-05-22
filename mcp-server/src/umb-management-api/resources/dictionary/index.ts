import GetDictionaryQueryResource from "./get/get-query.js";
import GetDictionaryItemResource from "./get/get-item.js";
import GetDictionaryRootResource from "./get/get-root.js";
import GetDictionaryChildrenResource from "./get/get-children.js";
import GetDictionaryAncestorsResource from "./get/get-ancestors.js";

export const DictionaryTemplateResources = [
  GetDictionaryQueryResource,
  GetDictionaryItemResource,
  GetDictionaryRootResource,
  GetDictionaryChildrenResource,
  GetDictionaryAncestorsResource,
]; 