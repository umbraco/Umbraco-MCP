# Umbraco Management API - Unsupported Endpoints Analysis

This document provides a comprehensive comparison between the available Umbraco Management API endpoints and the currently implemented MCP tools, identifying gaps in functionality.

## Summary

- **Total API Endpoints**: 393
- **Implemented Tools**: 269
- **Coverage**: ~68.4%
- **Missing Endpoints**: ~124

**Recent Updates:**
- Added Document Version tools (4 endpoints)
- Added Stylesheet tools (11 endpoints) 
- Added Script tools (10 endpoints)
- Expanded Partial View coverage
- Enhanced test infrastructure and collection filtering system

## Coverage by Section

### ✅ Well Covered Sections (80%+ coverage)
- **Culture**: 100% coverage (1/1 endpoints)
- **Data Types**: ~95% coverage (19/20 endpoints)
- **Dictionary**: ~90% coverage (9/10 endpoints)  
- **Document Blueprints**: ~85% coverage (6/7 endpoints)
- **Document Types**: ~88% coverage (22/25 endpoints)
- **Document Versions**: 100% coverage (4/4 endpoints) *NEW*
- **Documents**: ~79% coverage (38/48 endpoints)
- **Languages**: ~85% coverage (6/7 endpoints)
- **Log Viewer**: ~90% coverage (9/10 endpoints)
- **Media Types**: ~80% coverage (20/25 endpoints)
- **Media**: ~85% coverage (29/34 endpoints)
- **Member Groups**: ~85% coverage (6/7 endpoints)
- **Member Types**: ~80% coverage (8/10 endpoints)
- **Members**: ~83% coverage (5/6 endpoints)
- **Partial Views**: ~83% coverage (10/12 endpoints) *IMPROVED*
- **Property Types**: 100% coverage (1/1 endpoints)
- **Redirects**: 100% coverage (5/5 endpoints)
- **Scripts**: 100% coverage (10/10 endpoints) *NEW*
- **Server**: 100% coverage (5/5 endpoints)
- **Stylesheets**: 100% coverage (11/11 endpoints) *NEW*
- **Templates**: 100% coverage (10/10 endpoints)
- **Temporary Files**: 100% coverage (4/4 endpoints)
- **User Groups**: 100% coverage (8/8 endpoints)
- **Webhooks**: ~85% coverage (6/7 endpoints)

### ❌ Missing Sections (0% coverage)

#### Authentication & Security (22 endpoints)
- `postSecurityForgotPassword`
- `postSecurityForgotPasswordReset` 
- `postSecurityForgotPasswordVerify`
- `getSecurityConfiguration`
- `getUserCurrent`
- `getUserCurrent2fa`
- `deleteUserCurrent2faByProviderName`
- `postUserCurrent2faByProviderName`
- `getUserCurrent2faByProviderName`
- `postUserCurrentAvatar`
- `postUserCurrentChangePassword`
- `getUserCurrentConfiguration`
- `getUserCurrentLoginProviders`
- `getUserCurrentPermissions`
- `getUserCurrentPermissionsDocument`
- `getUserCurrentPermissionsMedia`
- `postUserDisable`
- `postUserEnable`
- `postUserInvite`
- `postUserInviteCreatePassword`
- `postUserInviteResend`
- `postUserInviteVerify`

#### User Management (36 endpoints)
- `postUserData`
- `getUserData`
- `putUserData`
- `getUserDataById`
- `getFilterUser`
- `getItemUser`
- `postUser`
- `deleteUser`
- `getUser`
- `getUserById`
- `deleteUserById`
- `putUserById`
- `getUserById2fa`
- `deleteUserById2faByProviderName`
- `getUserByIdCalculateStartNodes`
- `postUserByIdChangePassword`
- `postUserByIdClientCredentials`
- `getUserByIdClientCredentials`
- `deleteUserByIdClientCredentialsByClientId`
- `postUserByIdResetPassword`
- `deleteUserAvatarById`
- `postUserAvatarById`
- `getUserConfiguration`
- `deleteUserGroupByIdUsers`
- `postUserGroupByIdUsers`
- `postUserSetUserGroups`
- `postUserUnlock`

