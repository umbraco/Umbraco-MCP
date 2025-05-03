import { DocumentBuilder } from "./document-builder.js";
import { DocumentTestHelper } from "./document-test-helper.js";
import { jest } from "@jest/globals";
import { ROOT_DOCUMENT_TYPE_ID } from "../../../constants.js";

const TEST_DOCUMENT_NAME = "_Test DocumentBuilder";

describe("DocumentBuilder", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await DocumentTestHelper.cleanup(TEST_DOCUMENT_NAME);
  });

  it("should create a document and find it by name", async () => {
    const builder = await new DocumentBuilder()
      .withName(TEST_DOCUMENT_NAME)
      .withDocumentType(ROOT_DOCUMENT_TYPE_ID)
      .create();

    const found = await DocumentTestHelper.findDocument(TEST_DOCUMENT_NAME);
    expect(found).toBeDefined();
    expect(DocumentTestHelper.getNameFromItem(found)).toBe(TEST_DOCUMENT_NAME);
  });

  it("should return the created document's id and item", async () => {
    const builder = await new DocumentBuilder()
      .withName(TEST_DOCUMENT_NAME)
      .withDocumentType(ROOT_DOCUMENT_TYPE_ID)
      .create();

    const id = builder.getId();
    const item = builder.getCreatedItem();
    expect(id).toBeDefined();
    expect(item).toBeDefined();
    expect(DocumentTestHelper.getNameFromItem(item)).toBe(TEST_DOCUMENT_NAME);
  });
}); 