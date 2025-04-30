import GetDocumentBlueprintTool from "../get/get-blueprint.js";
import { DocumentBlueprintVerificationHelper, BLANK_UUID } from "./helpers/document-blueprint-verification-helper.js";
import { jest } from "@jest/globals";

describe("get-document-blueprint", () => {
  const TEST_BLUEPRINT_NAME = "_Test Blueprint Get";
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await DocumentBlueprintVerificationHelper.cleanup(TEST_BLUEPRINT_NAME);
  });

  it("should get a document blueprint by id", async () => {
    // Create a blueprint to get
    const blueprint = await DocumentBlueprintVerificationHelper.createDocumentBlueprint(TEST_BLUEPRINT_NAME);
    expect(blueprint).toBeDefined();

    // Get the blueprint
    const result = await GetDocumentBlueprintTool().handler({
      id: blueprint!.id
    }, { signal: new AbortController().signal });

    // Normalize dates and IDs in the response
    const normalizedResult = {
      ...result,
      content: result.content.map(content => {
        const parsed = JSON.parse(content.text as string);
        return {
          ...content,
          text: JSON.stringify({
            ...parsed,
            id: BLANK_UUID,
            documentType: {
              ...parsed.documentType,
              id: BLANK_UUID
            },
            variants: parsed.variants.map((variant: any) => ({
              ...variant,
              createDate: "2000-01-01T00:00:00.000Z",
              updateDate: "2000-01-01T00:00:00.000Z"
            }))
          })
        };
      })
    };
    
    // Verify the handler response using snapshot
    expect(normalizedResult).toMatchSnapshot();
  });

  it("should handle non-existent document blueprint", async () => {
    const result = await GetDocumentBlueprintTool().handler({
      id: "00000000-0000-0000-0000-000000000000"
    }, { signal: new AbortController().signal });

    // Verify the error response using snapshot
    expect(result).toMatchSnapshot();
  });
}); 