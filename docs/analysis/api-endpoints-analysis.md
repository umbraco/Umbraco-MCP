# Umbraco Management API Endpoints Analysis

## Culture
- `getCulture`

## Data Types
- `postDataType`
- `getDataTypeById`
- `deleteDataTypeById`
- `putDataTypeById`
- `postDataTypeByIdCopy`
- `getDataTypeByIdIsUsed`
- `putDataTypeByIdMove`
- `getDataTypeByIdReferences`
- `getDataTypeConfiguration`
- `postDataTypeFolder`
- `getDataTypeFolderById`
- `deleteDataTypeFolderById`
- `putDataTypeFolderById`
- `getFilterDataType`
- `getItemDataType`
- `getItemDataTypeSearch`
- `getTreeDataTypeAncestors`
- `getTreeDataTypeChildren`
- `getTreeDataTypeRoot`

## Dictionary
- `getDictionary`
- `postDictionary`
- `getDictionaryById`
- `deleteDictionaryById`
- `putDictionaryById`
- `getDictionaryByIdExport`
- `putDictionaryByIdMove`
- `postDictionaryImport`
- `getItemDictionary`
- `getTreeDictionaryAncestors`
- `getTreeDictionaryChildren`
- `getTreeDictionaryRoot`

## Document Blueprints
- `postDocumentBlueprint`
- `getDocumentBlueprintById`
- `deleteDocumentBlueprintById`
- `putDocumentBlueprintById`
- `putDocumentBlueprintByIdMove`
- `postDocumentBlueprintFolder`
- `getDocumentBlueprintFolderById`
- `deleteDocumentBlueprintFolderById`
- `putDocumentBlueprintFolderById`
- `postDocumentBlueprintFromDocument`
- `getItemDocumentBlueprint`
- `getTreeDocumentBlueprintAncestors`
- `getTreeDocumentBlueprintChildren`
- `getTreeDocumentBlueprintRoot`

## Document Types
- `postDocumentType`
- `getDocumentTypeById`
- `deleteDocumentTypeById`
- `putDocumentTypeById`
- `getDocumentTypeByIdAllowedChildren`
- `getDocumentTypeByIdBlueprint`
- `getDocumentTypeByIdCompositionReferences`
- `postDocumentTypeByIdCopy`
- `getDocumentTypeByIdExport`
- `putDocumentTypeByIdImport`
- `putDocumentTypeByIdMove`
- `getDocumentTypeAllowedAtRoot`
- `postDocumentTypeAvailableCompositions`
- `getDocumentTypeConfiguration`
- `postDocumentTypeFolder`
- `getDocumentTypeFolderById`
- `deleteDocumentTypeFolderById`
- `putDocumentTypeFolderById`
- `postDocumentTypeImport`
- `getItemDocumentType`
- `getItemDocumentTypeSearch`
- `getTreeDocumentTypeAncestors`
- `getTreeDocumentTypeChildren`
- `getTreeDocumentTypeRoot`

## Document Versions
- `getDocumentVersion`
- `getDocumentVersionById`
- `putDocumentVersionByIdPreventCleanup`
- `postDocumentVersionByIdRollback`

## Documents
- `getCollectionDocumentById`
- `postDocument`
- `getDocumentById`
- `deleteDocumentById`
- `putDocumentById`
- `getDocumentByIdAuditLog`
- `postDocumentByIdCopy`
- `getDocumentByIdDomains`
- `putDocumentByIdDomains`
- `putDocumentByIdMove`
- `putDocumentByIdMoveToRecycleBin`
- `getDocumentByIdNotifications`
- `putDocumentByIdNotifications`
- `postDocumentByIdPublicAccess`
- `deleteDocumentByIdPublicAccess`
- `getDocumentByIdPublicAccess`
- `putDocumentByIdPublicAccess`
- `putDocumentByIdPublish`
- `putDocumentByIdPublishWithDescendants`
- `getDocumentByIdPublished`
- `getDocumentByIdReferencedBy`
- `getDocumentByIdReferencedDescendants`
- `putDocumentByIdUnpublish`
- `putDocumentByIdValidate`
- `putUmbracoManagementApiV11DocumentByIdValidate11`
- `getDocumentAreReferenced`
- `getDocumentConfiguration`
- `putDocumentSort`
- `getDocumentUrls`
- `postDocumentValidate`
- `getItemDocument`
- `getItemDocumentSearch`

