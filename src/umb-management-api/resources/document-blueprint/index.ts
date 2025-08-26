import GetDocumentBlueprintResource from "./get/get-blueprint.js";
import GetDocumentBlueprintFolderResource from "./get/get-folder.js";
import GetDocumentBlueprintAncestorsResource from "./get/get-ancestors.js";
import GetDocumentBlueprintChildrenResource from "./get/get-children.js";
import GetDocumentBlueprintQueryResource from "./get/get-query.js";

export const DocumentBlueprintTemplateResources = [
  GetDocumentBlueprintResource,
  GetDocumentBlueprintFolderResource,
  GetDocumentBlueprintAncestorsResource,
  GetDocumentBlueprintChildrenResource,
  GetDocumentBlueprintQueryResource,
]; 