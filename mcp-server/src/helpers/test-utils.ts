import { BLANK_UUID } from "../tools/constants.js";

export function createSnapshotResult(result: any, idToReplace?: string) {
  if (!result?.content) {
    return result;
  }

  function normalizeItem(i: any) {
    const item = { ...i, id: BLANK_UUID };
    if (item.parent) {
      item.parent = { ...item.parent, id: BLANK_UUID };
    }
    if (item.createDate) {
      item.createDate = "NORMALIZED_DATE";
    }
    return item;
  }

  return {
    ...result,
    content: result.content.map((item: any) => {
      if (item.type === "text") {
        if (idToReplace) {
          // For single item responses
          let text = item.text.replace(idToReplace, BLANK_UUID);
          try {
            const parsed = JSON.parse(text);
            if (parsed.createDate) {
              parsed.createDate = "NORMALIZED_DATE";
            }
            text = JSON.stringify(parsed);
          } catch {}
          return {
            ...item,
            text
          };
        } else {
          // For list responses
          const parsed = JSON.parse(item.text);
          if (Array.isArray(parsed)) {
            // Handle ancestors API response
            return {
              ...item,
              text: JSON.stringify(parsed.map(normalizeItem))
            };
          }
          // Handle other list responses
          if (parsed.items) {
            parsed.items = parsed.items.map(normalizeItem);
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