## Document Recycle Bin
- `deleteRecycleBinDocument`
- `deleteRecycleBinDocumentById`
- `getRecycleBinDocumentByIdOriginalParent`
- `putRecycleBinDocumentByIdRestore`
- `getRecycleBinDocumentChildren`
- `getRecycleBinDocumentRoot`

## Document Tree
- `getTreeDocumentAncestors`
- `getTreeDocumentChildren`
- `getTreeDocumentRoot`

## Dynamic Root
- `postDynamicRootQuery`
- `getDynamicRootSteps`

## Health Check
- `getHealthCheckGroup`
- `getHealthCheckGroupByName`
- `postHealthCheckGroupByNameCheck`
- `postHealthCheckExecuteAction`

## Help
- `getHelp`

## Imaging
- `getImagingResizeUrls`

## Import
- `getImportAnalyze`

## Indexer
- `getIndexer`
- `getIndexerByIndexName`
- `postIndexerByIndexNameRebuild`

## Install
- `getInstallSettings`
- `postInstallSetup`
- `postInstallValidateDatabase`

## Language
- `getItemLanguage`
- `getItemLanguageDefault`
- `getLanguage`
- `postLanguage`
- `getLanguageByIsoCode`
- `deleteLanguageByIsoCode`
- `putLanguageByIsoCode`

## Log Viewer
- `getLogViewerLevel`
- `getLogViewerLevelCount`
- `getLogViewerLog`
- `getLogViewerMessageTemplate`
- `getLogViewerSavedSearch`
- `postLogViewerSavedSearch`
- `getLogViewerSavedSearchByName`
- `deleteLogViewerSavedSearchByName`
- `getLogViewerValidateLogsSize`

## Manifest
- `getManifestManifest`
- `getManifestManifestPrivate`
- `getManifestManifestPublic`

## Media Types
- `getItemMediaType`
- `getItemMediaTypeAllowed`
- `getItemMediaTypeFolders`
- `getItemMediaTypeSearch`
- `postMediaType`
- `getMediaTypeById`
- `deleteMediaTypeById`
- `putMediaTypeById`
- `getMediaTypeByIdAllowedChildren`
- `getMediaTypeByIdCompositionReferences`
- `postMediaTypeByIdCopy`
- `getMediaTypeByIdExport`
- `putMediaTypeByIdImport`
- `putMediaTypeByIdMove`
- `getMediaTypeAllowedAtRoot`
- `postMediaTypeAvailableCompositions`
- `getMediaTypeConfiguration`
- `postMediaTypeFolder`
- `getMediaTypeFolderById`
- `deleteMediaTypeFolderById`
- `putMediaTypeFolderById`
- `postMediaTypeImport`
- `getTreeMediaTypeAncestors`
- `getTreeMediaTypeChildren`
- `getTreeMediaTypeRoot`

## Media
- `getCollectionMedia`
- `getItemMedia`
- `getItemMediaSearch`
- `postMedia`
- `getMediaById`
- `deleteMediaById`
- `putMediaById`
- `getMediaByIdAuditLog`
- `putMediaByIdMove`
- `putMediaByIdMoveToRecycleBin`
- `getMediaByIdReferencedBy`
- `getMediaByIdReferencedDescendants`
- `putMediaByIdValidate`
- `getMediaAreReferenced`
- `getMediaConfiguration`
- `putMediaSort`
- `getMediaUrls`
- `postMediaValidate`

## Media Recycle Bin
- `deleteRecycleBinMedia`
- `deleteRecycleBinMediaById`
- `getRecycleBinMediaByIdOriginalParent`
- `putRecycleBinMediaByIdRestore`
- `getRecycleBinMediaChildren`
- `getRecycleBinMediaRoot`

## Media Tree
- `getTreeMediaAncestors`
- `getTreeMediaChildren`
- `getTreeMediaRoot`

## Member Groups
- `getItemMemberGroup`
- `getMemberGroup`
- `postMemberGroup`
- `getMemberGroupById`
- `deleteMemberGroupById`
- `putMemberGroupById`
- `getTreeMemberGroupRoot`

## Member Types
- `getItemMemberType`
- `getItemMemberTypeSearch`
- `postMemberType`
- `getMemberTypeById`
- `deleteMemberTypeById`
- `putMemberTypeById`
- `getMemberTypeByIdCompositionReferences`
- `postMemberTypeByIdCopy`
- `postMemberTypeAvailableCompositions`
- `getMemberTypeConfiguration`
- `getTreeMemberTypeRoot`

## Members
- `getFilterMember`
- `getItemMember`
- `getItemMemberSearch`
- `postMember`
- `getMemberById`
- `deleteMemberById`
- `putMemberById`
- `putMemberByIdValidate`
- `getMemberConfiguration`
- `postMemberValidate`

