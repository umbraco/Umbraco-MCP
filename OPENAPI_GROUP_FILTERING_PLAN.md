# Tool Collection-Based Filtering Plan

## Problem Statement

The Umbraco MCP server currently loads all available tools at startup, creating a large context window that may not be efficiently utilized. Many tools are only useful in specific circumstances, and the tools are already logically organized into collections that can be used for selective tool loading.

## Current Architecture Analysis

### Tool Organization Structure
```
src/umb-management-api/tools/
├── culture/           # Culture management tools
├── data-type/         # Data Type CRUD operations  
├── dictionary/        # Dictionary item management
├── document/          # Document content operations
├── document-blueprint/# Document blueprints
├── document-type/     # Document type definitions
├── language/          # Language settings
├── log-viewer/        # System logs
├── media/             # Media management
├── media-type/        # Media type definitions
├── member/            # Member management
├── member-group/      # Member group operations
├── member-type/       # Member type definitions
├── partial-view/      # Partial view templates
├── property-type/     # Property type management
├── redirect/          # URL redirect management
├── script/            # Script file management
├── server/            # Server information
├── template/          # Template management
├── temporary-file/    # Temporary file operations
├── user-group/        # User group management
└── webhook/           # Webhook integrations
```

### Current Tool Loading Process
1. **UmbracoToolFactory** (`src/umb-management-api/tools/tool-factory.ts`) loads all tool groups
2. Each tool group exports a function that returns `ToolDefinition<any>[]`
3. Tools are filtered by user permissions using `AuthorizationPolicies`
4. Tools can be filtered via environment variables:
   - `EXCLUDE_MANAGEMENT_TOOLS` - comma-separated list of tool names to exclude
   - `INCLUDE_MANAGEMENT_TOOLS` - comma-separated list of tool names to include (implemented in mapTools)

### OpenAPI Integration
- Orval generates TypeScript clients from OpenAPI spec at `http://localhost:56472/umbraco/swagger/management/swagger.json`
- OpenAPI spec uses `tags` to group endpoints (seen in orval config filters)
- Each tool corresponds to one or more OpenAPI endpoints

## Proposed Solution Architecture

### 1. Self-Contained Tool Collection Metadata

**Common Tool Collection Interface**
```typescript
// src/types/tool-collection.ts
export interface ToolCollectionMetadata {
  name: string;           // Collection key (e.g., 'culture', 'data-type')
  displayName: string;    // Human readable name
  description: string;    // Collection description
  dependencies?: string[]; // Required collections
}

export interface ToolCollectionExport {
  metadata: ToolCollectionMetadata;
  tools: (user: CurrentUserResponseModel) => ToolDefinition<any>[];
}
```

**Updated Tool Collection Exports** (each collection exports its own metadata)
```typescript
// src/umb-management-api/tools/culture/index.ts
export const CultureCollection: ToolCollectionExport = {
  metadata: {
    name: 'culture',
    displayName: 'Culture & Localization',
    description: 'Culture and localization management',
    dependencies: []
  },
  tools: (user: CurrentUserResponseModel) => {
    const tools: ToolDefinition<any>[] = [/* existing tool logic */];
    return tools;
  }
};
```

```typescript
// src/umb-management-api/tools/data-type/index.ts
export const DataTypeCollection: ToolCollectionExport = {
  metadata: {
    name: 'data-type',
    displayName: 'Data Types', 
    description: 'Data type definitions and management',
    dependencies: []
  },
  tools: (user: CurrentUserResponseModel) => {
    // Move existing DataTypeTools logic here
    const tools: ToolDefinition<any>[] = [GetDataTypeSearchTool()];
    
    if (AuthorizationPolicies.TreeAccessDocumentsOrMediaOrMembersOrContentTypes(user)) {
      tools.push(GetReferencesDataTypeTool());
      tools.push(IsUsedDataTypeTool());
      tools.push(GetDataTypeTool());
    }
    
    if (AuthorizationPolicies.TreeAccessDataTypes(user)) {
      tools.push(GetDataTypeRootTool());
      tools.push(GetDataTypeChildrenTool());
      // ... rest of existing DataTypeTools logic
    }
    
    return tools;
  }
};
```

### 2. Collection Configuration

