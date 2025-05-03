import { BLANK_UUID } from "../tools/constants.js";

export function createSnapshotResult(result: any, idToReplace?: string) {
  if (!result?.content) {
    return result;
  }

  return {
    ...result,
    content: result.content.map((item: any) => {
      if (item.type === "text") {
        if (idToReplace) {
          // For single item responses
          return {
            ...item,
            text: item.text.replace(idToReplace, BLANK_UUID)
          };
        } else {
          // For list responses
          const parsed = JSON.parse(item.text);
          if (Array.isArray(parsed)) {
            // Handle ancestors API response
            return {
              ...item,
              text: JSON.stringify(parsed.map((i: any) => ({
                ...i,
                id: BLANK_UUID,
                parent: i.parent ? { ...i.parent, id: BLANK_UUID } : null
              })))
            };
          }
          // Handle other list responses
          if (parsed.items) {
            parsed.items = parsed.items.map((i: any) => {
              const item = { ...i, id: BLANK_UUID };
              if (item.parent) {
                item.parent = { ...item.parent, id: BLANK_UUID };
              }
              return item;
            });
          }
          return {
            ...item,
            text: JSON.stringify(parsed)
          };
        }
      }
      return item;
    })
  };
} 