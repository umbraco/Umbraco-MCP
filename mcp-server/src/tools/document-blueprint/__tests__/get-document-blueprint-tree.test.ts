import { DocumentBlueprintVerificationHelper } from "./helpers/document-blueprint-verification-helper.js";
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
    await DocumentBlueprintVerificationHelper.cleanup(TEST_ROOT_NAME);
    await DocumentBlueprintVerificationHelper.cleanup(TEST_FOLDER_NAME);
    await DocumentBlueprintVerificationHelper.cleanup(TEST_CHILD_NAME);
  });

  describe("root", () => {
    it("should get root items", async () => {
      // Create a root blueprint
      const root = await DocumentBlueprintVerificationHelper.createDocumentBlueprint(TEST_ROOT_NAME);
      expect(root).toBeDefined();

      const result = await GetDocumentBlueprintRootTreeTool().handler({
        take: 100
      }, { 
        signal: new AbortController().signal 
      });

      // Normalize and verify response
      const normalizedItems = createSnapshotResult(result);
      expect(normalizedItems).toMatchSnapshot();
    });
  });

  describe("children", () => {
    it("should get child items", async () => {
      // Create parent folder
      const folder = await DocumentBlueprintVerificationHelper.createDocumentBlueprintFolder(TEST_FOLDER_NAME);
      expect(folder).toBeDefined();

      // Create child blueprint
      const child = await DocumentBlueprintVerificationHelper.createDocumentBlueprint(TEST_CHILD_NAME, folder!.id);
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
      const folder = await DocumentBlueprintVerificationHelper.createDocumentBlueprintFolder(TEST_FOLDER_NAME);
      expect(folder).toBeDefined();

      const child = await DocumentBlueprintVerificationHelper.createDocumentBlueprint(TEST_CHILD_NAME, folder!.id);
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