import DeleteDictionaryItemTool from "./delete/delete-dictionary-item.js";
import FindDictionaryItemTool from "./get/find-dictionary-item.js";
import GetDictionaryItemTool from "./get/get-dictionary-item.js";
import CreateDictionaryItemTool from "./post/create-dictionary-item.js";
import UpdateDictionaryItemTool from "./put/update-dictionary-item.js";

export const DictionaryTools = [
  GetDictionaryItemTool,
  FindDictionaryItemTool,
  CreateDictionaryItemTool,
  DeleteDictionaryItemTool,
  UpdateDictionaryItemTool
];
