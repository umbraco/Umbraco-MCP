#!/usr/bin/env node
"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } var _class; var _class2;
// src/index.ts
var _stdiojs = require('@modelcontextprotocol/sdk/server/stdio.js');

// src/server/umbraco-mcp-server.ts
var _mcpjs = require('@modelcontextprotocol/sdk/server/mcp.js');
var UmbracoMcpServer = (_class = class _UmbracoMcpServer {
  static __initStatic() {this.instance = null}
  constructor() {
  }
  static GetServer() {
    if (_UmbracoMcpServer.instance === null) {
      _UmbracoMcpServer.instance = new (0, _mcpjs.McpServer)({
        name: "Umbraco Server",
        version: "1.0.0",
        capabilities: {
          tools: {}
        }
      });
    }
    return _UmbracoMcpServer.instance;
  }
}, _class.__initStatic(), _class);

// src/api/umbraco/clients/umbraco-management-client.ts
var _axios = require('axios'); var _axios2 = _interopRequireDefault(_axios);
var client_id = process.env.UMBRACO_CLIENT_ID;
var client_secret = process.env.UMBRACO_CLIENT_SECRET;
var grant_type = "client_credentials";
var baseURL = process.env.UMBRACO_BASE_URL;
if (!baseURL)
  throw new Error("Missing required environment variable: UMBRACO_BASE_URL");
if (!client_id)
  throw new Error("Missing required environment variable: UMBRACO_CLIENT_ID");
if (!client_secret && client_id !== "umbraco-swagger")
  throw new Error(
    "Missing required environment variable: UMBRACO_CLIENT_SECRET"
  );
