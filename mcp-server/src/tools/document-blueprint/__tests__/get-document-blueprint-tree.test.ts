import { DocumentBlueprintTestHelper } from "./helpers/document-blueprint-test-helper.js";
import GetDocumentBlueprintAncestorsTreeTool from "../get/get-ancestors.js";
import GetDocumentBlueprintChildrenTreeTool from "../get/get-children.js";
import GetDocumentBlueprintRootTreeTool from "../get/get-root.js";
import { createSnapshotResult } from "@/helpers/test-utils.js";
import { jest } from "@jest/globals";

describe("document-blueprint-tree", () => {
  const TEST_ROOT_NAME = "_Test Root Blueprint";
  const TEST_FOLDER_NAME = "_Test Folder Blueprint";
  const TEST_CHILD_NAME = "_Test Child Blueprint";
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await DocumentBlueprintTestHelper.cleanup(TEST_ROOT_NAME);
    await DocumentBlueprintTestHelper.cleanup(TEST_CHILD_NAME);
    await DocumentBlueprintTestHelper.cleanup(TEST_FOLDER_NAME);
  });

  //can't test root as it will change throughout testing

  describe("children", () => {
    it("should get child items", async () => {
      // Create parent folder
      const folder = await DocumentBlueprintTestHelper.createDocumentBlueprintFolder(TEST_FOLDER_NAME);
      expect(folder).toBeDefined();

      // Create child blueprint
      const child = await DocumentBlueprintTestHelper.createDocumentBlueprint(TEST_CHILD_NAME, folder!.id);
      expect(child).toBeDefined();

      const result = await GetDocumentBlueprintChildrenTreeTool().handler({
        take: 100,
        parentId: folder!.id
      }, { signal: new AbortController().signal });

      // Normalize and verify response
      const normalizedItems = createSnapshotResult(result);
      expect(normalizedItems).toMatchSnapshot();
    });

    it("should handle non-existent parent", async () => {
      const result = await GetDocumentBlueprintChildrenTreeTool().handler({
        take: 100,
        parentId: "00000000-0000-0000-0000-000000000000"
      }, { signal: new AbortController().signal });

      expect(result).toMatchSnapshot();
    });
  });

  describe("ancestors", () => {
    it("should get ancestor items", async () => {
      // Create folder structure
      const folder = await DocumentBlueprintTestHelper.createDocumentBlueprintFolder(TEST_FOLDER_NAME);
      expect(folder).toBeDefined();

      const child = await DocumentBlueprintTestHelper.createDocumentBlueprint(TEST_CHILD_NAME, folder!.id);
      expect(child).toBeDefined();

      const result = await GetDocumentBlueprintAncestorsTreeTool().handler({
        descendantId: child!.id
      }, { signal: new AbortController().signal });

      // Normalize and verify response
      const normalizedItems = createSnapshotResult(result);
      expect(normalizedItems).toMatchSnapshot();
    });

    it("should handle non-existent item", async () => {
      const result = await GetDocumentBlueprintAncestorsTreeTool().handler({
        descendantId: "00000000-0000-0000-0000-000000000000"
      }, { signal: new AbortController().signal });

      expect(result).toMatchSnapshot();
    });
  });
}); 