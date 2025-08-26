import { ToolDefinition } from "types/tool-definition.js";
import GetPropertyTypeIsUsedTool from "./get/get-property-type-is-used.js";
import { CurrentUserResponseModel } from "@/umb-management-api/schemas/index.js";

export const PropertyTypeTools = (user: CurrentUserResponseModel) => {
    const tools: ToolDefinition<any>[] = [GetPropertyTypeIsUsedTool()];
    return tools
}
