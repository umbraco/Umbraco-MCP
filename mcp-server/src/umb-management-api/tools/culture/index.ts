import { ToolDefinition } from "types/tool-definition.js";
import GetCulturesTool from "./get-cultures.js";

export const CultureTools = (): ToolDefinition<any>[] => [GetCulturesTool()];