var tokenPath = "/umbraco/management/api/v1/security/back-office/token";
var UmbracoAxios = _axios2.default.create({ baseURL });
var accessToken = null;
var tokenExpiry = null;
var fetchAccessToken = async () => {
  const response = await _axios2.default.post(
    `${baseURL}${tokenPath}`,
    {
      client_id,
      client_secret: _nullishCoalesce(client_secret, () => ( "")),
      grant_type
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
  );
  const { access_token, expires_in } = response.data;
  accessToken = access_token;
  tokenExpiry = Date.now() + expires_in * 1e3;
  return accessToken;
};
UmbracoAxios.interceptors.request.use(async (config) => {
  if (!accessToken || tokenExpiry && Date.now() >= tokenExpiry) {
    await fetchAccessToken();
  }
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});
UmbracoAxios.interceptors.response.use(
  (response) => response,
  // Pass through successful responses
  (error) => {
    if (error.response) {
      console.error(
        `HTTP Error: ${error.response.status}`,
        error.response.data
      );
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
    return Promise.reject(error);
  }
);
var UmbracoManagementClient = (config, options) => {
  const source = _axios2.default.CancelToken.source();
  const promise = UmbracoAxios({
    ...config,
    ...options,
    cancelToken: source.token
  }).then(({ data }) => data);
  promise.cancel = () => {
    source.cancel("Query was cancelled");
  };
  return promise;
};

// src/api/umbraco/management/umbracoManagementAPI.ts
var getUmbracoManagementAPI = () => {
  const getCulture = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/culture`,
        method: "GET",
        params
      },
      options
    );
  };
  const postDataType = (createDataTypeRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/data-type`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: createDataTypeRequestModel
      },
      options
    );
  };
  const getDataTypeById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/data-type/${id}`,
        method: "GET"
      },
      options
    );
  };
  const deleteDataTypeById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/data-type/${id}`,
        method: "DELETE"
      },
      options
    );
  };
  const putDataTypeById = (id, updateDataTypeRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/data-type/${id}`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: updateDataTypeRequestModel
      },
      options
    );
  };
  const postDataTypeByIdCopy = (id, copyDataTypeRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/data-type/${id}/copy`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: copyDataTypeRequestModel
      },
      options
    );
  };
  const getDataTypeByIdIsUsed = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/data-type/${id}/is-used`,
        method: "GET"
      },
      options
    );
  };
  const putDataTypeByIdMove = (id, moveDataTypeRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/data-type/${id}/move`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: moveDataTypeRequestModel
      },
      options
    );
  };
  const getDataTypeByIdReferences = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/data-type/${id}/references`,
        method: "GET"
      },
      options
    );
  };
  const getDataTypeConfiguration = (options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/data-type/configuration`,
        method: "GET"
      },
      options
    );
  };
  const postDataTypeFolder = (createFolderRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/data-type/folder`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: createFolderRequestModel
      },
      options
    );
  };
  const getDataTypeFolderById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/data-type/folder/${id}`,
        method: "GET"
      },
      options
    );
  };
  const deleteDataTypeFolderById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/data-type/folder/${id}`,
        method: "DELETE"
      },
      options
    );
  };
  const putDataTypeFolderById = (id, updateFolderResponseModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/data-type/folder/${id}`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: updateFolderResponseModel
      },
      options
    );
  };
  const getFilterDataType = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/filter/data-type`,
        method: "GET",
        params
      },
      options
    );
  };
  const getItemDataType = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/item/data-type`,
        method: "GET",
        params
      },
      options
    );
  };
  const getItemDataTypeSearch = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/item/data-type/search`,
        method: "GET",
        params
      },
      options
    );
  };
  const getTreeDataTypeAncestors = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/tree/data-type/ancestors`,
        method: "GET",
        params
      },
      options
    );
  };
  const getTreeDataTypeChildren = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/tree/data-type/children`,
        method: "GET",
        params
      },
      options
    );
  };
  const getTreeDataTypeRoot = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/tree/data-type/root`,
        method: "GET",
        params
      },
      options
    );
  };
  const getDictionary = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/dictionary`,
        method: "GET",
        params
      },
      options
    );
  };
  const postDictionary = (createDictionaryItemRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/dictionary`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: createDictionaryItemRequestModel
      },
      options
    );
  };
  const getDictionaryById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/dictionary/${id}`,
        method: "GET"
      },
      options
    );
  };
  const deleteDictionaryById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/dictionary/${id}`,
        method: "DELETE"
      },
      options
    );
  };
  const putDictionaryById = (id, updateDictionaryItemRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/dictionary/${id}`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: updateDictionaryItemRequestModel
      },
      options
    );
  };
  const getDictionaryByIdExport = (id, params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/dictionary/${id}/export`,
        method: "GET",
        params,
        responseType: "blob"
      },
      options
    );
  };
  const putDictionaryByIdMove = (id, moveDictionaryRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/dictionary/${id}/move`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: moveDictionaryRequestModel
      },
      options
    );
  };
  const postDictionaryImport = (importDictionaryRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/dictionary/import`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: importDictionaryRequestModel
      },
      options
    );
  };
  const getItemDictionary = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/item/dictionary`,
        method: "GET",
        params
      },
      options
    );
  };
  const getTreeDictionaryAncestors = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/tree/dictionary/ancestors`,
        method: "GET",
        params
      },
      options
    );
  };
  const getTreeDictionaryChildren = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/tree/dictionary/children`,
        method: "GET",
        params
      },
      options
    );
  };
  const getTreeDictionaryRoot = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/tree/dictionary/root`,
        method: "GET",
        params
      },
      options
    );
  };
  const postDocumentBlueprint = (createDocumentBlueprintRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document-blueprint`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: createDocumentBlueprintRequestModel
      },
      options
    );
  };
  const getDocumentBlueprintById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document-blueprint/${id}`,
        method: "GET"
      },
      options
    );
  };
  const deleteDocumentBlueprintById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document-blueprint/${id}`,
        method: "DELETE"
      },
      options
    );
  };
  const putDocumentBlueprintById = (id, updateDocumentBlueprintRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document-blueprint/${id}`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: updateDocumentBlueprintRequestModel
      },
      options
    );
  };
  const putDocumentBlueprintByIdMove = (id, moveDocumentBlueprintRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document-blueprint/${id}/move`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: moveDocumentBlueprintRequestModel
      },
      options
    );
  };
  const postDocumentBlueprintFolder = (createFolderRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document-blueprint/folder`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: createFolderRequestModel
      },
      options
    );
  };
  const getDocumentBlueprintFolderById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document-blueprint/folder/${id}`,
        method: "GET"
      },
      options
    );
  };
  const deleteDocumentBlueprintFolderById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document-blueprint/folder/${id}`,
        method: "DELETE"
      },
      options
    );
  };
  const putDocumentBlueprintFolderById = (id, updateFolderResponseModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document-blueprint/folder/${id}`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: updateFolderResponseModel
      },
      options
    );
  };
  const postDocumentBlueprintFromDocument = (createDocumentBlueprintFromDocumentRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document-blueprint/from-document`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: createDocumentBlueprintFromDocumentRequestModel
      },
      options
    );
  };
  const getItemDocumentBlueprint = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/item/document-blueprint`,
        method: "GET",
        params
      },
      options
    );
  };
  const getTreeDocumentBlueprintAncestors = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/tree/document-blueprint/ancestors`,
        method: "GET",
        params
      },
      options
    );
  };
  const getTreeDocumentBlueprintChildren = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/tree/document-blueprint/children`,
        method: "GET",
        params
      },
      options
    );
  };
  const getTreeDocumentBlueprintRoot = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/tree/document-blueprint/root`,
        method: "GET",
        params
      },
      options
    );
  };
  const postDocumentType = (createDocumentTypeRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document-type`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: createDocumentTypeRequestModel
      },
      options
    );
  };
  const getDocumentTypeById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document-type/${id}`,
        method: "GET"
      },
      options
    );
  };
  const deleteDocumentTypeById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document-type/${id}`,
        method: "DELETE"
      },
      options
    );
  };
  const putDocumentTypeById = (id, updateDocumentTypeRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document-type/${id}`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: updateDocumentTypeRequestModel
      },
      options
    );
  };
  const getDocumentTypeByIdAllowedChildren = (id, params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document-type/${id}/allowed-children`,
        method: "GET",
        params
      },
      options
    );
  };
  const getDocumentTypeByIdBlueprint = (id, params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document-type/${id}/blueprint`,
        method: "GET",
        params
      },
      options
    );
  };
  const getDocumentTypeByIdCompositionReferences = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document-type/${id}/composition-references`,
        method: "GET"
      },
      options
    );
  };
  const postDocumentTypeByIdCopy = (id, copyDocumentTypeRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document-type/${id}/copy`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: copyDocumentTypeRequestModel
      },
      options
    );
  };
  const getDocumentTypeByIdExport = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document-type/${id}/export`,
        method: "GET",
        responseType: "blob"
      },
      options
    );
  };
  const putDocumentTypeByIdImport = (id, importDocumentTypeRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document-type/${id}/import`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: importDocumentTypeRequestModel
      },
      options
    );
  };
  const putDocumentTypeByIdMove = (id, moveDocumentTypeRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document-type/${id}/move`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: moveDocumentTypeRequestModel
      },
      options
    );
  };
  const getDocumentTypeAllowedAtRoot = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document-type/allowed-at-root`,
        method: "GET",
        params
      },
      options
    );
  };
  const postDocumentTypeAvailableCompositions = (documentTypeCompositionRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document-type/available-compositions`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: documentTypeCompositionRequestModel
      },
      options
    );
  };
  const getDocumentTypeConfiguration = (options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document-type/configuration`,
        method: "GET"
      },
      options
    );
  };
  const postDocumentTypeFolder = (createFolderRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document-type/folder`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: createFolderRequestModel
      },
      options
    );
  };
  const getDocumentTypeFolderById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document-type/folder/${id}`,
        method: "GET"
      },
      options
    );
  };
  const deleteDocumentTypeFolderById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document-type/folder/${id}`,
        method: "DELETE"
      },
      options
    );
  };
  const putDocumentTypeFolderById = (id, updateFolderResponseModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document-type/folder/${id}`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: updateFolderResponseModel
      },
      options
    );
  };
  const postDocumentTypeImport = (importDocumentTypeRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document-type/import`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: importDocumentTypeRequestModel
      },
      options
    );
  };
  const getItemDocumentType = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/item/document-type`,
        method: "GET",
        params
      },
      options
    );
  };
  const getItemDocumentTypeSearch = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/item/document-type/search`,
        method: "GET",
        params
      },
      options
    );
  };
  const getTreeDocumentTypeAncestors = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/tree/document-type/ancestors`,
        method: "GET",
        params
      },
      options
    );
  };
  const getTreeDocumentTypeChildren = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/tree/document-type/children`,
        method: "GET",
        params
      },
      options
    );
  };
  const getTreeDocumentTypeRoot = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/tree/document-type/root`,
        method: "GET",
        params
      },
      options
    );
  };
  const getDocumentVersion = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document-version`,
        method: "GET",
        params
      },
      options
    );
  };
  const getDocumentVersionById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document-version/${id}`,
        method: "GET"
      },
      options
    );
  };
  const putDocumentVersionByIdPreventCleanup = (id, params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document-version/${id}/prevent-cleanup`,
        method: "PUT",
        params
      },
      options
    );
  };
  const postDocumentVersionByIdRollback = (id, params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document-version/${id}/rollback`,
        method: "POST",
        params
      },
      options
    );
  };
  const getCollectionDocumentById = (id, params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/collection/document/${id}`,
        method: "GET",
        params
      },
      options
    );
  };
  const postDocument = (createDocumentRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: createDocumentRequestModel
      },
      options
    );
  };
  const getDocumentById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document/${id}`,
        method: "GET"
      },
      options
    );
  };
  const deleteDocumentById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document/${id}`,
        method: "DELETE"
      },
      options
    );
  };
  const putDocumentById = (id, updateDocumentRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document/${id}`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: updateDocumentRequestModel
      },
      options
    );
  };
  const getDocumentByIdAuditLog = (id, params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document/${id}/audit-log`,
        method: "GET",
        params
      },
      options
    );
  };
  const postDocumentByIdCopy = (id, copyDocumentRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document/${id}/copy`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: copyDocumentRequestModel
      },
      options
    );
  };
  const getDocumentByIdDomains = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document/${id}/domains`,
        method: "GET"
      },
      options
    );
  };
  const putDocumentByIdDomains = (id, updateDomainsRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document/${id}/domains`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: updateDomainsRequestModel
      },
      options
    );
  };
  const putDocumentByIdMove = (id, moveDocumentRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document/${id}/move`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: moveDocumentRequestModel
      },
      options
    );
  };
  const putDocumentByIdMoveToRecycleBin = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document/${id}/move-to-recycle-bin`,
        method: "PUT"
      },
      options
    );
  };
  const getDocumentByIdNotifications = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document/${id}/notifications`,
        method: "GET"
      },
      options
    );
  };
  const putDocumentByIdNotifications = (id, updateDocumentNotificationsRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document/${id}/notifications`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: updateDocumentNotificationsRequestModel
      },
      options
    );
  };
  const postDocumentByIdPublicAccess = (id, publicAccessRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document/${id}/public-access`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: publicAccessRequestModel
      },
      options
    );
  };
  const deleteDocumentByIdPublicAccess = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document/${id}/public-access`,
        method: "DELETE"
      },
      options
    );
  };
  const getDocumentByIdPublicAccess = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document/${id}/public-access`,
        method: "GET"
      },
      options
    );
  };
  const putDocumentByIdPublicAccess = (id, publicAccessRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document/${id}/public-access`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: publicAccessRequestModel
      },
      options
    );
  };
  const putDocumentByIdPublish = (id, publishDocumentRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document/${id}/publish`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: publishDocumentRequestModel
      },
      options
    );
  };
  const putDocumentByIdPublishWithDescendants = (id, publishDocumentWithDescendantsRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document/${id}/publish-with-descendants`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: publishDocumentWithDescendantsRequestModel
      },
      options
    );
  };
  const getDocumentByIdPublished = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document/${id}/published`,
        method: "GET"
      },
      options
    );
  };
  const getDocumentByIdReferencedBy = (id, params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document/${id}/referenced-by`,
        method: "GET",
        params
      },
      options
    );
  };
  const getDocumentByIdReferencedDescendants = (id, params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document/${id}/referenced-descendants`,
        method: "GET",
        params
      },
      options
    );
  };
  const putDocumentByIdUnpublish = (id, unpublishDocumentRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document/${id}/unpublish`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: unpublishDocumentRequestModel
      },
      options
    );
  };
  const putDocumentByIdValidate = (id, updateDocumentRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document/${id}/validate`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: updateDocumentRequestModel
      },
      options
    );
  };
  const putUmbracoManagementApiV11DocumentByIdValidate11 = (id, validateUpdateDocumentRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1.1/document/${id}/validate`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: validateUpdateDocumentRequestModel
      },
      options
    );
  };
  const getDocumentAreReferenced = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document/are-referenced`,
        method: "GET",
        params
      },
      options
    );
  };
  const getDocumentConfiguration = (options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document/configuration`,
        method: "GET"
      },
      options
    );
  };
  const putDocumentSort = (sortingRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document/sort`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: sortingRequestModel
      },
      options
    );
  };
  const getDocumentUrls = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document/urls`,
        method: "GET",
        params
      },
      options
    );
  };
  const postDocumentValidate = (createDocumentRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/document/validate`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: createDocumentRequestModel
      },
      options
    );
  };
  const getItemDocument = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/item/document`,
        method: "GET",
        params
      },
      options
    );
  };
  const getItemDocumentSearch = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/item/document/search`,
        method: "GET",
        params
      },
      options
    );
  };
  const deleteRecycleBinDocument = (options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/recycle-bin/document`,
        method: "DELETE"
      },
      options
    );
  };
  const deleteRecycleBinDocumentById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/recycle-bin/document/${id}`,
        method: "DELETE"
      },
      options
    );
  };
  const getRecycleBinDocumentByIdOriginalParent = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/recycle-bin/document/${id}/original-parent`,
        method: "GET"
      },
      options
    );
  };
  const putRecycleBinDocumentByIdRestore = (id, moveMediaRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/recycle-bin/document/${id}/restore`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: moveMediaRequestModel
      },
      options
    );
  };
  const getRecycleBinDocumentChildren = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/recycle-bin/document/children`,
        method: "GET",
        params
      },
      options
    );
  };
  const getRecycleBinDocumentRoot = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/recycle-bin/document/root`,
        method: "GET",
        params
      },
      options
    );
  };
  const getTreeDocumentAncestors = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/tree/document/ancestors`,
        method: "GET",
        params
      },
      options
    );
  };
  const getTreeDocumentChildren = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/tree/document/children`,
        method: "GET",
        params
      },
      options
    );
  };
  const getTreeDocumentRoot = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/tree/document/root`,
        method: "GET",
        params
      },
      options
    );
  };
  const postDynamicRootQuery = (dynamicRootRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/dynamic-root/query`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: dynamicRootRequestModel
      },
      options
    );
  };
  const getDynamicRootSteps = (options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/dynamic-root/steps`,
        method: "GET"
      },
      options
    );
  };
  const getHealthCheckGroup = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/health-check-group`,
        method: "GET",
        params
      },
      options
    );
  };
  const getHealthCheckGroupByName = (name, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/health-check-group/${name}`,
        method: "GET"
      },
      options
    );
  };
  const postHealthCheckGroupByNameCheck = (name, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/health-check-group/${name}/check`,
        method: "POST"
      },
      options
    );
  };
  const postHealthCheckExecuteAction = (healthCheckActionRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/health-check/execute-action`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: healthCheckActionRequestModel
      },
      options
    );
  };
  const getHelp = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/help`,
        method: "GET",
        params
      },
      options
    );
  };
  const getImagingResizeUrls = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/imaging/resize/urls`,
        method: "GET",
        params
      },
      options
    );
  };
  const getImportAnalyze = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/import/analyze`,
        method: "GET",
        params
      },
      options
    );
  };
  const getIndexer = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/indexer`,
        method: "GET",
        params
      },
      options
    );
  };
  const getIndexerByIndexName = (indexName, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/indexer/${indexName}`,
        method: "GET"
      },
      options
    );
  };
  const postIndexerByIndexNameRebuild = (indexName, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/indexer/${indexName}/rebuild`,
        method: "POST"
      },
      options
    );
  };
  const getInstallSettings = (options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/install/settings`,
        method: "GET"
      },
      options
    );
  };
  const postInstallSetup = (installRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/install/setup`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: installRequestModel
      },
      options
    );
  };
  const postInstallValidateDatabase = (databaseInstallRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/install/validate-database`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: databaseInstallRequestModel
      },
      options
    );
  };
  const getItemLanguage = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/item/language`,
        method: "GET",
        params
      },
      options
    );
  };
  const getItemLanguageDefault = (options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/item/language/default`,
        method: "GET"
      },
      options
    );
  };
  const getLanguage = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/language`,
        method: "GET",
        params
      },
      options
    );
  };
  const postLanguage = (createLanguageRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/language`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: createLanguageRequestModel
      },
      options
    );
  };
  const getLanguageByIsoCode = (isoCode, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/language/${isoCode}`,
        method: "GET"
      },
      options
    );
  };
  const deleteLanguageByIsoCode = (isoCode, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/language/${isoCode}`,
        method: "DELETE"
      },
      options
    );
  };
  const putLanguageByIsoCode = (isoCode, updateLanguageRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/language/${isoCode}`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: updateLanguageRequestModel
      },
      options
    );
  };
  const getLogViewerLevel = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/log-viewer/level`,
        method: "GET",
        params
      },
      options
    );
  };
  const getLogViewerLevelCount = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/log-viewer/level-count`,
        method: "GET",
        params
      },
      options
    );
  };
  const getLogViewerLog = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/log-viewer/log`,
        method: "GET",
        params
      },
      options
    );
  };
  const getLogViewerMessageTemplate = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/log-viewer/message-template`,
        method: "GET",
        params
      },
      options
    );
  };
  const getLogViewerSavedSearch = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/log-viewer/saved-search`,
        method: "GET",
        params
      },
      options
    );
  };
  const postLogViewerSavedSearch = (savedLogSearchRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/log-viewer/saved-search`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: savedLogSearchRequestModel
      },
      options
    );
  };
  const getLogViewerSavedSearchByName = (name, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/log-viewer/saved-search/${name}`,
        method: "GET"
      },
      options
    );
  };
  const deleteLogViewerSavedSearchByName = (name, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/log-viewer/saved-search/${name}`,
        method: "DELETE"
      },
      options
    );
  };
  const getLogViewerValidateLogsSize = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/log-viewer/validate-logs-size`,
        method: "GET",
        params
      },
      options
    );
  };
  const getManifestManifest = (options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/manifest/manifest`,
        method: "GET"
      },
      options
    );
  };
  const getManifestManifestPrivate = (options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/manifest/manifest/private`,
        method: "GET"
      },
      options
    );
  };
  const getManifestManifestPublic = (options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/manifest/manifest/public`,
        method: "GET"
      },
      options
    );
  };
  const getItemMediaType = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/item/media-type`,
        method: "GET",
        params
      },
      options
    );
  };
  const getItemMediaTypeAllowed = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/item/media-type/allowed`,
        method: "GET",
        params
      },
      options
    );
  };
  const getItemMediaTypeFolders = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/item/media-type/folders`,
        method: "GET",
        params
      },
      options
    );
  };
  const getItemMediaTypeSearch = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/item/media-type/search`,
        method: "GET",
        params
      },
      options
    );
  };
  const postMediaType = (createMediaTypeRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/media-type`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: createMediaTypeRequestModel
      },
      options
    );
  };
  const getMediaTypeById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/media-type/${id}`,
        method: "GET"
      },
      options
    );
  };
  const deleteMediaTypeById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/media-type/${id}`,
        method: "DELETE"
      },
      options
    );
  };
  const putMediaTypeById = (id, updateMediaTypeRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/media-type/${id}`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: updateMediaTypeRequestModel
      },
      options
    );
  };
  const getMediaTypeByIdAllowedChildren = (id, params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/media-type/${id}/allowed-children`,
        method: "GET",
        params
      },
      options
    );
  };
  const getMediaTypeByIdCompositionReferences = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/media-type/${id}/composition-references`,
        method: "GET"
      },
      options
    );
  };
  const postMediaTypeByIdCopy = (id, copyMediaTypeRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/media-type/${id}/copy`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: copyMediaTypeRequestModel
      },
      options
    );
  };
  const getMediaTypeByIdExport = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/media-type/${id}/export`,
        method: "GET",
        responseType: "blob"
      },
      options
    );
  };
  const putMediaTypeByIdImport = (id, importMediaTypeRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/media-type/${id}/import`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: importMediaTypeRequestModel
      },
      options
    );
  };
  const putMediaTypeByIdMove = (id, moveMediaTypeRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/media-type/${id}/move`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: moveMediaTypeRequestModel
      },
      options
    );
  };
  const getMediaTypeAllowedAtRoot = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/media-type/allowed-at-root`,
        method: "GET",
        params
      },
      options
    );
  };
  const postMediaTypeAvailableCompositions = (mediaTypeCompositionRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/media-type/available-compositions`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: mediaTypeCompositionRequestModel
      },
      options
    );
  };
  const getMediaTypeConfiguration = (options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/media-type/configuration`,
        method: "GET"
      },
      options
    );
  };
  const postMediaTypeFolder = (createFolderRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/media-type/folder`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: createFolderRequestModel
      },
      options
    );
  };
  const getMediaTypeFolderById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/media-type/folder/${id}`,
        method: "GET"
      },
      options
    );
  };
  const deleteMediaTypeFolderById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/media-type/folder/${id}`,
        method: "DELETE"
      },
      options
    );
  };
  const putMediaTypeFolderById = (id, updateFolderResponseModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/media-type/folder/${id}`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: updateFolderResponseModel
      },
      options
    );
  };
  const postMediaTypeImport = (importMediaTypeRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/media-type/import`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: importMediaTypeRequestModel
      },
      options
    );
  };
  const getTreeMediaTypeAncestors = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/tree/media-type/ancestors`,
        method: "GET",
        params
      },
      options
    );
  };
  const getTreeMediaTypeChildren = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/tree/media-type/children`,
        method: "GET",
        params
      },
      options
    );
  };
  const getTreeMediaTypeRoot = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/tree/media-type/root`,
        method: "GET",
        params
      },
      options
    );
  };
  const getCollectionMedia = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/collection/media`,
        method: "GET",
        params
      },
      options
    );
  };
  const getItemMedia = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/item/media`,
        method: "GET",
        params
      },
      options
    );
  };
  const getItemMediaSearch = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/item/media/search`,
        method: "GET",
        params
      },
      options
    );
  };
  const postMedia = (createMediaRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/media`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: createMediaRequestModel
      },
      options
    );
  };
  const getMediaById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/media/${id}`,
        method: "GET"
      },
      options
    );
  };
  const deleteMediaById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/media/${id}`,
        method: "DELETE"
      },
      options
    );
  };
  const putMediaById = (id, updateMediaRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/media/${id}`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: updateMediaRequestModel
      },
      options
    );
  };
  const getMediaByIdAuditLog = (id, params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/media/${id}/audit-log`,
        method: "GET",
        params
      },
      options
    );
  };
  const putMediaByIdMove = (id, moveMediaRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/media/${id}/move`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: moveMediaRequestModel
      },
      options
    );
  };
  const putMediaByIdMoveToRecycleBin = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/media/${id}/move-to-recycle-bin`,
        method: "PUT"
      },
      options
    );
  };
  const getMediaByIdReferencedBy = (id, params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/media/${id}/referenced-by`,
        method: "GET",
        params
      },
      options
    );
  };
  const getMediaByIdReferencedDescendants = (id, params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/media/${id}/referenced-descendants`,
        method: "GET",
        params
      },
      options
    );
  };
  const putMediaByIdValidate = (id, updateMediaRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/media/${id}/validate`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: updateMediaRequestModel
      },
      options
    );
  };
  const getMediaAreReferenced = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/media/are-referenced`,
        method: "GET",
        params
      },
      options
    );
  };
  const getMediaConfiguration = (options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/media/configuration`,
        method: "GET"
      },
      options
    );
  };
  const putMediaSort = (sortingRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/media/sort`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: sortingRequestModel
      },
      options
    );
  };
  const getMediaUrls = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/media/urls`,
        method: "GET",
        params
      },
      options
    );
  };
  const postMediaValidate = (createMediaRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/media/validate`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: createMediaRequestModel
      },
      options
    );
  };
  const deleteRecycleBinMedia = (options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/recycle-bin/media`,
        method: "DELETE"
      },
      options
    );
  };
  const deleteRecycleBinMediaById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/recycle-bin/media/${id}`,
        method: "DELETE"
      },
      options
    );
  };
  const getRecycleBinMediaByIdOriginalParent = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/recycle-bin/media/${id}/original-parent`,
        method: "GET"
      },
      options
    );
  };
  const putRecycleBinMediaByIdRestore = (id, moveMediaRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/recycle-bin/media/${id}/restore`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: moveMediaRequestModel
      },
      options
    );
  };
  const getRecycleBinMediaChildren = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/recycle-bin/media/children`,
        method: "GET",
        params
      },
      options
    );
  };
  const getRecycleBinMediaRoot = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/recycle-bin/media/root`,
        method: "GET",
        params
      },
      options
    );
  };
  const getTreeMediaAncestors = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/tree/media/ancestors`,
        method: "GET",
        params
      },
      options
    );
  };
  const getTreeMediaChildren = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/tree/media/children`,
        method: "GET",
        params
      },
      options
    );
  };
  const getTreeMediaRoot = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/tree/media/root`,
        method: "GET",
        params
      },
      options
    );
  };
  const getItemMemberGroup = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/item/member-group`,
        method: "GET",
        params
      },
      options
    );
  };
  const getMemberGroup = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/member-group`,
        method: "GET",
        params
      },
      options
    );
  };
  const postMemberGroup = (createMemberGroupRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/member-group`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: createMemberGroupRequestModel
      },
      options
    );
  };
  const getMemberGroupById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/member-group/${id}`,
        method: "GET"
      },
      options
    );
  };
  const deleteMemberGroupById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/member-group/${id}`,
        method: "DELETE"
      },
      options
    );
  };
  const putMemberGroupById = (id, updateMemberGroupRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/member-group/${id}`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: updateMemberGroupRequestModel
      },
      options
    );
  };
  const getTreeMemberGroupRoot = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/tree/member-group/root`,
        method: "GET",
        params
      },
      options
    );
  };
  const getItemMemberType = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/item/member-type`,
        method: "GET",
        params
      },
      options
    );
  };
  const getItemMemberTypeSearch = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/item/member-type/search`,
        method: "GET",
        params
      },
      options
    );
  };
  const postMemberType = (createMemberTypeRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/member-type`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: createMemberTypeRequestModel
      },
      options
    );
  };
  const getMemberTypeById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/member-type/${id}`,
        method: "GET"
      },
      options
    );
  };
  const deleteMemberTypeById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/member-type/${id}`,
        method: "DELETE"
      },
      options
    );
  };
  const putMemberTypeById = (id, updateMemberTypeRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/member-type/${id}`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: updateMemberTypeRequestModel
      },
      options
    );
  };
  const getMemberTypeByIdCompositionReferences = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/member-type/${id}/composition-references`,
        method: "GET"
      },
      options
    );
  };
  const postMemberTypeByIdCopy = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/member-type/${id}/copy`,
        method: "POST"
      },
      options
    );
  };
  const postMemberTypeAvailableCompositions = (memberTypeCompositionRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/member-type/available-compositions`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: memberTypeCompositionRequestModel
      },
      options
    );
  };
  const getMemberTypeConfiguration = (options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/member-type/configuration`,
        method: "GET"
      },
      options
    );
  };
  const getTreeMemberTypeRoot = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/tree/member-type/root`,
        method: "GET",
        params
      },
      options
    );
  };
  const getFilterMember = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/filter/member`,
        method: "GET",
        params
      },
      options
    );
  };
  const getItemMember = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/item/member`,
        method: "GET",
        params
      },
      options
    );
  };
  const getItemMemberSearch = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/item/member/search`,
        method: "GET",
        params
      },
      options
    );
  };
  const postMember = (createMemberRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/member`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: createMemberRequestModel
      },
      options
    );
  };
  const getMemberById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/member/${id}`,
        method: "GET"
      },
      options
    );
  };
  const deleteMemberById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/member/${id}`,
        method: "DELETE"
      },
      options
    );
  };
  const putMemberById = (id, updateMemberRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/member/${id}`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: updateMemberRequestModel
      },
      options
    );
  };
  const putMemberByIdValidate = (id, updateMemberRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/member/${id}/validate`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: updateMemberRequestModel
      },
      options
    );
  };
  const getMemberConfiguration = (options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/member/configuration`,
        method: "GET"
      },
      options
    );
  };
  const postMemberValidate = (createMemberRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/member/validate`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: createMemberRequestModel
      },
      options
    );
  };
  const postModelsBuilderBuild = (options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/models-builder/build`,
        method: "POST"
      },
      options
    );
  };
  const getModelsBuilderDashboard = (options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/models-builder/dashboard`,
        method: "GET"
      },
      options
    );
  };
  const getModelsBuilderStatus = (options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/models-builder/status`,
        method: "GET"
      },
      options
    );
  };
  const getObjectTypes = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/object-types`,
        method: "GET",
        params
      },
      options
    );
  };
  const getOembedQuery = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/oembed/query`,
        method: "GET",
        params
      },
      options
    );
  };
  const postPackageByNameRunMigration = (name, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/package/${name}/run-migration`,
        method: "POST"
      },
      options
    );
  };
  const getPackageConfiguration = (options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/package/configuration`,
        method: "GET"
      },
      options
    );
  };
  const getPackageCreated = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/package/created`,
        method: "GET",
        params
      },
      options
    );
  };
  const postPackageCreated = (createPackageRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/package/created`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: createPackageRequestModel
      },
      options
    );
  };
  const getPackageCreatedById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/package/created/${id}`,
        method: "GET"
      },
      options
    );
  };
  const deletePackageCreatedById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/package/created/${id}`,
        method: "DELETE"
      },
      options
    );
  };
  const putPackageCreatedById = (id, updatePackageRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/package/created/${id}`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: updatePackageRequestModel
      },
      options
    );
  };
  const getPackageCreatedByIdDownload = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/package/created/${id}/download`,
        method: "GET",
        responseType: "blob"
      },
      options
    );
  };
  const getPackageMigrationStatus = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/package/migration-status`,
        method: "GET",
        params
      },
      options
    );
  };
  const getItemPartialView = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/item/partial-view`,
        method: "GET",
        params
      },
      options
    );
  };
  const postPartialView = (createPartialViewRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/partial-view`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: createPartialViewRequestModel
      },
      options
    );
  };
  const getPartialViewByPath = (path, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/partial-view/${path}`,
        method: "GET"
      },
      options
    );
  };
  const deletePartialViewByPath = (path, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/partial-view/${path}`,
        method: "DELETE"
      },
      options
    );
  };
  const putPartialViewByPath = (path, updatePartialViewRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/partial-view/${path}`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: updatePartialViewRequestModel
      },
      options
    );
  };
  const putPartialViewByPathRename = (path, renamePartialViewRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/partial-view/${path}/rename`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: renamePartialViewRequestModel
      },
      options
    );
  };
  const postPartialViewFolder = (createPartialViewFolderRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/partial-view/folder`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: createPartialViewFolderRequestModel
      },
      options
    );
  };
  const getPartialViewFolderByPath = (path, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/partial-view/folder/${path}`,
        method: "GET"
      },
      options
    );
  };
  const deletePartialViewFolderByPath = (path, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/partial-view/folder/${path}`,
        method: "DELETE"
      },
      options
    );
  };
  const getPartialViewSnippet = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/partial-view/snippet`,
        method: "GET",
        params
      },
      options
    );
  };
  const getPartialViewSnippetById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/partial-view/snippet/${id}`,
        method: "GET"
      },
      options
    );
  };
  const getTreePartialViewAncestors = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/tree/partial-view/ancestors`,
        method: "GET",
        params
      },
      options
    );
  };
  const getTreePartialViewChildren = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/tree/partial-view/children`,
        method: "GET",
        params
      },
      options
    );
  };
  const getTreePartialViewRoot = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/tree/partial-view/root`,
        method: "GET",
        params
      },
      options
    );
  };
  const deletePreview = (options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/preview`,
        method: "DELETE"
      },
      options
    );
  };
  const postPreview = (options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/preview`,
        method: "POST"
      },
      options
    );
  };
  const getProfilingStatus = (options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/profiling/status`,
        method: "GET"
      },
      options
    );
  };
  const putProfilingStatus = (profilingStatusRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/profiling/status`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: profilingStatusRequestModel
      },
      options
    );
  };
  const getPropertyTypeIsUsed = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/property-type/is-used`,
        method: "GET",
        params
      },
      options
    );
  };
  const postPublishedCacheCollect = (options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/published-cache/collect`,
        method: "POST"
      },
      options
    );
  };
  const postPublishedCacheRebuild = (options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/published-cache/rebuild`,
        method: "POST"
      },
      options
    );
  };
  const postPublishedCacheReload = (options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/published-cache/reload`,
        method: "POST"
      },
      options
    );
  };
  const getPublishedCacheStatus = (options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/published-cache/status`,
        method: "GET"
      },
      options
    );
  };
  const getRedirectManagement = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/redirect-management`,
        method: "GET",
        params
      },
      options
    );
  };
  const getRedirectManagementById = (id, params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/redirect-management/${id}`,
        method: "GET",
        params
      },
      options
    );
  };
  const deleteRedirectManagementById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/redirect-management/${id}`,
        method: "DELETE"
      },
      options
    );
  };
  const getRedirectManagementStatus = (options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/redirect-management/status`,
        method: "GET"
      },
      options
    );
  };
  const postRedirectManagementStatus = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/redirect-management/status`,
        method: "POST",
        params
      },
      options
    );
  };
  const getItemRelationType = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/item/relation-type`,
        method: "GET",
        params
      },
      options
    );
  };
  const getRelationType = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/relation-type`,
        method: "GET",
        params
      },
      options
    );
  };
  const getRelationTypeById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/relation-type/${id}`,
        method: "GET"
      },
      options
    );
  };
  const getRelationByRelationTypeId = (id, params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/relation/type/${id}`,
        method: "GET",
        params
      },
      options
    );
  };
  const getItemScript = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/item/script`,
        method: "GET",
        params
      },
      options
    );
  };
  const postScript = (createScriptRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/script`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: createScriptRequestModel
      },
      options
    );
  };
  const getScriptByPath = (path, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/script/${path}`,
        method: "GET"
      },
      options
    );
  };
  const deleteScriptByPath = (path, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/script/${path}`,
        method: "DELETE"
      },
      options
    );
  };
  const putScriptByPath = (path, updateScriptRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/script/${path}`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: updateScriptRequestModel
      },
      options
    );
  };
  const putScriptByPathRename = (path, renameScriptRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/script/${path}/rename`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: renameScriptRequestModel
      },
      options
    );
  };
  const postScriptFolder = (createScriptFolderRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/script/folder`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: createScriptFolderRequestModel
      },
      options
    );
  };
  const getScriptFolderByPath = (path, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/script/folder/${path}`,
        method: "GET"
      },
      options
    );
  };
  const deleteScriptFolderByPath = (path, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/script/folder/${path}`,
        method: "DELETE"
      },
      options
    );
  };
  const getTreeScriptAncestors = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/tree/script/ancestors`,
        method: "GET",
        params
      },
      options
    );
  };
  const getTreeScriptChildren = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/tree/script/children`,
        method: "GET",
        params
      },
      options
    );
  };
  const getTreeScriptRoot = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/tree/script/root`,
        method: "GET",
        params
      },
      options
    );
  };
  const getSearcher = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/searcher`,
        method: "GET",
        params
      },
      options
    );
  };
  const getSearcherBySearcherNameQuery = (searcherName, params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/searcher/${searcherName}/query`,
        method: "GET",
        params
      },
      options
    );
  };
  const getSecurityConfiguration = (options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/security/configuration`,
        method: "GET"
      },
      options
    );
  };
  const postSecurityForgotPassword = (resetPasswordRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/security/forgot-password`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: resetPasswordRequestModel
      },
      options
    );
  };
  const postSecurityForgotPasswordReset = (resetPasswordTokenRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/security/forgot-password/reset`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: resetPasswordTokenRequestModel
      },
      options
    );
  };
  const postSecurityForgotPasswordVerify = (verifyResetPasswordTokenRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/security/forgot-password/verify`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: verifyResetPasswordTokenRequestModel
      },
      options
    );
  };
  const getSegment = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/segment`,
        method: "GET",
        params
      },
      options
    );
  };
  const getServerConfiguration = (options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/server/configuration`,
        method: "GET"
      },
      options
    );
  };
  const getServerInformation = (options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/server/information`,
        method: "GET"
      },
      options
    );
  };
  const getServerStatus = (options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/server/status`,
        method: "GET"
      },
      options
    );
  };
  const getServerTroubleshooting = (options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/server/troubleshooting`,
        method: "GET"
      },
      options
    );
  };
  const getServerUpgradeCheck = (options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/server/upgrade-check`,
        method: "GET"
      },
      options
    );
  };
  const getItemStaticFile = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/item/static-file`,
        method: "GET",
        params
      },
      options
    );
  };
  const getTreeStaticFileAncestors = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/tree/static-file/ancestors`,
        method: "GET",
        params
      },
      options
    );
  };
  const getTreeStaticFileChildren = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/tree/static-file/children`,
        method: "GET",
        params
      },
      options
    );
  };
  const getTreeStaticFileRoot = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/tree/static-file/root`,
        method: "GET",
        params
      },
      options
    );
  };
  const getItemStylesheet = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/item/stylesheet`,
        method: "GET",
        params
      },
      options
    );
  };
  const postStylesheet = (createStylesheetRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/stylesheet`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: createStylesheetRequestModel
      },
      options
    );
  };
  const getStylesheetByPath = (path, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/stylesheet/${path}`,
        method: "GET"
      },
      options
    );
  };
  const deleteStylesheetByPath = (path, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/stylesheet/${path}`,
        method: "DELETE"
      },
      options
    );
  };
  const putStylesheetByPath = (path, updateStylesheetRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/stylesheet/${path}`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: updateStylesheetRequestModel
      },
      options
    );
  };
  const putStylesheetByPathRename = (path, renameStylesheetRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/stylesheet/${path}/rename`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: renameStylesheetRequestModel
      },
      options
    );
  };
  const postStylesheetFolder = (createStylesheetFolderRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/stylesheet/folder`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: createStylesheetFolderRequestModel
      },
      options
    );
  };
  const getStylesheetFolderByPath = (path, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/stylesheet/folder/${path}`,
        method: "GET"
      },
      options
    );
  };
  const deleteStylesheetFolderByPath = (path, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/stylesheet/folder/${path}`,
        method: "DELETE"
      },
      options
    );
  };
  const getTreeStylesheetAncestors = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/tree/stylesheet/ancestors`,
        method: "GET",
        params
      },
      options
    );
  };
  const getTreeStylesheetChildren = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/tree/stylesheet/children`,
        method: "GET",
        params
      },
      options
    );
  };
  const getTreeStylesheetRoot = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/tree/stylesheet/root`,
        method: "GET",
        params
      },
      options
    );
  };
  const getTag = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/tag`,
        method: "GET",
        params
      },
      options
    );
  };
  const getTelemetry = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/telemetry`,
        method: "GET",
        params
      },
      options
    );
  };
  const getTelemetryLevel = (options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/telemetry/level`,
        method: "GET"
      },
      options
    );
  };
  const postTelemetryLevel = (telemetryRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/telemetry/level`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: telemetryRequestModel
      },
      options
    );
  };
  const getItemTemplate = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/item/template`,
        method: "GET",
        params
      },
      options
    );
  };
  const getItemTemplateSearch = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/item/template/search`,
        method: "GET",
        params
      },
      options
    );
  };
  const postTemplate = (createTemplateRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/template`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: createTemplateRequestModel
      },
      options
    );
  };
  const getTemplateById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/template/${id}`,
        method: "GET"
      },
      options
    );
  };
  const deleteTemplateById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/template/${id}`,
        method: "DELETE"
      },
      options
    );
  };
  const putTemplateById = (id, updateTemplateRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/template/${id}`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: updateTemplateRequestModel
      },
      options
    );
  };
  const getTemplateConfiguration = (options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/template/configuration`,
        method: "GET"
      },
      options
    );
  };
  const postTemplateQueryExecute = (templateQueryExecuteModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/template/query/execute`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: templateQueryExecuteModel
      },
      options
    );
  };
  const getTemplateQuerySettings = (options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/template/query/settings`,
        method: "GET"
      },
      options
    );
  };
  const getTreeTemplateAncestors = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/tree/template/ancestors`,
        method: "GET",
        params
      },
      options
    );
  };
  const getTreeTemplateChildren = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/tree/template/children`,
        method: "GET",
        params
      },
      options
    );
  };
  const getTreeTemplateRoot = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/tree/template/root`,
        method: "GET",
        params
      },
      options
    );
  };
  const postTemporaryFile = (postTemporaryFileBody2, options) => {
    const formData = new FormData();
    formData.append("Id", postTemporaryFileBody2.Id);
    formData.append("File", postTemporaryFileBody2.File);
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/temporary-file`,
        method: "POST",
        headers: { "Content-Type": "multipart/form-data" },
        data: formData
      },
      options
    );
  };
  const getTemporaryFileById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/temporary-file/${id}`,
        method: "GET"
      },
      options
    );
  };
  const deleteTemporaryFileById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/temporary-file/${id}`,
        method: "DELETE"
      },
      options
    );
  };
  const getTemporaryFileConfiguration = (options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/temporary-file/configuration`,
        method: "GET"
      },
      options
    );
  };
  const postUpgradeAuthorize = (options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/upgrade/authorize`,
        method: "POST"
      },
      options
    );
  };
  const getUpgradeSettings = (options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/upgrade/settings`,
        method: "GET"
      },
      options
    );
  };
  const postUserData = (createUserDataRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user-data`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: createUserDataRequestModel
      },
      options
    );
  };
  const getUserData = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user-data`,
        method: "GET",
        params
      },
      options
    );
  };
  const putUserData = (updateUserDataRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user-data`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: updateUserDataRequestModel
      },
      options
    );
  };
  const getUserDataById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user-data/${id}`,
        method: "GET"
      },
      options
    );
  };
  const getFilterUserGroup = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/filter/user-group`,
        method: "GET",
        params
      },
      options
    );
  };
  const getItemUserGroup = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/item/user-group`,
        method: "GET",
        params
      },
      options
    );
  };
  const deleteUserGroup = (deleteUserGroupsRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user-group`,
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        data: deleteUserGroupsRequestModel
      },
      options
    );
  };
  const postUserGroup = (createUserGroupRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user-group`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: createUserGroupRequestModel
      },
      options
    );
  };
  const getUserGroup = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user-group`,
        method: "GET",
        params
      },
      options
    );
  };
  const getUserGroupById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user-group/${id}`,
        method: "GET"
      },
      options
    );
  };
  const deleteUserGroupById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user-group/${id}`,
        method: "DELETE"
      },
      options
    );
  };
  const putUserGroupById = (id, updateUserGroupRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user-group/${id}`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: updateUserGroupRequestModel
      },
      options
    );
  };
  const deleteUserGroupByIdUsers = (id, referenceByIdModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user-group/${id}/users`,
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        data: referenceByIdModel
      },
      options
    );
  };
  const postUserGroupByIdUsers = (id, referenceByIdModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user-group/${id}/users`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: referenceByIdModel
      },
      options
    );
  };
  const getFilterUser = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/filter/user`,
        method: "GET",
        params
      },
      options
    );
  };
  const getItemUser = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/item/user`,
        method: "GET",
        params
      },
      options
    );
  };
  const postUser = (createUserRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: createUserRequestModel
      },
      options
    );
  };
  const deleteUser = (deleteUsersRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user`,
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        data: deleteUsersRequestModel
      },
      options
    );
  };
  const getUser = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user`,
        method: "GET",
        params
      },
      options
    );
  };
  const getUserById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user/${id}`,
        method: "GET"
      },
      options
    );
  };
  const deleteUserById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user/${id}`,
        method: "DELETE"
      },
      options
    );
  };
  const putUserById = (id, updateUserRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user/${id}`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: updateUserRequestModel
      },
      options
    );
  };
  const getUserById2fa = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user/${id}/2fa`,
        method: "GET"
      },
      options
    );
  };
  const deleteUserById2faByProviderName = (id, providerName, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user/${id}/2fa/${providerName}`,
        method: "DELETE"
      },
      options
    );
  };
  const getUserByIdCalculateStartNodes = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user/${id}/calculate-start-nodes`,
        method: "GET"
      },
      options
    );
  };
  const postUserByIdChangePassword = (id, changePasswordUserRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user/${id}/change-password`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: changePasswordUserRequestModel
      },
      options
    );
  };
  const postUserByIdClientCredentials = (id, createUserClientCredentialsRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user/${id}/client-credentials`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: createUserClientCredentialsRequestModel
      },
      options
    );
  };
  const getUserByIdClientCredentials = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user/${id}/client-credentials`,
        method: "GET"
      },
      options
    );
  };
  const deleteUserByIdClientCredentialsByClientId = (id, clientId, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user/${id}/client-credentials/${clientId}`,
        method: "DELETE"
      },
      options
    );
  };
  const postUserByIdResetPassword = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user/${id}/reset-password`,
        method: "POST"
      },
      options
    );
  };
  const deleteUserAvatarById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user/avatar/${id}`,
        method: "DELETE"
      },
      options
    );
  };
  const postUserAvatarById = (id, setAvatarRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user/avatar/${id}`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: setAvatarRequestModel
      },
      options
    );
  };
  const getUserConfiguration = (options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user/configuration`,
        method: "GET"
      },
      options
    );
  };
  const getUserCurrent = (options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user/current`,
        method: "GET"
      },
      options
    );
  };
  const getUserCurrent2fa = (options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user/current/2fa`,
        method: "GET"
      },
      options
    );
  };
  const deleteUserCurrent2faByProviderName = (providerName, params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user/current/2fa/${providerName}`,
        method: "DELETE",
        params
      },
      options
    );
  };
  const postUserCurrent2faByProviderName = (providerName, enableTwoFactorRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user/current/2fa/${providerName}`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: enableTwoFactorRequestModel
      },
      options
    );
  };
  const getUserCurrent2faByProviderName = (providerName, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user/current/2fa/${providerName}`,
        method: "GET"
      },
      options
    );
  };
  const postUserCurrentAvatar = (setAvatarRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user/current/avatar`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: setAvatarRequestModel
      },
      options
    );
  };
  const postUserCurrentChangePassword = (changePasswordCurrentUserRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user/current/change-password`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: changePasswordCurrentUserRequestModel
      },
      options
    );
  };
  const getUserCurrentConfiguration = (options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user/current/configuration`,
        method: "GET"
      },
      options
    );
  };
  const getUserCurrentLoginProviders = (options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user/current/login-providers`,
        method: "GET"
      },
      options
    );
  };
  const getUserCurrentPermissions = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user/current/permissions`,
        method: "GET",
        params
      },
      options
    );
  };
  const getUserCurrentPermissionsDocument = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user/current/permissions/document`,
        method: "GET",
        params
      },
      options
    );
  };
  const getUserCurrentPermissionsMedia = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user/current/permissions/media`,
        method: "GET",
        params
      },
      options
    );
  };
  const postUserDisable = (disableUserRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user/disable`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: disableUserRequestModel
      },
      options
    );
  };
  const postUserEnable = (enableUserRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user/enable`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: enableUserRequestModel
      },
      options
    );
  };
  const postUserInvite = (inviteUserRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user/invite`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: inviteUserRequestModel
      },
      options
    );
  };
  const postUserInviteCreatePassword = (createInitialPasswordUserRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user/invite/create-password`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: createInitialPasswordUserRequestModel
      },
      options
    );
  };
  const postUserInviteResend = (resendInviteUserRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user/invite/resend`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: resendInviteUserRequestModel
      },
      options
    );
  };
  const postUserInviteVerify = (verifyInviteUserRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user/invite/verify`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: verifyInviteUserRequestModel
      },
      options
    );
  };
  const postUserSetUserGroups = (updateUserGroupsOnUserRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user/set-user-groups`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: updateUserGroupsOnUserRequestModel
      },
      options
    );
  };
  const postUserUnlock = (unlockUsersRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/user/unlock`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: unlockUsersRequestModel
      },
      options
    );
  };
  const getItemWebhook = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/item/webhook`,
        method: "GET",
        params
      },
      options
    );
  };
  const getWebhook = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/webhook`,
        method: "GET",
        params
      },
      options
    );
  };
  const postWebhook = (createWebhookRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/webhook`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: createWebhookRequestModel
      },
      options
    );
  };
  const getWebhookById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/webhook/${id}`,
        method: "GET"
      },
      options
    );
  };
  const deleteWebhookById = (id, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/webhook/${id}`,
        method: "DELETE"
      },
      options
    );
  };
  const putWebhookById = (id, updateWebhookRequestModel, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/webhook/${id}`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: updateWebhookRequestModel
      },
      options
    );
  };
  const getWebhookByIdLogs = (id, params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/webhook/${id}/logs`,
        method: "GET",
        params
      },
      options
    );
  };
  const getWebhookEvents = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/webhook/events`,
        method: "GET",
        params
      },
      options
    );
  };
  const getWebhookLogs = (params, options) => {
    return UmbracoManagementClient(
      {
        url: `/umbraco/management/api/v1/webhook/logs`,
        method: "GET",
        params
      },
      options
    );
  };
  return { getCulture, postDataType, getDataTypeById, deleteDataTypeById, putDataTypeById, postDataTypeByIdCopy, getDataTypeByIdIsUsed, putDataTypeByIdMove, getDataTypeByIdReferences, getDataTypeConfiguration, postDataTypeFolder, getDataTypeFolderById, deleteDataTypeFolderById, putDataTypeFolderById, getFilterDataType, getItemDataType, getItemDataTypeSearch, getTreeDataTypeAncestors, getTreeDataTypeChildren, getTreeDataTypeRoot, getDictionary, postDictionary, getDictionaryById, deleteDictionaryById, putDictionaryById, getDictionaryByIdExport, putDictionaryByIdMove, postDictionaryImport, getItemDictionary, getTreeDictionaryAncestors, getTreeDictionaryChildren, getTreeDictionaryRoot, postDocumentBlueprint, getDocumentBlueprintById, deleteDocumentBlueprintById, putDocumentBlueprintById, putDocumentBlueprintByIdMove, postDocumentBlueprintFolder, getDocumentBlueprintFolderById, deleteDocumentBlueprintFolderById, putDocumentBlueprintFolderById, postDocumentBlueprintFromDocument, getItemDocumentBlueprint, getTreeDocumentBlueprintAncestors, getTreeDocumentBlueprintChildren, getTreeDocumentBlueprintRoot, postDocumentType, getDocumentTypeById, deleteDocumentTypeById, putDocumentTypeById, getDocumentTypeByIdAllowedChildren, getDocumentTypeByIdBlueprint, getDocumentTypeByIdCompositionReferences, postDocumentTypeByIdCopy, getDocumentTypeByIdExport, putDocumentTypeByIdImport, putDocumentTypeByIdMove, getDocumentTypeAllowedAtRoot, postDocumentTypeAvailableCompositions, getDocumentTypeConfiguration, postDocumentTypeFolder, getDocumentTypeFolderById, deleteDocumentTypeFolderById, putDocumentTypeFolderById, postDocumentTypeImport, getItemDocumentType, getItemDocumentTypeSearch, getTreeDocumentTypeAncestors, getTreeDocumentTypeChildren, getTreeDocumentTypeRoot, getDocumentVersion, getDocumentVersionById, putDocumentVersionByIdPreventCleanup, postDocumentVersionByIdRollback, getCollectionDocumentById, postDocument, getDocumentById, deleteDocumentById, putDocumentById, getDocumentByIdAuditLog, postDocumentByIdCopy, getDocumentByIdDomains, putDocumentByIdDomains, putDocumentByIdMove, putDocumentByIdMoveToRecycleBin, getDocumentByIdNotifications, putDocumentByIdNotifications, postDocumentByIdPublicAccess, deleteDocumentByIdPublicAccess, getDocumentByIdPublicAccess, putDocumentByIdPublicAccess, putDocumentByIdPublish, putDocumentByIdPublishWithDescendants, getDocumentByIdPublished, getDocumentByIdReferencedBy, getDocumentByIdReferencedDescendants, putDocumentByIdUnpublish, putDocumentByIdValidate, putUmbracoManagementApiV11DocumentByIdValidate11, getDocumentAreReferenced, getDocumentConfiguration, putDocumentSort, getDocumentUrls, postDocumentValidate, getItemDocument, getItemDocumentSearch, deleteRecycleBinDocument, deleteRecycleBinDocumentById, getRecycleBinDocumentByIdOriginalParent, putRecycleBinDocumentByIdRestore, getRecycleBinDocumentChildren, getRecycleBinDocumentRoot, getTreeDocumentAncestors, getTreeDocumentChildren, getTreeDocumentRoot, postDynamicRootQuery, getDynamicRootSteps, getHealthCheckGroup, getHealthCheckGroupByName, postHealthCheckGroupByNameCheck, postHealthCheckExecuteAction, getHelp, getImagingResizeUrls, getImportAnalyze, getIndexer, getIndexerByIndexName, postIndexerByIndexNameRebuild, getInstallSettings, postInstallSetup, postInstallValidateDatabase, getItemLanguage, getItemLanguageDefault, getLanguage, postLanguage, getLanguageByIsoCode, deleteLanguageByIsoCode, putLanguageByIsoCode, getLogViewerLevel, getLogViewerLevelCount, getLogViewerLog, getLogViewerMessageTemplate, getLogViewerSavedSearch, postLogViewerSavedSearch, getLogViewerSavedSearchByName, deleteLogViewerSavedSearchByName, getLogViewerValidateLogsSize, getManifestManifest, getManifestManifestPrivate, getManifestManifestPublic, getItemMediaType, getItemMediaTypeAllowed, getItemMediaTypeFolders, getItemMediaTypeSearch, postMediaType, getMediaTypeById, deleteMediaTypeById, putMediaTypeById, getMediaTypeByIdAllowedChildren, getMediaTypeByIdCompositionReferences, postMediaTypeByIdCopy, getMediaTypeByIdExport, putMediaTypeByIdImport, putMediaTypeByIdMove, getMediaTypeAllowedAtRoot, postMediaTypeAvailableCompositions, getMediaTypeConfiguration, postMediaTypeFolder, getMediaTypeFolderById, deleteMediaTypeFolderById, putMediaTypeFolderById, postMediaTypeImport, getTreeMediaTypeAncestors, getTreeMediaTypeChildren, getTreeMediaTypeRoot, getCollectionMedia, getItemMedia, getItemMediaSearch, postMedia, getMediaById, deleteMediaById, putMediaById, getMediaByIdAuditLog, putMediaByIdMove, putMediaByIdMoveToRecycleBin, getMediaByIdReferencedBy, getMediaByIdReferencedDescendants, putMediaByIdValidate, getMediaAreReferenced, getMediaConfiguration, putMediaSort, getMediaUrls, postMediaValidate, deleteRecycleBinMedia, deleteRecycleBinMediaById, getRecycleBinMediaByIdOriginalParent, putRecycleBinMediaByIdRestore, getRecycleBinMediaChildren, getRecycleBinMediaRoot, getTreeMediaAncestors, getTreeMediaChildren, getTreeMediaRoot, getItemMemberGroup, getMemberGroup, postMemberGroup, getMemberGroupById, deleteMemberGroupById, putMemberGroupById, getTreeMemberGroupRoot, getItemMemberType, getItemMemberTypeSearch, postMemberType, getMemberTypeById, deleteMemberTypeById, putMemberTypeById, getMemberTypeByIdCompositionReferences, postMemberTypeByIdCopy, postMemberTypeAvailableCompositions, getMemberTypeConfiguration, getTreeMemberTypeRoot, getFilterMember, getItemMember, getItemMemberSearch, postMember, getMemberById, deleteMemberById, putMemberById, putMemberByIdValidate, getMemberConfiguration, postMemberValidate, postModelsBuilderBuild, getModelsBuilderDashboard, getModelsBuilderStatus, getObjectTypes, getOembedQuery, postPackageByNameRunMigration, getPackageConfiguration, getPackageCreated, postPackageCreated, getPackageCreatedById, deletePackageCreatedById, putPackageCreatedById, getPackageCreatedByIdDownload, getPackageMigrationStatus, getItemPartialView, postPartialView, getPartialViewByPath, deletePartialViewByPath, putPartialViewByPath, putPartialViewByPathRename, postPartialViewFolder, getPartialViewFolderByPath, deletePartialViewFolderByPath, getPartialViewSnippet, getPartialViewSnippetById, getTreePartialViewAncestors, getTreePartialViewChildren, getTreePartialViewRoot, deletePreview, postPreview, getProfilingStatus, putProfilingStatus, getPropertyTypeIsUsed, postPublishedCacheCollect, postPublishedCacheRebuild, postPublishedCacheReload, getPublishedCacheStatus, getRedirectManagement, getRedirectManagementById, deleteRedirectManagementById, getRedirectManagementStatus, postRedirectManagementStatus, getItemRelationType, getRelationType, getRelationTypeById, getRelationByRelationTypeId, getItemScript, postScript, getScriptByPath, deleteScriptByPath, putScriptByPath, putScriptByPathRename, postScriptFolder, getScriptFolderByPath, deleteScriptFolderByPath, getTreeScriptAncestors, getTreeScriptChildren, getTreeScriptRoot, getSearcher, getSearcherBySearcherNameQuery, getSecurityConfiguration, postSecurityForgotPassword, postSecurityForgotPasswordReset, postSecurityForgotPasswordVerify, getSegment, getServerConfiguration, getServerInformation, getServerStatus, getServerTroubleshooting, getServerUpgradeCheck, getItemStaticFile, getTreeStaticFileAncestors, getTreeStaticFileChildren, getTreeStaticFileRoot, getItemStylesheet, postStylesheet, getStylesheetByPath, deleteStylesheetByPath, putStylesheetByPath, putStylesheetByPathRename, postStylesheetFolder, getStylesheetFolderByPath, deleteStylesheetFolderByPath, getTreeStylesheetAncestors, getTreeStylesheetChildren, getTreeStylesheetRoot, getTag, getTelemetry, getTelemetryLevel, postTelemetryLevel, getItemTemplate, getItemTemplateSearch, postTemplate, getTemplateById, deleteTemplateById, putTemplateById, getTemplateConfiguration, postTemplateQueryExecute, getTemplateQuerySettings, getTreeTemplateAncestors, getTreeTemplateChildren, getTreeTemplateRoot, postTemporaryFile, getTemporaryFileById, deleteTemporaryFileById, getTemporaryFileConfiguration, postUpgradeAuthorize, getUpgradeSettings, postUserData, getUserData, putUserData, getUserDataById, getFilterUserGroup, getItemUserGroup, deleteUserGroup, postUserGroup, getUserGroup, getUserGroupById, deleteUserGroupById, putUserGroupById, deleteUserGroupByIdUsers, postUserGroupByIdUsers, getFilterUser, getItemUser, postUser, deleteUser, getUser, getUserById, deleteUserById, putUserById, getUserById2fa, deleteUserById2faByProviderName, getUserByIdCalculateStartNodes, postUserByIdChangePassword, postUserByIdClientCredentials, getUserByIdClientCredentials, deleteUserByIdClientCredentialsByClientId, postUserByIdResetPassword, deleteUserAvatarById, postUserAvatarById, getUserConfiguration, getUserCurrent, getUserCurrent2fa, deleteUserCurrent2faByProviderName, postUserCurrent2faByProviderName, getUserCurrent2faByProviderName, postUserCurrentAvatar, postUserCurrentChangePassword, getUserCurrentConfiguration, getUserCurrentLoginProviders, getUserCurrentPermissions, getUserCurrentPermissionsDocument, getUserCurrentPermissionsMedia, postUserDisable, postUserEnable, postUserInvite, postUserInviteCreatePassword, postUserInviteResend, postUserInviteVerify, postUserSetUserGroups, postUserUnlock, getItemWebhook, getWebhook, postWebhook, getWebhookById, deleteWebhookById, putWebhookById, getWebhookByIdLogs, getWebhookEvents, getWebhookLogs };
};

// src/clients/umbraco-management-client.ts
var UmbracoManagementClient2 = (_class2 = class {
  static __initStatic2() {this.instance = null}
  constructor() {
  }
  static getClient() {
    if (this.instance === null) {
      this.instance = getUmbracoManagementAPI();
    }
    return this.instance;
  }
}, _class2.__initStatic2(), _class2);

