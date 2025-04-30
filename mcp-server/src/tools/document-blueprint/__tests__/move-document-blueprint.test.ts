import MoveDocumentBlueprintTool from "../put/move-blueprint.js";
import { DocumentBlueprintTestHelper } from "./helpers/document-blueprint-test-helper.js";
import { jest } from "@jest/globals";

describe("move-document-blueprint", () => {
  const TEST_BLUEPRINT_NAME = "_Test Blueprint Move";
  const TEST_FOLDER_NAME = "_Test Folder";
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    // Clean up any test blueprints
    await DocumentBlueprintTestHelper.cleanup(TEST_BLUEPRINT_NAME);
    await DocumentBlueprintTestHelper.cleanup(TEST_FOLDER_NAME);
  });

  it("should move a document blueprint", async () => {
    // Create a folder
    const folder = await DocumentBlueprintTestHelper.createDocumentBlueprintFolder(TEST_FOLDER_NAME);
    expect(folder).toBeDefined();

    // Create a blueprint to move
    const blueprint = await DocumentBlueprintTestHelper.createDocumentBlueprint(TEST_BLUEPRINT_NAME);
    expect(blueprint).toBeDefined();

    // Move the blueprint
    const result = await MoveDocumentBlueprintTool().handler({
      id: blueprint!.id,
      data: {
        target: {
          id: folder!.id
        }
      }
    }, { signal: new AbortController().signal });

    // Verify the handler response using snapshot
    expect(result).toMatchSnapshot();

    // Verify the blueprint was moved
    const found = await DocumentBlueprintTestHelper.findDocumentBlueprint(TEST_BLUEPRINT_NAME);
    expect(found).toBeDefined();
    expect(found!.id).toBe(blueprint!.id);
  });

  it("should handle moving to non-existent folder", async () => {
    // Create a blueprint to move
    const blueprint = await DocumentBlueprintTestHelper.createDocumentBlueprint(TEST_BLUEPRINT_NAME);
    expect(blueprint).toBeDefined();

    const result = await MoveDocumentBlueprintTool().handler({
      id: blueprint!.id,
      data: {
        target: {
          id: "00000000-0000-0000-0000-000000000000"
        }
      }
    }, { signal: new AbortController().signal });

    // Verify the error response using snapshot
    expect(result).toMatchSnapshot();
  });

  it("should handle moving non-existent blueprint", async () => {
    const result = await MoveDocumentBlueprintTool().handler({
      id: "00000000-0000-0000-0000-000000000000",
      data: {
        target: {
          id: "00000000-0000-0000-0000-000000000000"
        }
      }
    }, { signal: new AbortController().signal });

    // Verify the error response using snapshot
    expect(result).toMatchSnapshot();
  });
}); 