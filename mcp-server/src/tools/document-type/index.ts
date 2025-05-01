import CreateDocumentTypeTool from "./post/create-document-type.js";
import DeleteDocumentTypeTool from "./delete/delete-document-type.js";
import GetDocumentTypeTool from "./get/get-document-type.js";
import UpdateDocumentTypeTool from "./put/update-document-type.js";
import CopyDocumentTypeTool from "./post/copy-document-type.js";
import MoveDocumentTypeTool from "./put/move-document-type.js";
import GetDocumentTypeRootTool from "./items/get/get-root.js";
import GetDocumentTypeChildrenTool from "./items/get/get-children.js";
import GetDocumentTypeAncestorsTool from "./items/get/get-ancestors.js";
import CreateDocumentTypeFolderTool from "./folders/post/create-folder.js";
import DeleteDocumentTypeFolderTool from "./folders/delete/delete-folder.js";
import GetDocumentTypeFolderTool from "./folders/get/get-folder.js";
import UpdateDocumentTypeFolderTool from "./folders/put/update-folder.js";
import GetDocumentTypeBlueprintTool from "./get/get-document-type-blueprint.js";
import GetDocumentTypeCompositionReferencesTool from "./get/get-document-type-composition-references.js";
import GetDocumentTypeAvailableCompositionsTool from "./post/get-document-type-available-compositions.js";

export const DocumentTypeTools = [
  CreateDocumentTypeTool,
  DeleteDocumentTypeTool,
  GetDocumentTypeTool,
  UpdateDocumentTypeTool,
  CopyDocumentTypeTool,
  MoveDocumentTypeTool,
  GetDocumentTypeRootTool,
  GetDocumentTypeChildrenTool,
  GetDocumentTypeAncestorsTool,
  CreateDocumentTypeFolderTool,
  DeleteDocumentTypeFolderTool,
  GetDocumentTypeFolderTool,
  UpdateDocumentTypeFolderTool,
  GetDocumentTypeBlueprintTool,
  GetDocumentTypeCompositionReferencesTool,
  GetDocumentTypeAvailableCompositionsTool
]; 