// src/helpers/create-umbraco-tool.ts
var CreateUmbracoTool = (name, description, schema, handler) => () => ({
  name,
  description,
  schema,
  handler
});

// src/api/umbraco/management/umbracoManagementAPI.zod.ts


var _zod = require('zod');
var FileLike = class {
  constructor(name, size, type) {
    this.name = name;
    this.size = size;
    this.type = type;
  }
};
var getCultureQueryTakeDefault = 100;
var getCultureQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getCultureQueryTakeDefault)
});
var getCultureResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "name": _zod.z.string().min(1),
    "englishName": _zod.z.string().min(1)
  }))
});
var postDataTypeBody = _zod.z.object({
  "name": _zod.z.string().min(1),
  "editorAlias": _zod.z.string().min(1),
  "editorUiAlias": _zod.z.string(),
  "values": _zod.z.array(_zod.z.object({
    "alias": _zod.z.string(),
    "value": _zod.z.any().nullish()
  })),
  "id": _zod.z.string().uuid().nullish(),
  "parent": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish()
});
var getDataTypeByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getDataTypeByIdResponse = _zod.z.object({
  "name": _zod.z.string().min(1),
  "editorAlias": _zod.z.string().min(1),
  "editorUiAlias": _zod.z.string(),
  "values": _zod.z.array(_zod.z.object({
    "alias": _zod.z.string(),
    "value": _zod.z.any().nullish()
  })),
  "id": _zod.z.string().uuid(),
  "isDeletable": _zod.z.boolean(),
  "canIgnoreStartNodes": _zod.z.boolean()
});
var deleteDataTypeByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putDataTypeByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putDataTypeByIdBody = _zod.z.object({
  "name": _zod.z.string().min(1),
  "editorAlias": _zod.z.string().min(1),
  "editorUiAlias": _zod.z.string(),
  "values": _zod.z.array(_zod.z.object({
    "alias": _zod.z.string(),
    "value": _zod.z.any().nullish()
  }))
});
var postDataTypeByIdCopyParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var postDataTypeByIdCopyBody = _zod.z.object({
  "target": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish()
});
var getDataTypeByIdIsUsedParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getDataTypeByIdIsUsedResponse = _zod.z.boolean();
var putDataTypeByIdMoveParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putDataTypeByIdMoveBody = _zod.z.object({
  "target": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish()
});
var getDataTypeByIdReferencesParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getDataTypeByIdReferencesResponseItem = _zod.z.object({
  "contentType": _zod.z.object({
    "id": _zod.z.string().uuid(),
    "type": _zod.z.string().nullable(),
    "name": _zod.z.string().nullable(),
    "icon": _zod.z.string().nullable()
  }),
  "properties": _zod.z.array(_zod.z.object({
    "name": _zod.z.string(),
    "alias": _zod.z.string()
  }))
});
var getDataTypeByIdReferencesResponse = _zod.z.array(getDataTypeByIdReferencesResponseItem);
var getDataTypeConfigurationResponse = _zod.z.object({
  "canBeChanged": _zod.z.enum(["True", "False", "FalseWithHelpText"]),
  "documentListViewId": _zod.z.string().uuid(),
  "mediaListViewId": _zod.z.string().uuid()
});
var postDataTypeFolderBody = _zod.z.object({
  "name": _zod.z.string().min(1),
  "id": _zod.z.string().uuid().nullish(),
  "parent": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish()
});
var getDataTypeFolderByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getDataTypeFolderByIdResponse = _zod.z.object({
  "name": _zod.z.string().min(1),
  "id": _zod.z.string().uuid()
});
var deleteDataTypeFolderByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putDataTypeFolderByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putDataTypeFolderByIdBody = _zod.z.object({
  "name": _zod.z.string().min(1)
});
var getFilterDataTypeQueryTakeDefault = 100;
var getFilterDataTypeQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getFilterDataTypeQueryTakeDefault),
  "name": _zod.z.string().optional(),
  "editorUiAlias": _zod.z.string().optional(),
  "editorAlias": _zod.z.string().optional()
});
var getFilterDataTypeResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "name": _zod.z.string(),
    "editorUiAlias": _zod.z.string().nullish(),
    "editorAlias": _zod.z.string(),
    "isDeletable": _zod.z.boolean()
  }))
});
var getItemDataTypeQueryParams = _zod.z.object({
  "id": _zod.z.array(_zod.z.string().uuid()).optional()
});
var getItemDataTypeResponseItem = _zod.z.object({
  "id": _zod.z.string().uuid(),
  "name": _zod.z.string(),
  "editorUiAlias": _zod.z.string().nullish(),
  "editorAlias": _zod.z.string(),
  "isDeletable": _zod.z.boolean()
});
var getItemDataTypeResponse = _zod.z.array(getItemDataTypeResponseItem);
var getItemDataTypeSearchQueryTakeDefault = 100;
var getItemDataTypeSearchQueryParams = _zod.z.object({
  "query": _zod.z.string().optional(),
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getItemDataTypeSearchQueryTakeDefault)
});
var getItemDataTypeSearchResponse = _zod.z.object({
  "items": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "name": _zod.z.string(),
    "editorUiAlias": _zod.z.string().nullish(),
    "editorAlias": _zod.z.string(),
    "isDeletable": _zod.z.boolean()
  })),
  "total": _zod.z.number()
});
var getTreeDataTypeAncestorsQueryParams = _zod.z.object({
  "descendantId": _zod.z.string().uuid().optional()
});
var getTreeDataTypeAncestorsResponseItem = _zod.z.object({
  "hasChildren": _zod.z.boolean(),
  "id": _zod.z.string().uuid(),
  "parent": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish(),
  "name": _zod.z.string(),
  "isFolder": _zod.z.boolean(),
  "editorUiAlias": _zod.z.string().nullish(),
  "isDeletable": _zod.z.boolean()
});
var getTreeDataTypeAncestorsResponse = _zod.z.array(getTreeDataTypeAncestorsResponseItem);
var getTreeDataTypeChildrenQueryTakeDefault = 100;
var getTreeDataTypeChildrenQueryParams = _zod.z.object({
  "parentId": _zod.z.string().uuid().optional(),
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getTreeDataTypeChildrenQueryTakeDefault),
  "foldersOnly": _zod.z.coerce.boolean().optional()
});
var getTreeDataTypeChildrenResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "hasChildren": _zod.z.boolean(),
    "id": _zod.z.string().uuid(),
    "parent": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish(),
    "name": _zod.z.string(),
    "isFolder": _zod.z.boolean(),
    "editorUiAlias": _zod.z.string().nullish(),
    "isDeletable": _zod.z.boolean()
  }))
});
var getTreeDataTypeRootQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number(),
  "take": _zod.z.coerce.number().default(100),
  "foldersOnly": _zod.z.coerce.boolean()
});
var getTreeDataTypeRootResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "hasChildren": _zod.z.boolean(),
    "id": _zod.z.string().uuid(),
    "parent": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish(),
    "name": _zod.z.string(),
    "isFolder": _zod.z.boolean(),
    "editorUiAlias": _zod.z.string().nullish(),
    "isDeletable": _zod.z.boolean()
  }))
});
var getDictionaryQueryTakeDefault = 100;
var getDictionaryQueryParams = _zod.z.object({
  "filter": _zod.z.string().optional(),
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getDictionaryQueryTakeDefault)
});
var getDictionaryResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "name": _zod.z.string().nullish(),
    "id": _zod.z.string().uuid(),
    "parent": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish(),
    "translatedIsoCodes": _zod.z.array(_zod.z.string())
  }))
});
var postDictionaryBody = _zod.z.object({
  "name": _zod.z.string().min(1),
  "translations": _zod.z.array(_zod.z.object({
    "isoCode": _zod.z.string().min(1),
    "translation": _zod.z.string().min(1)
  })),
  "id": _zod.z.string().uuid().nullish(),
  "parent": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish()
});
var getDictionaryByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getDictionaryByIdResponse = _zod.z.object({
  "name": _zod.z.string().min(1),
  "translations": _zod.z.array(_zod.z.object({
    "isoCode": _zod.z.string().min(1),
    "translation": _zod.z.string().min(1)
  })),
  "id": _zod.z.string().uuid()
});
var deleteDictionaryByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putDictionaryByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putDictionaryByIdBody = _zod.z.object({
  "name": _zod.z.string().min(1),
  "translations": _zod.z.array(_zod.z.object({
    "isoCode": _zod.z.string().min(1),
    "translation": _zod.z.string().min(1)
  }))
});
var getDictionaryByIdExportParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getDictionaryByIdExportQueryParams = _zod.z.object({
  "includeChildren": _zod.z.coerce.boolean().optional()
});
var getDictionaryByIdExportResponse = _zod.z.instanceof(FileLike);
var putDictionaryByIdMoveParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putDictionaryByIdMoveBody = _zod.z.object({
  "target": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish()
});
var postDictionaryImportBody = _zod.z.object({
  "temporaryFile": _zod.z.object({
    "id": _zod.z.string().uuid()
  }),
  "parent": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish()
});
var getItemDictionaryQueryParams = _zod.z.object({
  "id": _zod.z.array(_zod.z.string().uuid()).optional()
});
var getItemDictionaryResponseItem = _zod.z.object({
  "id": _zod.z.string().uuid(),
  "name": _zod.z.string()
});
var getItemDictionaryResponse = _zod.z.array(getItemDictionaryResponseItem);
var getTreeDictionaryAncestorsQueryParams = _zod.z.object({
  "descendantId": _zod.z.string().uuid().optional()
});
var getTreeDictionaryAncestorsResponseItem = _zod.z.object({
  "hasChildren": _zod.z.boolean(),
  "id": _zod.z.string().uuid(),
  "parent": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish(),
  "name": _zod.z.string()
});
var getTreeDictionaryAncestorsResponse = _zod.z.array(getTreeDictionaryAncestorsResponseItem);
var getTreeDictionaryChildrenQueryTakeDefault = 100;
var getTreeDictionaryChildrenQueryParams = _zod.z.object({
  "parentId": _zod.z.string().uuid().optional(),
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getTreeDictionaryChildrenQueryTakeDefault)
});
var getTreeDictionaryChildrenResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "hasChildren": _zod.z.boolean(),
    "id": _zod.z.string().uuid(),
    "parent": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish(),
    "name": _zod.z.string()
  }))
});
var getTreeDictionaryRootQueryTakeDefault = 100;
var getTreeDictionaryRootQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getTreeDictionaryRootQueryTakeDefault)
});
var getTreeDictionaryRootResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "hasChildren": _zod.z.boolean(),
    "id": _zod.z.string().uuid(),
    "parent": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish(),
    "name": _zod.z.string()
  }))
});
var postDocumentBlueprintBody = _zod.z.object({
  "values": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullish(),
    "segment": _zod.z.string().nullish(),
    "alias": _zod.z.string().min(1),
    "value": _zod.z.any().nullish()
  })),
  "variants": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullish(),
    "segment": _zod.z.string().nullish(),
    "name": _zod.z.string().min(1)
  })),
  "id": _zod.z.string().uuid().nullish(),
  "parent": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish(),
  "documentType": _zod.z.object({
    "id": _zod.z.string().uuid()
  })
});
var getDocumentBlueprintByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getDocumentBlueprintByIdResponse = _zod.z.object({
  "values": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullish(),
    "segment": _zod.z.string().nullish(),
    "alias": _zod.z.string().min(1),
    "value": _zod.z.any().nullish(),
    "editorAlias": _zod.z.string().min(1)
  })),
  "variants": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullish(),
    "segment": _zod.z.string().nullish(),
    "name": _zod.z.string().min(1),
    "createDate": _zod.z.string().datetime({ "local": true }),
    "updateDate": _zod.z.string().datetime({ "local": true }),
    "state": _zod.z.enum(["NotCreated", "Draft", "Published", "PublishedPendingChanges"]),
    "publishDate": _zod.z.string().datetime({ "local": true }).nullish(),
    "scheduledPublishDate": _zod.z.string().datetime({ "local": true }).nullish(),
    "scheduledUnpublishDate": _zod.z.string().datetime({ "local": true }).nullish()
  })),
  "id": _zod.z.string().uuid(),
  "documentType": _zod.z.object({
    "id": _zod.z.string().uuid(),
    "icon": _zod.z.string(),
    "collection": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish()
  })
});
var deleteDocumentBlueprintByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putDocumentBlueprintByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putDocumentBlueprintByIdBody = _zod.z.object({
  "values": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullish(),
    "segment": _zod.z.string().nullish(),
    "alias": _zod.z.string().min(1),
    "value": _zod.z.any().nullish()
  })),
  "variants": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullish(),
    "segment": _zod.z.string().nullish(),
    "name": _zod.z.string().min(1)
  }))
});
var putDocumentBlueprintByIdMoveParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putDocumentBlueprintByIdMoveBody = _zod.z.object({
  "target": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish()
});
var postDocumentBlueprintFolderBody = _zod.z.object({
  "name": _zod.z.string().min(1),
  "id": _zod.z.string().uuid().nullish(),
  "parent": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish()
});
var getDocumentBlueprintFolderByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getDocumentBlueprintFolderByIdResponse = _zod.z.object({
  "name": _zod.z.string().min(1),
  "id": _zod.z.string().uuid()
});
var deleteDocumentBlueprintFolderByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putDocumentBlueprintFolderByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putDocumentBlueprintFolderByIdBody = _zod.z.object({
  "name": _zod.z.string().min(1)
});
var postDocumentBlueprintFromDocumentBody = _zod.z.object({
  "document": _zod.z.object({
    "id": _zod.z.string().uuid()
  }),
  "id": _zod.z.string().uuid().nullish(),
  "name": _zod.z.string(),
  "parent": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish()
});
var getItemDocumentBlueprintQueryParams = _zod.z.object({
  "id": _zod.z.array(_zod.z.string().uuid()).optional()
});
var getItemDocumentBlueprintResponseItem = _zod.z.object({
  "id": _zod.z.string().uuid(),
  "name": _zod.z.string(),
  "documentType": _zod.z.object({
    "id": _zod.z.string().uuid(),
    "icon": _zod.z.string(),
    "collection": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish()
  })
});
var getItemDocumentBlueprintResponse = _zod.z.array(getItemDocumentBlueprintResponseItem);
var getTreeDocumentBlueprintAncestorsQueryParams = _zod.z.object({
  "descendantId": _zod.z.string().uuid().optional()
});
var getTreeDocumentBlueprintAncestorsResponseItem = _zod.z.object({
  "hasChildren": _zod.z.boolean(),
  "id": _zod.z.string().uuid(),
  "parent": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish(),
  "name": _zod.z.string(),
  "isFolder": _zod.z.boolean(),
  "documentType": _zod.z.object({
    "id": _zod.z.string().uuid(),
    "icon": _zod.z.string(),
    "collection": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish()
  }).nullish()
});
var getTreeDocumentBlueprintAncestorsResponse = _zod.z.array(getTreeDocumentBlueprintAncestorsResponseItem);
var getTreeDocumentBlueprintChildrenQueryTakeDefault = 100;
var getTreeDocumentBlueprintChildrenQueryParams = _zod.z.object({
  "parentId": _zod.z.string().uuid().optional(),
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getTreeDocumentBlueprintChildrenQueryTakeDefault),
  "foldersOnly": _zod.z.coerce.boolean().optional()
});
var getTreeDocumentBlueprintChildrenResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "hasChildren": _zod.z.boolean(),
    "id": _zod.z.string().uuid(),
    "parent": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish(),
    "name": _zod.z.string(),
    "isFolder": _zod.z.boolean(),
    "documentType": _zod.z.object({
      "id": _zod.z.string().uuid(),
      "icon": _zod.z.string(),
      "collection": _zod.z.object({
        "id": _zod.z.string().uuid()
      }).nullish()
    }).nullish()
  }))
});
var getTreeDocumentBlueprintRootQueryTakeDefault = 100;
var getTreeDocumentBlueprintRootQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getTreeDocumentBlueprintRootQueryTakeDefault),
  "foldersOnly": _zod.z.coerce.boolean().optional()
});
var getTreeDocumentBlueprintRootResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "hasChildren": _zod.z.boolean(),
    "id": _zod.z.string().uuid(),
    "parent": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish(),
    "name": _zod.z.string(),
    "isFolder": _zod.z.boolean(),
    "documentType": _zod.z.object({
      "id": _zod.z.string().uuid(),
      "icon": _zod.z.string(),
      "collection": _zod.z.object({
        "id": _zod.z.string().uuid()
      }).nullish()
    }).nullish()
  }))
});
var postDocumentTypeBody = _zod.z.object({
  "alias": _zod.z.string().min(1),
  "name": _zod.z.string().min(1),
  "description": _zod.z.string().nullish(),
  "icon": _zod.z.string().min(1),
  "allowedAsRoot": _zod.z.boolean(),
  "variesByCulture": _zod.z.boolean(),
  "variesBySegment": _zod.z.boolean(),
  "collection": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish(),
  "isElement": _zod.z.boolean(),
  "properties": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "container": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish(),
    "sortOrder": _zod.z.number(),
    "alias": _zod.z.string().min(1),
    "name": _zod.z.string().min(1),
    "description": _zod.z.string().nullish(),
    "dataType": _zod.z.object({
      "id": _zod.z.string().uuid()
    }),
    "variesByCulture": _zod.z.boolean(),
    "variesBySegment": _zod.z.boolean(),
    "validation": _zod.z.object({
      "mandatory": _zod.z.boolean(),
      "mandatoryMessage": _zod.z.string().nullish(),
      "regEx": _zod.z.string().nullish(),
      "regExMessage": _zod.z.string().nullish()
    }),
    "appearance": _zod.z.object({
      "labelOnTop": _zod.z.boolean()
    })
  })),
  "containers": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "parent": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish(),
    "name": _zod.z.string().nullish(),
    "type": _zod.z.string().min(1),
    "sortOrder": _zod.z.number()
  })),
  "id": _zod.z.string().uuid().nullish(),
  "parent": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish(),
  "allowedTemplates": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid()
  })),
  "defaultTemplate": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish(),
  "cleanup": _zod.z.object({
    "preventCleanup": _zod.z.boolean(),
    "keepAllVersionsNewerThanDays": _zod.z.number().nullish(),
    "keepLatestVersionPerDayForDays": _zod.z.number().nullish()
  }),
  "allowedDocumentTypes": _zod.z.array(_zod.z.object({
    "documentType": _zod.z.object({
      "id": _zod.z.string().uuid()
    }),
    "sortOrder": _zod.z.number()
  })),
  "compositions": _zod.z.array(_zod.z.object({
    "documentType": _zod.z.object({
      "id": _zod.z.string().uuid()
    }),
    "compositionType": _zod.z.enum(["Composition", "Inheritance"])
  }))
});
var getDocumentTypeByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getDocumentTypeByIdResponse = _zod.z.object({
  "alias": _zod.z.string().min(1),
  "name": _zod.z.string().min(1),
  "description": _zod.z.string().nullish(),
  "icon": _zod.z.string().min(1),
  "allowedAsRoot": _zod.z.boolean(),
  "variesByCulture": _zod.z.boolean(),
  "variesBySegment": _zod.z.boolean(),
  "collection": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish(),
  "isElement": _zod.z.boolean(),
  "properties": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "container": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish(),
    "sortOrder": _zod.z.number(),
    "alias": _zod.z.string().min(1),
    "name": _zod.z.string().min(1),
    "description": _zod.z.string().nullish(),
    "dataType": _zod.z.object({
      "id": _zod.z.string().uuid()
    }),
    "variesByCulture": _zod.z.boolean(),
    "variesBySegment": _zod.z.boolean(),
    "validation": _zod.z.object({
      "mandatory": _zod.z.boolean(),
      "mandatoryMessage": _zod.z.string().nullish(),
      "regEx": _zod.z.string().nullish(),
      "regExMessage": _zod.z.string().nullish()
    }),
    "appearance": _zod.z.object({
      "labelOnTop": _zod.z.boolean()
    })
  })),
  "containers": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "parent": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish(),
    "name": _zod.z.string().nullish(),
    "type": _zod.z.string().min(1),
    "sortOrder": _zod.z.number()
  })),
  "id": _zod.z.string().uuid(),
  "allowedTemplates": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid()
  })),
  "defaultTemplate": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish(),
  "cleanup": _zod.z.object({
    "preventCleanup": _zod.z.boolean(),
    "keepAllVersionsNewerThanDays": _zod.z.number().nullish(),
    "keepLatestVersionPerDayForDays": _zod.z.number().nullish()
  }),
  "allowedDocumentTypes": _zod.z.array(_zod.z.object({
    "documentType": _zod.z.object({
      "id": _zod.z.string().uuid()
    }),
    "sortOrder": _zod.z.number()
  })),
  "compositions": _zod.z.array(_zod.z.object({
    "documentType": _zod.z.object({
      "id": _zod.z.string().uuid()
    }),
    "compositionType": _zod.z.enum(["Composition", "Inheritance"])
  }))
});
var deleteDocumentTypeByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putDocumentTypeByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putDocumentTypeByIdBody = _zod.z.object({
  "alias": _zod.z.string().min(1),
  "name": _zod.z.string().min(1),
  "description": _zod.z.string().nullish(),
  "icon": _zod.z.string().min(1),
  "allowedAsRoot": _zod.z.boolean(),
  "variesByCulture": _zod.z.boolean(),
  "variesBySegment": _zod.z.boolean(),
  "collection": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish(),
  "isElement": _zod.z.boolean(),
  "properties": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "container": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish(),
    "sortOrder": _zod.z.number(),
    "alias": _zod.z.string().min(1),
    "name": _zod.z.string().min(1),
    "description": _zod.z.string().nullish(),
    "dataType": _zod.z.object({
      "id": _zod.z.string().uuid()
    }),
    "variesByCulture": _zod.z.boolean(),
    "variesBySegment": _zod.z.boolean(),
    "validation": _zod.z.object({
      "mandatory": _zod.z.boolean(),
      "mandatoryMessage": _zod.z.string().nullish(),
      "regEx": _zod.z.string().nullish(),
      "regExMessage": _zod.z.string().nullish()
    }),
    "appearance": _zod.z.object({
      "labelOnTop": _zod.z.boolean()
    })
  })),
  "containers": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "parent": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish(),
    "name": _zod.z.string().nullish(),
    "type": _zod.z.string().min(1),
    "sortOrder": _zod.z.number()
  })),
  "allowedTemplates": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid()
  })),
  "defaultTemplate": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish(),
  "cleanup": _zod.z.object({
    "preventCleanup": _zod.z.boolean(),
    "keepAllVersionsNewerThanDays": _zod.z.number().nullish(),
    "keepLatestVersionPerDayForDays": _zod.z.number().nullish()
  }),
  "allowedDocumentTypes": _zod.z.array(_zod.z.object({
    "documentType": _zod.z.object({
      "id": _zod.z.string().uuid()
    }),
    "sortOrder": _zod.z.number()
  })),
  "compositions": _zod.z.array(_zod.z.object({
    "documentType": _zod.z.object({
      "id": _zod.z.string().uuid()
    }),
    "compositionType": _zod.z.enum(["Composition", "Inheritance"])
  }))
});
var getDocumentTypeByIdAllowedChildrenParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getDocumentTypeByIdAllowedChildrenQueryTakeDefault = 100;
var getDocumentTypeByIdAllowedChildrenQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getDocumentTypeByIdAllowedChildrenQueryTakeDefault)
});
var getDocumentTypeByIdAllowedChildrenResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "name": _zod.z.string(),
    "description": _zod.z.string().nullish(),
    "icon": _zod.z.string().nullish()
  }))
});
var getDocumentTypeByIdBlueprintParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getDocumentTypeByIdBlueprintQueryTakeDefault = 100;
var getDocumentTypeByIdBlueprintQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getDocumentTypeByIdBlueprintQueryTakeDefault)
});
var getDocumentTypeByIdBlueprintResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "name": _zod.z.string()
  }))
});
var getDocumentTypeByIdCompositionReferencesParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getDocumentTypeByIdCompositionReferencesResponseItem = _zod.z.object({
  "id": _zod.z.string().uuid(),
  "name": _zod.z.string(),
  "icon": _zod.z.string()
});
var getDocumentTypeByIdCompositionReferencesResponse = _zod.z.array(getDocumentTypeByIdCompositionReferencesResponseItem);
var postDocumentTypeByIdCopyParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var postDocumentTypeByIdCopyBody = _zod.z.object({
  "target": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish()
});
var getDocumentTypeByIdExportParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getDocumentTypeByIdExportResponse = _zod.z.instanceof(FileLike);
var putDocumentTypeByIdImportParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putDocumentTypeByIdImportBody = _zod.z.object({
  "file": _zod.z.object({
    "id": _zod.z.string().uuid()
  })
});
var putDocumentTypeByIdMoveParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putDocumentTypeByIdMoveBody = _zod.z.object({
  "target": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish()
});
var getDocumentTypeAllowedAtRootQueryTakeDefault = 100;
var getDocumentTypeAllowedAtRootQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getDocumentTypeAllowedAtRootQueryTakeDefault)
});
var getDocumentTypeAllowedAtRootResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "name": _zod.z.string(),
    "description": _zod.z.string().nullish(),
    "icon": _zod.z.string().nullish()
  }))
});
var postDocumentTypeAvailableCompositionsBody = _zod.z.object({
  "id": _zod.z.string().uuid().nullish(),
  "currentPropertyAliases": _zod.z.array(_zod.z.string()),
  "currentCompositeIds": _zod.z.array(_zod.z.string().uuid()),
  "isElement": _zod.z.boolean()
});
var postDocumentTypeAvailableCompositionsResponseItem = _zod.z.object({
  "id": _zod.z.string().uuid(),
  "name": _zod.z.string(),
  "icon": _zod.z.string(),
  "folderPath": _zod.z.array(_zod.z.string()),
  "isCompatible": _zod.z.boolean()
});
var postDocumentTypeAvailableCompositionsResponse = _zod.z.array(postDocumentTypeAvailableCompositionsResponseItem);
var getDocumentTypeConfigurationResponse = _zod.z.object({
  "dataTypesCanBeChanged": _zod.z.enum(["True", "False", "FalseWithHelpText"]),
  "disableTemplates": _zod.z.boolean(),
  "useSegments": _zod.z.boolean(),
  "reservedFieldNames": _zod.z.array(_zod.z.string())
});
var postDocumentTypeFolderBody = _zod.z.object({
  "name": _zod.z.string().min(1),
  "id": _zod.z.string().uuid().nullish(),
  "parent": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish()
});
var getDocumentTypeFolderByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getDocumentTypeFolderByIdResponse = _zod.z.object({
  "name": _zod.z.string().min(1),
  "id": _zod.z.string().uuid()
});
var deleteDocumentTypeFolderByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putDocumentTypeFolderByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putDocumentTypeFolderByIdBody = _zod.z.object({
  "name": _zod.z.string().min(1)
});
var postDocumentTypeImportBody = _zod.z.object({
  "file": _zod.z.object({
    "id": _zod.z.string().uuid()
  })
});
var getItemDocumentTypeQueryParams = _zod.z.object({
  "id": _zod.z.array(_zod.z.string().uuid()).optional()
});
var getItemDocumentTypeResponseItem = _zod.z.object({
  "id": _zod.z.string().uuid(),
  "name": _zod.z.string(),
  "isElement": _zod.z.boolean(),
  "icon": _zod.z.string().nullish(),
  "description": _zod.z.string().nullish()
});
var getItemDocumentTypeResponse = _zod.z.array(getItemDocumentTypeResponseItem);
var getItemDocumentTypeSearchQueryTakeDefault = 100;
var getItemDocumentTypeSearchQueryParams = _zod.z.object({
  "query": _zod.z.string().optional(),
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getItemDocumentTypeSearchQueryTakeDefault)
});
var getItemDocumentTypeSearchResponse = _zod.z.object({
  "items": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "name": _zod.z.string(),
    "isElement": _zod.z.boolean(),
    "icon": _zod.z.string().nullish(),
    "description": _zod.z.string().nullish()
  })),
  "total": _zod.z.number()
});
var getTreeDocumentTypeAncestorsQueryParams = _zod.z.object({
  "descendantId": _zod.z.string().uuid().optional()
});
var getTreeDocumentTypeAncestorsResponseItem = _zod.z.object({
  "hasChildren": _zod.z.boolean(),
  "id": _zod.z.string().uuid(),
  "parent": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish(),
  "name": _zod.z.string(),
  "isFolder": _zod.z.boolean(),
  "isElement": _zod.z.boolean(),
  "icon": _zod.z.string()
});
var getTreeDocumentTypeAncestorsResponse = _zod.z.array(getTreeDocumentTypeAncestorsResponseItem);
var getTreeDocumentTypeChildrenQueryTakeDefault = 100;
var getTreeDocumentTypeChildrenQueryParams = _zod.z.object({
  "parentId": _zod.z.string().uuid().optional(),
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getTreeDocumentTypeChildrenQueryTakeDefault),
  "foldersOnly": _zod.z.coerce.boolean().optional()
});
var getTreeDocumentTypeChildrenResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "hasChildren": _zod.z.boolean(),
    "id": _zod.z.string().uuid(),
    "parent": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish(),
    "name": _zod.z.string(),
    "isFolder": _zod.z.boolean(),
    "isElement": _zod.z.boolean(),
    "icon": _zod.z.string()
  }))
});
var getTreeDocumentTypeRootQueryTakeDefault = 100;
var getTreeDocumentTypeRootQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getTreeDocumentTypeRootQueryTakeDefault),
  "foldersOnly": _zod.z.coerce.boolean().optional()
});
var getTreeDocumentTypeRootResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "hasChildren": _zod.z.boolean(),
    "id": _zod.z.string().uuid(),
    "parent": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish(),
    "name": _zod.z.string(),
    "isFolder": _zod.z.boolean(),
    "isElement": _zod.z.boolean(),
    "icon": _zod.z.string()
  }))
});
var getDocumentVersionQueryTakeDefault = 100;
var getDocumentVersionQueryParams = _zod.z.object({
  "documentId": _zod.z.string().uuid(),
  "culture": _zod.z.string().optional(),
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getDocumentVersionQueryTakeDefault)
});
var getDocumentVersionResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "document": _zod.z.object({
      "id": _zod.z.string().uuid()
    }),
    "documentType": _zod.z.object({
      "id": _zod.z.string().uuid()
    }),
    "user": _zod.z.object({
      "id": _zod.z.string().uuid()
    }),
    "versionDate": _zod.z.string().datetime({ "local": true }),
    "isCurrentPublishedVersion": _zod.z.boolean(),
    "isCurrentDraftVersion": _zod.z.boolean(),
    "preventCleanup": _zod.z.boolean()
  }))
});
var getDocumentVersionByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getDocumentVersionByIdResponse = _zod.z.object({
  "values": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullish(),
    "segment": _zod.z.string().nullish(),
    "alias": _zod.z.string().min(1),
    "value": _zod.z.any().nullish(),
    "editorAlias": _zod.z.string().min(1)
  })),
  "variants": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullish(),
    "segment": _zod.z.string().nullish(),
    "name": _zod.z.string().min(1),
    "createDate": _zod.z.string().datetime({ "local": true }),
    "updateDate": _zod.z.string().datetime({ "local": true }),
    "state": _zod.z.enum(["NotCreated", "Draft", "Published", "PublishedPendingChanges"]),
    "publishDate": _zod.z.string().datetime({ "local": true }).nullish(),
    "scheduledPublishDate": _zod.z.string().datetime({ "local": true }).nullish(),
    "scheduledUnpublishDate": _zod.z.string().datetime({ "local": true }).nullish()
  })),
  "id": _zod.z.string().uuid(),
  "documentType": _zod.z.object({
    "id": _zod.z.string().uuid(),
    "icon": _zod.z.string(),
    "collection": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish()
  }),
  "document": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish()
});
var putDocumentVersionByIdPreventCleanupParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putDocumentVersionByIdPreventCleanupQueryParams = _zod.z.object({
  "preventCleanup": _zod.z.coerce.boolean().optional()
});
var postDocumentVersionByIdRollbackParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var postDocumentVersionByIdRollbackQueryParams = _zod.z.object({
  "culture": _zod.z.string().optional()
});
var getCollectionDocumentByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getCollectionDocumentByIdQueryOrderByDefault = "updateDate";
var getCollectionDocumentByIdQueryTakeDefault = 100;
var getCollectionDocumentByIdQueryParams = _zod.z.object({
  "dataTypeId": _zod.z.string().uuid().optional(),
  "orderBy": _zod.z.string().default(getCollectionDocumentByIdQueryOrderByDefault),
  "orderCulture": _zod.z.string().optional(),
  "orderDirection": _zod.z.enum(["Ascending", "Descending"]).optional(),
  "filter": _zod.z.string().optional(),
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getCollectionDocumentByIdQueryTakeDefault)
});
var getCollectionDocumentByIdResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "values": _zod.z.array(_zod.z.object({
      "culture": _zod.z.string().nullish(),
      "segment": _zod.z.string().nullish(),
      "alias": _zod.z.string().min(1),
      "value": _zod.z.any().nullish(),
      "editorAlias": _zod.z.string().min(1)
    })),
    "variants": _zod.z.array(_zod.z.object({
      "culture": _zod.z.string().nullish(),
      "segment": _zod.z.string().nullish(),
      "name": _zod.z.string().min(1),
      "createDate": _zod.z.string().datetime({ "local": true }),
      "updateDate": _zod.z.string().datetime({ "local": true }),
      "state": _zod.z.enum(["NotCreated", "Draft", "Published", "PublishedPendingChanges"]),
      "publishDate": _zod.z.string().datetime({ "local": true }).nullish(),
      "scheduledPublishDate": _zod.z.string().datetime({ "local": true }).nullish(),
      "scheduledUnpublishDate": _zod.z.string().datetime({ "local": true }).nullish()
    })),
    "id": _zod.z.string().uuid(),
    "creator": _zod.z.string().nullish(),
    "sortOrder": _zod.z.number(),
    "documentType": _zod.z.object({
      "id": _zod.z.string().uuid(),
      "alias": _zod.z.string(),
      "icon": _zod.z.string()
    }),
    "isTrashed": _zod.z.boolean(),
    "isProtected": _zod.z.boolean(),
    "updater": _zod.z.string().nullish()
  }))
});
var postDocumentBody = _zod.z.object({
  "values": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullish(),
    "segment": _zod.z.string().nullish(),
    "alias": _zod.z.string().min(1),
    "value": _zod.z.any().nullish()
  })),
  "variants": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullish(),
    "segment": _zod.z.string().nullish(),
    "name": _zod.z.string().min(1)
  })),
  "id": _zod.z.string().uuid().nullish(),
  "parent": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish(),
  "documentType": _zod.z.object({
    "id": _zod.z.string().uuid()
  }),
  "template": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullable()
});
var getDocumentByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getDocumentByIdResponse = _zod.z.object({
  "values": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullish(),
    "segment": _zod.z.string().nullish(),
    "alias": _zod.z.string().min(1),
    "value": _zod.z.any().nullish(),
    "editorAlias": _zod.z.string().min(1)
  })),
  "variants": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullish(),
    "segment": _zod.z.string().nullish(),
    "name": _zod.z.string().min(1),
    "createDate": _zod.z.string().datetime({ "local": true }),
    "updateDate": _zod.z.string().datetime({ "local": true }),
    "state": _zod.z.enum(["NotCreated", "Draft", "Published", "PublishedPendingChanges"]),
    "publishDate": _zod.z.string().datetime({ "local": true }).nullish(),
    "scheduledPublishDate": _zod.z.string().datetime({ "local": true }).nullish(),
    "scheduledUnpublishDate": _zod.z.string().datetime({ "local": true }).nullish()
  })),
  "id": _zod.z.string().uuid(),
  "documentType": _zod.z.object({
    "id": _zod.z.string().uuid(),
    "icon": _zod.z.string(),
    "collection": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish()
  }),
  "urls": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullable(),
    "url": _zod.z.string()
  })),
  "template": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish(),
  "isTrashed": _zod.z.boolean()
});
var deleteDocumentByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putDocumentByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putDocumentByIdBody = _zod.z.object({
  "values": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullish(),
    "segment": _zod.z.string().nullish(),
    "alias": _zod.z.string().min(1),
    "value": _zod.z.any().nullish()
  })),
  "variants": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullish(),
    "segment": _zod.z.string().nullish(),
    "name": _zod.z.string().min(1)
  })),
  "template": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish()
});
var getDocumentByIdAuditLogParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getDocumentByIdAuditLogQueryTakeDefault = 100;
var getDocumentByIdAuditLogQueryParams = _zod.z.object({
  "orderDirection": _zod.z.enum(["Ascending", "Descending"]).optional(),
  "sinceDate": _zod.z.string().datetime({ "local": true }).optional(),
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getDocumentByIdAuditLogQueryTakeDefault)
});
var getDocumentByIdAuditLogResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "user": _zod.z.object({
      "id": _zod.z.string().uuid()
    }),
    "timestamp": _zod.z.string().datetime({ "local": true }),
    "logType": _zod.z.enum(["New", "Save", "SaveVariant", "Open", "Delete", "Publish", "PublishVariant", "SendToPublish", "SendToPublishVariant", "Unpublish", "UnpublishVariant", "Move", "Copy", "AssignDomain", "PublicAccess", "Sort", "Notify", "System", "RollBack", "PackagerInstall", "PackagerUninstall", "Custom", "ContentVersionPreventCleanup", "ContentVersionEnableCleanup"]),
    "comment": _zod.z.string().nullish(),
    "parameters": _zod.z.string().nullish()
  }))
});
var postDocumentByIdCopyParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var postDocumentByIdCopyBody = _zod.z.object({
  "target": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish(),
  "relateToOriginal": _zod.z.boolean(),
  "includeDescendants": _zod.z.boolean()
});
var getDocumentByIdDomainsParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getDocumentByIdDomainsResponse = _zod.z.object({
  "defaultIsoCode": _zod.z.string().nullish(),
  "domains": _zod.z.array(_zod.z.object({
    "domainName": _zod.z.string(),
    "isoCode": _zod.z.string()
  }))
});
var putDocumentByIdDomainsParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putDocumentByIdDomainsBody = _zod.z.object({
  "defaultIsoCode": _zod.z.string().nullish(),
  "domains": _zod.z.array(_zod.z.object({
    "domainName": _zod.z.string(),
    "isoCode": _zod.z.string()
  }))
});
var putDocumentByIdMoveParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putDocumentByIdMoveBody = _zod.z.object({
  "target": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish()
});
var putDocumentByIdMoveToRecycleBinParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getDocumentByIdNotificationsParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getDocumentByIdNotificationsResponseItem = _zod.z.object({
  "actionId": _zod.z.string(),
  "alias": _zod.z.string(),
  "subscribed": _zod.z.boolean()
});
var getDocumentByIdNotificationsResponse = _zod.z.array(getDocumentByIdNotificationsResponseItem);
var putDocumentByIdNotificationsParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putDocumentByIdNotificationsBody = _zod.z.object({
  "subscribedActionIds": _zod.z.array(_zod.z.string())
});
var postDocumentByIdPublicAccessParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var postDocumentByIdPublicAccessBody = _zod.z.object({
  "loginDocument": _zod.z.object({
    "id": _zod.z.string().uuid()
  }),
  "errorDocument": _zod.z.object({
    "id": _zod.z.string().uuid()
  }),
  "memberUserNames": _zod.z.array(_zod.z.string()),
  "memberGroupNames": _zod.z.array(_zod.z.string())
});
var deleteDocumentByIdPublicAccessParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getDocumentByIdPublicAccessParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getDocumentByIdPublicAccessResponse = _zod.z.object({
  "loginDocument": _zod.z.object({
    "id": _zod.z.string().uuid()
  }),
  "errorDocument": _zod.z.object({
    "id": _zod.z.string().uuid()
  }),
  "members": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "memberType": _zod.z.object({
      "id": _zod.z.string().uuid(),
      "icon": _zod.z.string(),
      "collection": _zod.z.object({
        "id": _zod.z.string().uuid()
      }).nullish()
    }),
    "variants": _zod.z.array(_zod.z.object({
      "name": _zod.z.string(),
      "culture": _zod.z.string().nullish()
    })),
    "kind": _zod.z.enum(["Default", "Api"])
  })),
  "groups": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "name": _zod.z.string()
  }))
});
var putDocumentByIdPublicAccessParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putDocumentByIdPublicAccessBody = _zod.z.object({
  "loginDocument": _zod.z.object({
    "id": _zod.z.string().uuid()
  }),
  "errorDocument": _zod.z.object({
    "id": _zod.z.string().uuid()
  }),
  "memberUserNames": _zod.z.array(_zod.z.string()),
  "memberGroupNames": _zod.z.array(_zod.z.string())
});
var putDocumentByIdPublishParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putDocumentByIdPublishBody = _zod.z.object({
  "publishSchedules": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullish(),
    "schedule": _zod.z.object({
      "publishTime": _zod.z.string().datetime({ "local": true }).nullish(),
      "unpublishTime": _zod.z.string().datetime({ "local": true }).nullish()
    }).nullish()
  }))
});
var putDocumentByIdPublishWithDescendantsParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putDocumentByIdPublishWithDescendantsBody = _zod.z.object({
  "includeUnpublishedDescendants": _zod.z.boolean(),
  "cultures": _zod.z.array(_zod.z.string())
});
var getDocumentByIdPublishedParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getDocumentByIdPublishedResponse = _zod.z.object({
  "values": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullish(),
    "segment": _zod.z.string().nullish(),
    "alias": _zod.z.string().min(1),
    "value": _zod.z.any().nullish(),
    "editorAlias": _zod.z.string().min(1)
  })),
  "variants": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullish(),
    "segment": _zod.z.string().nullish(),
    "name": _zod.z.string().min(1),
    "createDate": _zod.z.string().datetime({ "local": true }),
    "updateDate": _zod.z.string().datetime({ "local": true }),
    "state": _zod.z.enum(["NotCreated", "Draft", "Published", "PublishedPendingChanges"]),
    "publishDate": _zod.z.string().datetime({ "local": true }).nullish(),
    "scheduledPublishDate": _zod.z.string().datetime({ "local": true }).nullish(),
    "scheduledUnpublishDate": _zod.z.string().datetime({ "local": true }).nullish()
  })),
  "id": _zod.z.string().uuid(),
  "documentType": _zod.z.object({
    "id": _zod.z.string().uuid(),
    "icon": _zod.z.string(),
    "collection": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish()
  }),
  "urls": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullable(),
    "url": _zod.z.string()
  })),
  "template": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish(),
  "isTrashed": _zod.z.boolean()
});
var getDocumentByIdReferencedByParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getDocumentByIdReferencedByQueryTakeDefault = 20;
var getDocumentByIdReferencedByQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getDocumentByIdReferencedByQueryTakeDefault)
});
var getDocumentByIdReferencedByResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "$type": _zod.z.enum(["DefaultReferenceResponseModel"]),
    "id": _zod.z.string().uuid(),
    "name": _zod.z.string().nullish(),
    "type": _zod.z.string().nullish(),
    "icon": _zod.z.string().nullish()
  }).or(_zod.z.object({
    "$type": _zod.z.enum(["DocumentReferenceResponseModel"]),
    "id": _zod.z.string().uuid(),
    "name": _zod.z.string().nullish(),
    "published": _zod.z.boolean().nullish(),
    "documentType": _zod.z.object({
      "icon": _zod.z.string().nullish(),
      "alias": _zod.z.string().nullish(),
      "name": _zod.z.string().nullish()
    })
  })).or(_zod.z.object({
    "$type": _zod.z.enum(["MediaReferenceResponseModel"]),
    "id": _zod.z.string().uuid(),
    "name": _zod.z.string().nullish(),
    "mediaType": _zod.z.object({
      "icon": _zod.z.string().nullish(),
      "alias": _zod.z.string().nullish(),
      "name": _zod.z.string().nullish()
    })
  })))
});
var getDocumentByIdReferencedDescendantsParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getDocumentByIdReferencedDescendantsQueryTakeDefault = 20;
var getDocumentByIdReferencedDescendantsQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getDocumentByIdReferencedDescendantsQueryTakeDefault)
});
var getDocumentByIdReferencedDescendantsResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid()
  }))
});
var putDocumentByIdUnpublishParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putDocumentByIdUnpublishBody = _zod.z.object({
  "cultures": _zod.z.array(_zod.z.string()).nullish()
});
var putDocumentByIdValidateParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putDocumentByIdValidateBody = _zod.z.object({
  "values": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullish(),
    "segment": _zod.z.string().nullish(),
    "alias": _zod.z.string().min(1),
    "value": _zod.z.any().nullish()
  })),
  "variants": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullish(),
    "segment": _zod.z.string().nullish(),
    "name": _zod.z.string().min(1)
  })),
  "template": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish()
});
var putUmbracoManagementApiV11DocumentByIdValidate11Params = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putUmbracoManagementApiV11DocumentByIdValidate11Body = _zod.z.object({
  "values": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullish(),
    "segment": _zod.z.string().nullish(),
    "alias": _zod.z.string().min(1),
    "value": _zod.z.any().nullish()
  })),
  "variants": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullish(),
    "segment": _zod.z.string().nullish(),
    "name": _zod.z.string().min(1)
  })),
  "template": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish(),
  "cultures": _zod.z.array(_zod.z.string()).nullish()
});
var getDocumentAreReferencedQueryTakeDefault = 20;
var getDocumentAreReferencedQueryParams = _zod.z.object({
  "id": _zod.z.array(_zod.z.string().uuid()).optional(),
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getDocumentAreReferencedQueryTakeDefault)
});
var getDocumentAreReferencedResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid()
  }))
});
var getDocumentConfigurationResponse = _zod.z.object({
  "disableDeleteWhenReferenced": _zod.z.boolean(),
  "disableUnpublishWhenReferenced": _zod.z.boolean(),
  "allowEditInvariantFromNonDefault": _zod.z.boolean(),
  "allowNonExistingSegmentsCreation": _zod.z.boolean(),
  "reservedFieldNames": _zod.z.array(_zod.z.string())
});
var putDocumentSortBody = _zod.z.object({
  "parent": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish(),
  "sorting": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "sortOrder": _zod.z.number()
  }))
});
var getDocumentUrlsQueryParams = _zod.z.object({
  "id": _zod.z.array(_zod.z.string().uuid()).optional()
});
var getDocumentUrlsResponseItem = _zod.z.object({
  "id": _zod.z.string().uuid(),
  "urlInfos": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullable(),
    "url": _zod.z.string()
  }))
});
var getDocumentUrlsResponse = _zod.z.array(getDocumentUrlsResponseItem);
var postDocumentValidateBody = _zod.z.object({
  "values": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullish(),
    "segment": _zod.z.string().nullish(),
    "alias": _zod.z.string().min(1),
    "value": _zod.z.any().nullish()
  })),
  "variants": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullish(),
    "segment": _zod.z.string().nullish(),
    "name": _zod.z.string().min(1)
  })),
  "id": _zod.z.string().uuid().nullish(),
  "parent": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish(),
  "documentType": _zod.z.object({
    "id": _zod.z.string().uuid()
  }),
  "template": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullable()
});
var getItemDocumentQueryParams = _zod.z.object({
  "id": _zod.z.array(_zod.z.string().uuid()).optional()
});
var getItemDocumentResponseItem = _zod.z.object({
  "id": _zod.z.string().uuid(),
  "isTrashed": _zod.z.boolean(),
  "isProtected": _zod.z.boolean(),
  "parent": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish(),
  "hasChildren": _zod.z.boolean(),
  "documentType": _zod.z.object({
    "id": _zod.z.string().uuid(),
    "icon": _zod.z.string(),
    "collection": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish()
  }),
  "variants": _zod.z.array(_zod.z.object({
    "name": _zod.z.string(),
    "culture": _zod.z.string().nullish(),
    "state": _zod.z.enum(["NotCreated", "Draft", "Published", "PublishedPendingChanges"])
  }))
});
var getItemDocumentResponse = _zod.z.array(getItemDocumentResponseItem);
var getItemDocumentSearchQueryTakeDefault = 100;
var getItemDocumentSearchQueryParams = _zod.z.object({
  "query": _zod.z.string().optional(),
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getItemDocumentSearchQueryTakeDefault),
  "parentId": _zod.z.string().uuid().optional(),
  "allowedDocumentTypes": _zod.z.array(_zod.z.string().uuid()).optional()
});
var getItemDocumentSearchResponse = _zod.z.object({
  "items": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "isTrashed": _zod.z.boolean(),
    "isProtected": _zod.z.boolean(),
    "parent": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish(),
    "hasChildren": _zod.z.boolean(),
    "documentType": _zod.z.object({
      "id": _zod.z.string().uuid(),
      "icon": _zod.z.string(),
      "collection": _zod.z.object({
        "id": _zod.z.string().uuid()
      }).nullish()
    }),
    "variants": _zod.z.array(_zod.z.object({
      "name": _zod.z.string(),
      "culture": _zod.z.string().nullish(),
      "state": _zod.z.enum(["NotCreated", "Draft", "Published", "PublishedPendingChanges"])
    }))
  })),
  "total": _zod.z.number()
});
var deleteRecycleBinDocumentByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getRecycleBinDocumentByIdOriginalParentParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getRecycleBinDocumentByIdOriginalParentResponse = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putRecycleBinDocumentByIdRestoreParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putRecycleBinDocumentByIdRestoreBody = _zod.z.object({
  "target": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish()
});
var getRecycleBinDocumentChildrenQueryTakeDefault = 100;
var getRecycleBinDocumentChildrenQueryParams = _zod.z.object({
  "parentId": _zod.z.string().uuid().optional(),
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getRecycleBinDocumentChildrenQueryTakeDefault)
});
var getRecycleBinDocumentChildrenResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "createDate": _zod.z.string().datetime({ "local": true }),
    "hasChildren": _zod.z.boolean(),
    "parent": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish(),
    "documentType": _zod.z.object({
      "id": _zod.z.string().uuid(),
      "icon": _zod.z.string(),
      "collection": _zod.z.object({
        "id": _zod.z.string().uuid()
      }).nullish()
    }),
    "variants": _zod.z.array(_zod.z.object({
      "name": _zod.z.string(),
      "culture": _zod.z.string().nullish(),
      "state": _zod.z.enum(["NotCreated", "Draft", "Published", "PublishedPendingChanges"])
    }))
  }))
});
var getRecycleBinDocumentRootQueryTakeDefault = 100;
var getRecycleBinDocumentRootQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getRecycleBinDocumentRootQueryTakeDefault)
});
var getRecycleBinDocumentRootResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "createDate": _zod.z.string().datetime({ "local": true }),
    "hasChildren": _zod.z.boolean(),
    "parent": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish(),
    "documentType": _zod.z.object({
      "id": _zod.z.string().uuid(),
      "icon": _zod.z.string(),
      "collection": _zod.z.object({
        "id": _zod.z.string().uuid()
      }).nullish()
    }),
    "variants": _zod.z.array(_zod.z.object({
      "name": _zod.z.string(),
      "culture": _zod.z.string().nullish(),
      "state": _zod.z.enum(["NotCreated", "Draft", "Published", "PublishedPendingChanges"])
    }))
  }))
});
var getTreeDocumentAncestorsQueryParams = _zod.z.object({
  "descendantId": _zod.z.string().uuid().optional()
});
var getTreeDocumentAncestorsResponseItem = _zod.z.object({
  "hasChildren": _zod.z.boolean(),
  "parent": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish(),
  "noAccess": _zod.z.boolean(),
  "isTrashed": _zod.z.boolean(),
  "id": _zod.z.string().uuid(),
  "createDate": _zod.z.string().datetime({ "local": true }),
  "isProtected": _zod.z.boolean(),
  "documentType": _zod.z.object({
    "id": _zod.z.string().uuid(),
    "icon": _zod.z.string(),
    "collection": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish()
  }),
  "variants": _zod.z.array(_zod.z.object({
    "name": _zod.z.string(),
    "culture": _zod.z.string().nullish(),
    "state": _zod.z.enum(["NotCreated", "Draft", "Published", "PublishedPendingChanges"])
  }))
});
var getTreeDocumentAncestorsResponse = _zod.z.array(getTreeDocumentAncestorsResponseItem);
var getTreeDocumentChildrenQueryTakeDefault = 100;
var getTreeDocumentChildrenQueryParams = _zod.z.object({
  "parentId": _zod.z.string().uuid().optional(),
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getTreeDocumentChildrenQueryTakeDefault),
  "dataTypeId": _zod.z.string().uuid().optional()
});
var getTreeDocumentChildrenResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "hasChildren": _zod.z.boolean(),
    "parent": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish(),
    "noAccess": _zod.z.boolean(),
    "isTrashed": _zod.z.boolean(),
    "id": _zod.z.string().uuid(),
    "createDate": _zod.z.string().datetime({ "local": true }),
    "isProtected": _zod.z.boolean(),
    "documentType": _zod.z.object({
      "id": _zod.z.string().uuid(),
      "icon": _zod.z.string(),
      "collection": _zod.z.object({
        "id": _zod.z.string().uuid()
      }).nullish()
    }),
    "variants": _zod.z.array(_zod.z.object({
      "name": _zod.z.string(),
      "culture": _zod.z.string().nullish(),
      "state": _zod.z.enum(["NotCreated", "Draft", "Published", "PublishedPendingChanges"])
    }))
  }))
});
var getTreeDocumentRootQueryTakeDefault = 100;
var getTreeDocumentRootQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getTreeDocumentRootQueryTakeDefault),
  "dataTypeId": _zod.z.string().uuid().optional()
});
var getTreeDocumentRootResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "hasChildren": _zod.z.boolean(),
    "parent": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish(),
    "noAccess": _zod.z.boolean(),
    "isTrashed": _zod.z.boolean(),
    "id": _zod.z.string().uuid(),
    "createDate": _zod.z.string().datetime({ "local": true }),
    "isProtected": _zod.z.boolean(),
    "documentType": _zod.z.object({
      "id": _zod.z.string().uuid(),
      "icon": _zod.z.string(),
      "collection": _zod.z.object({
        "id": _zod.z.string().uuid()
      }).nullish()
    }),
    "variants": _zod.z.array(_zod.z.object({
      "name": _zod.z.string(),
      "culture": _zod.z.string().nullish(),
      "state": _zod.z.enum(["NotCreated", "Draft", "Published", "PublishedPendingChanges"])
    }))
  }))
});
var postDynamicRootQueryBody = _zod.z.object({
  "context": _zod.z.object({
    "id": _zod.z.string().uuid().nullish(),
    "parent": _zod.z.object({
      "id": _zod.z.string().uuid()
    }),
    "culture": _zod.z.string().nullish(),
    "segment": _zod.z.string().nullish()
  }),
  "query": _zod.z.object({
    "origin": _zod.z.object({
      "alias": _zod.z.string(),
      "id": _zod.z.string().uuid().nullish()
    }),
    "steps": _zod.z.array(_zod.z.object({
      "alias": _zod.z.string(),
      "documentTypeIds": _zod.z.array(_zod.z.string().uuid())
    }))
  })
});
var postDynamicRootQueryResponse = _zod.z.object({
  "roots": _zod.z.array(_zod.z.string().uuid())
});
var getDynamicRootStepsResponseItem = _zod.z.string();
var getDynamicRootStepsResponse = _zod.z.array(getDynamicRootStepsResponseItem);
var getHealthCheckGroupQueryTakeDefault = 100;
var getHealthCheckGroupQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getHealthCheckGroupQueryTakeDefault)
});
var getHealthCheckGroupResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "name": _zod.z.string()
  }))
});
var getHealthCheckGroupByNameParams = _zod.z.object({
  "name": _zod.z.string()
});
var getHealthCheckGroupByNameResponse = _zod.z.object({
  "name": _zod.z.string(),
  "checks": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "name": _zod.z.string(),
    "description": _zod.z.string().nullish()
  }))
});
var postHealthCheckGroupByNameCheckParams = _zod.z.object({
  "name": _zod.z.string()
});
var postHealthCheckGroupByNameCheckResponse = _zod.z.object({
  "checks": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "results": _zod.z.array(_zod.z.object({
      "message": _zod.z.string(),
      "resultType": _zod.z.enum(["Success", "Warning", "Error", "Info"]),
      "actions": _zod.z.array(_zod.z.object({
        "healthCheck": _zod.z.object({
          "id": _zod.z.string().uuid()
        }),
        "alias": _zod.z.string().nullish(),
        "name": _zod.z.string().nullish(),
        "description": _zod.z.string().nullish(),
        "valueRequired": _zod.z.boolean(),
        "providedValue": _zod.z.string().nullish(),
        "providedValueValidation": _zod.z.string().nullish(),
        "providedValueValidationRegex": _zod.z.string().nullish(),
        "actionParameters": _zod.z.record(_zod.z.string(), _zod.z.any()).nullish()
      })).nullish(),
      "readMoreLink": _zod.z.string().nullish()
    })).nullish()
  }))
});
var postHealthCheckExecuteActionBody = _zod.z.object({
  "healthCheck": _zod.z.object({
    "id": _zod.z.string().uuid()
  }),
  "alias": _zod.z.string().nullish(),
  "name": _zod.z.string().nullish(),
  "description": _zod.z.string().nullish(),
  "valueRequired": _zod.z.boolean(),
  "providedValue": _zod.z.string().nullish(),
  "providedValueValidation": _zod.z.string().nullish(),
  "providedValueValidationRegex": _zod.z.string().nullish(),
  "actionParameters": _zod.z.record(_zod.z.string(), _zod.z.any()).nullish()
});
var postHealthCheckExecuteActionResponse = _zod.z.object({
  "message": _zod.z.string(),
  "resultType": _zod.z.enum(["Success", "Warning", "Error", "Info"]),
  "actions": _zod.z.array(_zod.z.object({
    "healthCheck": _zod.z.object({
      "id": _zod.z.string().uuid()
    }),
    "alias": _zod.z.string().nullish(),
    "name": _zod.z.string().nullish(),
    "description": _zod.z.string().nullish(),
    "valueRequired": _zod.z.boolean(),
    "providedValue": _zod.z.string().nullish(),
    "providedValueValidation": _zod.z.string().nullish(),
    "providedValueValidationRegex": _zod.z.string().nullish(),
    "actionParameters": _zod.z.record(_zod.z.string(), _zod.z.any()).nullish()
  })).nullish(),
  "readMoreLink": _zod.z.string().nullish()
});
var getHelpQueryTakeDefault = 100;
var getHelpQueryBaseUrlDefault = "https://our.umbraco.com";
var getHelpQueryParams = _zod.z.object({
  "section": _zod.z.string().optional(),
  "tree": _zod.z.string().optional(),
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getHelpQueryTakeDefault),
  "baseUrl": _zod.z.string().default(getHelpQueryBaseUrlDefault)
});
var getHelpResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "name": _zod.z.string().nullish(),
    "description": _zod.z.string().nullish(),
    "url": _zod.z.string().nullish(),
    "type": _zod.z.string().nullish()
  }))
});
var getImagingResizeUrlsQueryHeightDefault = 200;
var getImagingResizeUrlsQueryWidthDefault = 200;
var getImagingResizeUrlsQueryParams = _zod.z.object({
  "id": _zod.z.array(_zod.z.string().uuid()).optional(),
  "height": _zod.z.coerce.number().default(getImagingResizeUrlsQueryHeightDefault),
  "width": _zod.z.coerce.number().default(getImagingResizeUrlsQueryWidthDefault),
  "mode": _zod.z.enum(["Crop", "Max", "Stretch", "Pad", "BoxPad", "Min"]).optional()
});
var getImagingResizeUrlsResponseItem = _zod.z.object({
  "id": _zod.z.string().uuid(),
  "urlInfos": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullable(),
    "url": _zod.z.string()
  }))
});
var getImagingResizeUrlsResponse = _zod.z.array(getImagingResizeUrlsResponseItem);
var getImportAnalyzeQueryParams = _zod.z.object({
  "temporaryFileId": _zod.z.string().uuid().optional()
});
var getImportAnalyzeResponse = _zod.z.object({
  "entityType": _zod.z.string(),
  "alias": _zod.z.string().nullish(),
  "key": _zod.z.string().uuid().nullish()
});
var getIndexerQueryTakeDefault = 100;
var getIndexerQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getIndexerQueryTakeDefault)
});
var getIndexerResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "name": _zod.z.string().min(1),
    "healthStatus": _zod.z.object({
      "status": _zod.z.enum(["Healthy", "Unhealthy", "Rebuilding", "Corrupt"]),
      "message": _zod.z.string().nullish()
    }),
    "canRebuild": _zod.z.boolean(),
    "searcherName": _zod.z.string(),
    "documentCount": _zod.z.number(),
    "fieldCount": _zod.z.number(),
    "providerProperties": _zod.z.record(_zod.z.string(), _zod.z.any().nullable()).nullish()
  }))
});
var getIndexerByIndexNameParams = _zod.z.object({
  "indexName": _zod.z.string()
});
var getIndexerByIndexNameResponse = _zod.z.object({
  "name": _zod.z.string().min(1),
  "healthStatus": _zod.z.object({
    "status": _zod.z.enum(["Healthy", "Unhealthy", "Rebuilding", "Corrupt"]),
    "message": _zod.z.string().nullish()
  }),
  "canRebuild": _zod.z.boolean(),
  "searcherName": _zod.z.string(),
  "documentCount": _zod.z.number(),
  "fieldCount": _zod.z.number(),
  "providerProperties": _zod.z.record(_zod.z.string(), _zod.z.any().nullable()).nullish()
});
var postIndexerByIndexNameRebuildParams = _zod.z.object({
  "indexName": _zod.z.string()
});
var getInstallSettingsResponse = _zod.z.object({
  "user": _zod.z.object({
    "minCharLength": _zod.z.number(),
    "minNonAlphaNumericLength": _zod.z.number(),
    "consentLevels": _zod.z.array(_zod.z.object({
      "level": _zod.z.enum(["Minimal", "Basic", "Detailed"]),
      "description": _zod.z.string().min(1)
    }))
  }),
  "databases": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "sortOrder": _zod.z.number(),
    "displayName": _zod.z.string().min(1),
    "defaultDatabaseName": _zod.z.string().min(1),
    "providerName": _zod.z.string().min(1),
    "isConfigured": _zod.z.boolean(),
    "requiresServer": _zod.z.boolean(),
    "serverPlaceholder": _zod.z.string().min(1),
    "requiresCredentials": _zod.z.boolean(),
    "supportsIntegratedAuthentication": _zod.z.boolean(),
    "requiresConnectionTest": _zod.z.boolean()
  }))
});
var postInstallSetupBodyUserNameMin = 0;
var postInstallSetupBodyUserNameMax = 255;
var postInstallSetupBody = _zod.z.object({
  "user": _zod.z.object({
    "name": _zod.z.string().min(postInstallSetupBodyUserNameMin).max(postInstallSetupBodyUserNameMax),
    "email": _zod.z.string().email().min(1),
    "password": _zod.z.string().min(1),
    "subscribeToNewsletter": _zod.z.boolean()
  }),
  "database": _zod.z.object({
    "id": _zod.z.string().uuid(),
    "providerName": _zod.z.string().min(1),
    "server": _zod.z.string().nullish(),
    "name": _zod.z.string().nullish(),
    "username": _zod.z.string().nullish(),
    "password": _zod.z.string().nullish(),
    "useIntegratedAuthentication": _zod.z.boolean(),
    "connectionString": _zod.z.string().nullish(),
    "trustServerCertificate": _zod.z.boolean()
  }),
  "telemetryLevel": _zod.z.enum(["Minimal", "Basic", "Detailed"])
});
var postInstallValidateDatabaseBody = _zod.z.object({
  "id": _zod.z.string().uuid(),
  "providerName": _zod.z.string().min(1),
  "server": _zod.z.string().nullish(),
  "name": _zod.z.string().nullish(),
  "username": _zod.z.string().nullish(),
  "password": _zod.z.string().nullish(),
  "useIntegratedAuthentication": _zod.z.boolean(),
  "connectionString": _zod.z.string().nullish(),
  "trustServerCertificate": _zod.z.boolean()
});
var getItemLanguageQueryParams = _zod.z.object({
  "isoCode": _zod.z.array(_zod.z.string()).optional()
});
var getItemLanguageResponseItem = _zod.z.object({
  "name": _zod.z.string().min(1),
  "isoCode": _zod.z.string().min(1)
});
var getItemLanguageResponse = _zod.z.array(getItemLanguageResponseItem);
var getItemLanguageDefaultResponse = _zod.z.object({
  "name": _zod.z.string().min(1),
  "isoCode": _zod.z.string().min(1)
});
var getLanguageQueryTakeDefault = 100;
var getLanguageQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getLanguageQueryTakeDefault)
});
var getLanguageResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "name": _zod.z.string().min(1),
    "isDefault": _zod.z.boolean(),
    "isMandatory": _zod.z.boolean(),
    "fallbackIsoCode": _zod.z.string().nullish(),
    "isoCode": _zod.z.string().min(1)
  }))
});
var postLanguageBody = _zod.z.object({
  "name": _zod.z.string().min(1),
  "isDefault": _zod.z.boolean(),
  "isMandatory": _zod.z.boolean(),
  "fallbackIsoCode": _zod.z.string().nullish(),
  "isoCode": _zod.z.string().min(1)
});
var getLanguageByIsoCodeParams = _zod.z.object({
  "isoCode": _zod.z.string()
});
var getLanguageByIsoCodeResponse = _zod.z.object({
  "name": _zod.z.string().min(1),
  "isDefault": _zod.z.boolean(),
  "isMandatory": _zod.z.boolean(),
  "fallbackIsoCode": _zod.z.string().nullish(),
  "isoCode": _zod.z.string().min(1)
});
var deleteLanguageByIsoCodeParams = _zod.z.object({
  "isoCode": _zod.z.string()
});
var putLanguageByIsoCodeParams = _zod.z.object({
  "isoCode": _zod.z.string()
});
var putLanguageByIsoCodeBody = _zod.z.object({
  "name": _zod.z.string().min(1),
  "isDefault": _zod.z.boolean(),
  "isMandatory": _zod.z.boolean(),
  "fallbackIsoCode": _zod.z.string().nullish()
});
var getLogViewerLevelQueryTakeDefault = 100;
var getLogViewerLevelQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getLogViewerLevelQueryTakeDefault)
});
var getLogViewerLevelResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "name": _zod.z.string(),
    "level": _zod.z.enum(["Verbose", "Debug", "Information", "Warning", "Error", "Fatal"])
  }))
});
var getLogViewerLevelCountQueryParams = _zod.z.object({
  "startDate": _zod.z.string().datetime({ "local": true }).optional(),
  "endDate": _zod.z.string().datetime({ "local": true }).optional()
});
var getLogViewerLevelCountResponse = _zod.z.object({
  "information": _zod.z.number(),
  "debug": _zod.z.number(),
  "warning": _zod.z.number(),
  "error": _zod.z.number(),
  "fatal": _zod.z.number()
});
var getLogViewerLogQueryTakeDefault = 100;
var getLogViewerLogQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getLogViewerLogQueryTakeDefault),
  "orderDirection": _zod.z.enum(["Ascending", "Descending"]).optional(),
  "filterExpression": _zod.z.string().optional(),
  "logLevel": _zod.z.array(_zod.z.enum(["Verbose", "Debug", "Information", "Warning", "Error", "Fatal"])).optional(),
  "startDate": _zod.z.string().datetime({ "local": true }).optional(),
  "endDate": _zod.z.string().datetime({ "local": true }).optional()
});
var getLogViewerLogResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "timestamp": _zod.z.string().datetime({ "local": true }),
    "level": _zod.z.enum(["Verbose", "Debug", "Information", "Warning", "Error", "Fatal"]),
    "messageTemplate": _zod.z.string().nullish(),
    "renderedMessage": _zod.z.string().nullish(),
    "properties": _zod.z.array(_zod.z.object({
      "name": _zod.z.string(),
      "value": _zod.z.string().nullish()
    })),
    "exception": _zod.z.string().nullish()
  }))
});
var getLogViewerMessageTemplateQueryTakeDefault = 100;
var getLogViewerMessageTemplateQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getLogViewerMessageTemplateQueryTakeDefault),
  "startDate": _zod.z.string().datetime({ "local": true }).optional(),
  "endDate": _zod.z.string().datetime({ "local": true }).optional()
});
var getLogViewerMessageTemplateResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "messageTemplate": _zod.z.string().nullish(),
    "count": _zod.z.number()
  }))
});
var getLogViewerSavedSearchQueryTakeDefault = 100;
var getLogViewerSavedSearchQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getLogViewerSavedSearchQueryTakeDefault)
});
var getLogViewerSavedSearchResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "name": _zod.z.string(),
    "query": _zod.z.string()
  }))
});
var postLogViewerSavedSearchBody = _zod.z.object({
  "name": _zod.z.string(),
  "query": _zod.z.string()
});
var getLogViewerSavedSearchByNameParams = _zod.z.object({
  "name": _zod.z.string()
});
var getLogViewerSavedSearchByNameResponse = _zod.z.object({
  "name": _zod.z.string(),
  "query": _zod.z.string()
});
var deleteLogViewerSavedSearchByNameParams = _zod.z.object({
  "name": _zod.z.string()
});
var getLogViewerValidateLogsSizeQueryParams = _zod.z.object({
  "startDate": _zod.z.string().datetime({ "local": true }).optional(),
  "endDate": _zod.z.string().datetime({ "local": true }).optional()
});
var getManifestManifestResponseItem = _zod.z.object({
  "name": _zod.z.string().min(1),
  "id": _zod.z.string().nullish(),
  "version": _zod.z.string().nullish(),
  "extensions": _zod.z.array(_zod.z.any())
});
var getManifestManifestResponse = _zod.z.array(getManifestManifestResponseItem);
var getManifestManifestPrivateResponseItem = _zod.z.object({
  "name": _zod.z.string().min(1),
  "id": _zod.z.string().nullish(),
  "version": _zod.z.string().nullish(),
  "extensions": _zod.z.array(_zod.z.any())
});
var getManifestManifestPrivateResponse = _zod.z.array(getManifestManifestPrivateResponseItem);
var getManifestManifestPublicResponseItem = _zod.z.object({
  "name": _zod.z.string().min(1),
  "id": _zod.z.string().nullish(),
  "version": _zod.z.string().nullish(),
  "extensions": _zod.z.array(_zod.z.any())
});
var getManifestManifestPublicResponse = _zod.z.array(getManifestManifestPublicResponseItem);
var getItemMediaTypeQueryParams = _zod.z.object({
  "id": _zod.z.array(_zod.z.string().uuid()).optional()
});
var getItemMediaTypeResponseItem = _zod.z.object({
  "id": _zod.z.string().uuid(),
  "name": _zod.z.string(),
  "icon": _zod.z.string().nullish()
});
var getItemMediaTypeResponse = _zod.z.array(getItemMediaTypeResponseItem);
var getItemMediaTypeAllowedQueryTakeDefault = 100;
var getItemMediaTypeAllowedQueryParams = _zod.z.object({
  "fileExtension": _zod.z.string().optional(),
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getItemMediaTypeAllowedQueryTakeDefault)
});
var getItemMediaTypeAllowedResponse = _zod.z.object({
  "items": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "name": _zod.z.string(),
    "icon": _zod.z.string().nullish()
  })),
  "total": _zod.z.number()
});
var getItemMediaTypeFoldersQueryTakeDefault = 100;
var getItemMediaTypeFoldersQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getItemMediaTypeFoldersQueryTakeDefault)
});
var getItemMediaTypeFoldersResponse = _zod.z.object({
  "items": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "name": _zod.z.string(),
    "icon": _zod.z.string().nullish()
  })),
  "total": _zod.z.number()
});
var getItemMediaTypeSearchQueryTakeDefault = 100;
var getItemMediaTypeSearchQueryParams = _zod.z.object({
  "query": _zod.z.string().optional(),
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getItemMediaTypeSearchQueryTakeDefault)
});
var getItemMediaTypeSearchResponse = _zod.z.object({
  "items": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "name": _zod.z.string(),
    "icon": _zod.z.string().nullish()
  })),
  "total": _zod.z.number()
});
var postMediaTypeBody = _zod.z.object({
  "alias": _zod.z.string().min(1),
  "name": _zod.z.string().min(1),
  "description": _zod.z.string().nullish(),
  "icon": _zod.z.string().min(1),
  "allowedAsRoot": _zod.z.boolean(),
  "variesByCulture": _zod.z.boolean(),
  "variesBySegment": _zod.z.boolean(),
  "isElement": _zod.z.boolean(),
  "properties": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "container": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish(),
    "sortOrder": _zod.z.number(),
    "alias": _zod.z.string().min(1),
    "name": _zod.z.string().min(1),
    "description": _zod.z.string().nullish(),
    "dataType": _zod.z.object({
      "id": _zod.z.string().uuid()
    }),
    "variesByCulture": _zod.z.boolean(),
    "variesBySegment": _zod.z.boolean(),
    "validation": _zod.z.object({
      "mandatory": _zod.z.boolean(),
      "mandatoryMessage": _zod.z.string().nullish(),
      "regEx": _zod.z.string().nullish(),
      "regExMessage": _zod.z.string().nullish()
    }),
    "appearance": _zod.z.object({
      "labelOnTop": _zod.z.boolean()
    })
  })),
  "containers": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "parent": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish(),
    "name": _zod.z.string().nullish(),
    "type": _zod.z.string().min(1),
    "sortOrder": _zod.z.number()
  })),
  "id": _zod.z.string().uuid().nullish(),
  "parent": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish(),
  "allowedMediaTypes": _zod.z.array(_zod.z.object({
    "mediaType": _zod.z.object({
      "id": _zod.z.string().uuid()
    }),
    "sortOrder": _zod.z.number()
  })),
  "compositions": _zod.z.array(_zod.z.object({
    "mediaType": _zod.z.object({
      "id": _zod.z.string().uuid()
    }),
    "compositionType": _zod.z.enum(["Composition", "Inheritance"])
  })),
  "collection": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish()
});
var getMediaTypeByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getMediaTypeByIdResponse = _zod.z.object({
  "alias": _zod.z.string().min(1),
  "name": _zod.z.string().min(1),
  "description": _zod.z.string().nullish(),
  "icon": _zod.z.string().min(1),
  "allowedAsRoot": _zod.z.boolean(),
  "variesByCulture": _zod.z.boolean(),
  "variesBySegment": _zod.z.boolean(),
  "collection": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish(),
  "isElement": _zod.z.boolean(),
  "properties": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "container": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish(),
    "sortOrder": _zod.z.number(),
    "alias": _zod.z.string().min(1),
    "name": _zod.z.string().min(1),
    "description": _zod.z.string().nullish(),
    "dataType": _zod.z.object({
      "id": _zod.z.string().uuid()
    }),
    "variesByCulture": _zod.z.boolean(),
    "variesBySegment": _zod.z.boolean(),
    "validation": _zod.z.object({
      "mandatory": _zod.z.boolean(),
      "mandatoryMessage": _zod.z.string().nullish(),
      "regEx": _zod.z.string().nullish(),
      "regExMessage": _zod.z.string().nullish()
    }),
    "appearance": _zod.z.object({
      "labelOnTop": _zod.z.boolean()
    })
  })),
  "containers": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "parent": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish(),
    "name": _zod.z.string().nullish(),
    "type": _zod.z.string().min(1),
    "sortOrder": _zod.z.number()
  })),
  "id": _zod.z.string().uuid(),
  "allowedMediaTypes": _zod.z.array(_zod.z.object({
    "mediaType": _zod.z.object({
      "id": _zod.z.string().uuid()
    }),
    "sortOrder": _zod.z.number()
  })),
  "compositions": _zod.z.array(_zod.z.object({
    "mediaType": _zod.z.object({
      "id": _zod.z.string().uuid()
    }),
    "compositionType": _zod.z.enum(["Composition", "Inheritance"])
  })),
  "isDeletable": _zod.z.boolean(),
  "aliasCanBeChanged": _zod.z.boolean()
});
var deleteMediaTypeByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putMediaTypeByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putMediaTypeByIdBody = _zod.z.object({
  "alias": _zod.z.string().min(1),
  "name": _zod.z.string().min(1),
  "description": _zod.z.string().nullish(),
  "icon": _zod.z.string().min(1),
  "allowedAsRoot": _zod.z.boolean(),
  "variesByCulture": _zod.z.boolean(),
  "variesBySegment": _zod.z.boolean(),
  "collection": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish(),
  "isElement": _zod.z.boolean(),
  "properties": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "container": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish(),
    "sortOrder": _zod.z.number(),
    "alias": _zod.z.string().min(1),
    "name": _zod.z.string().min(1),
    "description": _zod.z.string().nullish(),
    "dataType": _zod.z.object({
      "id": _zod.z.string().uuid()
    }),
    "variesByCulture": _zod.z.boolean(),
    "variesBySegment": _zod.z.boolean(),
    "validation": _zod.z.object({
      "mandatory": _zod.z.boolean(),
      "mandatoryMessage": _zod.z.string().nullish(),
      "regEx": _zod.z.string().nullish(),
      "regExMessage": _zod.z.string().nullish()
    }),
    "appearance": _zod.z.object({
      "labelOnTop": _zod.z.boolean()
    })
  })),
  "containers": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "parent": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish(),
    "name": _zod.z.string().nullish(),
    "type": _zod.z.string().min(1),
    "sortOrder": _zod.z.number()
  })),
  "allowedMediaTypes": _zod.z.array(_zod.z.object({
    "mediaType": _zod.z.object({
      "id": _zod.z.string().uuid()
    }),
    "sortOrder": _zod.z.number()
  })),
  "compositions": _zod.z.array(_zod.z.object({
    "mediaType": _zod.z.object({
      "id": _zod.z.string().uuid()
    }),
    "compositionType": _zod.z.enum(["Composition", "Inheritance"])
  }))
});
var getMediaTypeByIdAllowedChildrenParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getMediaTypeByIdAllowedChildrenQueryTakeDefault = 100;
var getMediaTypeByIdAllowedChildrenQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getMediaTypeByIdAllowedChildrenQueryTakeDefault)
});
var getMediaTypeByIdAllowedChildrenResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "name": _zod.z.string(),
    "description": _zod.z.string().nullish(),
    "icon": _zod.z.string().nullish()
  }))
});
var getMediaTypeByIdCompositionReferencesParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getMediaTypeByIdCompositionReferencesResponseItem = _zod.z.object({
  "id": _zod.z.string().uuid(),
  "name": _zod.z.string(),
  "icon": _zod.z.string()
});
var getMediaTypeByIdCompositionReferencesResponse = _zod.z.array(getMediaTypeByIdCompositionReferencesResponseItem);
var postMediaTypeByIdCopyParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var postMediaTypeByIdCopyBody = _zod.z.object({
  "target": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish()
});
var getMediaTypeByIdExportParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getMediaTypeByIdExportResponse = _zod.z.instanceof(FileLike);
var putMediaTypeByIdImportParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putMediaTypeByIdImportBody = _zod.z.object({
  "file": _zod.z.object({
    "id": _zod.z.string().uuid()
  })
});
var putMediaTypeByIdMoveParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putMediaTypeByIdMoveBody = _zod.z.object({
  "target": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish()
});
var getMediaTypeAllowedAtRootQueryTakeDefault = 100;
var getMediaTypeAllowedAtRootQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getMediaTypeAllowedAtRootQueryTakeDefault)
});
var getMediaTypeAllowedAtRootResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "name": _zod.z.string(),
    "description": _zod.z.string().nullish(),
    "icon": _zod.z.string().nullish()
  }))
});
var postMediaTypeAvailableCompositionsBody = _zod.z.object({
  "id": _zod.z.string().uuid().nullish(),
  "currentPropertyAliases": _zod.z.array(_zod.z.string()),
  "currentCompositeIds": _zod.z.array(_zod.z.string().uuid())
});
var postMediaTypeAvailableCompositionsResponseItem = _zod.z.object({
  "id": _zod.z.string().uuid(),
  "name": _zod.z.string(),
  "icon": _zod.z.string(),
  "folderPath": _zod.z.array(_zod.z.string()),
  "isCompatible": _zod.z.boolean()
});
var postMediaTypeAvailableCompositionsResponse = _zod.z.array(postMediaTypeAvailableCompositionsResponseItem);
var getMediaTypeConfigurationResponse = _zod.z.object({
  "reservedFieldNames": _zod.z.array(_zod.z.string())
});
var postMediaTypeFolderBody = _zod.z.object({
  "name": _zod.z.string().min(1),
  "id": _zod.z.string().uuid().nullish(),
  "parent": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish()
});
var getMediaTypeFolderByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getMediaTypeFolderByIdResponse = _zod.z.object({
  "name": _zod.z.string().min(1),
  "id": _zod.z.string().uuid()
});
var deleteMediaTypeFolderByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putMediaTypeFolderByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putMediaTypeFolderByIdBody = _zod.z.object({
  "name": _zod.z.string().min(1)
});
var postMediaTypeImportBody = _zod.z.object({
  "file": _zod.z.object({
    "id": _zod.z.string().uuid()
  })
});
var getTreeMediaTypeAncestorsQueryParams = _zod.z.object({
  "descendantId": _zod.z.string().uuid().optional()
});
var getTreeMediaTypeAncestorsResponseItem = _zod.z.object({
  "hasChildren": _zod.z.boolean(),
  "id": _zod.z.string().uuid(),
  "parent": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish(),
  "name": _zod.z.string(),
  "isFolder": _zod.z.boolean(),
  "icon": _zod.z.string(),
  "isDeletable": _zod.z.boolean()
});
var getTreeMediaTypeAncestorsResponse = _zod.z.array(getTreeMediaTypeAncestorsResponseItem);
var getTreeMediaTypeChildrenQueryTakeDefault = 100;
var getTreeMediaTypeChildrenQueryParams = _zod.z.object({
  "parentId": _zod.z.string().uuid().optional(),
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getTreeMediaTypeChildrenQueryTakeDefault),
  "foldersOnly": _zod.z.coerce.boolean().optional()
});
var getTreeMediaTypeChildrenResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "hasChildren": _zod.z.boolean(),
    "id": _zod.z.string().uuid(),
    "parent": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish(),
    "name": _zod.z.string(),
    "isFolder": _zod.z.boolean(),
    "icon": _zod.z.string(),
    "isDeletable": _zod.z.boolean()
  }))
});
var getTreeMediaTypeRootQueryTakeDefault = 100;
var getTreeMediaTypeRootQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getTreeMediaTypeRootQueryTakeDefault),
  "foldersOnly": _zod.z.coerce.boolean().optional()
});
var getTreeMediaTypeRootResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "hasChildren": _zod.z.boolean(),
    "id": _zod.z.string().uuid(),
    "parent": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish(),
    "name": _zod.z.string(),
    "isFolder": _zod.z.boolean(),
    "icon": _zod.z.string(),
    "isDeletable": _zod.z.boolean()
  }))
});
var getCollectionMediaQueryOrderByDefault = "updateDate";
var getCollectionMediaQueryTakeDefault = 100;
var getCollectionMediaQueryParams = _zod.z.object({
  "id": _zod.z.string().uuid().optional(),
  "dataTypeId": _zod.z.string().uuid().optional(),
  "orderBy": _zod.z.string().default(getCollectionMediaQueryOrderByDefault),
  "orderDirection": _zod.z.enum(["Ascending", "Descending"]).optional(),
  "filter": _zod.z.string().optional(),
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getCollectionMediaQueryTakeDefault)
});
var getCollectionMediaResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "values": _zod.z.array(_zod.z.object({
      "culture": _zod.z.string().nullish(),
      "segment": _zod.z.string().nullish(),
      "alias": _zod.z.string().min(1),
      "value": _zod.z.any().nullish(),
      "editorAlias": _zod.z.string().min(1)
    })),
    "variants": _zod.z.array(_zod.z.object({
      "culture": _zod.z.string().nullish(),
      "segment": _zod.z.string().nullish(),
      "name": _zod.z.string().min(1),
      "createDate": _zod.z.string().datetime({ "local": true }),
      "updateDate": _zod.z.string().datetime({ "local": true })
    })),
    "id": _zod.z.string().uuid(),
    "creator": _zod.z.string().nullish(),
    "sortOrder": _zod.z.number(),
    "mediaType": _zod.z.object({
      "id": _zod.z.string().uuid(),
      "alias": _zod.z.string(),
      "icon": _zod.z.string()
    })
  }))
});
var getItemMediaQueryParams = _zod.z.object({
  "id": _zod.z.array(_zod.z.string().uuid()).optional()
});
var getItemMediaResponseItem = _zod.z.object({
  "id": _zod.z.string().uuid(),
  "isTrashed": _zod.z.boolean(),
  "parent": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish(),
  "hasChildren": _zod.z.boolean(),
  "mediaType": _zod.z.object({
    "id": _zod.z.string().uuid(),
    "icon": _zod.z.string(),
    "collection": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish()
  }),
  "variants": _zod.z.array(_zod.z.object({
    "name": _zod.z.string(),
    "culture": _zod.z.string().nullish()
  }))
});
var getItemMediaResponse = _zod.z.array(getItemMediaResponseItem);
var getItemMediaSearchQueryTakeDefault = 100;
var getItemMediaSearchQueryParams = _zod.z.object({
  "query": _zod.z.string().optional(),
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getItemMediaSearchQueryTakeDefault),
  "parentId": _zod.z.string().uuid().optional(),
  "allowedMediaTypes": _zod.z.array(_zod.z.string().uuid()).optional()
});
var getItemMediaSearchResponse = _zod.z.object({
  "items": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "isTrashed": _zod.z.boolean(),
    "parent": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish(),
    "hasChildren": _zod.z.boolean(),
    "mediaType": _zod.z.object({
      "id": _zod.z.string().uuid(),
      "icon": _zod.z.string(),
      "collection": _zod.z.object({
        "id": _zod.z.string().uuid()
      }).nullish()
    }),
    "variants": _zod.z.array(_zod.z.object({
      "name": _zod.z.string(),
      "culture": _zod.z.string().nullish()
    }))
  })),
  "total": _zod.z.number()
});
var postMediaBody = _zod.z.object({
  "values": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullish(),
    "segment": _zod.z.string().nullish(),
    "alias": _zod.z.string().min(1),
    "value": _zod.z.any().nullish()
  })),
  "variants": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullish(),
    "segment": _zod.z.string().nullish(),
    "name": _zod.z.string().min(1)
  })),
  "id": _zod.z.string().uuid().nullish(),
  "parent": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish(),
  "mediaType": _zod.z.object({
    "id": _zod.z.string().uuid()
  })
});
var getMediaByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getMediaByIdResponse = _zod.z.object({
  "values": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullish(),
    "segment": _zod.z.string().nullish(),
    "alias": _zod.z.string().min(1),
    "value": _zod.z.any().nullish(),
    "editorAlias": _zod.z.string().min(1)
  })),
  "variants": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullish(),
    "segment": _zod.z.string().nullish(),
    "name": _zod.z.string().min(1),
    "createDate": _zod.z.string().datetime({ "local": true }),
    "updateDate": _zod.z.string().datetime({ "local": true })
  })),
  "id": _zod.z.string().uuid(),
  "urls": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullable(),
    "url": _zod.z.string()
  })),
  "isTrashed": _zod.z.boolean(),
  "mediaType": _zod.z.object({
    "id": _zod.z.string().uuid(),
    "icon": _zod.z.string(),
    "collection": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish()
  })
});
var deleteMediaByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putMediaByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putMediaByIdBody = _zod.z.object({
  "values": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullish(),
    "segment": _zod.z.string().nullish(),
    "alias": _zod.z.string().min(1),
    "value": _zod.z.any().nullish()
  })),
  "variants": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullish(),
    "segment": _zod.z.string().nullish(),
    "name": _zod.z.string().min(1)
  }))
});
var getMediaByIdAuditLogParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getMediaByIdAuditLogQueryTakeDefault = 100;
var getMediaByIdAuditLogQueryParams = _zod.z.object({
  "orderDirection": _zod.z.enum(["Ascending", "Descending"]).optional(),
  "sinceDate": _zod.z.string().datetime({ "local": true }).optional(),
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getMediaByIdAuditLogQueryTakeDefault)
});
var getMediaByIdAuditLogResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "user": _zod.z.object({
      "id": _zod.z.string().uuid()
    }),
    "timestamp": _zod.z.string().datetime({ "local": true }),
    "logType": _zod.z.enum(["New", "Save", "SaveVariant", "Open", "Delete", "Publish", "PublishVariant", "SendToPublish", "SendToPublishVariant", "Unpublish", "UnpublishVariant", "Move", "Copy", "AssignDomain", "PublicAccess", "Sort", "Notify", "System", "RollBack", "PackagerInstall", "PackagerUninstall", "Custom", "ContentVersionPreventCleanup", "ContentVersionEnableCleanup"]),
    "comment": _zod.z.string().nullish(),
    "parameters": _zod.z.string().nullish()
  }))
});
var putMediaByIdMoveParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putMediaByIdMoveBody = _zod.z.object({
  "target": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish()
});
var putMediaByIdMoveToRecycleBinParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getMediaByIdReferencedByParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getMediaByIdReferencedByQueryTakeDefault = 20;
var getMediaByIdReferencedByQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getMediaByIdReferencedByQueryTakeDefault)
});
var getMediaByIdReferencedByResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "$type": _zod.z.enum(["DefaultReferenceResponseModel"]),
    "id": _zod.z.string().uuid(),
    "name": _zod.z.string().nullish(),
    "type": _zod.z.string().nullish(),
    "icon": _zod.z.string().nullish()
  }).or(_zod.z.object({
    "$type": _zod.z.enum(["DocumentReferenceResponseModel"]),
    "id": _zod.z.string().uuid(),
    "name": _zod.z.string().nullish(),
    "published": _zod.z.boolean().nullish(),
    "documentType": _zod.z.object({
      "icon": _zod.z.string().nullish(),
      "alias": _zod.z.string().nullish(),
      "name": _zod.z.string().nullish()
    })
  })).or(_zod.z.object({
    "$type": _zod.z.enum(["MediaReferenceResponseModel"]),
    "id": _zod.z.string().uuid(),
    "name": _zod.z.string().nullish(),
    "mediaType": _zod.z.object({
      "icon": _zod.z.string().nullish(),
      "alias": _zod.z.string().nullish(),
      "name": _zod.z.string().nullish()
    })
  })))
});
var getMediaByIdReferencedDescendantsParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getMediaByIdReferencedDescendantsQueryTakeDefault = 20;
var getMediaByIdReferencedDescendantsQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getMediaByIdReferencedDescendantsQueryTakeDefault)
});
var getMediaByIdReferencedDescendantsResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid()
  }))
});
var putMediaByIdValidateParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putMediaByIdValidateBody = _zod.z.object({
  "values": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullish(),
    "segment": _zod.z.string().nullish(),
    "alias": _zod.z.string().min(1),
    "value": _zod.z.any().nullish()
  })),
  "variants": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullish(),
    "segment": _zod.z.string().nullish(),
    "name": _zod.z.string().min(1)
  }))
});
var getMediaAreReferencedQueryTakeDefault = 20;
var getMediaAreReferencedQueryParams = _zod.z.object({
  "id": _zod.z.array(_zod.z.string().uuid()).optional(),
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getMediaAreReferencedQueryTakeDefault)
});
var getMediaAreReferencedResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid()
  }))
});
var getMediaConfigurationResponse = _zod.z.object({
  "disableDeleteWhenReferenced": _zod.z.boolean(),
  "disableUnpublishWhenReferenced": _zod.z.boolean(),
  "reservedFieldNames": _zod.z.array(_zod.z.string())
});
var putMediaSortBody = _zod.z.object({
  "parent": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish(),
  "sorting": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "sortOrder": _zod.z.number()
  }))
});
var getMediaUrlsQueryParams = _zod.z.object({
  "id": _zod.z.array(_zod.z.string().uuid()).optional()
});
var getMediaUrlsResponseItem = _zod.z.object({
  "id": _zod.z.string().uuid(),
  "urlInfos": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullable(),
    "url": _zod.z.string()
  }))
});
var getMediaUrlsResponse = _zod.z.array(getMediaUrlsResponseItem);
var postMediaValidateBody = _zod.z.object({
  "values": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullish(),
    "segment": _zod.z.string().nullish(),
    "alias": _zod.z.string().min(1),
    "value": _zod.z.any().nullish()
  })),
  "variants": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullish(),
    "segment": _zod.z.string().nullish(),
    "name": _zod.z.string().min(1)
  })),
  "id": _zod.z.string().uuid().nullish(),
  "parent": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish(),
  "mediaType": _zod.z.object({
    "id": _zod.z.string().uuid()
  })
});
var deleteRecycleBinMediaByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getRecycleBinMediaByIdOriginalParentParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getRecycleBinMediaByIdOriginalParentResponse = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putRecycleBinMediaByIdRestoreParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putRecycleBinMediaByIdRestoreBody = _zod.z.object({
  "target": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish()
});
var getRecycleBinMediaChildrenQueryTakeDefault = 100;
var getRecycleBinMediaChildrenQueryParams = _zod.z.object({
  "parentId": _zod.z.string().uuid().optional(),
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getRecycleBinMediaChildrenQueryTakeDefault)
});
var getRecycleBinMediaChildrenResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "createDate": _zod.z.string().datetime({ "local": true }),
    "hasChildren": _zod.z.boolean(),
    "parent": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish(),
    "mediaType": _zod.z.object({
      "id": _zod.z.string().uuid(),
      "icon": _zod.z.string(),
      "collection": _zod.z.object({
        "id": _zod.z.string().uuid()
      }).nullish()
    }),
    "variants": _zod.z.array(_zod.z.object({
      "name": _zod.z.string(),
      "culture": _zod.z.string().nullish()
    }))
  }))
});
var getRecycleBinMediaRootQueryTakeDefault = 100;
var getRecycleBinMediaRootQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getRecycleBinMediaRootQueryTakeDefault)
});
var getRecycleBinMediaRootResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "createDate": _zod.z.string().datetime({ "local": true }),
    "hasChildren": _zod.z.boolean(),
    "parent": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish(),
    "mediaType": _zod.z.object({
      "id": _zod.z.string().uuid(),
      "icon": _zod.z.string(),
      "collection": _zod.z.object({
        "id": _zod.z.string().uuid()
      }).nullish()
    }),
    "variants": _zod.z.array(_zod.z.object({
      "name": _zod.z.string(),
      "culture": _zod.z.string().nullish()
    }))
  }))
});
var getTreeMediaAncestorsQueryParams = _zod.z.object({
  "descendantId": _zod.z.string().uuid().optional()
});
var getTreeMediaAncestorsResponseItem = _zod.z.object({
  "hasChildren": _zod.z.boolean(),
  "parent": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish(),
  "noAccess": _zod.z.boolean(),
  "isTrashed": _zod.z.boolean(),
  "id": _zod.z.string().uuid(),
  "createDate": _zod.z.string().datetime({ "local": true }),
  "mediaType": _zod.z.object({
    "id": _zod.z.string().uuid(),
    "icon": _zod.z.string(),
    "collection": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish()
  }),
  "variants": _zod.z.array(_zod.z.object({
    "name": _zod.z.string(),
    "culture": _zod.z.string().nullish()
  }))
});
var getTreeMediaAncestorsResponse = _zod.z.array(getTreeMediaAncestorsResponseItem);
var getTreeMediaChildrenQueryTakeDefault = 100;
var getTreeMediaChildrenQueryParams = _zod.z.object({
  "parentId": _zod.z.string().uuid().optional(),
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getTreeMediaChildrenQueryTakeDefault),
  "dataTypeId": _zod.z.string().uuid().optional()
});
var getTreeMediaChildrenResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "hasChildren": _zod.z.boolean(),
    "parent": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish(),
    "noAccess": _zod.z.boolean(),
    "isTrashed": _zod.z.boolean(),
    "id": _zod.z.string().uuid(),
    "createDate": _zod.z.string().datetime({ "local": true }),
    "mediaType": _zod.z.object({
      "id": _zod.z.string().uuid(),
      "icon": _zod.z.string(),
      "collection": _zod.z.object({
        "id": _zod.z.string().uuid()
      }).nullish()
    }),
    "variants": _zod.z.array(_zod.z.object({
      "name": _zod.z.string(),
      "culture": _zod.z.string().nullish()
    }))
  }))
});
var getTreeMediaRootQueryTakeDefault = 100;
var getTreeMediaRootQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getTreeMediaRootQueryTakeDefault),
  "dataTypeId": _zod.z.string().uuid().optional()
});
var getTreeMediaRootResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "hasChildren": _zod.z.boolean(),
    "parent": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish(),
    "noAccess": _zod.z.boolean(),
    "isTrashed": _zod.z.boolean(),
    "id": _zod.z.string().uuid(),
    "createDate": _zod.z.string().datetime({ "local": true }),
    "mediaType": _zod.z.object({
      "id": _zod.z.string().uuid(),
      "icon": _zod.z.string(),
      "collection": _zod.z.object({
        "id": _zod.z.string().uuid()
      }).nullish()
    }),
    "variants": _zod.z.array(_zod.z.object({
      "name": _zod.z.string(),
      "culture": _zod.z.string().nullish()
    }))
  }))
});
var getItemMemberGroupQueryParams = _zod.z.object({
  "id": _zod.z.array(_zod.z.string().uuid()).optional()
});
var getItemMemberGroupResponseItem = _zod.z.object({
  "id": _zod.z.string().uuid(),
  "name": _zod.z.string()
});
var getItemMemberGroupResponse = _zod.z.array(getItemMemberGroupResponseItem);
var getMemberGroupQueryTakeDefault = 100;
var getMemberGroupQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getMemberGroupQueryTakeDefault)
});
var getMemberGroupResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "name": _zod.z.string(),
    "id": _zod.z.string().uuid()
  }))
});
var postMemberGroupBody = _zod.z.object({
  "name": _zod.z.string(),
  "id": _zod.z.string().uuid().nullish()
});
var getMemberGroupByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getMemberGroupByIdResponse = _zod.z.object({
  "name": _zod.z.string(),
  "id": _zod.z.string().uuid()
});
var deleteMemberGroupByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putMemberGroupByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putMemberGroupByIdBody = _zod.z.object({
  "name": _zod.z.string()
});
var getTreeMemberGroupRootQueryTakeDefault = 100;
var getTreeMemberGroupRootQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getTreeMemberGroupRootQueryTakeDefault)
});
var getTreeMemberGroupRootResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "hasChildren": _zod.z.boolean(),
    "id": _zod.z.string().uuid(),
    "parent": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish(),
    "name": _zod.z.string()
  }))
});
var getItemMemberTypeQueryParams = _zod.z.object({
  "id": _zod.z.array(_zod.z.string().uuid()).optional()
});
var getItemMemberTypeResponseItem = _zod.z.object({
  "id": _zod.z.string().uuid(),
  "name": _zod.z.string(),
  "icon": _zod.z.string().nullish()
});
var getItemMemberTypeResponse = _zod.z.array(getItemMemberTypeResponseItem);
var getItemMemberTypeSearchQueryTakeDefault = 100;
var getItemMemberTypeSearchQueryParams = _zod.z.object({
  "query": _zod.z.string().optional(),
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getItemMemberTypeSearchQueryTakeDefault)
});
var getItemMemberTypeSearchResponse = _zod.z.object({
  "items": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "name": _zod.z.string(),
    "icon": _zod.z.string().nullish()
  })),
  "total": _zod.z.number()
});
var postMemberTypeBody = _zod.z.object({
  "alias": _zod.z.string().min(1),
  "name": _zod.z.string().min(1),
  "description": _zod.z.string().nullish(),
  "icon": _zod.z.string().min(1),
  "allowedAsRoot": _zod.z.boolean(),
  "variesByCulture": _zod.z.boolean(),
  "variesBySegment": _zod.z.boolean(),
  "collection": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish(),
  "isElement": _zod.z.boolean(),
  "properties": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "container": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish(),
    "sortOrder": _zod.z.number(),
    "alias": _zod.z.string().min(1),
    "name": _zod.z.string().min(1),
    "description": _zod.z.string().nullish(),
    "dataType": _zod.z.object({
      "id": _zod.z.string().uuid()
    }),
    "variesByCulture": _zod.z.boolean(),
    "variesBySegment": _zod.z.boolean(),
    "validation": _zod.z.object({
      "mandatory": _zod.z.boolean(),
      "mandatoryMessage": _zod.z.string().nullish(),
      "regEx": _zod.z.string().nullish(),
      "regExMessage": _zod.z.string().nullish()
    }),
    "appearance": _zod.z.object({
      "labelOnTop": _zod.z.boolean()
    }),
    "isSensitive": _zod.z.boolean(),
    "visibility": _zod.z.object({
      "memberCanView": _zod.z.boolean(),
      "memberCanEdit": _zod.z.boolean()
    })
  })),
  "containers": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "parent": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish(),
    "name": _zod.z.string().nullish(),
    "type": _zod.z.string().min(1),
    "sortOrder": _zod.z.number()
  })),
  "id": _zod.z.string().uuid().nullish(),
  "compositions": _zod.z.array(_zod.z.object({
    "memberType": _zod.z.object({
      "id": _zod.z.string().uuid()
    }),
    "compositionType": _zod.z.enum(["Composition", "Inheritance"])
  }))
});
var getMemberTypeByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getMemberTypeByIdResponse = _zod.z.object({
  "alias": _zod.z.string().min(1),
  "name": _zod.z.string().min(1),
  "description": _zod.z.string().nullish(),
  "icon": _zod.z.string().min(1),
  "allowedAsRoot": _zod.z.boolean(),
  "variesByCulture": _zod.z.boolean(),
  "variesBySegment": _zod.z.boolean(),
  "collection": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish(),
  "isElement": _zod.z.boolean(),
  "properties": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "container": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish(),
    "sortOrder": _zod.z.number(),
    "alias": _zod.z.string().min(1),
    "name": _zod.z.string().min(1),
    "description": _zod.z.string().nullish(),
    "dataType": _zod.z.object({
      "id": _zod.z.string().uuid()
    }),
    "variesByCulture": _zod.z.boolean(),
    "variesBySegment": _zod.z.boolean(),
    "validation": _zod.z.object({
      "mandatory": _zod.z.boolean(),
      "mandatoryMessage": _zod.z.string().nullish(),
      "regEx": _zod.z.string().nullish(),
      "regExMessage": _zod.z.string().nullish()
    }),
    "appearance": _zod.z.object({
      "labelOnTop": _zod.z.boolean()
    }),
    "isSensitive": _zod.z.boolean(),
    "visibility": _zod.z.object({
      "memberCanView": _zod.z.boolean(),
      "memberCanEdit": _zod.z.boolean()
    })
  })),
  "containers": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "parent": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish(),
    "name": _zod.z.string().nullish(),
    "type": _zod.z.string().min(1),
    "sortOrder": _zod.z.number()
  })),
  "id": _zod.z.string().uuid(),
  "compositions": _zod.z.array(_zod.z.object({
    "memberType": _zod.z.object({
      "id": _zod.z.string().uuid()
    }),
    "compositionType": _zod.z.enum(["Composition", "Inheritance"])
  }))
});
var deleteMemberTypeByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putMemberTypeByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putMemberTypeByIdBody = _zod.z.object({
  "alias": _zod.z.string().min(1),
  "name": _zod.z.string().min(1),
  "description": _zod.z.string().nullish(),
  "icon": _zod.z.string().min(1),
  "allowedAsRoot": _zod.z.boolean(),
  "variesByCulture": _zod.z.boolean(),
  "variesBySegment": _zod.z.boolean(),
  "collection": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish(),
  "isElement": _zod.z.boolean(),
  "properties": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "container": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish(),
    "sortOrder": _zod.z.number(),
    "alias": _zod.z.string().min(1),
    "name": _zod.z.string().min(1),
    "description": _zod.z.string().nullish(),
    "dataType": _zod.z.object({
      "id": _zod.z.string().uuid()
    }),
    "variesByCulture": _zod.z.boolean(),
    "variesBySegment": _zod.z.boolean(),
    "validation": _zod.z.object({
      "mandatory": _zod.z.boolean(),
      "mandatoryMessage": _zod.z.string().nullish(),
      "regEx": _zod.z.string().nullish(),
      "regExMessage": _zod.z.string().nullish()
    }),
    "appearance": _zod.z.object({
      "labelOnTop": _zod.z.boolean()
    }),
    "isSensitive": _zod.z.boolean(),
    "visibility": _zod.z.object({
      "memberCanView": _zod.z.boolean(),
      "memberCanEdit": _zod.z.boolean()
    })
  })),
  "containers": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "parent": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish(),
    "name": _zod.z.string().nullish(),
    "type": _zod.z.string().min(1),
    "sortOrder": _zod.z.number()
  })),
  "compositions": _zod.z.array(_zod.z.object({
    "memberType": _zod.z.object({
      "id": _zod.z.string().uuid()
    }),
    "compositionType": _zod.z.enum(["Composition", "Inheritance"])
  }))
});
var getMemberTypeByIdCompositionReferencesParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getMemberTypeByIdCompositionReferencesResponseItem = _zod.z.object({
  "id": _zod.z.string().uuid(),
  "name": _zod.z.string(),
  "icon": _zod.z.string()
});
var getMemberTypeByIdCompositionReferencesResponse = _zod.z.array(getMemberTypeByIdCompositionReferencesResponseItem);
var postMemberTypeByIdCopyParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var postMemberTypeAvailableCompositionsBody = _zod.z.object({
  "id": _zod.z.string().uuid().nullish(),
  "currentPropertyAliases": _zod.z.array(_zod.z.string()),
  "currentCompositeIds": _zod.z.array(_zod.z.string().uuid())
});
var postMemberTypeAvailableCompositionsResponseItem = _zod.z.object({
  "id": _zod.z.string().uuid(),
  "name": _zod.z.string(),
  "icon": _zod.z.string(),
  "folderPath": _zod.z.array(_zod.z.string()),
  "isCompatible": _zod.z.boolean()
});
var postMemberTypeAvailableCompositionsResponse = _zod.z.array(postMemberTypeAvailableCompositionsResponseItem);
var getMemberTypeConfigurationResponse = _zod.z.object({
  "reservedFieldNames": _zod.z.array(_zod.z.string())
});
var getTreeMemberTypeRootQueryTakeDefault = 100;
var getTreeMemberTypeRootQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getTreeMemberTypeRootQueryTakeDefault)
});
var getTreeMemberTypeRootResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "hasChildren": _zod.z.boolean(),
    "id": _zod.z.string().uuid(),
    "parent": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish(),
    "name": _zod.z.string(),
    "icon": _zod.z.string()
  }))
});
var getFilterMemberQueryOrderByDefault = "username";
var getFilterMemberQueryTakeDefault = 100;
var getFilterMemberQueryParams = _zod.z.object({
  "memberTypeId": _zod.z.string().uuid().optional(),
  "memberGroupName": _zod.z.string().optional(),
  "isApproved": _zod.z.coerce.boolean().optional(),
  "isLockedOut": _zod.z.coerce.boolean().optional(),
  "orderBy": _zod.z.string().default(getFilterMemberQueryOrderByDefault),
  "orderDirection": _zod.z.enum(["Ascending", "Descending"]).optional(),
  "filter": _zod.z.string().optional(),
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getFilterMemberQueryTakeDefault)
});
var getFilterMemberResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "values": _zod.z.array(_zod.z.object({
      "culture": _zod.z.string().nullish(),
      "segment": _zod.z.string().nullish(),
      "alias": _zod.z.string().min(1),
      "value": _zod.z.any().nullish(),
      "editorAlias": _zod.z.string().min(1)
    })),
    "variants": _zod.z.array(_zod.z.object({
      "culture": _zod.z.string().nullish(),
      "segment": _zod.z.string().nullish(),
      "name": _zod.z.string().min(1),
      "createDate": _zod.z.string().datetime({ "local": true }),
      "updateDate": _zod.z.string().datetime({ "local": true })
    })),
    "id": _zod.z.string().uuid(),
    "email": _zod.z.string(),
    "username": _zod.z.string(),
    "memberType": _zod.z.object({
      "id": _zod.z.string().uuid(),
      "icon": _zod.z.string(),
      "collection": _zod.z.object({
        "id": _zod.z.string().uuid()
      }).nullish()
    }),
    "isApproved": _zod.z.boolean(),
    "isLockedOut": _zod.z.boolean(),
    "isTwoFactorEnabled": _zod.z.boolean(),
    "failedPasswordAttempts": _zod.z.number(),
    "lastLoginDate": _zod.z.string().datetime({ "local": true }).nullish(),
    "lastLockoutDate": _zod.z.string().datetime({ "local": true }).nullish(),
    "lastPasswordChangeDate": _zod.z.string().datetime({ "local": true }).nullish(),
    "groups": _zod.z.array(_zod.z.string().uuid()),
    "kind": _zod.z.enum(["Default", "Api"])
  }))
});
var getItemMemberQueryParams = _zod.z.object({
  "id": _zod.z.array(_zod.z.string().uuid()).optional()
});
var getItemMemberResponseItem = _zod.z.object({
  "id": _zod.z.string().uuid(),
  "memberType": _zod.z.object({
    "id": _zod.z.string().uuid(),
    "icon": _zod.z.string(),
    "collection": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish()
  }),
  "variants": _zod.z.array(_zod.z.object({
    "name": _zod.z.string(),
    "culture": _zod.z.string().nullish()
  })),
  "kind": _zod.z.enum(["Default", "Api"])
});
var getItemMemberResponse = _zod.z.array(getItemMemberResponseItem);
var getItemMemberSearchQueryTakeDefault = 100;
var getItemMemberSearchQueryParams = _zod.z.object({
  "query": _zod.z.string().optional(),
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getItemMemberSearchQueryTakeDefault),
  "allowedMemberTypes": _zod.z.array(_zod.z.string().uuid()).optional()
});
var getItemMemberSearchResponse = _zod.z.object({
  "items": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "memberType": _zod.z.object({
      "id": _zod.z.string().uuid(),
      "icon": _zod.z.string(),
      "collection": _zod.z.object({
        "id": _zod.z.string().uuid()
      }).nullish()
    }),
    "variants": _zod.z.array(_zod.z.object({
      "name": _zod.z.string(),
      "culture": _zod.z.string().nullish()
    })),
    "kind": _zod.z.enum(["Default", "Api"])
  })),
  "total": _zod.z.number()
});
var postMemberBody = _zod.z.object({
  "values": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullish(),
    "segment": _zod.z.string().nullish(),
    "alias": _zod.z.string().min(1),
    "value": _zod.z.any().nullish()
  })),
  "variants": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullish(),
    "segment": _zod.z.string().nullish(),
    "name": _zod.z.string().min(1)
  })),
  "id": _zod.z.string().uuid().nullish(),
  "email": _zod.z.string(),
  "username": _zod.z.string(),
  "password": _zod.z.string(),
  "memberType": _zod.z.object({
    "id": _zod.z.string().uuid()
  }),
  "groups": _zod.z.array(_zod.z.string().uuid()).nullish(),
  "isApproved": _zod.z.boolean()
});
var getMemberByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getMemberByIdResponse = _zod.z.object({
  "values": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullish(),
    "segment": _zod.z.string().nullish(),
    "alias": _zod.z.string().min(1),
    "value": _zod.z.any().nullish(),
    "editorAlias": _zod.z.string().min(1)
  })),
  "variants": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullish(),
    "segment": _zod.z.string().nullish(),
    "name": _zod.z.string().min(1),
    "createDate": _zod.z.string().datetime({ "local": true }),
    "updateDate": _zod.z.string().datetime({ "local": true })
  })),
  "id": _zod.z.string().uuid(),
  "email": _zod.z.string(),
  "username": _zod.z.string(),
  "memberType": _zod.z.object({
    "id": _zod.z.string().uuid(),
    "icon": _zod.z.string(),
    "collection": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish()
  }),
  "isApproved": _zod.z.boolean(),
  "isLockedOut": _zod.z.boolean(),
  "isTwoFactorEnabled": _zod.z.boolean(),
  "failedPasswordAttempts": _zod.z.number(),
  "lastLoginDate": _zod.z.string().datetime({ "local": true }).nullish(),
  "lastLockoutDate": _zod.z.string().datetime({ "local": true }).nullish(),
  "lastPasswordChangeDate": _zod.z.string().datetime({ "local": true }).nullish(),
  "groups": _zod.z.array(_zod.z.string().uuid()),
  "kind": _zod.z.enum(["Default", "Api"])
});
var deleteMemberByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putMemberByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putMemberByIdBody = _zod.z.object({
  "values": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullish(),
    "segment": _zod.z.string().nullish(),
    "alias": _zod.z.string().min(1),
    "value": _zod.z.any().nullish()
  })),
  "variants": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullish(),
    "segment": _zod.z.string().nullish(),
    "name": _zod.z.string().min(1)
  })),
  "email": _zod.z.string(),
  "username": _zod.z.string(),
  "oldPassword": _zod.z.string().nullish(),
  "newPassword": _zod.z.string().nullish(),
  "groups": _zod.z.array(_zod.z.string().uuid()).nullish(),
  "isApproved": _zod.z.boolean(),
  "isLockedOut": _zod.z.boolean(),
  "isTwoFactorEnabled": _zod.z.boolean()
});
var putMemberByIdValidateParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putMemberByIdValidateBody = _zod.z.object({
  "values": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullish(),
    "segment": _zod.z.string().nullish(),
    "alias": _zod.z.string().min(1),
    "value": _zod.z.any().nullish()
  })),
  "variants": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullish(),
    "segment": _zod.z.string().nullish(),
    "name": _zod.z.string().min(1)
  })),
  "email": _zod.z.string(),
  "username": _zod.z.string(),
  "oldPassword": _zod.z.string().nullish(),
  "newPassword": _zod.z.string().nullish(),
  "groups": _zod.z.array(_zod.z.string().uuid()).nullish(),
  "isApproved": _zod.z.boolean(),
  "isLockedOut": _zod.z.boolean(),
  "isTwoFactorEnabled": _zod.z.boolean()
});
var getMemberConfigurationResponse = _zod.z.object({
  "reservedFieldNames": _zod.z.array(_zod.z.string())
});
var postMemberValidateBody = _zod.z.object({
  "values": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullish(),
    "segment": _zod.z.string().nullish(),
    "alias": _zod.z.string().min(1),
    "value": _zod.z.any().nullish()
  })),
  "variants": _zod.z.array(_zod.z.object({
    "culture": _zod.z.string().nullish(),
    "segment": _zod.z.string().nullish(),
    "name": _zod.z.string().min(1)
  })),
  "id": _zod.z.string().uuid().nullish(),
  "email": _zod.z.string(),
  "username": _zod.z.string(),
  "password": _zod.z.string(),
  "memberType": _zod.z.object({
    "id": _zod.z.string().uuid()
  }),
  "groups": _zod.z.array(_zod.z.string().uuid()).nullish(),
  "isApproved": _zod.z.boolean()
});
var getModelsBuilderDashboardResponse = _zod.z.object({
  "mode": _zod.z.enum(["Nothing", "InMemoryAuto", "SourceCodeManual", "SourceCodeAuto"]),
  "canGenerate": _zod.z.boolean(),
  "outOfDateModels": _zod.z.boolean(),
  "lastError": _zod.z.string().nullish(),
  "version": _zod.z.string().nullish(),
  "modelsNamespace": _zod.z.string().nullish(),
  "trackingOutOfDateModels": _zod.z.boolean()
});
var getModelsBuilderStatusResponse = _zod.z.object({
  "status": _zod.z.enum(["OutOfDate", "Current", "Unknown"])
});
var getObjectTypesQueryTakeDefault = 100;
var getObjectTypesQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getObjectTypesQueryTakeDefault)
});
var getObjectTypesResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "name": _zod.z.string().nullish(),
    "id": _zod.z.string().uuid()
  }))
});
var getOembedQueryQueryParams = _zod.z.object({
  "url": _zod.z.string().url().optional(),
  "maxWidth": _zod.z.coerce.number().optional(),
  "maxHeight": _zod.z.coerce.number().optional()
});
var getOembedQueryResponse = _zod.z.object({
  "markup": _zod.z.string()
});
var postPackageByNameRunMigrationParams = _zod.z.object({
  "name": _zod.z.string()
});
var getPackageConfigurationResponse = _zod.z.object({
  "marketplaceUrl": _zod.z.string()
});
var getPackageCreatedQueryTakeDefault = 100;
var getPackageCreatedQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getPackageCreatedQueryTakeDefault)
});
var getPackageCreatedResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "name": _zod.z.string(),
    "contentNodeId": _zod.z.string().nullish(),
    "contentLoadChildNodes": _zod.z.boolean(),
    "mediaIds": _zod.z.array(_zod.z.string().uuid()),
    "mediaLoadChildNodes": _zod.z.boolean(),
    "documentTypes": _zod.z.array(_zod.z.string()),
    "mediaTypes": _zod.z.array(_zod.z.string()),
    "dataTypes": _zod.z.array(_zod.z.string()),
    "templates": _zod.z.array(_zod.z.string()),
    "partialViews": _zod.z.array(_zod.z.string()),
    "stylesheets": _zod.z.array(_zod.z.string()),
    "scripts": _zod.z.array(_zod.z.string()),
    "languages": _zod.z.array(_zod.z.string()),
    "dictionaryItems": _zod.z.array(_zod.z.string()),
    "id": _zod.z.string().uuid(),
    "packagePath": _zod.z.string()
  }))
});
var postPackageCreatedBody = _zod.z.object({
  "name": _zod.z.string(),
  "contentNodeId": _zod.z.string().nullish(),
  "contentLoadChildNodes": _zod.z.boolean(),
  "mediaIds": _zod.z.array(_zod.z.string().uuid()),
  "mediaLoadChildNodes": _zod.z.boolean(),
  "documentTypes": _zod.z.array(_zod.z.string()),
  "mediaTypes": _zod.z.array(_zod.z.string()),
  "dataTypes": _zod.z.array(_zod.z.string()),
  "templates": _zod.z.array(_zod.z.string()),
  "partialViews": _zod.z.array(_zod.z.string()),
  "stylesheets": _zod.z.array(_zod.z.string()),
  "scripts": _zod.z.array(_zod.z.string()),
  "languages": _zod.z.array(_zod.z.string()),
  "dictionaryItems": _zod.z.array(_zod.z.string()),
  "id": _zod.z.string().uuid().nullish()
});
var getPackageCreatedByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getPackageCreatedByIdResponse = _zod.z.object({
  "name": _zod.z.string(),
  "contentNodeId": _zod.z.string().nullish(),
  "contentLoadChildNodes": _zod.z.boolean(),
  "mediaIds": _zod.z.array(_zod.z.string().uuid()),
  "mediaLoadChildNodes": _zod.z.boolean(),
  "documentTypes": _zod.z.array(_zod.z.string()),
  "mediaTypes": _zod.z.array(_zod.z.string()),
  "dataTypes": _zod.z.array(_zod.z.string()),
  "templates": _zod.z.array(_zod.z.string()),
  "partialViews": _zod.z.array(_zod.z.string()),
  "stylesheets": _zod.z.array(_zod.z.string()),
  "scripts": _zod.z.array(_zod.z.string()),
  "languages": _zod.z.array(_zod.z.string()),
  "dictionaryItems": _zod.z.array(_zod.z.string()),
  "id": _zod.z.string().uuid(),
  "packagePath": _zod.z.string()
});
var deletePackageCreatedByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putPackageCreatedByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putPackageCreatedByIdBody = _zod.z.object({
  "name": _zod.z.string(),
  "contentNodeId": _zod.z.string().nullish(),
  "contentLoadChildNodes": _zod.z.boolean(),
  "mediaIds": _zod.z.array(_zod.z.string().uuid()),
  "mediaLoadChildNodes": _zod.z.boolean(),
  "documentTypes": _zod.z.array(_zod.z.string()),
  "mediaTypes": _zod.z.array(_zod.z.string()),
  "dataTypes": _zod.z.array(_zod.z.string()),
  "templates": _zod.z.array(_zod.z.string()),
  "partialViews": _zod.z.array(_zod.z.string()),
  "stylesheets": _zod.z.array(_zod.z.string()),
  "scripts": _zod.z.array(_zod.z.string()),
  "languages": _zod.z.array(_zod.z.string()),
  "dictionaryItems": _zod.z.array(_zod.z.string()),
  "packagePath": _zod.z.string()
});
var getPackageCreatedByIdDownloadParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getPackageCreatedByIdDownloadResponse = _zod.z.instanceof(FileLike);
var getPackageMigrationStatusQueryTakeDefault = 100;
var getPackageMigrationStatusQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getPackageMigrationStatusQueryTakeDefault)
});
var getPackageMigrationStatusResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "packageName": _zod.z.string(),
    "hasPendingMigrations": _zod.z.boolean()
  }))
});
var getItemPartialViewQueryParams = _zod.z.object({
  "path": _zod.z.array(_zod.z.string()).optional()
});
var getItemPartialViewResponseItem = _zod.z.object({
  "path": _zod.z.string(),
  "name": _zod.z.string(),
  "parent": _zod.z.object({
    "path": _zod.z.string()
  }).nullish(),
  "isFolder": _zod.z.boolean()
});
var getItemPartialViewResponse = _zod.z.array(getItemPartialViewResponseItem);
var postPartialViewBody = _zod.z.object({
  "name": _zod.z.string(),
  "parent": _zod.z.object({
    "path": _zod.z.string()
  }).nullish(),
  "content": _zod.z.string()
});
var getPartialViewByPathParams = _zod.z.object({
  "path": _zod.z.string()
});
var getPartialViewByPathResponse = _zod.z.object({
  "path": _zod.z.string(),
  "name": _zod.z.string(),
  "parent": _zod.z.object({
    "path": _zod.z.string()
  }).nullish(),
  "content": _zod.z.string()
});
var deletePartialViewByPathParams = _zod.z.object({
  "path": _zod.z.string()
});
var putPartialViewByPathParams = _zod.z.object({
  "path": _zod.z.string()
});
var putPartialViewByPathBody = _zod.z.object({
  "content": _zod.z.string()
});
var putPartialViewByPathRenameParams = _zod.z.object({
  "path": _zod.z.string()
});
var putPartialViewByPathRenameBody = _zod.z.object({
  "name": _zod.z.string()
});
var postPartialViewFolderBody = _zod.z.object({
  "name": _zod.z.string(),
  "parent": _zod.z.object({
    "path": _zod.z.string()
  }).nullish()
});
var getPartialViewFolderByPathParams = _zod.z.object({
  "path": _zod.z.string()
});
var getPartialViewFolderByPathResponse = _zod.z.object({
  "path": _zod.z.string(),
  "name": _zod.z.string(),
  "parent": _zod.z.object({
    "path": _zod.z.string()
  }).nullish()
});
var deletePartialViewFolderByPathParams = _zod.z.object({
  "path": _zod.z.string()
});
var getPartialViewSnippetQueryTakeDefault = 100;
var getPartialViewSnippetQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getPartialViewSnippetQueryTakeDefault)
});
var getPartialViewSnippetResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "id": _zod.z.string(),
    "name": _zod.z.string()
  }))
});
var getPartialViewSnippetByIdParams = _zod.z.object({
  "id": _zod.z.string()
});
var getPartialViewSnippetByIdResponse = _zod.z.object({
  "id": _zod.z.string(),
  "name": _zod.z.string(),
  "content": _zod.z.string()
});
var getTreePartialViewAncestorsQueryParams = _zod.z.object({
  "descendantPath": _zod.z.string().optional()
});
var getTreePartialViewAncestorsResponseItem = _zod.z.object({
  "hasChildren": _zod.z.boolean(),
  "name": _zod.z.string(),
  "path": _zod.z.string(),
  "parent": _zod.z.object({
    "path": _zod.z.string()
  }).nullish(),
  "isFolder": _zod.z.boolean()
});
var getTreePartialViewAncestorsResponse = _zod.z.array(getTreePartialViewAncestorsResponseItem);
var getTreePartialViewChildrenQueryTakeDefault = 100;
var getTreePartialViewChildrenQueryParams = _zod.z.object({
  "parentPath": _zod.z.string().optional(),
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getTreePartialViewChildrenQueryTakeDefault)
});
var getTreePartialViewChildrenResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "hasChildren": _zod.z.boolean(),
    "name": _zod.z.string(),
    "path": _zod.z.string(),
    "parent": _zod.z.object({
      "path": _zod.z.string()
    }).nullish(),
    "isFolder": _zod.z.boolean()
  }))
});
var getTreePartialViewRootQueryTakeDefault = 100;
var getTreePartialViewRootQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getTreePartialViewRootQueryTakeDefault)
});
var getTreePartialViewRootResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "hasChildren": _zod.z.boolean(),
    "name": _zod.z.string(),
    "path": _zod.z.string(),
    "parent": _zod.z.object({
      "path": _zod.z.string()
    }).nullish(),
    "isFolder": _zod.z.boolean()
  }))
});
var getProfilingStatusResponse = _zod.z.object({
  "enabled": _zod.z.boolean()
});
var putProfilingStatusBody = _zod.z.object({
  "enabled": _zod.z.boolean()
});
var getPropertyTypeIsUsedQueryParams = _zod.z.object({
  "contentTypeId": _zod.z.string().uuid().optional(),
  "propertyAlias": _zod.z.string().optional()
});
var getPropertyTypeIsUsedResponse = _zod.z.boolean();
var getRedirectManagementQueryTakeDefault = 100;
var getRedirectManagementQueryParams = _zod.z.object({
  "filter": _zod.z.string().optional(),
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getRedirectManagementQueryTakeDefault)
});
var getRedirectManagementResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "originalUrl": _zod.z.string(),
    "destinationUrl": _zod.z.string(),
    "created": _zod.z.string().datetime({ "local": true }),
    "document": _zod.z.object({
      "id": _zod.z.string().uuid()
    }),
    "culture": _zod.z.string().nullish()
  }))
});
var getRedirectManagementByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getRedirectManagementByIdQueryTakeDefault = 100;
var getRedirectManagementByIdQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getRedirectManagementByIdQueryTakeDefault)
});
var getRedirectManagementByIdResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "originalUrl": _zod.z.string(),
    "destinationUrl": _zod.z.string(),
    "created": _zod.z.string().datetime({ "local": true }),
    "document": _zod.z.object({
      "id": _zod.z.string().uuid()
    }),
    "culture": _zod.z.string().nullish()
  }))
});
var deleteRedirectManagementByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getRedirectManagementStatusResponse = _zod.z.object({
  "status": _zod.z.enum(["Enabled", "Disabled"]),
  "userIsAdmin": _zod.z.boolean()
});
var postRedirectManagementStatusQueryParams = _zod.z.object({
  "status": _zod.z.enum(["Enabled", "Disabled"]).optional()
});
var getItemRelationTypeQueryParams = _zod.z.object({
  "id": _zod.z.array(_zod.z.string().uuid()).optional()
});
var getItemRelationTypeResponseItem = _zod.z.object({
  "id": _zod.z.string().uuid(),
  "name": _zod.z.string(),
  "isDeletable": _zod.z.boolean()
});
var getItemRelationTypeResponse = _zod.z.array(getItemRelationTypeResponseItem);
var getRelationTypeQueryTakeDefault = 100;
var getRelationTypeQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getRelationTypeQueryTakeDefault)
});
var getRelationTypeResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "name": _zod.z.string().min(1),
    "isBidirectional": _zod.z.boolean(),
    "isDependency": _zod.z.boolean(),
    "id": _zod.z.string().uuid(),
    "alias": _zod.z.string().nullish(),
    "parentObject": _zod.z.object({
      "name": _zod.z.string().nullish(),
      "id": _zod.z.string().uuid()
    }).nullish(),
    "childObject": _zod.z.object({
      "name": _zod.z.string().nullish(),
      "id": _zod.z.string().uuid()
    }).nullish()
  }))
});
var getRelationTypeByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getRelationTypeByIdResponse = _zod.z.object({
  "name": _zod.z.string().min(1),
  "isBidirectional": _zod.z.boolean(),
  "isDependency": _zod.z.boolean(),
  "id": _zod.z.string().uuid(),
  "alias": _zod.z.string().nullish(),
  "parentObject": _zod.z.object({
    "name": _zod.z.string().nullish(),
    "id": _zod.z.string().uuid()
  }).nullish(),
  "childObject": _zod.z.object({
    "name": _zod.z.string().nullish(),
    "id": _zod.z.string().uuid()
  }).nullish()
});
var getRelationByRelationTypeIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getRelationByRelationTypeIdQueryTakeDefault = 100;
var getRelationByRelationTypeIdQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getRelationByRelationTypeIdQueryTakeDefault)
});
var getRelationByRelationTypeIdResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "relationType": _zod.z.object({
      "id": _zod.z.string().uuid()
    }),
    "parent": _zod.z.object({
      "id": _zod.z.string().uuid(),
      "name": _zod.z.string().nullish()
    }),
    "child": _zod.z.object({
      "id": _zod.z.string().uuid(),
      "name": _zod.z.string().nullish()
    }),
    "createDate": _zod.z.string().datetime({ "local": true }),
    "comment": _zod.z.string().nullish()
  }))
});
var getItemScriptQueryParams = _zod.z.object({
  "path": _zod.z.array(_zod.z.string()).optional()
});
var getItemScriptResponseItem = _zod.z.object({
  "path": _zod.z.string(),
  "name": _zod.z.string(),
  "parent": _zod.z.object({
    "path": _zod.z.string()
  }).nullish(),
  "isFolder": _zod.z.boolean()
});
var getItemScriptResponse = _zod.z.array(getItemScriptResponseItem);
var postScriptBody = _zod.z.object({
  "name": _zod.z.string(),
  "parent": _zod.z.object({
    "path": _zod.z.string()
  }).nullish(),
  "content": _zod.z.string()
});
var getScriptByPathParams = _zod.z.object({
  "path": _zod.z.string()
});
var getScriptByPathResponse = _zod.z.object({
  "path": _zod.z.string(),
  "name": _zod.z.string(),
  "parent": _zod.z.object({
    "path": _zod.z.string()
  }).nullish(),
  "content": _zod.z.string()
});
var deleteScriptByPathParams = _zod.z.object({
  "path": _zod.z.string()
});
var putScriptByPathParams = _zod.z.object({
  "path": _zod.z.string()
});
var putScriptByPathBody = _zod.z.object({
  "content": _zod.z.string()
});
var putScriptByPathRenameParams = _zod.z.object({
  "path": _zod.z.string()
});
var putScriptByPathRenameBody = _zod.z.object({
  "name": _zod.z.string()
});
var postScriptFolderBody = _zod.z.object({
  "name": _zod.z.string(),
  "parent": _zod.z.object({
    "path": _zod.z.string()
  }).nullish()
});
var getScriptFolderByPathParams = _zod.z.object({
  "path": _zod.z.string()
});
var getScriptFolderByPathResponse = _zod.z.object({
  "path": _zod.z.string(),
  "name": _zod.z.string(),
  "parent": _zod.z.object({
    "path": _zod.z.string()
  }).nullish()
});
var deleteScriptFolderByPathParams = _zod.z.object({
  "path": _zod.z.string()
});
var getTreeScriptAncestorsQueryParams = _zod.z.object({
  "descendantPath": _zod.z.string().optional()
});
var getTreeScriptAncestorsResponseItem = _zod.z.object({
  "hasChildren": _zod.z.boolean(),
  "name": _zod.z.string(),
  "path": _zod.z.string(),
  "parent": _zod.z.object({
    "path": _zod.z.string()
  }).nullish(),
  "isFolder": _zod.z.boolean()
});
var getTreeScriptAncestorsResponse = _zod.z.array(getTreeScriptAncestorsResponseItem);
var getTreeScriptChildrenQueryTakeDefault = 100;
var getTreeScriptChildrenQueryParams = _zod.z.object({
  "parentPath": _zod.z.string().optional(),
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getTreeScriptChildrenQueryTakeDefault)
});
var getTreeScriptChildrenResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "hasChildren": _zod.z.boolean(),
    "name": _zod.z.string(),
    "path": _zod.z.string(),
    "parent": _zod.z.object({
      "path": _zod.z.string()
    }).nullish(),
    "isFolder": _zod.z.boolean()
  }))
});
var getTreeScriptRootQueryTakeDefault = 100;
var getTreeScriptRootQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getTreeScriptRootQueryTakeDefault)
});
var getTreeScriptRootResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "hasChildren": _zod.z.boolean(),
    "name": _zod.z.string(),
    "path": _zod.z.string(),
    "parent": _zod.z.object({
      "path": _zod.z.string()
    }).nullish(),
    "isFolder": _zod.z.boolean()
  }))
});
var getSearcherQueryTakeDefault = 100;
var getSearcherQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getSearcherQueryTakeDefault)
});
var getSearcherResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "name": _zod.z.string().min(1)
  }))
});
var getSearcherBySearcherNameQueryParams = _zod.z.object({
  "searcherName": _zod.z.string()
});
var getSearcherBySearcherNameQueryQueryTakeDefault = 100;
var getSearcherBySearcherNameQueryQueryParams = _zod.z.object({
  "term": _zod.z.string().optional(),
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getSearcherBySearcherNameQueryQueryTakeDefault)
});
var getSearcherBySearcherNameQueryResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().min(1),
    "score": _zod.z.number(),
    "fieldCount": _zod.z.number(),
    "fields": _zod.z.array(_zod.z.object({
      "name": _zod.z.string(),
      "values": _zod.z.array(_zod.z.string())
    }))
  }))
});
var getSecurityConfigurationResponse = _zod.z.object({
  "passwordConfiguration": _zod.z.object({
    "minimumPasswordLength": _zod.z.number(),
    "requireNonLetterOrDigit": _zod.z.boolean(),
    "requireDigit": _zod.z.boolean(),
    "requireLowercase": _zod.z.boolean(),
    "requireUppercase": _zod.z.boolean()
  })
});
var postSecurityForgotPasswordBody = _zod.z.object({
  "email": _zod.z.string().min(1)
});
var postSecurityForgotPasswordResetBody = _zod.z.object({
  "user": _zod.z.object({
    "id": _zod.z.string().uuid()
  }),
  "resetCode": _zod.z.string(),
  "password": _zod.z.string().min(1)
});
var postSecurityForgotPasswordVerifyBody = _zod.z.object({
  "user": _zod.z.object({
    "id": _zod.z.string().uuid()
  }),
  "resetCode": _zod.z.string()
});
var postSecurityForgotPasswordVerifyResponse = _zod.z.object({
  "passwordConfiguration": _zod.z.object({
    "minimumPasswordLength": _zod.z.number(),
    "requireNonLetterOrDigit": _zod.z.boolean(),
    "requireDigit": _zod.z.boolean(),
    "requireLowercase": _zod.z.boolean(),
    "requireUppercase": _zod.z.boolean()
  })
});
var getSegmentQueryTakeDefault = 100;
var getSegmentQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getSegmentQueryTakeDefault)
});
var getSegmentResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "name": _zod.z.string(),
    "alias": _zod.z.string()
  }))
});
var getServerConfigurationResponse = _zod.z.object({
  "allowPasswordReset": _zod.z.boolean(),
  "versionCheckPeriod": _zod.z.number(),
  "allowLocalLogin": _zod.z.boolean()
});
var getServerInformationResponse = _zod.z.object({
  "version": _zod.z.string(),
  "assemblyVersion": _zod.z.string(),
  "baseUtcOffset": _zod.z.string(),
  "runtimeMode": _zod.z.enum(["BackofficeDevelopment", "Development", "Production"])
});
var getServerStatusResponse = _zod.z.object({
  "serverStatus": _zod.z.enum(["Unknown", "Boot", "Install", "Upgrade", "Run", "BootFailed"])
});
var getServerTroubleshootingResponse = _zod.z.object({
  "items": _zod.z.array(_zod.z.object({
    "name": _zod.z.string(),
    "data": _zod.z.string()
  }))
});
var getServerUpgradeCheckResponse = _zod.z.object({
  "type": _zod.z.string(),
  "comment": _zod.z.string(),
  "url": _zod.z.string()
});
var getItemStaticFileQueryParams = _zod.z.object({
  "path": _zod.z.array(_zod.z.string()).optional()
});
var getItemStaticFileResponseItem = _zod.z.object({
  "path": _zod.z.string(),
  "name": _zod.z.string(),
  "parent": _zod.z.object({
    "path": _zod.z.string()
  }).nullish(),
  "isFolder": _zod.z.boolean()
});
var getItemStaticFileResponse = _zod.z.array(getItemStaticFileResponseItem);
var getTreeStaticFileAncestorsQueryParams = _zod.z.object({
  "descendantPath": _zod.z.string().optional()
});
var getTreeStaticFileAncestorsResponseItem = _zod.z.object({
  "hasChildren": _zod.z.boolean(),
  "name": _zod.z.string(),
  "path": _zod.z.string(),
  "parent": _zod.z.object({
    "path": _zod.z.string()
  }).nullish(),
  "isFolder": _zod.z.boolean()
});
var getTreeStaticFileAncestorsResponse = _zod.z.array(getTreeStaticFileAncestorsResponseItem);
var getTreeStaticFileChildrenQueryTakeDefault = 100;
var getTreeStaticFileChildrenQueryParams = _zod.z.object({
  "parentPath": _zod.z.string().optional(),
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getTreeStaticFileChildrenQueryTakeDefault)
});
var getTreeStaticFileChildrenResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "hasChildren": _zod.z.boolean(),
    "name": _zod.z.string(),
    "path": _zod.z.string(),
    "parent": _zod.z.object({
      "path": _zod.z.string()
    }).nullish(),
    "isFolder": _zod.z.boolean()
  }))
});
var getTreeStaticFileRootQueryTakeDefault = 100;
var getTreeStaticFileRootQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getTreeStaticFileRootQueryTakeDefault)
});
var getTreeStaticFileRootResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "hasChildren": _zod.z.boolean(),
    "name": _zod.z.string(),
    "path": _zod.z.string(),
    "parent": _zod.z.object({
      "path": _zod.z.string()
    }).nullish(),
    "isFolder": _zod.z.boolean()
  }))
});
var getItemStylesheetQueryParams = _zod.z.object({
  "path": _zod.z.array(_zod.z.string()).optional()
});
var getItemStylesheetResponseItem = _zod.z.object({
  "path": _zod.z.string(),
  "name": _zod.z.string(),
  "parent": _zod.z.object({
    "path": _zod.z.string()
  }).nullish(),
  "isFolder": _zod.z.boolean()
});
var getItemStylesheetResponse = _zod.z.array(getItemStylesheetResponseItem);
var postStylesheetBody = _zod.z.object({
  "name": _zod.z.string(),
  "parent": _zod.z.object({
    "path": _zod.z.string()
  }).nullish(),
  "content": _zod.z.string()
});
var getStylesheetByPathParams = _zod.z.object({
  "path": _zod.z.string()
});
var getStylesheetByPathResponse = _zod.z.object({
  "path": _zod.z.string(),
  "name": _zod.z.string(),
  "parent": _zod.z.object({
    "path": _zod.z.string()
  }).nullish(),
  "content": _zod.z.string()
});
var deleteStylesheetByPathParams = _zod.z.object({
  "path": _zod.z.string()
});
var putStylesheetByPathParams = _zod.z.object({
  "path": _zod.z.string()
});
var putStylesheetByPathBody = _zod.z.object({
  "content": _zod.z.string()
});
var putStylesheetByPathRenameParams = _zod.z.object({
  "path": _zod.z.string()
});
var putStylesheetByPathRenameBody = _zod.z.object({
  "name": _zod.z.string()
});
var postStylesheetFolderBody = _zod.z.object({
  "name": _zod.z.string(),
  "parent": _zod.z.object({
    "path": _zod.z.string()
  }).nullish()
});
var getStylesheetFolderByPathParams = _zod.z.object({
  "path": _zod.z.string()
});
var getStylesheetFolderByPathResponse = _zod.z.object({
  "path": _zod.z.string(),
  "name": _zod.z.string(),
  "parent": _zod.z.object({
    "path": _zod.z.string()
  }).nullish()
});
var deleteStylesheetFolderByPathParams = _zod.z.object({
  "path": _zod.z.string()
});
var getTreeStylesheetAncestorsQueryParams = _zod.z.object({
  "descendantPath": _zod.z.string().optional()
});
var getTreeStylesheetAncestorsResponseItem = _zod.z.object({
  "hasChildren": _zod.z.boolean(),
  "name": _zod.z.string(),
  "path": _zod.z.string(),
  "parent": _zod.z.object({
    "path": _zod.z.string()
  }).nullish(),
  "isFolder": _zod.z.boolean()
});
var getTreeStylesheetAncestorsResponse = _zod.z.array(getTreeStylesheetAncestorsResponseItem);
var getTreeStylesheetChildrenQueryTakeDefault = 100;
var getTreeStylesheetChildrenQueryParams = _zod.z.object({
  "parentPath": _zod.z.string().optional(),
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getTreeStylesheetChildrenQueryTakeDefault)
});
var getTreeStylesheetChildrenResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "hasChildren": _zod.z.boolean(),
    "name": _zod.z.string(),
    "path": _zod.z.string(),
    "parent": _zod.z.object({
      "path": _zod.z.string()
    }).nullish(),
    "isFolder": _zod.z.boolean()
  }))
});
var getTreeStylesheetRootQueryTakeDefault = 100;
var getTreeStylesheetRootQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getTreeStylesheetRootQueryTakeDefault)
});
var getTreeStylesheetRootResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "hasChildren": _zod.z.boolean(),
    "name": _zod.z.string(),
    "path": _zod.z.string(),
    "parent": _zod.z.object({
      "path": _zod.z.string()
    }).nullish(),
    "isFolder": _zod.z.boolean()
  }))
});
var getTagQueryTakeDefault = 100;
var getTagQueryParams = _zod.z.object({
  "query": _zod.z.string().optional(),
  "tagGroup": _zod.z.string().optional(),
  "culture": _zod.z.string().optional(),
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getTagQueryTakeDefault)
});
var getTagResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "text": _zod.z.string().nullish(),
    "group": _zod.z.string().nullish(),
    "nodeCount": _zod.z.number()
  }))
});
var getTelemetryQueryTakeDefault = 100;
var getTelemetryQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getTelemetryQueryTakeDefault)
});
var getTelemetryResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "telemetryLevel": _zod.z.enum(["Minimal", "Basic", "Detailed"])
  }))
});
var getTelemetryLevelResponse = _zod.z.object({
  "telemetryLevel": _zod.z.enum(["Minimal", "Basic", "Detailed"])
});
var postTelemetryLevelBody = _zod.z.object({
  "telemetryLevel": _zod.z.enum(["Minimal", "Basic", "Detailed"])
});
var getItemTemplateQueryParams = _zod.z.object({
  "id": _zod.z.array(_zod.z.string().uuid()).optional()
});
var getItemTemplateResponseItem = _zod.z.object({
  "id": _zod.z.string().uuid(),
  "name": _zod.z.string(),
  "alias": _zod.z.string()
});
var getItemTemplateResponse = _zod.z.array(getItemTemplateResponseItem);
var getItemTemplateSearchQueryTakeDefault = 100;
var getItemTemplateSearchQueryParams = _zod.z.object({
  "query": _zod.z.string().optional(),
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getItemTemplateSearchQueryTakeDefault)
});
var getItemTemplateSearchResponse = _zod.z.object({
  "items": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid(),
    "name": _zod.z.string(),
    "alias": _zod.z.string()
  })),
  "total": _zod.z.number()
});
var postTemplateBody = _zod.z.object({
  "name": _zod.z.string().min(1),
  "alias": _zod.z.string().min(1),
  "content": _zod.z.string().nullish(),
  "id": _zod.z.string().uuid().nullish()
});
var getTemplateByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getTemplateByIdResponse = _zod.z.object({
  "name": _zod.z.string().min(1),
  "alias": _zod.z.string().min(1),
  "content": _zod.z.string().nullish(),
  "id": _zod.z.string().uuid(),
  "masterTemplate": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish()
});
var deleteTemplateByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putTemplateByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putTemplateByIdBody = _zod.z.object({
  "name": _zod.z.string().min(1),
  "alias": _zod.z.string().min(1),
  "content": _zod.z.string().nullish()
});
var getTemplateConfigurationResponse = _zod.z.object({
  "disabled": _zod.z.boolean()
});
var postTemplateQueryExecuteBody = _zod.z.object({
  "rootDocument": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish(),
  "documentTypeAlias": _zod.z.string().nullish(),
  "filters": _zod.z.array(_zod.z.object({
    "propertyAlias": _zod.z.string().min(1),
    "constraintValue": _zod.z.string().min(1),
    "operator": _zod.z.enum(["Equals", "NotEquals", "Contains", "NotContains", "LessThan", "LessThanEqualTo", "GreaterThan", "GreaterThanEqualTo"])
  })).nullish(),
  "sort": _zod.z.object({
    "propertyAlias": _zod.z.string(),
    "direction": _zod.z.string().nullish()
  }).nullish(),
  "take": _zod.z.number()
});
var postTemplateQueryExecuteResponse = _zod.z.object({
  "queryExpression": _zod.z.string(),
  "sampleResults": _zod.z.array(_zod.z.object({
    "icon": _zod.z.string(),
    "name": _zod.z.string()
  })),
  "resultCount": _zod.z.number(),
  "executionTime": _zod.z.number()
});
var getTemplateQuerySettingsResponse = _zod.z.object({
  "documentTypeAliases": _zod.z.array(_zod.z.string()),
  "properties": _zod.z.array(_zod.z.object({
    "alias": _zod.z.string(),
    "type": _zod.z.enum(["String", "DateTime", "Integer"])
  })),
  "operators": _zod.z.array(_zod.z.object({
    "operator": _zod.z.enum(["Equals", "NotEquals", "Contains", "NotContains", "LessThan", "LessThanEqualTo", "GreaterThan", "GreaterThanEqualTo"]),
    "applicableTypes": _zod.z.array(_zod.z.enum(["String", "DateTime", "Integer"]))
  }))
});
var getTreeTemplateAncestorsQueryParams = _zod.z.object({
  "descendantId": _zod.z.string().uuid().optional()
});
var getTreeTemplateAncestorsResponseItem = _zod.z.object({
  "hasChildren": _zod.z.boolean(),
  "id": _zod.z.string().uuid(),
  "parent": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish(),
  "name": _zod.z.string()
});
var getTreeTemplateAncestorsResponse = _zod.z.array(getTreeTemplateAncestorsResponseItem);
var getTreeTemplateChildrenQueryTakeDefault = 100;
var getTreeTemplateChildrenQueryParams = _zod.z.object({
  "parentId": _zod.z.string().uuid().optional(),
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getTreeTemplateChildrenQueryTakeDefault)
});
var getTreeTemplateChildrenResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "hasChildren": _zod.z.boolean(),
    "id": _zod.z.string().uuid(),
    "parent": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish(),
    "name": _zod.z.string()
  }))
});
var getTreeTemplateRootQueryTakeDefault = 100;
var getTreeTemplateRootQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getTreeTemplateRootQueryTakeDefault)
});
var getTreeTemplateRootResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "hasChildren": _zod.z.boolean(),
    "id": _zod.z.string().uuid(),
    "parent": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish(),
    "name": _zod.z.string()
  }))
});
var postTemporaryFileBody = _zod.z.object({
  "Id": _zod.z.string().uuid(),
  "File": _zod.z.instanceof(FileLike)
});
var getTemporaryFileByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getTemporaryFileByIdResponse = _zod.z.object({
  "id": _zod.z.string().uuid(),
  "availableUntil": _zod.z.string().datetime({ "local": true }).nullish(),
  "fileName": _zod.z.string().min(1)
});
var deleteTemporaryFileByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getTemporaryFileConfigurationResponse = _zod.z.object({
  "imageFileTypes": _zod.z.array(_zod.z.string()),
  "disallowedUploadedFilesExtensions": _zod.z.array(_zod.z.string()),
  "allowedUploadedFileExtensions": _zod.z.array(_zod.z.string()),
  "maxFileSize": _zod.z.number().nullish()
});
var getUpgradeSettingsResponse = _zod.z.object({
  "currentState": _zod.z.string().min(1),
  "newState": _zod.z.string().min(1),
  "newVersion": _zod.z.string().min(1),
  "oldVersion": _zod.z.string().min(1),
  "reportUrl": _zod.z.string()
});
var postUserDataBody = _zod.z.object({
  "group": _zod.z.string(),
  "identifier": _zod.z.string(),
  "value": _zod.z.string(),
  "key": _zod.z.string().uuid().nullish()
});
var getUserDataQueryTakeDefault = 100;
var getUserDataQueryParams = _zod.z.object({
  "groups": _zod.z.array(_zod.z.string()).optional(),
  "identifiers": _zod.z.array(_zod.z.string()).optional(),
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getUserDataQueryTakeDefault)
});
var getUserDataResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "group": _zod.z.string(),
    "identifier": _zod.z.string(),
    "value": _zod.z.string(),
    "key": _zod.z.string().uuid()
  }))
});
var putUserDataBody = _zod.z.object({
  "group": _zod.z.string(),
  "identifier": _zod.z.string(),
  "value": _zod.z.string(),
  "key": _zod.z.string().uuid()
});
var getUserDataByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getUserDataByIdResponse = _zod.z.object({
  "group": _zod.z.string(),
  "identifier": _zod.z.string(),
  "value": _zod.z.string()
});
var getFilterUserGroupQueryTakeDefault = 100;
var getFilterUserGroupQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getFilterUserGroupQueryTakeDefault),
  "filter": _zod.z.string().optional()
});
var getFilterUserGroupResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "name": _zod.z.string(),
    "alias": _zod.z.string(),
    "icon": _zod.z.string().nullish(),
    "sections": _zod.z.array(_zod.z.string()),
    "languages": _zod.z.array(_zod.z.string()),
    "hasAccessToAllLanguages": _zod.z.boolean(),
    "documentStartNode": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish(),
    "documentRootAccess": _zod.z.boolean(),
    "mediaStartNode": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish(),
    "mediaRootAccess": _zod.z.boolean(),
    "fallbackPermissions": _zod.z.array(_zod.z.string()),
    "permissions": _zod.z.array(_zod.z.object({
      "$type": _zod.z.enum(["DocumentPermissionPresentationModel"]),
      "document": _zod.z.object({
        "id": _zod.z.string().uuid()
      }),
      "verbs": _zod.z.array(_zod.z.string())
    }).or(_zod.z.object({
      "$type": _zod.z.enum(["UnknownTypePermissionPresentationModel"]),
      "verbs": _zod.z.array(_zod.z.string()),
      "context": _zod.z.string()
    }))),
    "id": _zod.z.string().uuid(),
    "isDeletable": _zod.z.boolean(),
    "aliasCanBeChanged": _zod.z.boolean()
  }))
});
var getItemUserGroupQueryParams = _zod.z.object({
  "id": _zod.z.array(_zod.z.string().uuid()).optional()
});
var getItemUserGroupResponseItem = _zod.z.object({
  "id": _zod.z.string().uuid(),
  "name": _zod.z.string(),
  "icon": _zod.z.string().nullish(),
  "alias": _zod.z.string().nullish()
});
var getItemUserGroupResponse = _zod.z.array(getItemUserGroupResponseItem);
var deleteUserGroupBody = _zod.z.object({
  "userGroupIds": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid()
  }))
});
var postUserGroupBody = _zod.z.object({
  "name": _zod.z.string(),
  "alias": _zod.z.string(),
  "icon": _zod.z.string().nullish(),
  "sections": _zod.z.array(_zod.z.string()),
  "languages": _zod.z.array(_zod.z.string()),
  "hasAccessToAllLanguages": _zod.z.boolean(),
  "documentStartNode": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish(),
  "documentRootAccess": _zod.z.boolean(),
  "mediaStartNode": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish(),
  "mediaRootAccess": _zod.z.boolean(),
  "fallbackPermissions": _zod.z.array(_zod.z.string()),
  "permissions": _zod.z.array(_zod.z.object({
    "$type": _zod.z.enum(["DocumentPermissionPresentationModel"]),
    "document": _zod.z.object({
      "id": _zod.z.string().uuid()
    }),
    "verbs": _zod.z.array(_zod.z.string())
  }).or(_zod.z.object({
    "$type": _zod.z.enum(["UnknownTypePermissionPresentationModel"]),
    "verbs": _zod.z.array(_zod.z.string()),
    "context": _zod.z.string()
  }))),
  "id": _zod.z.string().uuid().nullish()
});
var getUserGroupQueryTakeDefault = 100;
var getUserGroupQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getUserGroupQueryTakeDefault)
});
var getUserGroupResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "name": _zod.z.string(),
    "alias": _zod.z.string(),
    "icon": _zod.z.string().nullish(),
    "sections": _zod.z.array(_zod.z.string()),
    "languages": _zod.z.array(_zod.z.string()),
    "hasAccessToAllLanguages": _zod.z.boolean(),
    "documentStartNode": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish(),
    "documentRootAccess": _zod.z.boolean(),
    "mediaStartNode": _zod.z.object({
      "id": _zod.z.string().uuid()
    }).nullish(),
    "mediaRootAccess": _zod.z.boolean(),
    "fallbackPermissions": _zod.z.array(_zod.z.string()),
    "permissions": _zod.z.array(_zod.z.object({
      "$type": _zod.z.enum(["DocumentPermissionPresentationModel"]),
      "document": _zod.z.object({
        "id": _zod.z.string().uuid()
      }),
      "verbs": _zod.z.array(_zod.z.string())
    }).or(_zod.z.object({
      "$type": _zod.z.enum(["UnknownTypePermissionPresentationModel"]),
      "verbs": _zod.z.array(_zod.z.string()),
      "context": _zod.z.string()
    }))),
    "id": _zod.z.string().uuid(),
    "isDeletable": _zod.z.boolean(),
    "aliasCanBeChanged": _zod.z.boolean()
  }))
});
var getUserGroupByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getUserGroupByIdResponse = _zod.z.object({
  "name": _zod.z.string(),
  "alias": _zod.z.string(),
  "icon": _zod.z.string().nullish(),
  "sections": _zod.z.array(_zod.z.string()),
  "languages": _zod.z.array(_zod.z.string()),
  "hasAccessToAllLanguages": _zod.z.boolean(),
  "documentStartNode": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish(),
  "documentRootAccess": _zod.z.boolean(),
  "mediaStartNode": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish(),
  "mediaRootAccess": _zod.z.boolean(),
  "fallbackPermissions": _zod.z.array(_zod.z.string()),
  "permissions": _zod.z.array(_zod.z.object({
    "$type": _zod.z.enum(["DocumentPermissionPresentationModel"]),
    "document": _zod.z.object({
      "id": _zod.z.string().uuid()
    }),
    "verbs": _zod.z.array(_zod.z.string())
  }).or(_zod.z.object({
    "$type": _zod.z.enum(["UnknownTypePermissionPresentationModel"]),
    "verbs": _zod.z.array(_zod.z.string()),
    "context": _zod.z.string()
  }))),
  "id": _zod.z.string().uuid(),
  "isDeletable": _zod.z.boolean(),
  "aliasCanBeChanged": _zod.z.boolean()
});
var deleteUserGroupByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putUserGroupByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putUserGroupByIdBody = _zod.z.object({
  "name": _zod.z.string(),
  "alias": _zod.z.string(),
  "icon": _zod.z.string().nullish(),
  "sections": _zod.z.array(_zod.z.string()),
  "languages": _zod.z.array(_zod.z.string()),
  "hasAccessToAllLanguages": _zod.z.boolean(),
  "documentStartNode": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish(),
  "documentRootAccess": _zod.z.boolean(),
  "mediaStartNode": _zod.z.object({
    "id": _zod.z.string().uuid()
  }).nullish(),
  "mediaRootAccess": _zod.z.boolean(),
  "fallbackPermissions": _zod.z.array(_zod.z.string()),
  "permissions": _zod.z.array(_zod.z.object({
    "$type": _zod.z.enum(["DocumentPermissionPresentationModel"]),
    "document": _zod.z.object({
      "id": _zod.z.string().uuid()
    }),
    "verbs": _zod.z.array(_zod.z.string())
  }).or(_zod.z.object({
    "$type": _zod.z.enum(["UnknownTypePermissionPresentationModel"]),
    "verbs": _zod.z.array(_zod.z.string()),
    "context": _zod.z.string()
  })))
});
var deleteUserGroupByIdUsersParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var deleteUserGroupByIdUsersBodyItem = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var deleteUserGroupByIdUsersBody = _zod.z.array(deleteUserGroupByIdUsersBodyItem);
var postUserGroupByIdUsersParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var postUserGroupByIdUsersBodyItem = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var postUserGroupByIdUsersBody = _zod.z.array(postUserGroupByIdUsersBodyItem);
var getFilterUserQueryTakeDefault = 100;
var getFilterUserQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getFilterUserQueryTakeDefault),
  "orderBy": _zod.z.enum(["UserName", "Language", "Name", "Email", "Id", "CreateDate", "UpdateDate", "IsApproved", "IsLockedOut", "LastLoginDate"]).optional(),
  "orderDirection": _zod.z.enum(["Ascending", "Descending"]).optional(),
  "userGroupIds": _zod.z.array(_zod.z.string().uuid()).optional(),
  "userStates": _zod.z.array(_zod.z.enum(["Active", "Disabled", "LockedOut", "Invited", "Inactive", "All"])).optional(),
  "filter": _zod.z.string().optional()
});
var getFilterUserResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "email": _zod.z.string(),
    "userName": _zod.z.string(),
    "name": _zod.z.string(),
    "userGroupIds": _zod.z.array(_zod.z.object({
      "id": _zod.z.string().uuid()
    })),
    "id": _zod.z.string().uuid(),
    "languageIsoCode": _zod.z.string().nullish(),
    "documentStartNodeIds": _zod.z.array(_zod.z.object({
      "id": _zod.z.string().uuid()
    })),
    "hasDocumentRootAccess": _zod.z.boolean(),
    "mediaStartNodeIds": _zod.z.array(_zod.z.object({
      "id": _zod.z.string().uuid()
    })),
    "hasMediaRootAccess": _zod.z.boolean(),
    "avatarUrls": _zod.z.array(_zod.z.string()),
    "state": _zod.z.enum(["Active", "Disabled", "LockedOut", "Invited", "Inactive", "All"]),
    "failedLoginAttempts": _zod.z.number(),
    "createDate": _zod.z.string().datetime({ "local": true }),
    "updateDate": _zod.z.string().datetime({ "local": true }),
    "lastLoginDate": _zod.z.string().datetime({ "local": true }).nullish(),
    "lastLockoutDate": _zod.z.string().datetime({ "local": true }).nullish(),
    "lastPasswordChangeDate": _zod.z.string().datetime({ "local": true }).nullish(),
    "isAdmin": _zod.z.boolean(),
    "kind": _zod.z.enum(["Default", "Api"])
  }))
});
var getItemUserQueryParams = _zod.z.object({
  "id": _zod.z.array(_zod.z.string().uuid()).optional()
});
var getItemUserResponseItem = _zod.z.object({
  "id": _zod.z.string().uuid(),
  "name": _zod.z.string(),
  "avatarUrls": _zod.z.array(_zod.z.string()),
  "kind": _zod.z.enum(["Default", "Api"])
});
var getItemUserResponse = _zod.z.array(getItemUserResponseItem);
var postUserBody = _zod.z.object({
  "email": _zod.z.string(),
  "userName": _zod.z.string(),
  "name": _zod.z.string(),
  "userGroupIds": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid()
  })),
  "id": _zod.z.string().uuid().nullish(),
  "kind": _zod.z.enum(["Default", "Api"])
});
var deleteUserBody = _zod.z.object({
  "userIds": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid()
  }))
});
var getUserQueryTakeDefault = 100;
var getUserQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getUserQueryTakeDefault)
});
var getUserResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "email": _zod.z.string(),
    "userName": _zod.z.string(),
    "name": _zod.z.string(),
    "userGroupIds": _zod.z.array(_zod.z.object({
      "id": _zod.z.string().uuid()
    })),
    "id": _zod.z.string().uuid(),
    "languageIsoCode": _zod.z.string().nullish(),
    "documentStartNodeIds": _zod.z.array(_zod.z.object({
      "id": _zod.z.string().uuid()
    })),
    "hasDocumentRootAccess": _zod.z.boolean(),
    "mediaStartNodeIds": _zod.z.array(_zod.z.object({
      "id": _zod.z.string().uuid()
    })),
    "hasMediaRootAccess": _zod.z.boolean(),
    "avatarUrls": _zod.z.array(_zod.z.string()),
    "state": _zod.z.enum(["Active", "Disabled", "LockedOut", "Invited", "Inactive", "All"]),
    "failedLoginAttempts": _zod.z.number(),
    "createDate": _zod.z.string().datetime({ "local": true }),
    "updateDate": _zod.z.string().datetime({ "local": true }),
    "lastLoginDate": _zod.z.string().datetime({ "local": true }).nullish(),
    "lastLockoutDate": _zod.z.string().datetime({ "local": true }).nullish(),
    "lastPasswordChangeDate": _zod.z.string().datetime({ "local": true }).nullish(),
    "isAdmin": _zod.z.boolean(),
    "kind": _zod.z.enum(["Default", "Api"])
  }))
});
var getUserByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getUserByIdResponse = _zod.z.object({
  "email": _zod.z.string(),
  "userName": _zod.z.string(),
  "name": _zod.z.string(),
  "userGroupIds": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid()
  })),
  "id": _zod.z.string().uuid(),
  "languageIsoCode": _zod.z.string().nullish(),
  "documentStartNodeIds": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid()
  })),
  "hasDocumentRootAccess": _zod.z.boolean(),
  "mediaStartNodeIds": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid()
  })),
  "hasMediaRootAccess": _zod.z.boolean(),
  "avatarUrls": _zod.z.array(_zod.z.string()),
  "state": _zod.z.enum(["Active", "Disabled", "LockedOut", "Invited", "Inactive", "All"]),
  "failedLoginAttempts": _zod.z.number(),
  "createDate": _zod.z.string().datetime({ "local": true }),
  "updateDate": _zod.z.string().datetime({ "local": true }),
  "lastLoginDate": _zod.z.string().datetime({ "local": true }).nullish(),
  "lastLockoutDate": _zod.z.string().datetime({ "local": true }).nullish(),
  "lastPasswordChangeDate": _zod.z.string().datetime({ "local": true }).nullish(),
  "isAdmin": _zod.z.boolean(),
  "kind": _zod.z.enum(["Default", "Api"])
});
var deleteUserByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putUserByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putUserByIdBody = _zod.z.object({
  "email": _zod.z.string(),
  "userName": _zod.z.string(),
  "name": _zod.z.string(),
  "userGroupIds": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid()
  })),
  "languageIsoCode": _zod.z.string(),
  "documentStartNodeIds": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid()
  })),
  "hasDocumentRootAccess": _zod.z.boolean(),
  "mediaStartNodeIds": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid()
  })),
  "hasMediaRootAccess": _zod.z.boolean()
});
var getUserById2faParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getUserById2faResponseItem = _zod.z.object({
  "providerName": _zod.z.string(),
  "isEnabledOnUser": _zod.z.boolean()
});
var getUserById2faResponse = _zod.z.array(getUserById2faResponseItem);
var deleteUserById2faByProviderNameParams = _zod.z.object({
  "id": _zod.z.string().uuid(),
  "providerName": _zod.z.string()
});
var getUserByIdCalculateStartNodesParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getUserByIdCalculateStartNodesResponse = _zod.z.object({
  "id": _zod.z.string().uuid(),
  "documentStartNodeIds": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid()
  })),
  "hasDocumentRootAccess": _zod.z.boolean(),
  "mediaStartNodeIds": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid()
  })),
  "hasMediaRootAccess": _zod.z.boolean()
});
var postUserByIdChangePasswordParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var postUserByIdChangePasswordBody = _zod.z.object({
  "newPassword": _zod.z.string()
});
var postUserByIdClientCredentialsParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var postUserByIdClientCredentialsBody = _zod.z.object({
  "clientId": _zod.z.string(),
  "clientSecret": _zod.z.string()
});
var getUserByIdClientCredentialsParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getUserByIdClientCredentialsResponseItem = _zod.z.string();
var getUserByIdClientCredentialsResponse = _zod.z.array(getUserByIdClientCredentialsResponseItem);
var deleteUserByIdClientCredentialsByClientIdParams = _zod.z.object({
  "id": _zod.z.string().uuid(),
  "clientId": _zod.z.string()
});
var postUserByIdResetPasswordParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var postUserByIdResetPasswordResponse = _zod.z.object({
  "resetPassword": _zod.z.string().nullish()
});
var deleteUserAvatarByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var postUserAvatarByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var postUserAvatarByIdBody = _zod.z.object({
  "file": _zod.z.object({
    "id": _zod.z.string().uuid()
  })
});
var getUserConfigurationResponse = _zod.z.object({
  "canInviteUsers": _zod.z.boolean(),
  "usernameIsEmail": _zod.z.boolean(),
  "passwordConfiguration": _zod.z.object({
    "minimumPasswordLength": _zod.z.number(),
    "requireNonLetterOrDigit": _zod.z.boolean(),
    "requireDigit": _zod.z.boolean(),
    "requireLowercase": _zod.z.boolean(),
    "requireUppercase": _zod.z.boolean()
  }),
  "allowChangePassword": _zod.z.boolean(),
  "allowTwoFactor": _zod.z.boolean()
});
var getUserCurrentResponse = _zod.z.object({
  "email": _zod.z.string(),
  "userName": _zod.z.string(),
  "name": _zod.z.string(),
  "userGroupIds": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid()
  })),
  "id": _zod.z.string().uuid(),
  "languageIsoCode": _zod.z.string().nullable(),
  "documentStartNodeIds": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid()
  })),
  "hasDocumentRootAccess": _zod.z.boolean(),
  "mediaStartNodeIds": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid()
  })),
  "hasMediaRootAccess": _zod.z.boolean(),
  "avatarUrls": _zod.z.array(_zod.z.string()),
  "languages": _zod.z.array(_zod.z.string()),
  "hasAccessToAllLanguages": _zod.z.boolean(),
  "hasAccessToSensitiveData": _zod.z.boolean(),
  "fallbackPermissions": _zod.z.array(_zod.z.string()),
  "permissions": _zod.z.array(_zod.z.object({
    "$type": _zod.z.enum(["DocumentPermissionPresentationModel"]),
    "document": _zod.z.object({
      "id": _zod.z.string().uuid()
    }),
    "verbs": _zod.z.array(_zod.z.string())
  }).or(_zod.z.object({
    "$type": _zod.z.enum(["UnknownTypePermissionPresentationModel"]),
    "verbs": _zod.z.array(_zod.z.string()),
    "context": _zod.z.string()
  }))),
  "allowedSections": _zod.z.array(_zod.z.string()),
  "isAdmin": _zod.z.boolean()
});
var getUserCurrent2faResponseItem = _zod.z.object({
  "providerName": _zod.z.string(),
  "isEnabledOnUser": _zod.z.boolean()
});
var getUserCurrent2faResponse = _zod.z.array(getUserCurrent2faResponseItem);
var deleteUserCurrent2faByProviderNameParams = _zod.z.object({
  "providerName": _zod.z.string()
});
var deleteUserCurrent2faByProviderNameQueryParams = _zod.z.object({
  "code": _zod.z.string().optional()
});
var postUserCurrent2faByProviderNameParams = _zod.z.object({
  "providerName": _zod.z.string()
});
var postUserCurrent2faByProviderNameBody = _zod.z.object({
  "code": _zod.z.string(),
  "secret": _zod.z.string()
});
var postUserCurrent2faByProviderNameResponse = _zod.z.object({});
var getUserCurrent2faByProviderNameParams = _zod.z.object({
  "providerName": _zod.z.string()
});
var getUserCurrent2faByProviderNameResponse = _zod.z.object({});
var postUserCurrentAvatarBody = _zod.z.object({
  "file": _zod.z.object({
    "id": _zod.z.string().uuid()
  })
});
var postUserCurrentChangePasswordBody = _zod.z.object({
  "newPassword": _zod.z.string(),
  "oldPassword": _zod.z.string().nullish()
});
var getUserCurrentConfigurationResponse = _zod.z.object({
  "keepUserLoggedIn": _zod.z.boolean(),
  "usernameIsEmail": _zod.z.boolean(),
  "passwordConfiguration": _zod.z.object({
    "minimumPasswordLength": _zod.z.number(),
    "requireNonLetterOrDigit": _zod.z.boolean(),
    "requireDigit": _zod.z.boolean(),
    "requireLowercase": _zod.z.boolean(),
    "requireUppercase": _zod.z.boolean()
  }),
  "allowChangePassword": _zod.z.boolean(),
  "allowTwoFactor": _zod.z.boolean()
});
var getUserCurrentLoginProvidersResponseItem = _zod.z.object({
  "providerSchemeName": _zod.z.string(),
  "providerKey": _zod.z.string().nullish(),
  "isLinkedOnUser": _zod.z.boolean(),
  "hasManualLinkingEnabled": _zod.z.boolean()
});
var getUserCurrentLoginProvidersResponse = _zod.z.array(getUserCurrentLoginProvidersResponseItem);
var getUserCurrentPermissionsQueryParams = _zod.z.object({
  "id": _zod.z.array(_zod.z.string().uuid()).optional()
});
var getUserCurrentPermissionsResponse = _zod.z.object({
  "permissions": _zod.z.array(_zod.z.object({
    "nodeKey": _zod.z.string().uuid(),
    "permissions": _zod.z.array(_zod.z.string())
  }))
});
var getUserCurrentPermissionsDocumentQueryParams = _zod.z.object({
  "id": _zod.z.array(_zod.z.string().uuid()).optional()
});
var getUserCurrentPermissionsDocumentResponseItem = _zod.z.object({
  "permissions": _zod.z.array(_zod.z.object({
    "nodeKey": _zod.z.string().uuid(),
    "permissions": _zod.z.array(_zod.z.string())
  }))
});
var getUserCurrentPermissionsDocumentResponse = _zod.z.array(getUserCurrentPermissionsDocumentResponseItem);
var getUserCurrentPermissionsMediaQueryParams = _zod.z.object({
  "id": _zod.z.array(_zod.z.string().uuid()).optional()
});
var getUserCurrentPermissionsMediaResponse = _zod.z.object({
  "permissions": _zod.z.array(_zod.z.object({
    "nodeKey": _zod.z.string().uuid(),
    "permissions": _zod.z.array(_zod.z.string())
  }))
});
var postUserDisableBody = _zod.z.object({
  "userIds": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid()
  }))
});
var postUserEnableBody = _zod.z.object({
  "userIds": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid()
  }))
});
var postUserInviteBody = _zod.z.object({
  "email": _zod.z.string(),
  "userName": _zod.z.string(),
  "name": _zod.z.string(),
  "userGroupIds": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid()
  })),
  "id": _zod.z.string().uuid().nullish(),
  "message": _zod.z.string().nullish()
});
var postUserInviteCreatePasswordBody = _zod.z.object({
  "user": _zod.z.object({
    "id": _zod.z.string().uuid()
  }),
  "token": _zod.z.string().min(1),
  "password": _zod.z.string()
});
var postUserInviteResendBody = _zod.z.object({
  "user": _zod.z.object({
    "id": _zod.z.string().uuid()
  }),
  "message": _zod.z.string().nullish()
});
var postUserInviteVerifyBody = _zod.z.object({
  "user": _zod.z.object({
    "id": _zod.z.string().uuid()
  }),
  "token": _zod.z.string().min(1)
});
var postUserInviteVerifyResponse = _zod.z.object({
  "passwordConfiguration": _zod.z.object({
    "minimumPasswordLength": _zod.z.number(),
    "requireNonLetterOrDigit": _zod.z.boolean(),
    "requireDigit": _zod.z.boolean(),
    "requireLowercase": _zod.z.boolean(),
    "requireUppercase": _zod.z.boolean()
  })
});
var postUserSetUserGroupsBody = _zod.z.object({
  "userIds": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid()
  })),
  "userGroupIds": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid()
  }))
});
var postUserUnlockBody = _zod.z.object({
  "userIds": _zod.z.array(_zod.z.object({
    "id": _zod.z.string().uuid()
  }))
});
var getItemWebhookQueryParams = _zod.z.object({
  "id": _zod.z.array(_zod.z.string().uuid()).optional()
});
var getItemWebhookResponseItem = _zod.z.object({
  "enabled": _zod.z.boolean(),
  "name": _zod.z.string(),
  "events": _zod.z.string(),
  "url": _zod.z.string(),
  "types": _zod.z.string()
});
var getItemWebhookResponse = _zod.z.array(getItemWebhookResponseItem);
var getWebhookQueryTakeDefault = 100;
var getWebhookQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getWebhookQueryTakeDefault)
});
var getWebhookResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "enabled": _zod.z.boolean(),
    "name": _zod.z.string().nullish(),
    "description": _zod.z.string().nullish(),
    "url": _zod.z.string().min(1),
    "contentTypeKeys": _zod.z.array(_zod.z.string().uuid()),
    "headers": _zod.z.record(_zod.z.string(), _zod.z.string()),
    "id": _zod.z.string().uuid(),
    "events": _zod.z.array(_zod.z.object({
      "eventName": _zod.z.string(),
      "eventType": _zod.z.string(),
      "alias": _zod.z.string()
    }))
  }))
});
var postWebhookBody = _zod.z.object({
  "enabled": _zod.z.boolean(),
  "name": _zod.z.string().nullish(),
  "description": _zod.z.string().nullish(),
  "url": _zod.z.string().min(1),
  "contentTypeKeys": _zod.z.array(_zod.z.string().uuid()),
  "headers": _zod.z.record(_zod.z.string(), _zod.z.string()),
  "id": _zod.z.string().uuid().nullish(),
  "events": _zod.z.array(_zod.z.string())
});
var getWebhookByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getWebhookByIdResponse = _zod.z.object({
  "enabled": _zod.z.boolean(),
  "name": _zod.z.string().nullish(),
  "description": _zod.z.string().nullish(),
  "url": _zod.z.string().min(1),
  "contentTypeKeys": _zod.z.array(_zod.z.string().uuid()),
  "headers": _zod.z.record(_zod.z.string(), _zod.z.string()),
  "id": _zod.z.string().uuid(),
  "events": _zod.z.array(_zod.z.object({
    "eventName": _zod.z.string(),
    "eventType": _zod.z.string(),
    "alias": _zod.z.string()
  }))
});
var deleteWebhookByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putWebhookByIdParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var putWebhookByIdBody = _zod.z.object({
  "enabled": _zod.z.boolean(),
  "name": _zod.z.string().nullish(),
  "description": _zod.z.string().nullish(),
  "url": _zod.z.string().min(1),
  "contentTypeKeys": _zod.z.array(_zod.z.string().uuid()),
  "headers": _zod.z.record(_zod.z.string(), _zod.z.string()),
  "events": _zod.z.array(_zod.z.string())
});
var getWebhookByIdLogsParams = _zod.z.object({
  "id": _zod.z.string().uuid()
});
var getWebhookByIdLogsQueryTakeDefault = 100;
var getWebhookByIdLogsQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getWebhookByIdLogsQueryTakeDefault)
});
var getWebhookByIdLogsResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "key": _zod.z.string().uuid(),
    "webhookKey": _zod.z.string().uuid(),
    "statusCode": _zod.z.string(),
    "isSuccessStatusCode": _zod.z.boolean(),
    "date": _zod.z.string().datetime({ "local": true }),
    "eventAlias": _zod.z.string(),
    "url": _zod.z.string(),
    "retryCount": _zod.z.number(),
    "requestHeaders": _zod.z.string(),
    "requestBody": _zod.z.string(),
    "responseHeaders": _zod.z.string(),
    "responseBody": _zod.z.string(),
    "exceptionOccured": _zod.z.boolean()
  }))
});
var getWebhookEventsQueryTakeDefault = 100;
var getWebhookEventsQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getWebhookEventsQueryTakeDefault)
});
var getWebhookEventsResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "eventName": _zod.z.string(),
    "eventType": _zod.z.string(),
    "alias": _zod.z.string()
  }))
});
var getWebhookLogsQueryTakeDefault = 100;
var getWebhookLogsQueryParams = _zod.z.object({
  "skip": _zod.z.coerce.number().optional(),
  "take": _zod.z.coerce.number().default(getWebhookLogsQueryTakeDefault)
});
var getWebhookLogsResponse = _zod.z.object({
  "total": _zod.z.number(),
  "items": _zod.z.array(_zod.z.object({
    "key": _zod.z.string().uuid(),
    "webhookKey": _zod.z.string().uuid(),
    "statusCode": _zod.z.string(),
    "isSuccessStatusCode": _zod.z.boolean(),
    "date": _zod.z.string().datetime({ "local": true }),
    "eventAlias": _zod.z.string(),
    "url": _zod.z.string(),
    "retryCount": _zod.z.number(),
    "requestHeaders": _zod.z.string(),
    "requestBody": _zod.z.string(),
    "responseHeaders": _zod.z.string(),
    "responseBody": _zod.z.string(),
    "exceptionOccured": _zod.z.boolean()
  }))
});