#### Package Management (11 endpoints)
- `postPackageByNameRunMigration`
- `getPackageConfiguration`
- `getPackageCreated`
- `postPackageCreated`
- `getPackageCreatedById`
- `deletePackageCreatedById`
- `putPackageCreatedById`
- `getPackageCreatedByIdDownload`
- `getPackageMigrationStatus`

#### Scripting & Views (22 endpoints)
- `getItemScript`
- `postScript`
- `getScriptByPath`
- `deleteScriptByPath`
- `putScriptByPath`
- `putScriptByPathRename`
- `postScriptFolder`
- `getScriptFolderByPath`
- `deleteScriptFolderByPath`
- `getTreeScriptAncestors`
- `getTreeScriptChildren`
- `getTreeScriptRoot`
- `getItemPartialView`
- `postPartialView`
- `getPartialViewByPath`
- `deletePartialViewByPath`
- `putPartialViewByPath`
- `putPartialViewByPathRename`
- `postPartialViewFolder`
- `getPartialViewFolderByPath`
- `deletePartialViewFolderByPath`
- `getPartialViewSnippet`
- `getPartialViewSnippetById`
- `getTreePartialViewAncestors`
- `getTreePartialViewChildren`
- `getTreePartialViewRoot`

#### Stylesheets (10 endpoints)
- `getItemStylesheet`
- `postStylesheet`
- `getStylesheetByPath`
- `deleteStylesheetByPath`
- `putStylesheetByPath`
- `putStylesheetByPathRename`
- `postStylesheetFolder`
- `getStylesheetFolderByPath`
- `deleteStylesheetFolderByPath`
- `getTreeStylesheetAncestors`
- `getTreeStylesheetChildren`
- `getTreeStylesheetRoot`

#### Static File Management (4 endpoints)
- `getItemStaticFile`
- `getTreeStaticFileAncestors`
- `getTreeStaticFileChildren`
- `getTreeStaticFileRoot`

#### System Operations (29 endpoints)

**Health Checks (4 endpoints)**
- `getHealthCheckGroup`
- `getHealthCheckGroupByName`
- `postHealthCheckGroupByNameCheck`
- `postHealthCheckExecuteAction`

**Help System (1 endpoint)**
- `getHelp`

**Imaging (1 endpoint)**
- `getImagingResizeUrls`

**Import/Export (1 endpoint)**
- `getImportAnalyze`

**Indexing (3 endpoints)**
- `getIndexer`
- `getIndexerByIndexName`
- `postIndexerByIndexNameRebuild`

**Installation (3 endpoints)**
- `getInstallSettings`
- `postInstallSetup`
- `postInstallValidateDatabase`

**Manifests (3 endpoints)**
- `getManifestManifest`
- `getManifestManifestPrivate`
- `getManifestManifestPublic`

**Models Builder (3 endpoints)**
- `postModelsBuilderBuild`
- `getModelsBuilderDashboard`
- `getModelsBuilderStatus`

**Object Types (1 endpoint)**
- `getObjectTypes`

**OEmbed (1 endpoint)**
- `getOembedQuery`

**Preview (2 endpoints)**
- `deletePreview`
- `postPreview`

**Profiling (2 endpoints)**
- `getProfilingStatus`
- `putProfilingStatus`

**Published Cache (4 endpoints)**
- `postPublishedCacheCollect`
- `postPublishedCacheRebuild`
- `postPublishedCacheReload`
- `getPublishedCacheStatus`

**Search (2 endpoints)**
- `getSearcher`
- `getSearcherBySearcherNameQuery`

**Segments (1 endpoint)**
- `getSegment`

**Telemetry (3 endpoints)**
- `getTelemetry`
- `getTelemetryLevel`
- `postTelemetryLevel`

**Tags (1 endpoint)**
- `getTag`

**Upgrade (2 endpoints)**
- `postUpgradeAuthorize`
- `getUpgradeSettings`

#### Relation Types (4 endpoints)
- `getItemRelationType`
- `getRelationType`
- `getRelationTypeById`
- `getRelationByRelationTypeId`

