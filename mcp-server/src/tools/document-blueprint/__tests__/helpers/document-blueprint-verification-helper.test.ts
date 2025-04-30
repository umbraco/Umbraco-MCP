import { DocumentBlueprintVerificationHelper, BLANK_UUID } from "./document-blueprint-verification-helper.js";
import { DocumentBlueprintTreeItemResponseModel } from "@/umb-management-api/schemas/index.js";

describe('DocumentBlueprintVerificationHelper', () => {
  const TEST_BLUEPRINT_NAME = 'Test Integration Blueprint';
  const TEST_BLUEPRINT_CLEANUP_NAME = 'Test Integration Blueprint Cleanup';
  const TEST_BLUEPRINT_FOLDER_NAME = 'Test Integration Blueprint Folder';
  const TEST_CHILD_BLUEPRINT_NAME = 'Test Child Blueprint';

  // Clean up any test blueprints that might be left over from previous test runs
  beforeAll(async () => {
    await DocumentBlueprintVerificationHelper.cleanup(TEST_BLUEPRINT_NAME);
    await DocumentBlueprintVerificationHelper.cleanup(TEST_CHILD_BLUEPRINT_NAME);
    await DocumentBlueprintVerificationHelper.cleanup(TEST_BLUEPRINT_FOLDER_NAME);
    await DocumentBlueprintVerificationHelper.cleanup(TEST_BLUEPRINT_CLEANUP_NAME);
  });

  // Clean up after all tests
  afterAll(async () => {
    await DocumentBlueprintVerificationHelper.cleanup(TEST_BLUEPRINT_NAME);
    await DocumentBlueprintVerificationHelper.cleanup(TEST_CHILD_BLUEPRINT_NAME);
    await DocumentBlueprintVerificationHelper.cleanup(TEST_BLUEPRINT_FOLDER_NAME);
    await DocumentBlueprintVerificationHelper.cleanup(TEST_BLUEPRINT_CLEANUP_NAME);
  });

  describe('createDocumentBlueprint and findDocumentBlueprints', () => {
    it('should create and find a blueprint', async () => {
      // Create a blueprint
      const created = await DocumentBlueprintVerificationHelper.createDocumentBlueprint(TEST_BLUEPRINT_NAME);
      expect(created).toBeDefined();
      expect(created?.name).toBe(TEST_BLUEPRINT_NAME);

      // Find the blueprint
      const found = await DocumentBlueprintVerificationHelper.findDocumentBlueprint(TEST_BLUEPRINT_NAME);
      expect(found).toBeDefined();
      expect(found?.name).toBe(TEST_BLUEPRINT_NAME);
    });

    it('should create and find a blueprint in a folder', async () => {
      // Create parent blueprint
      const parent = await DocumentBlueprintVerificationHelper.createDocumentBlueprintFolder(TEST_BLUEPRINT_FOLDER_NAME);
      expect(parent).toBeDefined();

      // Create child blueprint
      const child = await DocumentBlueprintVerificationHelper.createDocumentBlueprint(TEST_CHILD_BLUEPRINT_NAME, parent?.id);
      expect(child).toBeDefined();
      expect(child?.name).toBe(TEST_CHILD_BLUEPRINT_NAME);

      // Find the child blueprint
      const found = await DocumentBlueprintVerificationHelper.findDocumentBlueprint(TEST_CHILD_BLUEPRINT_NAME);
      expect(found).toBeDefined();
      expect(found?.name).toBe(TEST_CHILD_BLUEPRINT_NAME);
    });

    it('should return empty array when blueprint not found', async () => {
      const result = await DocumentBlueprintVerificationHelper.findDocumentBlueprint('Non-existent-Blueprint');
      expect(result).toEqual(undefined);
    });
  });

  describe('cleanup and cleanupById', () => {
    it('should cleanup blueprint by name', async () => {
      // Create a blueprint
      const created = await DocumentBlueprintVerificationHelper.createDocumentBlueprint(TEST_BLUEPRINT_CLEANUP_NAME);
      expect(created).toBeDefined();

      // Clean it up
      await DocumentBlueprintVerificationHelper.cleanup(TEST_BLUEPRINT_CLEANUP_NAME);

      // Verify it's gone
      const found = await DocumentBlueprintVerificationHelper.findDocumentBlueprint(TEST_BLUEPRINT_CLEANUP_NAME);
      expect(found).toBeUndefined();
    });

  });

  describe('normaliseIds', () => {
    const mockBlueprint: DocumentBlueprintTreeItemResponseModel = {
      id: '123-456',
      name: 'Test Blueprint',
      documentType: { id: '789-012', icon: 'icon-document' },
      isFolder: false,
      hasChildren: false
    };

    const mockFolder: DocumentBlueprintTreeItemResponseModel = {
      id: '789-012',
      name: 'Test Folder',
      documentType: { id: '789-012', icon: 'icon-folder' },
      isFolder: true,
      hasChildren: true
    };

    it('should normalise a single item by setting id to BLANK_UUID', () => {
      const result = DocumentBlueprintVerificationHelper.normaliseIds(mockBlueprint) as DocumentBlueprintTreeItemResponseModel;
      
      expect(result.id).toBe(BLANK_UUID);
      // Verify original wasn't mutated
      expect(mockBlueprint.id).toBe('123-456');
    });

    it('should normalise an array of items by setting all ids to BLANK_UUID', () => {
      const items = [mockBlueprint, mockFolder];
      const result = DocumentBlueprintVerificationHelper.normaliseIds(items) as DocumentBlueprintTreeItemResponseModel[];

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
      result.forEach(item => {
        expect(item.id).toBe(BLANK_UUID);
      });
      // Verify originals weren't mutated
      expect(items[0].id).toBe('123-456');
      expect(items[1].id).toBe('789-012');
    });

    it('should preserve all other properties when normalising', () => {
      const result = DocumentBlueprintVerificationHelper.normaliseIds(mockBlueprint) as DocumentBlueprintTreeItemResponseModel;
      
      expect(result.id).toBe(BLANK_UUID);
      expect(result.name).toBe(mockBlueprint.name);
      expect(result.documentType).toEqual(mockBlueprint.documentType);
      expect(result.hasChildren).toBe(mockBlueprint.hasChildren);
      expect(result.isFolder).toBe(mockBlueprint.isFolder);
    });
  });
}); 