import { DocumentBlueprintVerificationHelper } from "./helpers/document-blueprint-verification-helper.js";
import CreateDocumentBlueprintFolderTool from "../folders/post/create-folder.js";
import DeleteDocumentBlueprintFolderTool from "../folders/delete/delete-folder.js";
import UpdateDocumentBlueprintFolderTool from "../folders/put/update-folder.js";
import { createSnapshotResult } from "@/helpers/test-utils.js";
import { jest } from "@jest/globals";

describe("document-blueprint-folder", () => {
  const TEST_FOLDER_NAME = "_Test Blueprint Folder";
  const TEST_PARENT_FOLDER_NAME = "_Test Parent Folder";
  const UPDATED_FOLDER_NAME = "_Updated Folder Name";
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await DocumentBlueprintVerificationHelper.cleanup(TEST_FOLDER_NAME);
    await DocumentBlueprintVerificationHelper.cleanup(TEST_PARENT_FOLDER_NAME);
    await DocumentBlueprintVerificationHelper.cleanup(UPDATED_FOLDER_NAME);
  });

  describe("create", () => {
    it("should create a folder", async () => {
      const result = await CreateDocumentBlueprintFolderTool().handler({
        name: TEST_FOLDER_NAME
      }, { signal: new AbortController().signal });

      expect(createSnapshotResult(result)).toMatchSnapshot();

      // Verify folder exists
      const found = await DocumentBlueprintVerificationHelper.findDocumentBlueprint(TEST_FOLDER_NAME);
      expect(found).toBeDefined();
      expect(found!.isFolder).toBe(true);
    });

    it("should create a folder with parent", async () => {
      // Create parent folder
      const parent = await DocumentBlueprintVerificationHelper.createDocumentBlueprintFolder(TEST_PARENT_FOLDER_NAME);
      expect(parent).toBeDefined();

      const result = await CreateDocumentBlueprintFolderTool().handler({
        name: TEST_FOLDER_NAME,
        parent: { id: parent!.id }
      }, { signal: new AbortController().signal });

      expect(createSnapshotResult(result)).toMatchSnapshot();

      // Verify folder exists under parent
      const found = await DocumentBlueprintVerificationHelper.findDocumentBlueprint(TEST_FOLDER_NAME);
      expect(found).toBeDefined();
      expect(found!.isFolder).toBe(true);
    });
  });

  describe("update", () => {
    it("should update a folder name", async () => {
      // Create folder to update
      const folder = await DocumentBlueprintVerificationHelper.createDocumentBlueprintFolder(TEST_FOLDER_NAME);
      expect(folder).toBeDefined();

      const result = await UpdateDocumentBlueprintFolderTool().handler({
        id: folder!.id,
        data: {
          name: UPDATED_FOLDER_NAME
        }
      }, { signal: new AbortController().signal });

      expect(result).toMatchSnapshot();

      // Verify folder was updated
      const found = await DocumentBlueprintVerificationHelper.findDocumentBlueprint(UPDATED_FOLDER_NAME);
      expect(found).toBeDefined();
      expect(found!.name).toBe(UPDATED_FOLDER_NAME);
    });

    it("should handle non-existent folder", async () => {
      const result = await UpdateDocumentBlueprintFolderTool().handler({
        id: "00000000-0000-0000-0000-000000000000",
        data: {
          name: UPDATED_FOLDER_NAME
        }
      }, { signal: new AbortController().signal });

      expect(result).toMatchSnapshot();
    });
  });

  describe("delete", () => {
    it("should delete a folder", async () => {
      // Create folder to delete
      const folder = await DocumentBlueprintVerificationHelper.createDocumentBlueprintFolder(TEST_FOLDER_NAME);
      expect(folder).toBeDefined();

      const result = await DeleteDocumentBlueprintFolderTool().handler({
        id: folder!.id
      }, { signal: new AbortController().signal });

      expect(createSnapshotResult(result)).toMatchSnapshot();

      // Verify folder was deleted
      const found = await DocumentBlueprintVerificationHelper.findDocumentBlueprint(TEST_FOLDER_NAME);
      expect(found).toBeUndefined();
    });

    it("should handle non-existent folder", async () => {
      const result = await DeleteDocumentBlueprintFolderTool().handler({
        id: "00000000-0000-0000-0000-000000000000"
      }, { signal: new AbortController().signal });

      expect(result).toMatchSnapshot();
    });
  });
}); 