// src/tools/culture/get-cultures.ts
var GetCulturesTool = CreateUmbracoTool(
  "get-culture",
  "Retrieves a paginated list of cultures that Umbraco can be configured to use",
  getCultureQueryParams.shape,
  async (params) => {
    const client = UmbracoManagementClient2.getClient();
    var response = await client.getCulture(params);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response)
        }
      ]
    };
  }
);
var get_cultures_default = GetCulturesTool;

// src/tools/culture/index.ts
var CultureTools = [get_cultures_default];

// src/tools/data-types/get/get-root.ts
var GetDataTypeRootTool = CreateUmbracoTool(
  "get-data-type-root",
  "Gets the root level of the data type tree.",
  getTreeDataTypeRootQueryParams.shape,
  async (params) => {
    const client = UmbracoManagementClient2.getClient();
    var response = await client.getTreeDataTypeRoot(params);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response)
        }
      ]
    };
  }
);
var get_root_default = GetDataTypeRootTool;

// src/tools/data-types/post/create-data-type.ts
var CreateDataTypeTool = CreateUmbracoTool(
  "create-data-type",
  "Creates a new data type",
  postDataTypeBody.shape,
  async (model) => {
    try {
      const client = UmbracoManagementClient2.getClient();
      var response = await client.postDataType(model);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response)
          }
        ]
      };
    } catch (error) {
      console.error("Error creating data type:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error}`
          }
        ]
      };
    }
  }
);
var create_data_type_default = CreateDataTypeTool;

