import GetDataTypeRootResource from "./get/get-root.js";
import GetDataTypeChildrenResource from "./get/get-children.js";
import GetDataTypeSearchResource from "./get/get-search.js";
import GetDataTypeAncestorsResource from "./get/get-ancestors.js";
import GetDataTypeQueryResource from "./get/get-query.js";
import GetDataTypeFolderResource from "./get/get-folder.js";
import GetDataTypeIsUsedResource from "./get/get-is-used.js";

export const DataTypeTemplateResources = [
  GetDataTypeRootResource,
  GetDataTypeChildrenResource,
  GetDataTypeSearchResource,
  GetDataTypeAncestorsResource,
  GetDataTypeQueryResource,
  GetDataTypeFolderResource,
  GetDataTypeIsUsedResource
];
