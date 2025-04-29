import { getDictionaryByIdParams } from "../../../api/umbraco/management/umbracoManagementAPI.zod.js";
import GetDictionaryItemTool from "../get/get-dictionary-item.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "./helpers/dictionary-verification-helper.js";

describe("get-dictionary-item", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it("should get a dictionary item by id", async () => {
    const knownDictionaryId = "7e02a26c-5a42-4e35-92fd-3b4ab480d7d5";
    const params = getDictionaryByIdParams.parse({ id: knownDictionaryId });

    const result = await GetDictionaryItemTool().handler(params, { signal: new AbortController().signal });

    expect(result).toMatchSnapshot();
  });

  it("should handle non-existent dictionary item", async () => {
    const nonExistentId = BLANK_UUID;
    const params = getDictionaryByIdParams.parse({ id: nonExistentId });

    const result = await GetDictionaryItemTool().handler(params, { signal: new AbortController().signal });
    expect(result).toMatchSnapshot();
  });
}); 