import { ToolDefinition } from "types/tool-definition.js";
import GetCulturesTool from "./get-cultures.js";
import { CurrentUserResponseModel } from "@/umb-management-api/schemas/index.js";

export const CultureTools = (user: CurrentUserResponseModel): ToolDefinition<any>[] => [GetCulturesTool()];
