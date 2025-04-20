import { UmbracoManagementClient } from '../clients/umbraco-management-client.js';
export const getUmbracoManagementAPI = () => {
    const getCulture = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/culture`, method: 'GET',
            params
        }, options);
    };
    const postDataType = (createDataTypeRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/data-type`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: createDataTypeRequestModel
        }, options);
    };
    const getDataTypeById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/data-type/${id}`, method: 'GET'
        }, options);
    };
    const deleteDataTypeById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/data-type/${id}`, method: 'DELETE'
        }, options);
    };
    const putDataTypeById = (id, updateDataTypeRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/data-type/${id}`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: updateDataTypeRequestModel
        }, options);
    };
    const postDataTypeByIdCopy = (id, copyDataTypeRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/data-type/${id}/copy`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: copyDataTypeRequestModel
        }, options);
    };
    const getDataTypeByIdIsUsed = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/data-type/${id}/is-used`, method: 'GET'
        }, options);
    };
    const putDataTypeByIdMove = (id, moveDataTypeRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/data-type/${id}/move`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: moveDataTypeRequestModel
        }, options);
    };
    const getDataTypeByIdReferences = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/data-type/${id}/references`, method: 'GET'
        }, options);
    };
    const getDataTypeConfiguration = (options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/data-type/configuration`, method: 'GET'
        }, options);
    };
    const postDataTypeFolder = (createFolderRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/data-type/folder`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: createFolderRequestModel
        }, options);
    };
    const getDataTypeFolderById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/data-type/folder/${id}`, method: 'GET'
        }, options);
    };
    const deleteDataTypeFolderById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/data-type/folder/${id}`, method: 'DELETE'
        }, options);
    };
    const putDataTypeFolderById = (id, updateFolderResponseModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/data-type/folder/${id}`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: updateFolderResponseModel
        }, options);
    };
    const getFilterDataType = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/filter/data-type`, method: 'GET',
            params
        }, options);
    };
    const getItemDataType = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/item/data-type`, method: 'GET',
            params
        }, options);
    };
    const getItemDataTypeSearch = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/item/data-type/search`, method: 'GET',
            params
        }, options);
    };
    const getTreeDataTypeAncestors = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/tree/data-type/ancestors`, method: 'GET',
            params
        }, options);
    };
    const getTreeDataTypeChildren = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/tree/data-type/children`, method: 'GET',
            params
        }, options);
    };
    const getTreeDataTypeRoot = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/tree/data-type/root`, method: 'GET',
            params
        }, options);
    };
    const getDictionary = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/dictionary`, method: 'GET',
            params
        }, options);
    };
    const postDictionary = (createDictionaryItemRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/dictionary`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: createDictionaryItemRequestModel
        }, options);
    };
    const getDictionaryById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/dictionary/${id}`, method: 'GET'
        }, options);
    };
    const deleteDictionaryById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/dictionary/${id}`, method: 'DELETE'
        }, options);
    };
    const putDictionaryById = (id, updateDictionaryItemRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/dictionary/${id}`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: updateDictionaryItemRequestModel
        }, options);
    };
    const getDictionaryByIdExport = (id, params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/dictionary/${id}/export`, method: 'GET',
            params,
            responseType: 'blob'
        }, options);
    };
    const putDictionaryByIdMove = (id, moveDictionaryRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/dictionary/${id}/move`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: moveDictionaryRequestModel
        }, options);
    };
    const postDictionaryImport = (importDictionaryRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/dictionary/import`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: importDictionaryRequestModel
        }, options);
    };
    const getItemDictionary = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/item/dictionary`, method: 'GET',
            params
        }, options);
    };
    const getTreeDictionaryAncestors = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/tree/dictionary/ancestors`, method: 'GET',
            params
        }, options);
    };
    const getTreeDictionaryChildren = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/tree/dictionary/children`, method: 'GET',
            params
        }, options);
    };
    const getTreeDictionaryRoot = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/tree/dictionary/root`, method: 'GET',
            params
        }, options);
    };
    const postDocumentBlueprint = (createDocumentBlueprintRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document-blueprint`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: createDocumentBlueprintRequestModel
        }, options);
    };
    const getDocumentBlueprintById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document-blueprint/${id}`, method: 'GET'
        }, options);
    };
    const deleteDocumentBlueprintById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document-blueprint/${id}`, method: 'DELETE'
        }, options);
    };
    const putDocumentBlueprintById = (id, updateDocumentBlueprintRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document-blueprint/${id}`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: updateDocumentBlueprintRequestModel
        }, options);
    };
    const putDocumentBlueprintByIdMove = (id, moveDocumentBlueprintRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document-blueprint/${id}/move`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: moveDocumentBlueprintRequestModel
        }, options);
    };
    const postDocumentBlueprintFolder = (createFolderRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document-blueprint/folder`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: createFolderRequestModel
        }, options);
    };
    const getDocumentBlueprintFolderById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document-blueprint/folder/${id}`, method: 'GET'
        }, options);
    };
    const deleteDocumentBlueprintFolderById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document-blueprint/folder/${id}`, method: 'DELETE'
        }, options);
    };
    const putDocumentBlueprintFolderById = (id, updateFolderResponseModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document-blueprint/folder/${id}`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: updateFolderResponseModel
        }, options);
    };
    const postDocumentBlueprintFromDocument = (createDocumentBlueprintFromDocumentRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document-blueprint/from-document`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: createDocumentBlueprintFromDocumentRequestModel
        }, options);
    };
    const getItemDocumentBlueprint = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/item/document-blueprint`, method: 'GET',
            params
        }, options);
    };
    const getTreeDocumentBlueprintAncestors = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/tree/document-blueprint/ancestors`, method: 'GET',
            params
        }, options);
    };
    const getTreeDocumentBlueprintChildren = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/tree/document-blueprint/children`, method: 'GET',
            params
        }, options);
    };
    const getTreeDocumentBlueprintRoot = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/tree/document-blueprint/root`, method: 'GET',
            params
        }, options);
    };
    const postDocumentType = (createDocumentTypeRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document-type`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: createDocumentTypeRequestModel
        }, options);
    };
    const getDocumentTypeById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document-type/${id}`, method: 'GET'
        }, options);
    };
    const deleteDocumentTypeById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document-type/${id}`, method: 'DELETE'
        }, options);
    };
    const putDocumentTypeById = (id, updateDocumentTypeRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document-type/${id}`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: updateDocumentTypeRequestModel
        }, options);
    };
    const getDocumentTypeByIdAllowedChildren = (id, params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document-type/${id}/allowed-children`, method: 'GET',
            params
        }, options);
    };
    const getDocumentTypeByIdBlueprint = (id, params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document-type/${id}/blueprint`, method: 'GET',
            params
        }, options);
    };
    const getDocumentTypeByIdCompositionReferences = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document-type/${id}/composition-references`, method: 'GET'
        }, options);
    };
    const postDocumentTypeByIdCopy = (id, copyDocumentTypeRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document-type/${id}/copy`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: copyDocumentTypeRequestModel
        }, options);
    };
    const getDocumentTypeByIdExport = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document-type/${id}/export`, method: 'GET',
            responseType: 'blob'
        }, options);
    };
    const putDocumentTypeByIdImport = (id, importDocumentTypeRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document-type/${id}/import`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: importDocumentTypeRequestModel
        }, options);
    };
    const putDocumentTypeByIdMove = (id, moveDocumentTypeRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document-type/${id}/move`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: moveDocumentTypeRequestModel
        }, options);
    };
    const getDocumentTypeAllowedAtRoot = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document-type/allowed-at-root`, method: 'GET',
            params
        }, options);
    };
    const postDocumentTypeAvailableCompositions = (documentTypeCompositionRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document-type/available-compositions`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: documentTypeCompositionRequestModel
        }, options);
    };
    const getDocumentTypeConfiguration = (options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document-type/configuration`, method: 'GET'
        }, options);
    };
    const postDocumentTypeFolder = (createFolderRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document-type/folder`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: createFolderRequestModel
        }, options);
    };
    const getDocumentTypeFolderById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document-type/folder/${id}`, method: 'GET'
        }, options);
    };
    const deleteDocumentTypeFolderById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document-type/folder/${id}`, method: 'DELETE'
        }, options);
    };
    const putDocumentTypeFolderById = (id, updateFolderResponseModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document-type/folder/${id}`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: updateFolderResponseModel
        }, options);
    };
    const postDocumentTypeImport = (importDocumentTypeRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document-type/import`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: importDocumentTypeRequestModel
        }, options);
    };
    const getItemDocumentType = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/item/document-type`, method: 'GET',
            params
        }, options);
    };
    const getItemDocumentTypeSearch = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/item/document-type/search`, method: 'GET',
            params
        }, options);
    };
    const getTreeDocumentTypeAncestors = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/tree/document-type/ancestors`, method: 'GET',
            params
        }, options);
    };
    const getTreeDocumentTypeChildren = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/tree/document-type/children`, method: 'GET',
            params
        }, options);
    };
    const getTreeDocumentTypeRoot = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/tree/document-type/root`, method: 'GET',
            params
        }, options);
    };
    const getDocumentVersion = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document-version`, method: 'GET',
            params
        }, options);
    };
    const getDocumentVersionById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document-version/${id}`, method: 'GET'
        }, options);
    };
    const putDocumentVersionByIdPreventCleanup = (id, params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document-version/${id}/prevent-cleanup`, method: 'PUT',
            params
        }, options);
    };
    const postDocumentVersionByIdRollback = (id, params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document-version/${id}/rollback`, method: 'POST',
            params
        }, options);
    };
    const getCollectionDocumentById = (id, params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/collection/document/${id}`, method: 'GET',
            params
        }, options);
    };
    const postDocument = (createDocumentRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: createDocumentRequestModel
        }, options);
    };
    const getDocumentById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document/${id}`, method: 'GET'
        }, options);
    };
    const deleteDocumentById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document/${id}`, method: 'DELETE'
        }, options);
    };
    const putDocumentById = (id, updateDocumentRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document/${id}`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: updateDocumentRequestModel
        }, options);
    };
    const getDocumentByIdAuditLog = (id, params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document/${id}/audit-log`, method: 'GET',
            params
        }, options);
    };
    const postDocumentByIdCopy = (id, copyDocumentRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document/${id}/copy`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: copyDocumentRequestModel
        }, options);
    };
    const getDocumentByIdDomains = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document/${id}/domains`, method: 'GET'
        }, options);
    };
    const putDocumentByIdDomains = (id, updateDomainsRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document/${id}/domains`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: updateDomainsRequestModel
        }, options);
    };
    const putDocumentByIdMove = (id, moveDocumentRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document/${id}/move`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: moveDocumentRequestModel
        }, options);
    };
    const putDocumentByIdMoveToRecycleBin = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document/${id}/move-to-recycle-bin`, method: 'PUT'
        }, options);
    };
    const getDocumentByIdNotifications = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document/${id}/notifications`, method: 'GET'
        }, options);
    };
    const putDocumentByIdNotifications = (id, updateDocumentNotificationsRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document/${id}/notifications`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: updateDocumentNotificationsRequestModel
        }, options);
    };
    const postDocumentByIdPublicAccess = (id, publicAccessRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document/${id}/public-access`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: publicAccessRequestModel
        }, options);
    };
    const deleteDocumentByIdPublicAccess = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document/${id}/public-access`, method: 'DELETE'
        }, options);
    };
    const getDocumentByIdPublicAccess = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document/${id}/public-access`, method: 'GET'
        }, options);
    };
    const putDocumentByIdPublicAccess = (id, publicAccessRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document/${id}/public-access`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: publicAccessRequestModel
        }, options);
    };
    const putDocumentByIdPublish = (id, publishDocumentRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document/${id}/publish`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: publishDocumentRequestModel
        }, options);
    };
    const putDocumentByIdPublishWithDescendants = (id, publishDocumentWithDescendantsRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document/${id}/publish-with-descendants`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: publishDocumentWithDescendantsRequestModel
        }, options);
    };
    const getDocumentByIdPublished = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document/${id}/published`, method: 'GET'
        }, options);
    };
    const getDocumentByIdReferencedBy = (id, params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document/${id}/referenced-by`, method: 'GET',
            params
        }, options);
    };
    const getDocumentByIdReferencedDescendants = (id, params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document/${id}/referenced-descendants`, method: 'GET',
            params
        }, options);
    };
    const putDocumentByIdUnpublish = (id, unpublishDocumentRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document/${id}/unpublish`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: unpublishDocumentRequestModel
        }, options);
    };
    /**
     * @deprecated
     */
    const putDocumentByIdValidate = (id, updateDocumentRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document/${id}/validate`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: updateDocumentRequestModel
        }, options);
    };
    const putUmbracoManagementApiV11DocumentByIdValidate11 = (id, validateUpdateDocumentRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1.1/document/${id}/validate`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: validateUpdateDocumentRequestModel
        }, options);
    };
    const getDocumentAreReferenced = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document/are-referenced`, method: 'GET',
            params
        }, options);
    };
    const getDocumentConfiguration = (options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document/configuration`, method: 'GET'
        }, options);
    };
    const putDocumentSort = (sortingRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document/sort`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: sortingRequestModel
        }, options);
    };
    const getDocumentUrls = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document/urls`, method: 'GET',
            params
        }, options);
    };
    const postDocumentValidate = (createDocumentRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/document/validate`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: createDocumentRequestModel
        }, options);
    };
    const getItemDocument = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/item/document`, method: 'GET',
            params
        }, options);
    };
    const getItemDocumentSearch = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/item/document/search`, method: 'GET',
            params
        }, options);
    };
    const deleteRecycleBinDocument = (options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/recycle-bin/document`, method: 'DELETE'
        }, options);
    };
    const deleteRecycleBinDocumentById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/recycle-bin/document/${id}`, method: 'DELETE'
        }, options);
    };
    const getRecycleBinDocumentByIdOriginalParent = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/recycle-bin/document/${id}/original-parent`, method: 'GET'
        }, options);
    };
    const putRecycleBinDocumentByIdRestore = (id, moveMediaRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/recycle-bin/document/${id}/restore`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: moveMediaRequestModel
        }, options);
    };
    const getRecycleBinDocumentChildren = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/recycle-bin/document/children`, method: 'GET',
            params
        }, options);
    };
    const getRecycleBinDocumentRoot = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/recycle-bin/document/root`, method: 'GET',
            params
        }, options);
    };
    const getTreeDocumentAncestors = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/tree/document/ancestors`, method: 'GET',
            params
        }, options);
    };
    const getTreeDocumentChildren = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/tree/document/children`, method: 'GET',
            params
        }, options);
    };
    const getTreeDocumentRoot = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/tree/document/root`, method: 'GET',
            params
        }, options);
    };
    const postDynamicRootQuery = (dynamicRootRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/dynamic-root/query`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: dynamicRootRequestModel
        }, options);
    };
    const getDynamicRootSteps = (options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/dynamic-root/steps`, method: 'GET'
        }, options);
    };
    const getHealthCheckGroup = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/health-check-group`, method: 'GET',
            params
        }, options);
    };
    const getHealthCheckGroupByName = (name, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/health-check-group/${name}`, method: 'GET'
        }, options);
    };
    const postHealthCheckGroupByNameCheck = (name, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/health-check-group/${name}/check`, method: 'POST'
        }, options);
    };
    const postHealthCheckExecuteAction = (healthCheckActionRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/health-check/execute-action`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: healthCheckActionRequestModel
        }, options);
    };
    const getHelp = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/help`, method: 'GET',
            params
        }, options);
    };
    const getImagingResizeUrls = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/imaging/resize/urls`, method: 'GET',
            params
        }, options);
    };
    const getImportAnalyze = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/import/analyze`, method: 'GET',
            params
        }, options);
    };
    const getIndexer = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/indexer`, method: 'GET',
            params
        }, options);
    };
    const getIndexerByIndexName = (indexName, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/indexer/${indexName}`, method: 'GET'
        }, options);
    };
    const postIndexerByIndexNameRebuild = (indexName, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/indexer/${indexName}/rebuild`, method: 'POST'
        }, options);
    };
    const getInstallSettings = (options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/install/settings`, method: 'GET'
        }, options);
    };
    const postInstallSetup = (installRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/install/setup`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: installRequestModel
        }, options);
    };
    const postInstallValidateDatabase = (databaseInstallRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/install/validate-database`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: databaseInstallRequestModel
        }, options);
    };
    const getItemLanguage = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/item/language`, method: 'GET',
            params
        }, options);
    };
    const getItemLanguageDefault = (options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/item/language/default`, method: 'GET'
        }, options);
    };
    const getLanguage = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/language`, method: 'GET',
            params
        }, options);
    };
    const postLanguage = (createLanguageRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/language`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: createLanguageRequestModel
        }, options);
    };
    const getLanguageByIsoCode = (isoCode, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/language/${isoCode}`, method: 'GET'
        }, options);
    };
    const deleteLanguageByIsoCode = (isoCode, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/language/${isoCode}`, method: 'DELETE'
        }, options);
    };
    const putLanguageByIsoCode = (isoCode, updateLanguageRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/language/${isoCode}`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: updateLanguageRequestModel
        }, options);
    };
    const getLogViewerLevel = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/log-viewer/level`, method: 'GET',
            params
        }, options);
    };
    const getLogViewerLevelCount = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/log-viewer/level-count`, method: 'GET',
            params
        }, options);
    };
    const getLogViewerLog = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/log-viewer/log`, method: 'GET',
            params
        }, options);
    };
    const getLogViewerMessageTemplate = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/log-viewer/message-template`, method: 'GET',
            params
        }, options);
    };
    const getLogViewerSavedSearch = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/log-viewer/saved-search`, method: 'GET',
            params
        }, options);
    };
    const postLogViewerSavedSearch = (savedLogSearchRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/log-viewer/saved-search`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: savedLogSearchRequestModel
        }, options);
    };
    const getLogViewerSavedSearchByName = (name, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/log-viewer/saved-search/${name}`, method: 'GET'
        }, options);
    };
    const deleteLogViewerSavedSearchByName = (name, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/log-viewer/saved-search/${name}`, method: 'DELETE'
        }, options);
    };
    const getLogViewerValidateLogsSize = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/log-viewer/validate-logs-size`, method: 'GET',
            params
        }, options);
    };
    const getManifestManifest = (options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/manifest/manifest`, method: 'GET'
        }, options);
    };
    const getManifestManifestPrivate = (options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/manifest/manifest/private`, method: 'GET'
        }, options);
    };
    const getManifestManifestPublic = (options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/manifest/manifest/public`, method: 'GET'
        }, options);
    };
    const getItemMediaType = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/item/media-type`, method: 'GET',
            params
        }, options);
    };
    const getItemMediaTypeAllowed = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/item/media-type/allowed`, method: 'GET',
            params
        }, options);
    };
    const getItemMediaTypeFolders = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/item/media-type/folders`, method: 'GET',
            params
        }, options);
    };
    const getItemMediaTypeSearch = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/item/media-type/search`, method: 'GET',
            params
        }, options);
    };
    const postMediaType = (createMediaTypeRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/media-type`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: createMediaTypeRequestModel
        }, options);
    };
    const getMediaTypeById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/media-type/${id}`, method: 'GET'
        }, options);
    };
    const deleteMediaTypeById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/media-type/${id}`, method: 'DELETE'
        }, options);
    };
    const putMediaTypeById = (id, updateMediaTypeRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/media-type/${id}`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: updateMediaTypeRequestModel
        }, options);
    };
    const getMediaTypeByIdAllowedChildren = (id, params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/media-type/${id}/allowed-children`, method: 'GET',
            params
        }, options);
    };
    const getMediaTypeByIdCompositionReferences = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/media-type/${id}/composition-references`, method: 'GET'
        }, options);
    };
    const postMediaTypeByIdCopy = (id, copyMediaTypeRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/media-type/${id}/copy`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: copyMediaTypeRequestModel
        }, options);
    };
    const getMediaTypeByIdExport = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/media-type/${id}/export`, method: 'GET',
            responseType: 'blob'
        }, options);
    };
    const putMediaTypeByIdImport = (id, importMediaTypeRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/media-type/${id}/import`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: importMediaTypeRequestModel
        }, options);
    };
    const putMediaTypeByIdMove = (id, moveMediaTypeRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/media-type/${id}/move`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: moveMediaTypeRequestModel
        }, options);
    };
    const getMediaTypeAllowedAtRoot = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/media-type/allowed-at-root`, method: 'GET',
            params
        }, options);
    };
    const postMediaTypeAvailableCompositions = (mediaTypeCompositionRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/media-type/available-compositions`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: mediaTypeCompositionRequestModel
        }, options);
    };
    const getMediaTypeConfiguration = (options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/media-type/configuration`, method: 'GET'
        }, options);
    };
    const postMediaTypeFolder = (createFolderRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/media-type/folder`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: createFolderRequestModel
        }, options);
    };
    const getMediaTypeFolderById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/media-type/folder/${id}`, method: 'GET'
        }, options);
    };
    const deleteMediaTypeFolderById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/media-type/folder/${id}`, method: 'DELETE'
        }, options);
    };
    const putMediaTypeFolderById = (id, updateFolderResponseModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/media-type/folder/${id}`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: updateFolderResponseModel
        }, options);
    };
    const postMediaTypeImport = (importMediaTypeRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/media-type/import`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: importMediaTypeRequestModel
        }, options);
    };
    const getTreeMediaTypeAncestors = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/tree/media-type/ancestors`, method: 'GET',
            params
        }, options);
    };
    const getTreeMediaTypeChildren = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/tree/media-type/children`, method: 'GET',
            params
        }, options);
    };
    const getTreeMediaTypeRoot = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/tree/media-type/root`, method: 'GET',
            params
        }, options);
    };
    const getCollectionMedia = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/collection/media`, method: 'GET',
            params
        }, options);
    };
    const getItemMedia = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/item/media`, method: 'GET',
            params
        }, options);
    };
    const getItemMediaSearch = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/item/media/search`, method: 'GET',
            params
        }, options);
    };
    const postMedia = (createMediaRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/media`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: createMediaRequestModel
        }, options);
    };
    const getMediaById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/media/${id}`, method: 'GET'
        }, options);
    };
    const deleteMediaById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/media/${id}`, method: 'DELETE'
        }, options);
    };
    const putMediaById = (id, updateMediaRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/media/${id}`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: updateMediaRequestModel
        }, options);
    };
    const getMediaByIdAuditLog = (id, params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/media/${id}/audit-log`, method: 'GET',
            params
        }, options);
    };
    const putMediaByIdMove = (id, moveMediaRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/media/${id}/move`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: moveMediaRequestModel
        }, options);
    };
    const putMediaByIdMoveToRecycleBin = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/media/${id}/move-to-recycle-bin`, method: 'PUT'
        }, options);
    };
    const getMediaByIdReferencedBy = (id, params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/media/${id}/referenced-by`, method: 'GET',
            params
        }, options);
    };
    const getMediaByIdReferencedDescendants = (id, params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/media/${id}/referenced-descendants`, method: 'GET',
            params
        }, options);
    };
    const putMediaByIdValidate = (id, updateMediaRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/media/${id}/validate`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: updateMediaRequestModel
        }, options);
    };
    const getMediaAreReferenced = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/media/are-referenced`, method: 'GET',
            params
        }, options);
    };
    const getMediaConfiguration = (options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/media/configuration`, method: 'GET'
        }, options);
    };
    const putMediaSort = (sortingRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/media/sort`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: sortingRequestModel
        }, options);
    };
    const getMediaUrls = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/media/urls`, method: 'GET',
            params
        }, options);
    };
    const postMediaValidate = (createMediaRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/media/validate`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: createMediaRequestModel
        }, options);
    };
    const deleteRecycleBinMedia = (options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/recycle-bin/media`, method: 'DELETE'
        }, options);
    };
    const deleteRecycleBinMediaById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/recycle-bin/media/${id}`, method: 'DELETE'
        }, options);
    };
    const getRecycleBinMediaByIdOriginalParent = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/recycle-bin/media/${id}/original-parent`, method: 'GET'
        }, options);
    };
    const putRecycleBinMediaByIdRestore = (id, moveMediaRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/recycle-bin/media/${id}/restore`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: moveMediaRequestModel
        }, options);
    };
    const getRecycleBinMediaChildren = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/recycle-bin/media/children`, method: 'GET',
            params
        }, options);
    };
    const getRecycleBinMediaRoot = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/recycle-bin/media/root`, method: 'GET',
            params
        }, options);
    };
    const getTreeMediaAncestors = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/tree/media/ancestors`, method: 'GET',
            params
        }, options);
    };
    const getTreeMediaChildren = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/tree/media/children`, method: 'GET',
            params
        }, options);
    };
    const getTreeMediaRoot = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/tree/media/root`, method: 'GET',
            params
        }, options);
    };
    const getItemMemberGroup = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/item/member-group`, method: 'GET',
            params
        }, options);
    };
    const getMemberGroup = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/member-group`, method: 'GET',
            params
        }, options);
    };
    const postMemberGroup = (createMemberGroupRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/member-group`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: createMemberGroupRequestModel
        }, options);
    };
    const getMemberGroupById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/member-group/${id}`, method: 'GET'
        }, options);
    };
    const deleteMemberGroupById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/member-group/${id}`, method: 'DELETE'
        }, options);
    };
    const putMemberGroupById = (id, updateMemberGroupRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/member-group/${id}`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: updateMemberGroupRequestModel
        }, options);
    };
    const getTreeMemberGroupRoot = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/tree/member-group/root`, method: 'GET',
            params
        }, options);
    };
    const getItemMemberType = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/item/member-type`, method: 'GET',
            params
        }, options);
    };
    const getItemMemberTypeSearch = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/item/member-type/search`, method: 'GET',
            params
        }, options);
    };
    const postMemberType = (createMemberTypeRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/member-type`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: createMemberTypeRequestModel
        }, options);
    };
    const getMemberTypeById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/member-type/${id}`, method: 'GET'
        }, options);
    };
    const deleteMemberTypeById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/member-type/${id}`, method: 'DELETE'
        }, options);
    };
    const putMemberTypeById = (id, updateMemberTypeRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/member-type/${id}`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: updateMemberTypeRequestModel
        }, options);
    };
    const getMemberTypeByIdCompositionReferences = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/member-type/${id}/composition-references`, method: 'GET'
        }, options);
    };
    const postMemberTypeByIdCopy = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/member-type/${id}/copy`, method: 'POST'
        }, options);
    };
    const postMemberTypeAvailableCompositions = (memberTypeCompositionRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/member-type/available-compositions`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: memberTypeCompositionRequestModel
        }, options);
    };
    const getMemberTypeConfiguration = (options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/member-type/configuration`, method: 'GET'
        }, options);
    };
    const getTreeMemberTypeRoot = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/tree/member-type/root`, method: 'GET',
            params
        }, options);
    };
    const getFilterMember = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/filter/member`, method: 'GET',
            params
        }, options);
    };
    const getItemMember = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/item/member`, method: 'GET',
            params
        }, options);
    };
    const getItemMemberSearch = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/item/member/search`, method: 'GET',
            params
        }, options);
    };
    const postMember = (createMemberRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/member`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: createMemberRequestModel
        }, options);
    };
    const getMemberById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/member/${id}`, method: 'GET'
        }, options);
    };
    const deleteMemberById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/member/${id}`, method: 'DELETE'
        }, options);
    };
    const putMemberById = (id, updateMemberRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/member/${id}`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: updateMemberRequestModel
        }, options);
    };
    const putMemberByIdValidate = (id, updateMemberRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/member/${id}/validate`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: updateMemberRequestModel
        }, options);
    };
    const getMemberConfiguration = (options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/member/configuration`, method: 'GET'
        }, options);
    };
    const postMemberValidate = (createMemberRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/member/validate`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: createMemberRequestModel
        }, options);
    };
    const postModelsBuilderBuild = (options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/models-builder/build`, method: 'POST'
        }, options);
    };
    const getModelsBuilderDashboard = (options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/models-builder/dashboard`, method: 'GET'
        }, options);
    };
    const getModelsBuilderStatus = (options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/models-builder/status`, method: 'GET'
        }, options);
    };
    const getObjectTypes = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/object-types`, method: 'GET',
            params
        }, options);
    };
    const getOembedQuery = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/oembed/query`, method: 'GET',
            params
        }, options);
    };
    const postPackageByNameRunMigration = (name, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/package/${name}/run-migration`, method: 'POST'
        }, options);
    };
    const getPackageConfiguration = (options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/package/configuration`, method: 'GET'
        }, options);
    };
    const getPackageCreated = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/package/created`, method: 'GET',
            params
        }, options);
    };
    const postPackageCreated = (createPackageRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/package/created`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: createPackageRequestModel
        }, options);
    };
    const getPackageCreatedById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/package/created/${id}`, method: 'GET'
        }, options);
    };
    const deletePackageCreatedById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/package/created/${id}`, method: 'DELETE'
        }, options);
    };
    const putPackageCreatedById = (id, updatePackageRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/package/created/${id}`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: updatePackageRequestModel
        }, options);
    };
    const getPackageCreatedByIdDownload = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/package/created/${id}/download`, method: 'GET',
            responseType: 'blob'
        }, options);
    };
    const getPackageMigrationStatus = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/package/migration-status`, method: 'GET',
            params
        }, options);
    };
    const getItemPartialView = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/item/partial-view`, method: 'GET',
            params
        }, options);
    };
    const postPartialView = (createPartialViewRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/partial-view`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: createPartialViewRequestModel
        }, options);
    };
    const getPartialViewByPath = (path, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/partial-view/${path}`, method: 'GET'
        }, options);
    };
    const deletePartialViewByPath = (path, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/partial-view/${path}`, method: 'DELETE'
        }, options);
    };
    const putPartialViewByPath = (path, updatePartialViewRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/partial-view/${path}`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: updatePartialViewRequestModel
        }, options);
    };
    const putPartialViewByPathRename = (path, renamePartialViewRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/partial-view/${path}/rename`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: renamePartialViewRequestModel
        }, options);
    };
    const postPartialViewFolder = (createPartialViewFolderRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/partial-view/folder`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: createPartialViewFolderRequestModel
        }, options);
    };
    const getPartialViewFolderByPath = (path, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/partial-view/folder/${path}`, method: 'GET'
        }, options);
    };
    const deletePartialViewFolderByPath = (path, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/partial-view/folder/${path}`, method: 'DELETE'
        }, options);
    };
    const getPartialViewSnippet = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/partial-view/snippet`, method: 'GET',
            params
        }, options);
    };
    const getPartialViewSnippetById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/partial-view/snippet/${id}`, method: 'GET'
        }, options);
    };
    const getTreePartialViewAncestors = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/tree/partial-view/ancestors`, method: 'GET',
            params
        }, options);
    };
    const getTreePartialViewChildren = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/tree/partial-view/children`, method: 'GET',
            params
        }, options);
    };
    const getTreePartialViewRoot = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/tree/partial-view/root`, method: 'GET',
            params
        }, options);
    };
    const deletePreview = (options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/preview`, method: 'DELETE'
        }, options);
    };
    const postPreview = (options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/preview`, method: 'POST'
        }, options);
    };
    const getProfilingStatus = (options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/profiling/status`, method: 'GET'
        }, options);
    };
    const putProfilingStatus = (profilingStatusRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/profiling/status`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: profilingStatusRequestModel
        }, options);
    };
    const getPropertyTypeIsUsed = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/property-type/is-used`, method: 'GET',
            params
        }, options);
    };
    /**
     * @deprecated
     */
    const postPublishedCacheCollect = (options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/published-cache/collect`, method: 'POST'
        }, options);
    };
    const postPublishedCacheRebuild = (options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/published-cache/rebuild`, method: 'POST'
        }, options);
    };
    const postPublishedCacheReload = (options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/published-cache/reload`, method: 'POST'
        }, options);
    };
    /**
     * @deprecated
     */
    const getPublishedCacheStatus = (options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/published-cache/status`, method: 'GET'
        }, options);
    };
    const getRedirectManagement = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/redirect-management`, method: 'GET',
            params
        }, options);
    };
    const getRedirectManagementById = (id, params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/redirect-management/${id}`, method: 'GET',
            params
        }, options);
    };
    const deleteRedirectManagementById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/redirect-management/${id}`, method: 'DELETE'
        }, options);
    };
    const getRedirectManagementStatus = (options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/redirect-management/status`, method: 'GET'
        }, options);
    };
    const postRedirectManagementStatus = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/redirect-management/status`, method: 'POST',
            params
        }, options);
    };
    const getItemRelationType = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/item/relation-type`, method: 'GET',
            params
        }, options);
    };
    const getRelationType = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/relation-type`, method: 'GET',
            params
        }, options);
    };
    const getRelationTypeById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/relation-type/${id}`, method: 'GET'
        }, options);
    };
    const getRelationByRelationTypeId = (id, params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/relation/type/${id}`, method: 'GET',
            params
        }, options);
    };
    const getItemScript = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/item/script`, method: 'GET',
            params
        }, options);
    };
    const postScript = (createScriptRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/script`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: createScriptRequestModel
        }, options);
    };
    const getScriptByPath = (path, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/script/${path}`, method: 'GET'
        }, options);
    };
    const deleteScriptByPath = (path, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/script/${path}`, method: 'DELETE'
        }, options);
    };
    const putScriptByPath = (path, updateScriptRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/script/${path}`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: updateScriptRequestModel
        }, options);
    };
    const putScriptByPathRename = (path, renameScriptRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/script/${path}/rename`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: renameScriptRequestModel
        }, options);
    };
    const postScriptFolder = (createScriptFolderRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/script/folder`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: createScriptFolderRequestModel
        }, options);
    };
    const getScriptFolderByPath = (path, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/script/folder/${path}`, method: 'GET'
        }, options);
    };
    const deleteScriptFolderByPath = (path, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/script/folder/${path}`, method: 'DELETE'
        }, options);
    };
    const getTreeScriptAncestors = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/tree/script/ancestors`, method: 'GET',
            params
        }, options);
    };
    const getTreeScriptChildren = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/tree/script/children`, method: 'GET',
            params
        }, options);
    };
    const getTreeScriptRoot = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/tree/script/root`, method: 'GET',
            params
        }, options);
    };
    const getSearcher = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/searcher`, method: 'GET',
            params
        }, options);
    };
    const getSearcherBySearcherNameQuery = (searcherName, params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/searcher/${searcherName}/query`, method: 'GET',
            params
        }, options);
    };
    const getSecurityConfiguration = (options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/security/configuration`, method: 'GET'
        }, options);
    };
    const postSecurityForgotPassword = (resetPasswordRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/security/forgot-password`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: resetPasswordRequestModel
        }, options);
    };
    const postSecurityForgotPasswordReset = (resetPasswordTokenRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/security/forgot-password/reset`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: resetPasswordTokenRequestModel
        }, options);
    };
    const postSecurityForgotPasswordVerify = (verifyResetPasswordTokenRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/security/forgot-password/verify`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: verifyResetPasswordTokenRequestModel
        }, options);
    };
    const getSegment = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/segment`, method: 'GET',
            params
        }, options);
    };
    const getServerConfiguration = (options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/server/configuration`, method: 'GET'
        }, options);
    };
    const getServerInformation = (options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/server/information`, method: 'GET'
        }, options);
    };
    const getServerStatus = (options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/server/status`, method: 'GET'
        }, options);
    };
    const getServerTroubleshooting = (options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/server/troubleshooting`, method: 'GET'
        }, options);
    };
    const getServerUpgradeCheck = (options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/server/upgrade-check`, method: 'GET'
        }, options);
    };
    const getItemStaticFile = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/item/static-file`, method: 'GET',
            params
        }, options);
    };
    const getTreeStaticFileAncestors = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/tree/static-file/ancestors`, method: 'GET',
            params
        }, options);
    };
    const getTreeStaticFileChildren = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/tree/static-file/children`, method: 'GET',
            params
        }, options);
    };
    const getTreeStaticFileRoot = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/tree/static-file/root`, method: 'GET',
            params
        }, options);
    };
    const getItemStylesheet = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/item/stylesheet`, method: 'GET',
            params
        }, options);
    };
    const postStylesheet = (createStylesheetRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/stylesheet`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: createStylesheetRequestModel
        }, options);
    };
    const getStylesheetByPath = (path, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/stylesheet/${path}`, method: 'GET'
        }, options);
    };
    const deleteStylesheetByPath = (path, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/stylesheet/${path}`, method: 'DELETE'
        }, options);
    };
    const putStylesheetByPath = (path, updateStylesheetRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/stylesheet/${path}`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: updateStylesheetRequestModel
        }, options);
    };
    const putStylesheetByPathRename = (path, renameStylesheetRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/stylesheet/${path}/rename`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: renameStylesheetRequestModel
        }, options);
    };
    const postStylesheetFolder = (createStylesheetFolderRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/stylesheet/folder`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: createStylesheetFolderRequestModel
        }, options);
    };
    const getStylesheetFolderByPath = (path, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/stylesheet/folder/${path}`, method: 'GET'
        }, options);
    };
    const deleteStylesheetFolderByPath = (path, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/stylesheet/folder/${path}`, method: 'DELETE'
        }, options);
    };
    const getTreeStylesheetAncestors = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/tree/stylesheet/ancestors`, method: 'GET',
            params
        }, options);
    };
    const getTreeStylesheetChildren = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/tree/stylesheet/children`, method: 'GET',
            params
        }, options);
    };
    const getTreeStylesheetRoot = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/tree/stylesheet/root`, method: 'GET',
            params
        }, options);
    };
    const getTag = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/tag`, method: 'GET',
            params
        }, options);
    };
    const getTelemetry = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/telemetry`, method: 'GET',
            params
        }, options);
    };
    const getTelemetryLevel = (options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/telemetry/level`, method: 'GET'
        }, options);
    };
    const postTelemetryLevel = (telemetryRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/telemetry/level`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: telemetryRequestModel
        }, options);
    };
    const getItemTemplate = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/item/template`, method: 'GET',
            params
        }, options);
    };
    const getItemTemplateSearch = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/item/template/search`, method: 'GET',
            params
        }, options);
    };
    const postTemplate = (createTemplateRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/template`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: createTemplateRequestModel
        }, options);
    };
    const getTemplateById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/template/${id}`, method: 'GET'
        }, options);
    };
    const deleteTemplateById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/template/${id}`, method: 'DELETE'
        }, options);
    };
    const putTemplateById = (id, updateTemplateRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/template/${id}`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: updateTemplateRequestModel
        }, options);
    };
    const getTemplateConfiguration = (options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/template/configuration`, method: 'GET'
        }, options);
    };
    const postTemplateQueryExecute = (templateQueryExecuteModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/template/query/execute`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: templateQueryExecuteModel
        }, options);
    };
    const getTemplateQuerySettings = (options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/template/query/settings`, method: 'GET'
        }, options);
    };
    const getTreeTemplateAncestors = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/tree/template/ancestors`, method: 'GET',
            params
        }, options);
    };
    const getTreeTemplateChildren = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/tree/template/children`, method: 'GET',
            params
        }, options);
    };
    const getTreeTemplateRoot = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/tree/template/root`, method: 'GET',
            params
        }, options);
    };
    const postTemporaryFile = (postTemporaryFileBody, options) => {
        const formData = new FormData();
        formData.append('Id', postTemporaryFileBody.Id);
        formData.append('File', postTemporaryFileBody.File);
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/temporary-file`, method: 'POST',
            headers: { 'Content-Type': 'multipart/form-data', },
            data: formData
        }, options);
    };
    const getTemporaryFileById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/temporary-file/${id}`, method: 'GET'
        }, options);
    };
    const deleteTemporaryFileById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/temporary-file/${id}`, method: 'DELETE'
        }, options);
    };
    const getTemporaryFileConfiguration = (options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/temporary-file/configuration`, method: 'GET'
        }, options);
    };
    const postUpgradeAuthorize = (options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/upgrade/authorize`, method: 'POST'
        }, options);
    };
    const getUpgradeSettings = (options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/upgrade/settings`, method: 'GET'
        }, options);
    };
    const postUserData = (createUserDataRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user-data`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: createUserDataRequestModel
        }, options);
    };
    const getUserData = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user-data`, method: 'GET',
            params
        }, options);
    };
    const putUserData = (updateUserDataRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user-data`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: updateUserDataRequestModel
        }, options);
    };
    const getUserDataById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user-data/${id}`, method: 'GET'
        }, options);
    };
    const getFilterUserGroup = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/filter/user-group`, method: 'GET',
            params
        }, options);
    };
    const getItemUserGroup = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/item/user-group`, method: 'GET',
            params
        }, options);
    };
    const deleteUserGroup = (deleteUserGroupsRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user-group`, method: 'DELETE',
            headers: { 'Content-Type': 'application/json', },
            data: deleteUserGroupsRequestModel
        }, options);
    };
    const postUserGroup = (createUserGroupRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user-group`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: createUserGroupRequestModel
        }, options);
    };
    const getUserGroup = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user-group`, method: 'GET',
            params
        }, options);
    };
    const getUserGroupById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user-group/${id}`, method: 'GET'
        }, options);
    };
    const deleteUserGroupById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user-group/${id}`, method: 'DELETE'
        }, options);
    };
    const putUserGroupById = (id, updateUserGroupRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user-group/${id}`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: updateUserGroupRequestModel
        }, options);
    };
    const deleteUserGroupByIdUsers = (id, referenceByIdModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user-group/${id}/users`, method: 'DELETE',
            headers: { 'Content-Type': 'application/json', },
            data: referenceByIdModel
        }, options);
    };
    const postUserGroupByIdUsers = (id, referenceByIdModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user-group/${id}/users`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: referenceByIdModel
        }, options);
    };
    const getFilterUser = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/filter/user`, method: 'GET',
            params
        }, options);
    };
    const getItemUser = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/item/user`, method: 'GET',
            params
        }, options);
    };
    const postUser = (createUserRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: createUserRequestModel
        }, options);
    };
    const deleteUser = (deleteUsersRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user`, method: 'DELETE',
            headers: { 'Content-Type': 'application/json', },
            data: deleteUsersRequestModel
        }, options);
    };
    const getUser = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user`, method: 'GET',
            params
        }, options);
    };
    const getUserById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user/${id}`, method: 'GET'
        }, options);
    };
    const deleteUserById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user/${id}`, method: 'DELETE'
        }, options);
    };
    const putUserById = (id, updateUserRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user/${id}`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: updateUserRequestModel
        }, options);
    };
    const getUserById2fa = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user/${id}/2fa`, method: 'GET'
        }, options);
    };
    const deleteUserById2faByProviderName = (id, providerName, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user/${id}/2fa/${providerName}`, method: 'DELETE'
        }, options);
    };
    const getUserByIdCalculateStartNodes = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user/${id}/calculate-start-nodes`, method: 'GET'
        }, options);
    };
    const postUserByIdChangePassword = (id, changePasswordUserRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user/${id}/change-password`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: changePasswordUserRequestModel
        }, options);
    };
    const postUserByIdClientCredentials = (id, createUserClientCredentialsRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user/${id}/client-credentials`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: createUserClientCredentialsRequestModel
        }, options);
    };
    const getUserByIdClientCredentials = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user/${id}/client-credentials`, method: 'GET'
        }, options);
    };
    const deleteUserByIdClientCredentialsByClientId = (id, clientId, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user/${id}/client-credentials/${clientId}`, method: 'DELETE'
        }, options);
    };
    const postUserByIdResetPassword = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user/${id}/reset-password`, method: 'POST'
        }, options);
    };
    const deleteUserAvatarById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user/avatar/${id}`, method: 'DELETE'
        }, options);
    };
    const postUserAvatarById = (id, setAvatarRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user/avatar/${id}`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: setAvatarRequestModel
        }, options);
    };
    const getUserConfiguration = (options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user/configuration`, method: 'GET'
        }, options);
    };
    const getUserCurrent = (options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user/current`, method: 'GET'
        }, options);
    };
    const getUserCurrent2fa = (options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user/current/2fa`, method: 'GET'
        }, options);
    };
    const deleteUserCurrent2faByProviderName = (providerName, params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user/current/2fa/${providerName}`, method: 'DELETE',
            params
        }, options);
    };
    const postUserCurrent2faByProviderName = (providerName, enableTwoFactorRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user/current/2fa/${providerName}`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: enableTwoFactorRequestModel
        }, options);
    };
    const getUserCurrent2faByProviderName = (providerName, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user/current/2fa/${providerName}`, method: 'GET'
        }, options);
    };
    const postUserCurrentAvatar = (setAvatarRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user/current/avatar`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: setAvatarRequestModel
        }, options);
    };
    const postUserCurrentChangePassword = (changePasswordCurrentUserRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user/current/change-password`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: changePasswordCurrentUserRequestModel
        }, options);
    };
    const getUserCurrentConfiguration = (options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user/current/configuration`, method: 'GET'
        }, options);
    };
    const getUserCurrentLoginProviders = (options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user/current/login-providers`, method: 'GET'
        }, options);
    };
    const getUserCurrentPermissions = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user/current/permissions`, method: 'GET',
            params
        }, options);
    };
    const getUserCurrentPermissionsDocument = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user/current/permissions/document`, method: 'GET',
            params
        }, options);
    };
    const getUserCurrentPermissionsMedia = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user/current/permissions/media`, method: 'GET',
            params
        }, options);
    };
    const postUserDisable = (disableUserRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user/disable`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: disableUserRequestModel
        }, options);
    };
    const postUserEnable = (enableUserRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user/enable`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: enableUserRequestModel
        }, options);
    };
    const postUserInvite = (inviteUserRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user/invite`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: inviteUserRequestModel
        }, options);
    };
    const postUserInviteCreatePassword = (createInitialPasswordUserRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user/invite/create-password`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: createInitialPasswordUserRequestModel
        }, options);
    };
    const postUserInviteResend = (resendInviteUserRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user/invite/resend`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: resendInviteUserRequestModel
        }, options);
    };
    const postUserInviteVerify = (verifyInviteUserRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user/invite/verify`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: verifyInviteUserRequestModel
        }, options);
    };
    const postUserSetUserGroups = (updateUserGroupsOnUserRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user/set-user-groups`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: updateUserGroupsOnUserRequestModel
        }, options);
    };
    const postUserUnlock = (unlockUsersRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/user/unlock`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: unlockUsersRequestModel
        }, options);
    };
    const getItemWebhook = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/item/webhook`, method: 'GET',
            params
        }, options);
    };
    const getWebhook = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/webhook`, method: 'GET',
            params
        }, options);
    };
    const postWebhook = (createWebhookRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/webhook`, method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            data: createWebhookRequestModel
        }, options);
    };
    const getWebhookById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/webhook/${id}`, method: 'GET'
        }, options);
    };
    const deleteWebhookById = (id, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/webhook/${id}`, method: 'DELETE'
        }, options);
    };
    const putWebhookById = (id, updateWebhookRequestModel, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/webhook/${id}`, method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            data: updateWebhookRequestModel
        }, options);
    };
    const getWebhookByIdLogs = (id, params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/webhook/${id}/logs`, method: 'GET',
            params
        }, options);
    };
    const getWebhookEvents = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/webhook/events`, method: 'GET',
            params
        }, options);
    };
    const getWebhookLogs = (params, options) => {
        return UmbracoManagementClient({ url: `/umbraco/management/api/v1/webhook/logs`, method: 'GET',
            params
        }, options);
    };
    return { getCulture, postDataType, getDataTypeById, deleteDataTypeById, putDataTypeById, postDataTypeByIdCopy, getDataTypeByIdIsUsed, putDataTypeByIdMove, getDataTypeByIdReferences, getDataTypeConfiguration, postDataTypeFolder, getDataTypeFolderById, deleteDataTypeFolderById, putDataTypeFolderById, getFilterDataType, getItemDataType, getItemDataTypeSearch, getTreeDataTypeAncestors, getTreeDataTypeChildren, getTreeDataTypeRoot, getDictionary, postDictionary, getDictionaryById, deleteDictionaryById, putDictionaryById, getDictionaryByIdExport, putDictionaryByIdMove, postDictionaryImport, getItemDictionary, getTreeDictionaryAncestors, getTreeDictionaryChildren, getTreeDictionaryRoot, postDocumentBlueprint, getDocumentBlueprintById, deleteDocumentBlueprintById, putDocumentBlueprintById, putDocumentBlueprintByIdMove, postDocumentBlueprintFolder, getDocumentBlueprintFolderById, deleteDocumentBlueprintFolderById, putDocumentBlueprintFolderById, postDocumentBlueprintFromDocument, getItemDocumentBlueprint, getTreeDocumentBlueprintAncestors, getTreeDocumentBlueprintChildren, getTreeDocumentBlueprintRoot, postDocumentType, getDocumentTypeById, deleteDocumentTypeById, putDocumentTypeById, getDocumentTypeByIdAllowedChildren, getDocumentTypeByIdBlueprint, getDocumentTypeByIdCompositionReferences, postDocumentTypeByIdCopy, getDocumentTypeByIdExport, putDocumentTypeByIdImport, putDocumentTypeByIdMove, getDocumentTypeAllowedAtRoot, postDocumentTypeAvailableCompositions, getDocumentTypeConfiguration, postDocumentTypeFolder, getDocumentTypeFolderById, deleteDocumentTypeFolderById, putDocumentTypeFolderById, postDocumentTypeImport, getItemDocumentType, getItemDocumentTypeSearch, getTreeDocumentTypeAncestors, getTreeDocumentTypeChildren, getTreeDocumentTypeRoot, getDocumentVersion, getDocumentVersionById, putDocumentVersionByIdPreventCleanup, postDocumentVersionByIdRollback, getCollectionDocumentById, postDocument, getDocumentById, deleteDocumentById, putDocumentById, getDocumentByIdAuditLog, postDocumentByIdCopy, getDocumentByIdDomains, putDocumentByIdDomains, putDocumentByIdMove, putDocumentByIdMoveToRecycleBin, getDocumentByIdNotifications, putDocumentByIdNotifications, postDocumentByIdPublicAccess, deleteDocumentByIdPublicAccess, getDocumentByIdPublicAccess, putDocumentByIdPublicAccess, putDocumentByIdPublish, putDocumentByIdPublishWithDescendants, getDocumentByIdPublished, getDocumentByIdReferencedBy, getDocumentByIdReferencedDescendants, putDocumentByIdUnpublish, putDocumentByIdValidate, putUmbracoManagementApiV11DocumentByIdValidate11, getDocumentAreReferenced, getDocumentConfiguration, putDocumentSort, getDocumentUrls, postDocumentValidate, getItemDocument, getItemDocumentSearch, deleteRecycleBinDocument, deleteRecycleBinDocumentById, getRecycleBinDocumentByIdOriginalParent, putRecycleBinDocumentByIdRestore, getRecycleBinDocumentChildren, getRecycleBinDocumentRoot, getTreeDocumentAncestors, getTreeDocumentChildren, getTreeDocumentRoot, postDynamicRootQuery, getDynamicRootSteps, getHealthCheckGroup, getHealthCheckGroupByName, postHealthCheckGroupByNameCheck, postHealthCheckExecuteAction, getHelp, getImagingResizeUrls, getImportAnalyze, getIndexer, getIndexerByIndexName, postIndexerByIndexNameRebuild, getInstallSettings, postInstallSetup, postInstallValidateDatabase, getItemLanguage, getItemLanguageDefault, getLanguage, postLanguage, getLanguageByIsoCode, deleteLanguageByIsoCode, putLanguageByIsoCode, getLogViewerLevel, getLogViewerLevelCount, getLogViewerLog, getLogViewerMessageTemplate, getLogViewerSavedSearch, postLogViewerSavedSearch, getLogViewerSavedSearchByName, deleteLogViewerSavedSearchByName, getLogViewerValidateLogsSize, getManifestManifest, getManifestManifestPrivate, getManifestManifestPublic, getItemMediaType, getItemMediaTypeAllowed, getItemMediaTypeFolders, getItemMediaTypeSearch, postMediaType, getMediaTypeById, deleteMediaTypeById, putMediaTypeById, getMediaTypeByIdAllowedChildren, getMediaTypeByIdCompositionReferences, postMediaTypeByIdCopy, getMediaTypeByIdExport, putMediaTypeByIdImport, putMediaTypeByIdMove, getMediaTypeAllowedAtRoot, postMediaTypeAvailableCompositions, getMediaTypeConfiguration, postMediaTypeFolder, getMediaTypeFolderById, deleteMediaTypeFolderById, putMediaTypeFolderById, postMediaTypeImport, getTreeMediaTypeAncestors, getTreeMediaTypeChildren, getTreeMediaTypeRoot, getCollectionMedia, getItemMedia, getItemMediaSearch, postMedia, getMediaById, deleteMediaById, putMediaById, getMediaByIdAuditLog, putMediaByIdMove, putMediaByIdMoveToRecycleBin, getMediaByIdReferencedBy, getMediaByIdReferencedDescendants, putMediaByIdValidate, getMediaAreReferenced, getMediaConfiguration, putMediaSort, getMediaUrls, postMediaValidate, deleteRecycleBinMedia, deleteRecycleBinMediaById, getRecycleBinMediaByIdOriginalParent, putRecycleBinMediaByIdRestore, getRecycleBinMediaChildren, getRecycleBinMediaRoot, getTreeMediaAncestors, getTreeMediaChildren, getTreeMediaRoot, getItemMemberGroup, getMemberGroup, postMemberGroup, getMemberGroupById, deleteMemberGroupById, putMemberGroupById, getTreeMemberGroupRoot, getItemMemberType, getItemMemberTypeSearch, postMemberType, getMemberTypeById, deleteMemberTypeById, putMemberTypeById, getMemberTypeByIdCompositionReferences, postMemberTypeByIdCopy, postMemberTypeAvailableCompositions, getMemberTypeConfiguration, getTreeMemberTypeRoot, getFilterMember, getItemMember, getItemMemberSearch, postMember, getMemberById, deleteMemberById, putMemberById, putMemberByIdValidate, getMemberConfiguration, postMemberValidate, postModelsBuilderBuild, getModelsBuilderDashboard, getModelsBuilderStatus, getObjectTypes, getOembedQuery, postPackageByNameRunMigration, getPackageConfiguration, getPackageCreated, postPackageCreated, getPackageCreatedById, deletePackageCreatedById, putPackageCreatedById, getPackageCreatedByIdDownload, getPackageMigrationStatus, getItemPartialView, postPartialView, getPartialViewByPath, deletePartialViewByPath, putPartialViewByPath, putPartialViewByPathRename, postPartialViewFolder, getPartialViewFolderByPath, deletePartialViewFolderByPath, getPartialViewSnippet, getPartialViewSnippetById, getTreePartialViewAncestors, getTreePartialViewChildren, getTreePartialViewRoot, deletePreview, postPreview, getProfilingStatus, putProfilingStatus, getPropertyTypeIsUsed, postPublishedCacheCollect, postPublishedCacheRebuild, postPublishedCacheReload, getPublishedCacheStatus, getRedirectManagement, getRedirectManagementById, deleteRedirectManagementById, getRedirectManagementStatus, postRedirectManagementStatus, getItemRelationType, getRelationType, getRelationTypeById, getRelationByRelationTypeId, getItemScript, postScript, getScriptByPath, deleteScriptByPath, putScriptByPath, putScriptByPathRename, postScriptFolder, getScriptFolderByPath, deleteScriptFolderByPath, getTreeScriptAncestors, getTreeScriptChildren, getTreeScriptRoot, getSearcher, getSearcherBySearcherNameQuery, getSecurityConfiguration, postSecurityForgotPassword, postSecurityForgotPasswordReset, postSecurityForgotPasswordVerify, getSegment, getServerConfiguration, getServerInformation, getServerStatus, getServerTroubleshooting, getServerUpgradeCheck, getItemStaticFile, getTreeStaticFileAncestors, getTreeStaticFileChildren, getTreeStaticFileRoot, getItemStylesheet, postStylesheet, getStylesheetByPath, deleteStylesheetByPath, putStylesheetByPath, putStylesheetByPathRename, postStylesheetFolder, getStylesheetFolderByPath, deleteStylesheetFolderByPath, getTreeStylesheetAncestors, getTreeStylesheetChildren, getTreeStylesheetRoot, getTag, getTelemetry, getTelemetryLevel, postTelemetryLevel, getItemTemplate, getItemTemplateSearch, postTemplate, getTemplateById, deleteTemplateById, putTemplateById, getTemplateConfiguration, postTemplateQueryExecute, getTemplateQuerySettings, getTreeTemplateAncestors, getTreeTemplateChildren, getTreeTemplateRoot, postTemporaryFile, getTemporaryFileById, deleteTemporaryFileById, getTemporaryFileConfiguration, postUpgradeAuthorize, getUpgradeSettings, postUserData, getUserData, putUserData, getUserDataById, getFilterUserGroup, getItemUserGroup, deleteUserGroup, postUserGroup, getUserGroup, getUserGroupById, deleteUserGroupById, putUserGroupById, deleteUserGroupByIdUsers, postUserGroupByIdUsers, getFilterUser, getItemUser, postUser, deleteUser, getUser, getUserById, deleteUserById, putUserById, getUserById2fa, deleteUserById2faByProviderName, getUserByIdCalculateStartNodes, postUserByIdChangePassword, postUserByIdClientCredentials, getUserByIdClientCredentials, deleteUserByIdClientCredentialsByClientId, postUserByIdResetPassword, deleteUserAvatarById, postUserAvatarById, getUserConfiguration, getUserCurrent, getUserCurrent2fa, deleteUserCurrent2faByProviderName, postUserCurrent2faByProviderName, getUserCurrent2faByProviderName, postUserCurrentAvatar, postUserCurrentChangePassword, getUserCurrentConfiguration, getUserCurrentLoginProviders, getUserCurrentPermissions, getUserCurrentPermissionsDocument, getUserCurrentPermissionsMedia, postUserDisable, postUserEnable, postUserInvite, postUserInviteCreatePassword, postUserInviteResend, postUserInviteVerify, postUserSetUserGroups, postUserUnlock, getItemWebhook, getWebhook, postWebhook, getWebhookById, deleteWebhookById, putWebhookById, getWebhookByIdLogs, getWebhookEvents, getWebhookLogs };
};