**Configuration Schema** (extends existing tool-level filtering)
```typescript
// src/umb-management-api/groups/collection-configuration.ts
export interface CollectionConfiguration {
  // Collection-level filtering (new) 
  enabledCollections: string[];  // Collection names (e.g., 'culture', 'data-type')
  disabledCollections: string[]; // Collection names to exclude
  
  // Tool-level filtering (existing, enhanced)
  enabledTools: string[];  // Individual tool names to include
  disabledTools: string[]; // Individual tool names to exclude
  
  mode: 'include' | 'exclude'; // Strategy for applying filters
}

export const DEFAULT_COLLECTION_CONFIG: CollectionConfiguration = {
  enabledCollections: [],
  disabledCollections: [],
  enabledTools: [],
  disabledTools: [],
  mode: 'exclude' // Load all by default, only exclude specified ones
};
```

### 3. Configuration Storage & Loading

**Environment-based Configuration** 
Building on existing `INCLUDE_MANAGEMENT_TOOLS` / `EXCLUDE_MANAGEMENT_TOOLS` pattern:

```typescript
// src/helpers/env.ts - extend existing schema
const envSchema = z.object({
  // ... existing env vars
  INCLUDE_MANAGEMENT_TOOLS: z.string().optional()
    .transform((val) => val?.split(',').map(tool => tool.trim()).filter(Boolean))
    .pipe(z.array(z.string()).optional()),
  EXCLUDE_MANAGEMENT_TOOLS: z.string().optional()
    .transform((val) => val?.split(',').map(tool => tool.trim()))
    .pipe(z.array(z.string()).optional()),
  
  // New collection-level filtering
  INCLUDE_MANAGEMENT_COLLECTIONS: z.string().optional()
    .transform((val) => val?.split(',').map(collection => collection.trim()).filter(Boolean))
    .pipe(z.array(z.string()).optional()),
  EXCLUDE_MANAGEMENT_COLLECTIONS: z.string().optional()
    .transform((val) => val?.split(',').map(collection => collection.trim()))
    .pipe(z.array(z.string()).optional()),
});

// src/helpers/collection-config-loader.ts
export class CollectionConfigLoader {
  static loadFromEnv(): CollectionConfiguration {
    return {
      enabledCollections: env.INCLUDE_MANAGEMENT_COLLECTIONS ?? [],
      disabledCollections: env.EXCLUDE_MANAGEMENT_COLLECTIONS ?? [],
      enabledTools: env.INCLUDE_MANAGEMENT_TOOLS ?? [],
      disabledTools: env.EXCLUDE_MANAGEMENT_TOOLS ?? [],
      mode: env.INCLUDE_MANAGEMENT_COLLECTIONS?.length ? 'include' : 'exclude'
    };
  }
}
```

**Configuration File Schema**
```json
// .umbraco-mcp-config.json (optional)
{
  "groups": {
    "mode": "include",
    "enabledGroups": ["Culture", "Data Type", "Document"],
    "disabledGroups": []
  }
}
```

### 4. Enhanced Existing Tool Factory

**Enhanced Tool Factory** (extends existing `tool-factory.ts`)
```typescript
// src/umb-management-api/tools/tool-factory.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CollectionConfigLoader } from "@/helpers/collection-config-loader.js";

// Import all collections
import { CultureCollection } from "./culture/index.js";
import { DataTypeCollection } from "./data-type/index.js";
import { DictionaryCollection } from "./dictionary/index.js";
// ... other collection imports

const availableCollections = [
  CultureCollection,
  DataTypeCollection,
  DictionaryCollection,
  DocumentBlueprintCollection,
  DocumentTypeCollection,
  DocumentCollection,
  MediaCollection,
  MediaTypeCollection,
  MemberGroupCollection,
  MemberCollection,
  MemberTypeCollection,
  LogViewerCollection,
  LanguageCollection,
  PartialViewCollection,
  PropertyTypeCollection,
  TemplateCollection,
  WebhookCollection,
  ServerCollection,
  RedirectCollection,
  UserGroupCollection,
  TemporaryFileCollection,
  ScriptCollection
];

// Enhanced mapTools with collection filtering (existing function signature)
const mapTools = (server: McpServer,
  user: CurrentUserResponseModel,
  tools: ToolDefinition<any>[]) => {
  return tools.forEach(tool => {
    // Check if user has permission for this tool
    const userHasPermission = (tool.enabled === undefined || tool.enabled(user));
    if (!userHasPermission) return;
    
    // Apply existing tool-level filtering (preserves current behavior)
    if (env.EXCLUDE_MANAGEMENT_TOOLS?.includes(tool.name)) return;
    if (env.INCLUDE_MANAGEMENT_TOOLS?.length && !env.INCLUDE_MANAGEMENT_TOOLS.includes(tool.name)) return;
    
    // Register the tool
    server.tool(tool.name, tool.description, tool.schema, tool.handler);
  })
}

function getEnabledCollections(config: CollectionConfiguration): ToolCollectionExport[] {
  const allCollectionNames = availableCollections.map(c => c.metadata.name);
  
  let enabledNames: string[];
  if (config.mode === 'include') {
    enabledNames = config.enabledCollections.length > 0 
      ? config.enabledCollections 
      : allCollectionNames; // All collections if none specified
  } else {
    enabledNames = allCollectionNames.filter(name => !config.disabledCollections.includes(name));
  }
  
  // Resolve dependencies - add required collections
  const enabledWithDependencies = resolveDependencies(enabledNames, availableCollections);
  
  return availableCollections.filter(collection => 
    enabledWithDependencies.includes(collection.metadata.name)
  );
}

function validateConfiguration(config: CollectionConfiguration, collections: ToolCollectionExport[]): void {
  const availableNames = new Set(collections.map(c => c.metadata.name));
  
  // Check all referenced collection names exist
  const referencedNames = [
    ...config.enabledCollections,
    ...config.disabledCollections,
    ...collections.flatMap(c => c.metadata.dependencies || [])
  ];
  
  const invalid = referencedNames.filter(name => !availableNames.has(name));
  if (invalid.length > 0) {
    console.warn(`Referenced collections don't exist: ${[...new Set(invalid)].join(', ')}`);
  }
}

