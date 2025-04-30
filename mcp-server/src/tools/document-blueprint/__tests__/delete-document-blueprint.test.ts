import DeleteDocumentBlueprintTool from "../delete/delete-blueprint.js";
import { DocumentBlueprintVerificationHelper } from "./helpers/document-blueprint-verification-helper.js";
import { jest } from "@jest/globals";

describe("delete-document-blueprint", () => {
  const TEST_BLUEPRINT_NAME = "_Test Blueprint Delete";
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    // Clean up any remaining test blueprints
    await DocumentBlueprintVerificationHelper.cleanup(TEST_BLUEPRINT_NAME);
  });

  it("should delete a document blueprint", async () => {
    // Create a blueprint to delete
    const blueprint = await DocumentBlueprintVerificationHelper.createDocumentBlueprint(TEST_BLUEPRINT_NAME);
    expect(blueprint).toBeDefined();

    // Delete the blueprint
    const result = await DeleteDocumentBlueprintTool().handler({
      id: blueprint!.id
    }, { signal: new AbortController().signal });

    // Verify the handler response using snapshot
    expect(result).toMatchSnapshot();

    // Verify the blueprint no longer exists
    const found = await DocumentBlueprintVerificationHelper.findDocumentBlueprint(TEST_BLUEPRINT_NAME);
    expect(found).toBeUndefined();
  });

  it("should handle non-existent document blueprint", async () => {
    const result = await DeleteDocumentBlueprintTool().handler({
      id: "00000000-0000-0000-0000-000000000000"
    }, { signal: new AbortController().signal });

    // Verify the error response using snapshot
    expect(result).toMatchSnapshot();
  });
}); 