// src/tools/data-types/delete/delete-data-type.ts
var DeleteDataTypeTool = CreateUmbracoTool(
  "delete-data-type",
  "Deletes a data type by Id",
  deleteDataTypeByIdParams.shape,
  async ({ id }) => {
    try {
      const client = UmbracoManagementClient2.getClient();
      var response = await client.deleteDataTypeById(id);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response)
          }
        ]
      };
    } catch (error) {
      console.error("Error creating data type:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error}`
          }
        ]
      };
    }
  }
);
var delete_data_type_default = DeleteDataTypeTool;

// src/tools/data-types/get/find-data-type.ts
var FindDataTypeTool = CreateUmbracoTool(
  "find-data-type",
  "Finds a data type by Id or name",
  getFilterDataTypeQueryParams.shape,
  async (model) => {
    try {
      const client = UmbracoManagementClient2.getClient();
      var response = await client.getFilterDataType(model);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response)
          }
        ]
      };
    } catch (error) {
      console.error("Error creating data type:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error}`
          }
        ]
      };
    }
  }
);
var find_data_type_default = FindDataTypeTool;

// src/tools/data-types/get/get-data-type.ts
var GetDataTypeTool = CreateUmbracoTool(
  "get-data-type",
  "Gets a data type by Id",
  getDataTypeByIdParams.shape,
  async ({ id }) => {
    try {
      const client = UmbracoManagementClient2.getClient();
      const response = await client.getDataTypeById(id);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response)
          }
        ],
        resource: {
          type: "data-type",
          ...response,
          uri: `${process.env.UMBRACO_BASE_URL}/umbraco/section/settings/workspace/data-type/edit/${response.id}`
        }
      };
    } catch (error) {
      console.error("Error creating data type:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error}`
          }
        ]
      };
    }
  }
);
var get_data_type_default = GetDataTypeTool;