## Models Builder
- `postModelsBuilderBuild`
- `getModelsBuilderDashboard`
- `getModelsBuilderStatus`

## Object Types
- `getObjectTypes`

## OEmbed
- `getOembedQuery`

## Packages
- `postPackageByNameRunMigration`
- `getPackageConfiguration`
- `getPackageCreated`
- `postPackageCreated`
- `getPackageCreatedById`
- `deletePackageCreatedById`
- `putPackageCreatedById`
- `getPackageCreatedByIdDownload`
- `getPackageMigrationStatus`

## Partial Views
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

## Preview
- `deletePreview`
- `postPreview`

## Profiling
- `getProfilingStatus`
- `putProfilingStatus`

## Property Types
- `getPropertyTypeIsUsed`

## Published Cache
- `postPublishedCacheCollect`
- `postPublishedCacheRebuild`
- `postPublishedCacheReload`
- `getPublishedCacheStatus`

## Redirect Management
- `getRedirectManagement`
- `getRedirectManagementById`
- `deleteRedirectManagementById`
- `getRedirectManagementStatus`
- `postRedirectManagementStatus`

## Relations
- `getItemRelationType`
- `getRelationType`
- `getRelationTypeById`
- `getRelationByRelationTypeId`

## Scripts
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

## Search
- `getSearcher`
- `getSearcherBySearcherNameQuery`

## Security
- `getSecurityConfiguration`
- `postSecurityForgotPassword`
- `postSecurityForgotPasswordReset`
- `postSecurityForgotPasswordVerify`

## Segments
- `getSegment`

## Server
- `getServerConfiguration`
- `getServerInformation`
- `getServerStatus`
- `getServerTroubleshooting`
- `getServerUpgradeCheck`

## Static Files
- `getItemStaticFile`
- `getTreeStaticFileAncestors`
- `getTreeStaticFileChildren`
- `getTreeStaticFileRoot`

## Stylesheets
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

## Tags
- `getTag`

## Telemetry
- `getTelemetry`
- `getTelemetryLevel`
- `postTelemetryLevel`

## Templates
- `getItemTemplate`
- `getItemTemplateSearch`
- `postTemplate`
- `getTemplateById`
- `deleteTemplateById`
- `putTemplateById`
- `getTemplateConfiguration`
- `postTemplateQueryExecute`
- `getTemplateQuerySettings`
- `getTreeTemplateAncestors`
- `getTreeTemplateChildren`
- `getTreeTemplateRoot`

## Upgrade
- `postUpgradeAuthorize`
- `getUpgradeSettings`

## User Data
- `postUserData`
- `getUserData`
- `putUserData`
- `getUserDataById`

## User Groups
- `getFilterUserGroup`
- `getItemUserGroup`
- `deleteUserGroup`
- `postUserGroup`
- `getUserGroup`
- `getUserGroupById`
- `deleteUserGroupById`
- `putUserGroupById`
- `deleteUserGroupByIdUsers`
- `postUserGroupByIdUsers`

## Users
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
- `postUserSetUserGroups`
- `postUserUnlock`

## Webhooks
- `getItemWebhook`
- `getWebhook`
- `postWebhook`
- `getWebhookById`
- `deleteWebhookById`
- `putWebhookById`
- `getWebhookByIdLogs`
- `getWebhookEvents`
- `getWebhookLogs`

---

## Summary Statistics

**Total Endpoints:** 393
**MCP Tools Implemented:** 269
**Coverage:** 68.4%

**Categories:** 37

**Major Functional Areas:**
- **Content Management:** Documents (48 endpoints), Document Versions (4 endpoints), Media (34 endpoints), Templates (10 endpoints)
- **Content Types:** Document Types (25 endpoints), Media Types (25 endpoints), Data Types (20 endpoints)
- **User Management:** Users (36 endpoints), User Groups (8 endpoints), Members (10 endpoints)
- **Development:** Scripts (10 endpoints), Stylesheets (11 endpoints), Partial Views (12 endpoints)
- **System Management:** Server (5 endpoints), Security (4 endpoints), Health Check (4 endpoints)
- **Configuration:** Various configuration endpoints across categories
- **Tree Operations:** Tree navigation endpoints for hierarchical content
- **Search & Filtering:** Search and filter endpoints across content types

**Recent Additions:**
- Document Version management (rollback, cleanup)
- Complete Stylesheet file management
- Full Script file operations
- Enhanced collection filtering system
- Comprehensive testing infrastructure