function resolveDependencies(requestedNames: string[], collections: ToolCollectionExport[]): string[] {
  const result = new Set(requestedNames);
  const collectionMap = new Map(collections.map(c => [c.metadata.name, c]));
  
  // Recursively add dependencies
  function addDependencies(collectionName: string) {
    const collection = collectionMap.get(collectionName);
    if (collection?.metadata.dependencies) {
      collection.metadata.dependencies.forEach(dep => {
        if (!result.has(dep)) {
          result.add(dep);
          addDependencies(dep); // Recursive dependency resolution
        }
      });
    }
  }
  
  requestedNames.forEach(addDependencies);
  return Array.from(result);
}

export function UmbracoToolFactory(server: McpServer, user: CurrentUserResponseModel) {
  // Load collection configuration
  const config = CollectionConfigLoader.loadFromEnv();
  
  // Validate configuration
  validateConfiguration(config, availableCollections);
  
  // Get enabled collections based on configuration
  const enabledCollections = getEnabledCollections(config);
  
  // Load tools from enabled collections only
  enabledCollections.forEach(collection => {
    const tools = collection.tools(user);
    mapTools(server, user, tools);
  });
}
```

### 5. Validation & Error Handling

**Compile-time Safety**
- Use TypeScript mapped types to ensure collection keys exist
- Zod schemas for runtime configuration validation
- Collection name validation against actual exported collections

**Runtime Validation**
```typescript
// src/umb-management-api/groups/collection-validator.ts
export class CollectionValidator {
  static validateCollectionExists(collectionName: string): boolean {
    // Check if collection actually exists in TOOL_COLLECTIONS registry
    return collectionName in TOOL_COLLECTIONS;
  }

  static validateCollectionDependencies(config: CollectionConfiguration): ValidationResult {
    // Ensure required collection dependencies are included
    // e.g., 'dictionary' requires 'language'
  }