// src/tools/data-types/put/update-data-type.ts

var UpdateDataTypeTool = CreateUmbracoTool(
  "update-data-type",
  "Updates a data type by Id",
  {
    id: putDataTypeByIdParams.shape.id,
    data: _zod.z.object(putDataTypeByIdBody.shape)
  },
  async (model) => {
    try {
      const client = UmbracoManagementClient2.getClient();
      var response = await client.putDataTypeById(model.id, model.data);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response)
          }
        ]
      };
    } catch (error) {
      console.error("Error creating data type:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error}`
          }
        ]
      };
    }
  }
);
var update_data_type_default = UpdateDataTypeTool;

// src/tools/data-types/post/copy-data-type.ts

var CopyDataTypeTool = CreateUmbracoTool(
  "copy-data-type",
  "Copy a data type by Id",
  {
    id: postDataTypeByIdCopyParams.shape.id,
    body: _zod.z.object(postDataTypeByIdCopyBody.shape)
  },
  async ({ id, body }) => {
    try {
      const client = UmbracoManagementClient2.getClient();
      var response = await client.postDataTypeByIdCopy(id, body);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response)
          }
        ]
      };
    } catch (error) {
      console.error("Error copying data type:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error}`
          }
        ]
      };
    }
  }
);
var copy_data_type_default = CopyDataTypeTool;

