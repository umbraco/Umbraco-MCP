import { DocumentTestHelper } from "./document-test-helper.js";
import { DocumentBuilder } from "./document-builder.js";
import { jest } from "@jest/globals";
import type { DocumentTreeItemResponseModel } from "../../../../api/umbraco/management/schemas/documentTreeItemResponseModel.js";
import { ROOT_DOCUMENT_TYPE_ID } from "../../../constants.js";
import { BLANK_UUID } from "../../../constants.js";

const TEST_DOCUMENT_NAME = "_Test DocumentHelper";

describe("DocumentTestHelper", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await DocumentTestHelper.cleanup(TEST_DOCUMENT_NAME);
  });

  it("normaliseIds should blank out id for single and array", async () => {
    const builder = await new DocumentBuilder()
      .withName(TEST_DOCUMENT_NAME)
      .withDocumentType(ROOT_DOCUMENT_TYPE_ID)
      .create();
    const item = builder.getCreatedItem();
    const normSingle = DocumentTestHelper.normaliseIds(item) as DocumentTreeItemResponseModel;
    expect(normSingle.id).toBe(BLANK_UUID);
    const normArray = DocumentTestHelper.normaliseIds([item]) as DocumentTreeItemResponseModel[];
    expect(normArray[0].id).toBe(BLANK_UUID);
  });

  it("getNameFromItem should return the name from the first variant", async () => {
    const builder = await new DocumentBuilder()
      .withName(TEST_DOCUMENT_NAME)
      .withDocumentType(ROOT_DOCUMENT_TYPE_ID)
      .create();
    const item = builder.getCreatedItem();
    expect(DocumentTestHelper.getNameFromItem(item)).toBe(TEST_DOCUMENT_NAME);
  });

  it("findDocument should find a document by variant name", async () => {
    const builder = await new DocumentBuilder()
      .withName(TEST_DOCUMENT_NAME)
      .withDocumentType(ROOT_DOCUMENT_TYPE_ID)
      .create();
    const found = await DocumentTestHelper.findDocument(TEST_DOCUMENT_NAME);
    expect(found).toBeDefined();
    expect(DocumentTestHelper.getNameFromItem(found!)).toBe(TEST_DOCUMENT_NAME);
  });

  it("cleanup should remove a document", async () => {
    const builder = await new DocumentBuilder()
      .withName(TEST_DOCUMENT_NAME)
      .withDocumentType(ROOT_DOCUMENT_TYPE_ID)
      .create();
    // Ensure it exists
    let found = await DocumentTestHelper.findDocument(TEST_DOCUMENT_NAME);
    expect(found).toBeDefined();
    // Cleanup
    await DocumentTestHelper.cleanup(TEST_DOCUMENT_NAME);
    // Should not be found after cleanup
    found = await DocumentTestHelper.findDocument(TEST_DOCUMENT_NAME);
    expect(found).toBeUndefined();
  });
}); 