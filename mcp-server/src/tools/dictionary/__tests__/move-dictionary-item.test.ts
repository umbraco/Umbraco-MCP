import MoveDictionaryItemTool from "../put/move-dictionary-item.js";
import { DictionaryTestHelper } from "./helpers/dictionary-test-helper.js";
import { BLANK_UUID, DEFAULT_ISO_CODE } from "./helpers/dictionary-verification-helper.js";
import { jest } from "@jest/globals";

const CHILD_DICTIONARY_NAME = "_Child Dictionary";
const CHILD_DICTIONARY_TRANSLATION = "_Child Translation";
const PARENT_DICTIONARY_NAME = "_Parent Dictionary";
const PARENT_DICTIONARY_TRANSLATION = "_Parent Translation";

describe("move-dictionary-item", () => {
  let originalConsoleError: typeof console.error;
  let childHelper: DictionaryTestHelper;
  let parentHelper: DictionaryTestHelper;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
    childHelper = new DictionaryTestHelper();
    parentHelper = new DictionaryTestHelper();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await childHelper.cleanup();
    await parentHelper.cleanup();
  });

  it("should move a dictionary item to a new parent", async () => {
    // Create parent dictionary item
    await parentHelper
      .withName(PARENT_DICTIONARY_NAME)
      .withTranslation(DEFAULT_ISO_CODE, PARENT_DICTIONARY_TRANSLATION)
      .create();

    // Create child dictionary item
    await childHelper
      .withName(CHILD_DICTIONARY_NAME)
      .withTranslation(DEFAULT_ISO_CODE, CHILD_DICTIONARY_TRANSLATION)
      .create();

    const result = await MoveDictionaryItemTool().handler({
      id: childHelper.getId(),
      data: {
        target: {
          id: parentHelper.getId()
        }
      }
    }, { signal: new AbortController().signal });

    expect(result).toMatchSnapshot();
  });

  it("should move a dictionary item from parent back to root", async () => {
    // Create parent dictionary item
    await parentHelper
      .withName(PARENT_DICTIONARY_NAME)
      .withTranslation(DEFAULT_ISO_CODE, PARENT_DICTIONARY_TRANSLATION)
      .create();

    // Create child dictionary item under parent
    await childHelper
      .withName(CHILD_DICTIONARY_NAME)
      .withTranslation(DEFAULT_ISO_CODE, CHILD_DICTIONARY_TRANSLATION)
      .withParent(parentHelper.getId())
      .create();

    const result = await MoveDictionaryItemTool().handler({
      id: childHelper.getId(),
      data: {
        target: null
      }
    }, { signal: new AbortController().signal });

    expect(result).toMatchSnapshot();
  });

  it("should handle non-existent dictionary item", async () => {
    const result = await MoveDictionaryItemTool().handler({
      id: BLANK_UUID,
      data: {
        target: null
      }
    }, { signal: new AbortController().signal });

    expect(result).toMatchSnapshot();
  });
}); 