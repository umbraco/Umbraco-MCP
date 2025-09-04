# Similar Endpoints for Stylesheet

## Best Match: Partial View
- **Similarity**: Partial View is the closest match as it's a file-based entity with folders that uses path-based operations (similar to stylesheets), has content creation/editing capabilities, has folder management, and includes both rename and update operations
- **Location**: `/Users/philw/Projects/umbraco-mcp/src/umb-management-api/tools/partial-view/`
- **Copy Strategy**: Copy the entire folder structure and adapt the API calls from partial-view to stylesheet endpoints

## Alternative Matches:
1. **Script**: Very similar file-based structure with folders, but simpler (no snippets, fewer specialized operations)
2. **Template**: File-based but ID-based rather than path-based operations, has query operations not applicable to stylesheets
3. **Dictionary**: Good testing patterns with comprehensive builders and helpers, but different API structure (ID-based vs path-based)

## Key API Pattern Differences:

### Stylesheet API Endpoints (Path-based):
- `getItemStylesheet` - List items
- `postStylesheet` - Create stylesheet
- `getStylesheetByPath` - Get by path  
- `deleteStylesheetByPath` - Delete by path
- `putStylesheetByPath` - Update by path
- `putStylesheetByPathRename` - Rename by path
- `postStylesheetFolder` - Create folder
- `getStylesheetFolderByPath` - Get folder by path
- `deleteStylesheetFolderByPath` - Delete folder by path
- `getTreeStylesheetAncestors` - Tree ancestors
- `getTreeStylesheetChildren` - Tree children  
- `getTreeStylesheetRoot` - Tree root

### Partial View API (Nearly Identical Pattern):
- `getItemPartialView` - List items
- `postPartialView` - Create partial view
- `getPartialViewByPath` - Get by path
- `deletePartialViewByPath` - Delete by path
- `putPartialViewByPath` - Update by path
- `putPartialViewByPathRename` - Rename by path
- `postPartialViewFolder` - Create folder
- `getPartialViewFolderByPath` - Get folder by path
- `deletePartialViewFolderByPath` - Delete folder by path
- `getTreePartialViewAncestors` - Tree ancestors
- `getTreePartialViewChildren` - Tree children
- `getTreePartialViewRoot` - Tree root

## Key Files to Copy:

### Tools (Copy and adapt from partial-view):
- **Index**: `/src/umb-management-api/tools/partial-view/index.ts`
- **POST operations**: 
  - `/post/create-partial-view.ts` → `create-stylesheet.ts`
  - `/post/create-partial-view-folder.ts` → `create-stylesheet-folder.ts`
- **GET operations**:
  - `/get/get-partial-view-by-path.ts` → `get-stylesheet-by-path.ts`
  - `/get/get-partial-view-folder-by-path.ts` → `get-stylesheet-folder-by-path.ts`
- **PUT operations**:
  - `/put/update-partial-view.ts` → `update-stylesheet.ts`
  - `/put/rename-partial-view.ts` → `rename-stylesheet.ts`
- **DELETE operations**:
  - `/delete/delete-partial-view.ts` → `delete-stylesheet.ts`
  - `/delete/delete-partial-view-folder.ts` → `delete-stylesheet-folder.ts`
- **Tree operations (items/get/)**:
  - `get-ancestors.ts` → Copy directly
  - `get-children.ts` → Copy directly  
  - `get-root.ts` → Copy directly
  - `get-search.ts` → Copy directly (maps to getItemStylesheet)

### Tests (Copy and adapt from partial-view):
- **Builders**: 
  - `/helpers/partial-view-builder.ts` → `stylesheet-builder.ts`
  - `/helpers/partial-view-folder-builder.ts` → `stylesheet-folder-builder.ts`
- **Helpers**: 
  - `/helpers/partial-view-helper.ts` → `stylesheet-helper.ts`
- **Integration Tests**: All test files following the partial-view pattern

### Skip These Partial View Files (Not Applicable to Stylesheets):
- `get-partial-view-snippet.ts` - Stylesheets don't have snippets
- `get-partial-view-snippet-by-id.ts` - Stylesheets don't have snippets

## Key Adaptations Needed:

### 1. API Client Method Names:
- `postPartialView` → `postStylesheet`
- `getPartialViewByPath` → `getStylesheetByPath`
- `putPartialViewByPath` → `putStylesheetByPath`
- `deletePartialViewByPath` → `deleteStylesheetByPath`
- etc.

### 2. Schema Names:
- `CreatePartialViewRequestModel` → `CreateStylesheetRequestModel`
- `postPartialViewBody` → `postStylesheetBody`
- etc.

### 3. File Extensions:
- Partial Views: `.cshtml`
- Stylesheets: `.css`

### 4. Content Handling:
- Partial Views: Remove line breaks from content
- Stylesheets: Keep CSS content formatting intact

### 5. Authorization Policy:
- Use `AuthorizationPolicies.TreeAccessStylesheets(user)` instead of `TreeAccessPartialViews`

## Implementation Order:
1. Copy the `/partial-view/` folder structure to `/stylesheet/`
2. Update all API method calls from partial-view to stylesheet
3. Update schema imports and types
4. Change file extensions from `.cshtml` to `.css`
5. Update authorization policies
6. Adapt test builders and helpers
7. Update content handling logic for CSS files
8. Remove snippet-related functionality

The Partial View implementation provides the perfect template as it has the exact same API pattern (path-based operations with folders, rename operations, tree operations) and comprehensive testing infrastructure that can be directly adapted for Stylesheets.