import { getDictionaryByIdParams } from "../../../api/umbraco/management/umbracoManagementAPI.zod.js";
import GetDictionaryItemTool from "../get/get-dictionary-item.js";
import { DictionaryTestHelper } from "./helpers/dictionary-test-helper.js";
import { BLANK_UUID, DEFAULT_ISO_CODE } from "./helpers/dictionary-verification-helper.js";
import { createSnapshotResult } from "../../../helpers/test-utils.js";
import { jest } from "@jest/globals";

const TEST_DICTIONARY_NAME = "_Test Dictionary Get";
const TEST_DICTIONARY_TRANSLATION = "_Test Translation Get";

describe("get-dictionary-item", () => {
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

  it("should get a dictionary item by id", async () => {
    // Create a dictionary item first
    await helper
      .withName(TEST_DICTIONARY_NAME)
      .withTranslation(DEFAULT_ISO_CODE, TEST_DICTIONARY_TRANSLATION)
      .create();

    const params = getDictionaryByIdParams.parse({ id: helper.getId() });

    const result = await GetDictionaryItemTool().handler(params, { signal: new AbortController().signal });

    expect(createSnapshotResult(result, helper.getId())).toMatchSnapshot();
  });

  it("should handle non-existent dictionary item", async () => {
    const nonExistentId = BLANK_UUID;
    const params = getDictionaryByIdParams.parse({ id: nonExistentId });

    const result = await GetDictionaryItemTool().handler(params, { signal: new AbortController().signal });
    expect(result).toMatchSnapshot();
  });
}); 