#### Dynamic Root (2 endpoints)
- `postDynamicRootQuery`
- `getDynamicRootSteps`

### ⚠️ Partially Covered Sections

#### Data Types (Missing 1 endpoint)
- `getFilterDataType` - Filtering functionality

#### Dictionary (Missing 1 endpoint)
- `getDictionaryByIdExport` - Export functionality

#### Document Blueprints (Missing 1 endpoint)
- `moveDocumentBlueprint` - Move functionality

#### Document Types (Missing 3 endpoints)
- `getDocumentTypeByIdExport` - Export functionality
- `putDocumentTypeByIdImport` - Import functionality
- `postDocumentTypeImport` - Import functionality

#### Documents (Missing 10 endpoints)
- Version management: `getDocumentVersion`, `getDocumentVersionById`, `putDocumentVersionByIdPreventCleanup`, `postDocumentVersionByIdRollback`
- Collections: `getCollectionDocumentById`
- References: `getDocumentByIdReferencedBy`, `getDocumentByIdReferencedDescendants`, `getDocumentAreReferenced`
- Restore: `getRecycleBinDocumentByIdOriginalParent`, `putRecycleBinDocumentByIdRestore`

#### Languages (Missing 1 endpoint)
- `getItemLanguageDefault` - Default language item

#### Log Viewer (Missing 1 endpoint)
- `getLogViewerValidateLogsSize` - Log size validation

#### Media Types (Missing 5 endpoints)
- `getItemMediaTypeFolders` - Folder items
- `getMediaTypeByIdExport` - Export functionality
- `putMediaTypeByIdImport` - Import functionality
- `postMediaTypeImport` - Import functionality

#### Media (Missing 5 endpoints)
- Collections: `getCollectionMedia`
- References: `getMediaByIdReferencedBy`, `getMediaByIdReferencedDescendants`, `getMediaAreReferenced`
- Restore: `getRecycleBinMediaByIdOriginalParent`, `putRecycleBinMediaByIdRestore`

#### Member Groups (Missing 1 endpoint)
- `getItemMemberGroup` - Member group items

#### Member Types (Missing 2 endpoints)
- `getItemMemberType` - Member type items
- `getItemMemberTypeSearch` - Search functionality

#### Members (Missing 1 endpoint)
- `getFilterMember` - Filtering functionality

#### Webhooks (Missing 1 endpoint)
- `getWebhookByIdLogs` - Webhook-specific logs

## Priority Recommendations

### High Priority (Core CMS functionality)
1. **User Management** - Critical for user administration
2. **Authentication & Security** - Essential for security operations
3. **Package Management** - Important for deployment and maintenance
4. ~~**Version Management**~~ - ✅ COMPLETED (Document Versions added)

### Medium Priority (Development tools)
1. ~~**Scripting & Views**~~ - ✅ COMPLETED (Scripts and Partial Views added)
2. ~~**Stylesheets**~~ - ✅ COMPLETED (100% coverage achieved)
3. **System Operations** - Important for maintenance

### Low Priority (Specialized features)
1. **Static File Management** - Less commonly used
2. **Relation Types** - Specialized use cases
3. **Dynamic Root** - Advanced content modeling

## Implementation Notes

**Recent Achievements (68.4% coverage):**
- ✅ **Document Versions** - Complete rollback and cleanup functionality
- ✅ **Stylesheets** - Full CRUD operations and tree navigation
- ✅ **Scripts** - Complete script file management
- ✅ **Enhanced Test Infrastructure** - Comprehensive testing patterns and collection filtering
- ✅ **Improved Coverage** - Significant jump from 47.6% to 68.4%

**Remaining gaps focus on:**
- Advanced administrative functions (User management, Security)
- System maintenance operations (Packages, Health checks)
- Import/export functionality
- Specialized features (Relations, Tags, Static files)

The current MCP implementation now provides excellent coverage of the core content management workflows, with strong support for:
- All content types (Documents, Media, Members)
- Development workflow (Scripts, Stylesheets, Templates, Partial Views)
- Content versioning and rollback capabilities
- Comprehensive testing and quality assurance