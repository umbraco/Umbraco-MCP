import { DocumentBuilder } from "./document-builder.js";
import { DocumentTestHelper } from "./document-test-helper.js";
import { jest } from "@jest/globals";

const TEST_DOCUMENT_NAME = "_Test DocumentBuilder";
const TEST_RECYCLE_BIN_DOCUMENT_NAME = "_Test DocumentBuilder RecycleBin";
const TEST_PUBLISHED_DOCUMENT_NAME = "_Test DocumentBuilder Published";
describe("DocumentBuilder", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await DocumentTestHelper.cleanup(TEST_DOCUMENT_NAME);
    await DocumentTestHelper.cleanup(TEST_RECYCLE_BIN_DOCUMENT_NAME);
    await DocumentTestHelper.cleanup(TEST_PUBLISHED_DOCUMENT_NAME);
  });

  it("should create a document and find it by name", async () => {
    const builder = await new DocumentBuilder()
      .withName(TEST_DOCUMENT_NAME)
      .withRootDocumentType()
      .create();

    const found = await DocumentTestHelper.findDocument(TEST_DOCUMENT_NAME);
    expect(found).toBeDefined();
    expect(DocumentTestHelper.getNameFromItem(found)).toBe(TEST_DOCUMENT_NAME);
  });

  it("should return the created document's id and item", async () => {
    const builder = await new DocumentBuilder()
      .withName(TEST_DOCUMENT_NAME)
      .withRootDocumentType()
      .create();

    const id = builder.getId();
    const item = builder.getCreatedItem();
    expect(id).toBeDefined();
    expect(item).toBeDefined();
    expect(DocumentTestHelper.getNameFromItem(item)).toBe(TEST_DOCUMENT_NAME);
  });

  it("moveToRecycleBin should move a created document to the recycle bin", async () => {
    const builder = await new DocumentBuilder()
      .withName(TEST_RECYCLE_BIN_DOCUMENT_NAME)
      .withRootDocumentType()
      .create();
    await builder.moveToRecycleBin();
    const foundNormal = await DocumentTestHelper.findDocument(TEST_RECYCLE_BIN_DOCUMENT_NAME);
    expect(foundNormal).toBeUndefined();
    const foundRecycleBin = await DocumentTestHelper.findDocumentInRecycleBin(TEST_RECYCLE_BIN_DOCUMENT_NAME);
    expect(foundRecycleBin).toBeDefined();
    expect(foundRecycleBin!.variants[0].name).toBe(TEST_RECYCLE_BIN_DOCUMENT_NAME);
  });

  it("moveToRecycleBin should throw if called before create", async () => {
    const builder = new DocumentBuilder().withName("_Test MoveToRecycleBin Error").withRootDocumentType();
    await expect(builder.moveToRecycleBin()).rejects.toThrow(/No document has been created yet/);
  });

  it("publish should publish a created document", async () => {
    const builder = await new DocumentBuilder()
      .withName(TEST_PUBLISHED_DOCUMENT_NAME)
      .withRootDocumentType()
      .create();
    await expect(builder.publish()).resolves.toBe(builder);
    // Check the published state
    const found = await DocumentTestHelper.findDocument(TEST_PUBLISHED_DOCUMENT_NAME);
    expect(found).toBeDefined();
    const isPublished = found?.variants.some((v: any) => v.state === "Published");
    expect(isPublished).toBe(true);
  });

  it("publish should throw if called before create", async () => {
    const builder = new DocumentBuilder().withName("_Test PublishBuilder Error").withRootDocumentType();
    await expect(builder.publish()).rejects.toThrow(/No document has been created yet/);
  });
}); 