  static validateNoConflicts(config: CollectionConfiguration): ValidationResult {
    // Check for conflicts between enabled/disabled collections
  }
}
```

## Implementation Steps

This is a straightforward implementation that can be done in one go:

### Core Implementation
1. **Add collection interfaces** (`src/types/tool-collection.ts`) - Include dependency metadata
2. **Extend environment schema** (`src/helpers/env.ts`) 
3. **Update tool collections** - Convert existing tool exports to collection format with dependencies
4. **Enhance tool factory** (`src/umb-management-api/tools/tool-factory.ts`) with collection filtering and dependency resolution
5. **Add dependency validation** - Ensure required collections are automatically included

### Optional Enhancements (if needed later)
- **Configuration file support** - JSON config file with schema validation

## Testing Strategy

Focus on testing the core collection filtering logic with minimal, targeted tests:

### Unit Tests (Core Logic)
```typescript
// test/collection-filtering.test.ts
describe('Collection Filtering', () => {
  const mockCollections: ToolCollectionExport[] = [
    { metadata: { name: 'culture', dependencies: [] }, tools: () => [] },
    { metadata: { name: 'dictionary', dependencies: ['language'] }, tools: () => [] },
    { metadata: { name: 'language', dependencies: [] }, tools: () => [] },
    { metadata: { name: 'document', dependencies: ['document-type'] }, tools: () => [] },
    { metadata: { name: 'document-type', dependencies: [] }, tools: () => [] }
  ];

  describe('resolveDependencies', () => {
    it('should include dependencies automatically', () => {
      const result = resolveDependencies(['dictionary'], mockCollections);
      expect(result).toEqual(['dictionary', 'language']);
    });

    it('should handle nested dependencies', () => {
      // If document-type depended on something else
      const result = resolveDependencies(['document'], mockCollections);
      expect(result).toEqual(['document', 'document-type']);
    });
  });

  describe('validateConfiguration', () => {
    it('should warn about invalid collection names', () => {
      const config = { enabledCollections: ['invalid-name'], disabledCollections: [] };
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      validateConfiguration(config, mockCollections);
      
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('invalid-name'));
    });
  });

  describe('getEnabledCollections', () => {
    it('should return all collections by default', () => {
      const config = { enabledCollections: [], disabledCollections: [], mode: 'exclude' };
      const result = getEnabledCollections(config);
      expect(result).toHaveLength(5);
    });

    it('should filter to enabled collections only in include mode', () => {
      const config = { enabledCollections: ['culture'], disabledCollections: [], mode: 'include' };
      const result = getEnabledCollections(config);
      expect(result.map(c => c.metadata.name)).toEqual(['culture']);
    });
  });
});
```

### Integration Tests (Tool Factory Behavior)
```typescript
// test/tool-factory-integration.test.ts
describe('UmbracoToolFactory Integration', () => {
  let mockServer: jest.Mocked<McpServer>;
  let mockUser: CurrentUserResponseModel;

  beforeEach(() => {
    mockServer = { tool: jest.fn() } as any;
    mockUser = {} as any;
    
    // Mock environment
    process.env.INCLUDE_MANAGEMENT_COLLECTIONS = '';
    process.env.EXCLUDE_MANAGEMENT_COLLECTIONS = '';
  });

  it('should load tools from all collections by default', () => {
    UmbracoToolFactory(mockServer, mockUser);
    
    // Verify server.tool was called for tools from all collections
    expect(mockServer.tool).toHaveBeenCalledTimes(/* expected total */);
  });

  it('should only load tools from enabled collections', () => {
    process.env.INCLUDE_MANAGEMENT_COLLECTIONS = 'culture,language';
    
    UmbracoToolFactory(mockServer, mockUser);
    
    // Verify only culture and language tools were loaded
    const toolCalls = mockServer.tool.mock.calls.map(call => call[0]);
    expect(toolCalls.every(name => 
      name.includes('culture') || name.includes('language')
    )).toBe(true);
  });

  it('should automatically include dependencies', () => {
    process.env.INCLUDE_MANAGEMENT_COLLECTIONS = 'dictionary';
    
    UmbracoToolFactory(mockServer, mockUser);
    
    // Should include both dictionary and language tools
    const toolCalls = mockServer.tool.mock.calls.map(call => call[0]);
    expect(toolCalls.some(name => name.includes('dictionary'))).toBe(true);
    expect(toolCalls.some(name => name.includes('language'))).toBe(true);
  });

  it('should exclude individual tools while keeping collection enabled', () => {
    process.env.INCLUDE_MANAGEMENT_COLLECTIONS = 'culture';
    process.env.EXCLUDE_MANAGEMENT_TOOLS = 'get-cultures';
    
    UmbracoToolFactory(mockServer, mockUser);
    
    // Should include culture collection but exclude specific tool
    const toolCalls = mockServer.tool.mock.calls.map(call => call[0]);
    expect(toolCalls).not.toContain('get-cultures');
    // But other culture tools should still be loaded (if any exist)
  });

  it('should include only specific tools from enabled collections', () => {
    process.env.INCLUDE_MANAGEMENT_COLLECTIONS = 'data-type,document';
    process.env.INCLUDE_MANAGEMENT_TOOLS = 'create-data-type,get-document';
    
    UmbracoToolFactory(mockServer, mockUser);
    
    // Should only include the explicitly listed tools, even though collections are enabled
    const toolCalls = mockServer.tool.mock.calls.map(call => call[0]);
    expect(toolCalls).toContain('create-data-type');
    expect(toolCalls).toContain('get-document');
    expect(toolCalls).not.toContain('delete-data-type'); // Other data-type tools excluded
    expect(toolCalls).not.toContain('update-document'); // Other document tools excluded
  });

  it('should handle tool-level overrides with collection exclusions', () => {
    process.env.EXCLUDE_MANAGEMENT_COLLECTIONS = 'temporary-file,log-viewer';
    process.env.INCLUDE_MANAGEMENT_TOOLS = 'create-temporary-file'; // Force include one tool from excluded collection
    
    UmbracoToolFactory(mockServer, mockUser);
    
    const toolCalls = mockServer.tool.mock.calls.map(call => call[0]);
    // Should include the force-included tool despite collection being excluded
    expect(toolCalls).toContain('create-temporary-file');
    // But other temporary-file tools should be excluded
    expect(toolCalls).not.toContain('delete-temporary-file');
  });
});
```

### Environment Variable Tests
```typescript
// test/env-parsing.test.ts
describe('Environment Variable Parsing', () => {
  it('should parse comma-separated collection names', () => {
    process.env.INCLUDE_MANAGEMENT_COLLECTIONS = 'culture, data-type , document';
    
    const config = CollectionConfigLoader.loadFromEnv();
    
    expect(config.enabledCollections).toEqual(['culture', 'data-type', 'document']);
  });

  it('should handle empty values', () => {
    process.env.INCLUDE_MANAGEMENT_COLLECTIONS = '';
    
    const config = CollectionConfigLoader.loadFromEnv();
    
    expect(config.enabledCollections).toEqual([]);
  });
});
```

### Key Testing Principles
1. **Test the logic, not the data** - Use mock collections instead of testing every real collection
2. **Focus on edge cases** - Dependencies, invalid names, empty configs
3. **Integration over unit** - Test the full `UmbracoToolFactory` behavior with realistic scenarios
4. **Environment isolation** - Mock environment variables for predictable tests
5. **Minimal but comprehensive** - Cover all the core paths without exhaustive permutations

### What We Don't Need to Test
- ❌ Individual tool collection implementations (they already have their own tests)
- ❌ Every possible combination of collections  
- ❌ Zod schema validation (Zod handles this)
- ❌ MCP server registration details (existing pattern, already tested)

## Configuration Examples

### Scenario 1: Content Editor Focus
```json
{
  "mode": "include",
  "enabledCollections": ["document", "document-type", "media", "template"]
}
```

### Scenario 2: Developer Setup  
```json
{
  "mode": "include", 
  "enabledCollections": ["data-type", "document-type", "property-type", "script", "template"]
}
```

### Scenario 3: Admin Operations
```json
{
  "mode": "exclude",
  "disabledCollections": ["temporary-file", "log-viewer"],
  "disabledTools": ["delete-data-type", "delete-document-type"]
}
```

### Scenario 4: Development with Specific Exclusions (combines collection + tool level)
```bash
# Environment variables approach
export EXCLUDE_MANAGEMENT_COLLECTIONS="log-viewer,temporary-file"
export INCLUDE_MANAGEMENT_TOOLS="create-data-type,update-data-type,get-data-type"
```

### Scenario 5: Granular Content Editor Setup  
```json
{
  "mode": "include",
  "enabledCollections": ["document", "media", "template"], 
  "disabledTools": ["delete-document", "delete-media"], // Safety restrictions
  "enabledTools": [] // Use collection defaults
}
```

## Benefits

1. **Reduced Context Window** - Only load relevant tools for specific use cases
2. **Type Safety** - Compile-time validation of collection configurations
3. **Zero Maintenance Overhead** - Collections are self-describing, impossible to forget when adding new ones
4. **Flexibility** - Easy to enable/disable tool collections as needed  
5. **Performance** - Faster startup and reduced memory usage
6. **Clean Architecture** - No backwards compatibility exports needed, collections are self-contained
7. **Automatic Discovery** - New collections are automatically included without manual registration

## Risk Mitigation

1. **Backwards Compatibility** - Default configuration loads all tools
2. **Dependency Tracking** - Validate group dependencies to prevent broken workflows
3. **Clear Documentation** - Provide examples and migration guides
4. **Gradual Migration** - Implement as opt-in feature initially

## Files to Create/Modify

### New Files
- `src/types/tool-collection.ts` - Tool collection interfaces
- `src/umb-management-api/collections/collection-configuration.ts` - Configuration types
- `src/helpers/collection-config-loader.ts` - Configuration loading

### Modified Files
- `src/helpers/env.ts` - Add collection-level environment variables
- `src/umb-management-api/tools/tool-factory.ts` - Enhance with collection filtering
- Individual tool collection index files - Convert to new collection export structure

### Configuration Files
- `.umbraco-mcp-config.json` (optional configuration file)
- Environment variable documentation in README

## Next Steps

1. **Validate approach** with stakeholders
2. **Start making changes** - manual group registry and basic filtering  
3. **Test performance impact** and context window reduction
4. **Iterate and expand** to full tool coverage

This plan provides a comprehensive, type-safe solution for managing MCP tool loading based on OpenAPI groups while maintaining backwards compatibility and enabling future enhancements.