// src/tools/data-types/get/is-used-data-type.ts
var IsUsedDataTypeTool = CreateUmbracoTool(
  "is-used-data-type",
  "Checks if a data type is used within Umbraco",
  getDataTypeByIdIsUsedParams.shape,
  async ({ id }) => {
    try {
      const client = UmbracoManagementClient2.getClient();
      var response = await client.getDataTypeByIdIsUsed(id);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response)
          }
        ]
      };
    } catch (error) {
      console.error("Error creating data type:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error}`
          }
        ]
      };
    }
  }
);
var is_used_data_type_default = IsUsedDataTypeTool;

// src/tools/data-types/put/move-data-type.ts

var MoveDataTypeTool = CreateUmbracoTool(
  "move-data-type",
  "Updates a data type by Id",
  {
    id: putDataTypeByIdMoveParams.shape.id,
    data: _zod.z.object(putDataTypeByIdMoveBody.shape)
  },
  async (model) => {
    try {
      const client = UmbracoManagementClient2.getClient();
      var response = await client.putDataTypeByIdMove(model.id, model.data);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response)
          }
        ]
      };
    } catch (error) {
      console.error("Error creating data type:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error}`
          }
        ]
      };
    }
  }
);
var move_data_type_default = MoveDataTypeTool;

// src/tools/data-types/get/get-references-data-type.ts
var GetReferencesDataTypeTool = CreateUmbracoTool(
  "get-references-data-type",
  "Gets a data type by Id",
  getDataTypeByIdReferencesParams.shape,
  async ({ id }) => {
    try {
      const client = UmbracoManagementClient2.getClient();
      var response = await client.getDataTypeByIdReferences(id);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response)
          }
        ]
      };
    } catch (error) {
      console.error("Error creating data type:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error}`
          }
        ]
      };
    }
  }
);
var get_references_data_type_default = GetReferencesDataTypeTool;

