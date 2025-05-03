import { createSnapshotResult } from "../test-utils.js";
import { BLANK_UUID } from "../../tools/constants.js";

describe("createSnapshotResult", () => {
  const TEST_UUID = "12345678-1234-1234-1234-123456789012";

  describe("basic functionality", () => {
    it("should return the original result if no content is present", () => {
      // Arrange
      const input = { someOtherField: "value" };

      // Act
      const result = createSnapshotResult(input);

      // Assert
      expect(result).toEqual(input);
    });

    it("should handle non-text content items unchanged", () => {
      // Arrange
      const input = {
        content: [
          { type: "image", url: "test.jpg" }
        ]
      };

      // Act
      const result = createSnapshotResult(input);

      // Assert
      expect(result).toEqual(input);
    });
  });

  describe("single item responses", () => {
    it("should replace specified UUID in text content", () => {
      // Arrange
      const input = {
        content: [
          { 
            type: "text",
            text: `Some text with UUID: ${TEST_UUID}`
          }
        ]
      };

      // Act
      const result = createSnapshotResult(input, TEST_UUID);

      // Assert
      expect(result.content[0].text).toContain(BLANK_UUID);
      expect(result.content[0].text).not.toContain(TEST_UUID);
    });
  });

  describe("list responses", () => {
    it("should handle array responses with parent relationships", () => {
      // Arrange
      const input = {
        content: [
          {
            type: "text",
            text: JSON.stringify([
              {
                id: TEST_UUID,
                name: "Item 1",
                parent: { id: TEST_UUID, name: "Parent" }
              },
              {
                id: TEST_UUID,
                name: "Item 2",
                parent: null
              }
            ])
          }
        ]
      };

      // Act
      const result = createSnapshotResult(input);

      // Assert
      const parsed = JSON.parse(result.content[0].text);
      expect(parsed).toHaveLength(2);
      expect(parsed[0].id).toBe(BLANK_UUID);
      expect(parsed[0].parent.id).toBe(BLANK_UUID);
      expect(parsed[1].id).toBe(BLANK_UUID);
      expect(parsed[1].parent).toBeNull();
    });

    it("should handle items array in object responses", () => {
      // Arrange
      const input = {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              items: [
                {
                  id: TEST_UUID,
                  name: "Item 1",
                  parent: { id: TEST_UUID, name: "Parent" }
                },
                {
                  id: TEST_UUID,
                  name: "Item 2",
                  parent: null
                }
              ],
              totalItems: 2
            })
          }
        ]
      };

      // Act
      const result = createSnapshotResult(input);

      // Assert
      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.items).toHaveLength(2);
      expect(parsed.items[0].id).toBe(BLANK_UUID);
      expect(parsed.items[0].parent.id).toBe(BLANK_UUID);
      expect(parsed.items[1].id).toBe(BLANK_UUID);
      expect(parsed.items[1].parent).toBeNull();
      expect(parsed.totalItems).toBe(2);
    });
  });

  describe("error handling", () => {
    it("should handle invalid JSON in text content", () => {
      // Arrange
      const input = {
        content: [
          {
            type: "text",
            text: "Invalid JSON"
          }
        ]
      };

      // Act & Assert
      expect(() => createSnapshotResult(input)).toThrow();
    });
  });
}); 