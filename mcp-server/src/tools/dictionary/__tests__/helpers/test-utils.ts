import { BLANK_UUID } from "./dictionary-verification-helper.js";

export function createSnapshotResult(result: any, idToReplace?: string) {
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
          parsed.items = parsed.items.map((i: any) => ({
            ...i,
            id: BLANK_UUID
          }));
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