// src/tools/data-types/folders/post/create-folder.ts
var CreateDataTypeFolderTool = CreateUmbracoTool(
  "create-data-type-folder",
  "Creates a new data type folder",
  postDataTypeFolderBody.shape,
  async (model) => {
    try {
      const client = UmbracoManagementClient2.getClient();
      var response = await client.postDataTypeFolder(model);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response)
          }
        ]
      };
    } catch (error) {
      console.error("Error creating data type:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error}`
          }
        ]
      };
    }
  }
);
var create_folder_default = CreateDataTypeFolderTool;

// src/tools/data-types/folders/delete/delete-folder.ts
var DeleteDataTypeFolderTool = CreateUmbracoTool(
  "delete-data-type-folder",
  "Deletes a data type folder by Id",
  deleteDataTypeFolderByIdParams.shape,
  async ({ id }) => {
    try {
      const client = UmbracoManagementClient2.getClient();
      var response = await client.deleteDataTypeFolderById(id);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response)
          }
        ]
      };
    } catch (error) {
      console.error("Error creating data type:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error}`
          }
        ]
      };
    }
  }
);
var delete_folder_default = DeleteDataTypeFolderTool;

// src/tools/data-types/folders/get/get-folder.ts
var GetDataTypeFolderTool = CreateUmbracoTool(
  "get-data-type-folder",
  "Gets a data type folder by Id",
  getDataTypeFolderByIdParams.shape,
  async ({ id }) => {
    try {
      const client = UmbracoManagementClient2.getClient();
      var response = await client.getDataTypeFolderById(id);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response)
          }
        ]
      };
    } catch (error) {
      console.error("Error creating data type:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error}`
          }
        ]
      };
    }
  }
);
var get_folder_default = GetDataTypeFolderTool;

// src/tools/data-types/get/get-search.ts
var GetDataTypeSearchTool = CreateUmbracoTool(
  "get-data-type-search",
  "Searches the data type tree for a data type or a folder.",
  getTreeDataTypeRootQueryParams.shape,
  async (params) => {
    const client = UmbracoManagementClient2.getClient();
    var response = await client.getItemDataTypeSearch(params);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response)
        }
      ]
    };
  }
);
var get_search_default = GetDataTypeSearchTool;

// src/tools/data-types/index.ts
var DataTypeTools = [
  get_root_default,
  get_search_default,
  create_data_type_default,
  delete_data_type_default,
  find_data_type_default,
  get_data_type_default,
  update_data_type_default,
  copy_data_type_default,
  is_used_data_type_default,
  move_data_type_default,
  get_references_data_type_default,
  create_folder_default,
  delete_folder_default,
  get_folder_default
];

// src/tools/dictionary/delete/delete-dictionary-item.ts
var DeleteDictionaryItemTool = CreateUmbracoTool(
  "delete-dictionary-item",
  "Deletes a dictionary item by Id",
  deleteDictionaryByIdParams.shape,
  async ({ id }) => {
    try {
      const client = UmbracoManagementClient2.getClient();
      var response = await client.deleteDictionaryById(id);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response)
          }
        ]
      };
    } catch (error) {
      console.error("Error creating data type:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error}`
          }
        ]
      };
    }
  }
);
var delete_dictionary_item_default = DeleteDictionaryItemTool;

// src/tools/dictionary/get/find-dictionary-item.ts
var FindDictionaryItemTool = CreateUmbracoTool(
  "find-dictionary",
  "Finds a dictionary by Id or name",
  getDictionaryQueryParams.shape,
  async (model) => {
    try {
      const client = UmbracoManagementClient2.getClient();
      var response = await client.getDictionary(model);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response)
          }
        ]
      };
    } catch (error) {
      console.error("Error creating data type:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error}`
          }
        ]
      };
    }
  }
);
var find_dictionary_item_default = FindDictionaryItemTool;

// src/tools/dictionary/get/get-dictionary-item.ts
var GetDictionaryItemTool = CreateUmbracoTool(
  "get-dictionary",
  "Gets a dictionary by Id",
  getDictionaryByIdParams.shape,
  async ({ id }) => {
    try {
      const client = UmbracoManagementClient2.getClient();
      const response = await client.getDictionaryById(id);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response)
          }
        ]
      };
    } catch (error) {
      console.error("Error getting dictionary:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error}`
          }
        ]
      };
    }
  }
);
var get_dictionary_item_default = GetDictionaryItemTool;

// src/tools/dictionary/post/create-dictionary-item.ts
var CreateDictionaryItemTool = CreateUmbracoTool(
  "create-dictionary",
  "Creates a new dictionary item",
  postDictionaryBody.shape,
  async (model) => {
    try {
      const client = UmbracoManagementClient2.getClient();
      var response = await client.postDictionary(model);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response)
          }
        ]
      };
    } catch (error) {
      console.error("Error creating data type:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error}`
          }
        ]
      };
    }
  }
);
var create_dictionary_item_default = CreateDictionaryItemTool;

// src/tools/dictionary/put/update-dictionary-item.ts

var UpdateDictionaryItemTool = CreateUmbracoTool(
  "update-dictionary-item",
  "Updates a dictionary item by Id",
  {
    id: putDictionaryByIdParams.shape.id,
    data: _zod.z.object(putDictionaryByIdBody.shape)
  },
  async (model) => {
    try {
      const client = UmbracoManagementClient2.getClient();
      var response = await client.putDictionaryById(model.id, model.data);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response)
          }
        ]
      };
    } catch (error) {
      console.error("Error creating data type:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error}`
          }
        ]
      };
    }
  }
);
var update_dictionary_item_default = UpdateDictionaryItemTool;

// src/tools/dictionary/index.ts
var DictionaryTools = [
  get_dictionary_item_default,
  find_dictionary_item_default,
  create_dictionary_item_default,
  delete_dictionary_item_default,
  update_dictionary_item_default
];

// src/tools/tool-factory.ts
function ToolFactory(server) {
  CultureTools.map((tool) => tool()).forEach(
    (tool) => server.tool(tool.name, tool.description, tool.schema, tool.handler)
  );
  DataTypeTools.map((tool) => tool()).forEach(
    (tool) => server.tool(tool.name, tool.description, tool.schema, tool.handler)
  );
  DictionaryTools.map((tool) => tool()).forEach(
    (tool) => server.tool(tool.name, tool.description, tool.schema, tool.handler)
  );
}

// src/helpers/create-umbraco-template-resource.ts
var CreateUmbracoTemplateResource = (name, description, template, handler) => () => ({
  name,
  description,
  template,
  handler
});

// src/resources/data-types/get/get-root.ts

var GetDataTypeRootResource = CreateUmbracoTemplateResource(
  "List Data Types at Root",
  new (0, _mcpjs.ResourceTemplate)("umbraco://data-type/root?skip={skip}&take={take}&foldersOnly={foldersOnly}", {
    list: void 0,
    complete: {
      skip: (value) => ["0", "10", "20", "30", "40", "50", "60", "70", "80", "90", "100"],
      take: (value) => ["10", "20", "50", "100"],
      foldersOnly: (value) => ["true", "false"]
    }
  }),
  async (uri, variables) => {
    try {
      const client = UmbracoManagementClient2.getClient();
      const params = getTreeDataTypeRootQueryParams.parse(variables);
      const response = await client.getTreeDataTypeRoot(params);
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify(response, null, 2),
          mimeType: "application/json"
        }]
      };
    } catch (error) {
      console.error("Error in GetDataTypeRootResource:", error);
      throw error;
    }
  }
);
var get_root_default2 = GetDataTypeRootResource;

// src/resources/data-types/index.ts
var DataTypeTemplateResources = [
  get_root_default2
];

// src/helpers/create-umbraco-read-resource.ts
var CreateUmbracoReadResource = (uri, name, description, handler) => () => ({
  uri,
  name,
  description,
  handler
});

// src/resources/language/get/get-default.ts
var GetLangagueDefaultResource = CreateUmbracoReadResource(
  "umbraco://item/langage/default",
  "List default language",
  "List the default language for the current Umbraco instance",
  async (uri) => {
    try {
      const client = UmbracoManagementClient2.getClient();
      const response = await client.getItemLanguageDefault();
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify(response, null, 2),
          mimeType: "application/json"
        }]
      };
    } catch (error) {
      console.error("Error in GetItemLanguageDefault:", error);
      throw error;
    }
  }
);
var get_default_default = GetLangagueDefaultResource;

// src/resources/language/index.ts
var LanugageReadResources = [
  get_default_default
];

// src/resources/resource-factory.ts
function ResourceFactory(server) {
  LanugageReadResources.map((resource) => resource()).forEach(
    (resource) => server.resource(resource.name, resource.uri, { description: resource.description }, resource.handler)
  );
  DataTypeTemplateResources.map((resource) => resource()).forEach(
    (resource) => server.resource(resource.name, resource.template, { description: resource.description }, resource.handler)
  );
}

// src/index.ts
var main = async () => {
  const server = UmbracoMcpServer.GetServer();
  ResourceFactory(server);
  ToolFactory(server);
  const transport = new (0, _stdiojs.StdioServerTransport)();
  await server.connect(transport);
};
main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
//# sourceMappingURL=index.cjs.map