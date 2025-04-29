import FindDictionaryItemTool from "../get/find-dictionary-item.js";
import { DictionaryTestHelper } from "./helpers/dictionary-test-helper.js";
import { DEFAULT_ISO_CODE } from "./helpers/dictionary-verification-helper.js";
import { createSnapshotResult } from "./helpers/test-utils.js";
import { jest } from "@jest/globals";

const TEST_DICTIONARY_NAME = "Test Dictionary Find";
const TEST_DICTIONARY_TRANSLATION = "Test Translation Find";

describe("find-dictionary-item", () => {
  let originalConsoleError: typeof console.error;
  let helper: DictionaryTestHelper;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
    helper = new DictionaryTestHelper();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await helper.cleanup();
  });

  it("should find a dictionary item by name", async () => {
    // Create a dictionary item first
    await helper
      .withName(TEST_DICTIONARY_NAME)
      .withTranslation(DEFAULT_ISO_CODE, TEST_DICTIONARY_TRANSLATION)
      .create();

    const result = await FindDictionaryItemTool().handler({
      filter: TEST_DICTIONARY_NAME,
      take: 100
    }, { signal: new AbortController().signal });

    expect(createSnapshotResult(result)).toMatchSnapshot();
  });

  it("should handle non-existent dictionary item", async () => {
    const result = await FindDictionaryItemTool().handler({
      filter: "Non Existent Dictionary",
      take: 100
    }, { signal: new AbortController().signal });

    expect(result).toMatchSnapshot();
  });
}); 