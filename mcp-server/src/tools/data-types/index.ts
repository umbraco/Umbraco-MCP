import GetDataTypeRootTool from "./get/get-root.js";
import CreateDataTypeTool from "./post/create-data-type.js";
import DeleteDataTypeTool from "./delete/delete-data-type.js";
import FindDataTypeTool from "./get/find-data-type.js";
import GetDataTypeTool from "./get/get-data-type.js";
import UpdateDataTypeTool from "./put/update-data-type.js";
import CopyDataTypeTool from "./post/copy-data-type.js";
import IsUsedDataTypeTool from "./get/is-used-data-type.js";
import MoveDataTypeTool from "./put/move-data-type.js";
import GetReferencesDataTypeTool from "./get/get-references-data-type.js";
import CreateDataTypeFolderTool from "./folders/post/create-folder.js";
import DeleteDataTypeFolderTool from "./folders/delete/delete-folder.js";
import GetDataTypeFolderTool from "./folders/get/get-folder.js";

export const DataTypeTools = [
  GetDataTypeRootTool,
  CreateDataTypeTool,
  DeleteDataTypeTool,
  FindDataTypeTool,
  GetDataTypeTool,
  UpdateDataTypeTool,
  CopyDataTypeTool,
  IsUsedDataTypeTool,
  MoveDataTypeTool,
  GetReferencesDataTypeTool,
  CreateDataTypeFolderTool,
  DeleteDataTypeFolderTool,
  GetDataTypeFolderTool,
];
