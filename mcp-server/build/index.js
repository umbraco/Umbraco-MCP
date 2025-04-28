#!/usr/bin/env node

// src/index.ts
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// src/server/umbraco-mcp-server.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
var UmbracoMcpServer = class _UmbracoMcpServer {
  static instance = null;
  constructor() {
  }
  static GetServer() {
    if (_UmbracoMcpServer.instance === null) {
      _UmbracoMcpServer.instance = new McpServer({
        name: "Umbraco Server",
        version: "1.0.0",
        capabilities: {
          tools: {}
        }
      });
    }
    return _UmbracoMcpServer.instance;
  }
};

// src/api/umbraco/clients/umbraco-management-client.ts
import Axios from "axios";
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
var UmbracoAxios = Axios.create({ baseURL });
var accessToken = null;
var tokenExpiry = null;
var fetchAccessToken = async () => {
  const response = await Axios.post(
    `${baseURL}${tokenPath}`,
    {
      client_id,
      client_secret: client_secret ?? "",
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
  const source = Axios.CancelToken.source();
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
var UmbracoManagementClient2 = class {
  static instance = null;
  constructor() {
  }
  static getClient() {
    if (this.instance === null) {
      this.instance = getUmbracoManagementAPI();
    }
    return this.instance;
  }
};

// src/helpers/create-umbraco-tool.ts
var CreateUmbracoTool = (name, description, schema, handler) => () => ({
  name,
  description,
  schema,
  handler
});

// src/api/umbraco/management/umbracoManagementAPI.zod.ts
import {
  z as zod
} from "zod";
var FileLike = class {
  constructor(name, size, type) {
    this.name = name;
    this.size = size;
    this.type = type;
  }
};
var getCultureQueryTakeDefault = 100;
var getCultureQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getCultureQueryTakeDefault)
});
var getCultureResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "name": zod.string().min(1),
    "englishName": zod.string().min(1)
  }))
});
var postDataTypeBody = zod.object({
  "name": zod.string().min(1),
  "editorAlias": zod.string().min(1),
  "editorUiAlias": zod.string(),
  "values": zod.array(zod.object({
    "alias": zod.string(),
    "value": zod.any().nullish()
  })),
  "id": zod.string().uuid().nullish(),
  "parent": zod.object({
    "id": zod.string().uuid()
  }).nullish()
});
var getDataTypeByIdParams = zod.object({
  "id": zod.string().uuid()
});
var getDataTypeByIdResponse = zod.object({
  "name": zod.string().min(1),
  "editorAlias": zod.string().min(1),
  "editorUiAlias": zod.string(),
  "values": zod.array(zod.object({
    "alias": zod.string(),
    "value": zod.any().nullish()
  })),
  "id": zod.string().uuid(),
  "isDeletable": zod.boolean(),
  "canIgnoreStartNodes": zod.boolean()
});
var deleteDataTypeByIdParams = zod.object({
  "id": zod.string().uuid()
});
var putDataTypeByIdParams = zod.object({
  "id": zod.string().uuid()
});
var putDataTypeByIdBody = zod.object({
  "name": zod.string().min(1),
  "editorAlias": zod.string().min(1),
  "editorUiAlias": zod.string(),
  "values": zod.array(zod.object({
    "alias": zod.string(),
    "value": zod.any().nullish()
  }))
});
var postDataTypeByIdCopyParams = zod.object({
  "id": zod.string().uuid()
});
var postDataTypeByIdCopyBody = zod.object({
  "target": zod.object({
    "id": zod.string().uuid()
  }).nullish()
});
var getDataTypeByIdIsUsedParams = zod.object({
  "id": zod.string().uuid()
});
var getDataTypeByIdIsUsedResponse = zod.boolean();
var putDataTypeByIdMoveParams = zod.object({
  "id": zod.string().uuid()
});
var putDataTypeByIdMoveBody = zod.object({
  "target": zod.object({
    "id": zod.string().uuid()
  }).nullish()
});
var getDataTypeByIdReferencesParams = zod.object({
  "id": zod.string().uuid()
});
var getDataTypeByIdReferencesResponseItem = zod.object({
  "contentType": zod.object({
    "id": zod.string().uuid(),
    "type": zod.string().nullable(),
    "name": zod.string().nullable(),
    "icon": zod.string().nullable()
  }),
  "properties": zod.array(zod.object({
    "name": zod.string(),
    "alias": zod.string()
  }))
});
var getDataTypeByIdReferencesResponse = zod.array(getDataTypeByIdReferencesResponseItem);
var getDataTypeConfigurationResponse = zod.object({
  "canBeChanged": zod.enum(["True", "False", "FalseWithHelpText"]),
  "documentListViewId": zod.string().uuid(),
  "mediaListViewId": zod.string().uuid()
});
var postDataTypeFolderBody = zod.object({
  "name": zod.string().min(1),
  "id": zod.string().uuid().nullish(),
  "parent": zod.object({
    "id": zod.string().uuid()
  }).nullish()
});
var getDataTypeFolderByIdParams = zod.object({
  "id": zod.string().uuid()
});
var getDataTypeFolderByIdResponse = zod.object({
  "name": zod.string().min(1),
  "id": zod.string().uuid()
});
var deleteDataTypeFolderByIdParams = zod.object({
  "id": zod.string().uuid()
});
var putDataTypeFolderByIdParams = zod.object({
  "id": zod.string().uuid()
});
var putDataTypeFolderByIdBody = zod.object({
  "name": zod.string().min(1)
});
var getFilterDataTypeQueryTakeDefault = 100;
var getFilterDataTypeQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getFilterDataTypeQueryTakeDefault),
  "name": zod.string().optional(),
  "editorUiAlias": zod.string().optional(),
  "editorAlias": zod.string().optional()
});
var getFilterDataTypeResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "id": zod.string().uuid(),
    "name": zod.string(),
    "editorUiAlias": zod.string().nullish(),
    "editorAlias": zod.string(),
    "isDeletable": zod.boolean()
  }))
});
var getItemDataTypeQueryParams = zod.object({
  "id": zod.array(zod.string().uuid()).optional()
});
var getItemDataTypeResponseItem = zod.object({
  "id": zod.string().uuid(),
  "name": zod.string(),
  "editorUiAlias": zod.string().nullish(),
  "editorAlias": zod.string(),
  "isDeletable": zod.boolean()
});
var getItemDataTypeResponse = zod.array(getItemDataTypeResponseItem);
var getItemDataTypeSearchQueryTakeDefault = 100;
var getItemDataTypeSearchQueryParams = zod.object({
  "query": zod.string().optional(),
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getItemDataTypeSearchQueryTakeDefault)
});
var getItemDataTypeSearchResponse = zod.object({
  "items": zod.array(zod.object({
    "id": zod.string().uuid(),
    "name": zod.string(),
    "editorUiAlias": zod.string().nullish(),
    "editorAlias": zod.string(),
    "isDeletable": zod.boolean()
  })),
  "total": zod.number()
});
var getTreeDataTypeAncestorsQueryParams = zod.object({
  "descendantId": zod.string().uuid().optional()
});
var getTreeDataTypeAncestorsResponseItem = zod.object({
  "hasChildren": zod.boolean(),
  "id": zod.string().uuid(),
  "parent": zod.object({
    "id": zod.string().uuid()
  }).nullish(),
  "name": zod.string(),
  "isFolder": zod.boolean(),
  "editorUiAlias": zod.string().nullish(),
  "isDeletable": zod.boolean()
});
var getTreeDataTypeAncestorsResponse = zod.array(getTreeDataTypeAncestorsResponseItem);
var getTreeDataTypeChildrenQueryTakeDefault = 100;
var getTreeDataTypeChildrenQueryParams = zod.object({
  "parentId": zod.string().uuid().optional(),
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getTreeDataTypeChildrenQueryTakeDefault),
  "foldersOnly": zod.coerce.boolean().optional()
});
var getTreeDataTypeChildrenResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "hasChildren": zod.boolean(),
    "id": zod.string().uuid(),
    "parent": zod.object({
      "id": zod.string().uuid()
    }).nullish(),
    "name": zod.string(),
    "isFolder": zod.boolean(),
    "editorUiAlias": zod.string().nullish(),
    "isDeletable": zod.boolean()
  }))
});
var getTreeDataTypeRootQueryParams = zod.object({
  "skip": zod.coerce.number(),
  "take": zod.coerce.number().default(100),
  "foldersOnly": zod.coerce.boolean()
});
var getTreeDataTypeRootResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "hasChildren": zod.boolean(),
    "id": zod.string().uuid(),
    "parent": zod.object({
      "id": zod.string().uuid()
    }).nullish(),
    "name": zod.string(),
    "isFolder": zod.boolean(),
    "editorUiAlias": zod.string().nullish(),
    "isDeletable": zod.boolean()
  }))
});
var getDictionaryQueryTakeDefault = 100;
var getDictionaryQueryParams = zod.object({
  "filter": zod.string().optional(),
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getDictionaryQueryTakeDefault)
});
var getDictionaryResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "name": zod.string().nullish(),
    "id": zod.string().uuid(),
    "parent": zod.object({
      "id": zod.string().uuid()
    }).nullish(),
    "translatedIsoCodes": zod.array(zod.string())
  }))
});
var postDictionaryBody = zod.object({
  "name": zod.string().min(1),
  "translations": zod.array(zod.object({
    "isoCode": zod.string().min(1),
    "translation": zod.string().min(1)
  })),
  "id": zod.string().uuid().nullish(),
  "parent": zod.object({
    "id": zod.string().uuid()
  }).nullish()
});
var getDictionaryByIdParams = zod.object({
  "id": zod.string().uuid()
});
var getDictionaryByIdResponse = zod.object({
  "name": zod.string().min(1),
  "translations": zod.array(zod.object({
    "isoCode": zod.string().min(1),
    "translation": zod.string().min(1)
  })),
  "id": zod.string().uuid()
});
var deleteDictionaryByIdParams = zod.object({
  "id": zod.string().uuid()
});
var putDictionaryByIdParams = zod.object({
  "id": zod.string().uuid()
});
var putDictionaryByIdBody = zod.object({
  "name": zod.string().min(1),
  "translations": zod.array(zod.object({
    "isoCode": zod.string().min(1),
    "translation": zod.string().min(1)
  }))
});
var getDictionaryByIdExportParams = zod.object({
  "id": zod.string().uuid()
});
var getDictionaryByIdExportQueryParams = zod.object({
  "includeChildren": zod.coerce.boolean().optional()
});
var getDictionaryByIdExportResponse = zod.instanceof(FileLike);
var putDictionaryByIdMoveParams = zod.object({
  "id": zod.string().uuid()
});
var putDictionaryByIdMoveBody = zod.object({
  "target": zod.object({
    "id": zod.string().uuid()
  }).nullish()
});
var postDictionaryImportBody = zod.object({
  "temporaryFile": zod.object({
    "id": zod.string().uuid()
  }),
  "parent": zod.object({
    "id": zod.string().uuid()
  }).nullish()
});
var getItemDictionaryQueryParams = zod.object({
  "id": zod.array(zod.string().uuid()).optional()
});
var getItemDictionaryResponseItem = zod.object({
  "id": zod.string().uuid(),
  "name": zod.string()
});
var getItemDictionaryResponse = zod.array(getItemDictionaryResponseItem);
var getTreeDictionaryAncestorsQueryParams = zod.object({
  "descendantId": zod.string().uuid().optional()
});
var getTreeDictionaryAncestorsResponseItem = zod.object({
  "hasChildren": zod.boolean(),
  "id": zod.string().uuid(),
  "parent": zod.object({
    "id": zod.string().uuid()
  }).nullish(),
  "name": zod.string()
});
var getTreeDictionaryAncestorsResponse = zod.array(getTreeDictionaryAncestorsResponseItem);
var getTreeDictionaryChildrenQueryTakeDefault = 100;
var getTreeDictionaryChildrenQueryParams = zod.object({
  "parentId": zod.string().uuid().optional(),
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getTreeDictionaryChildrenQueryTakeDefault)
});
var getTreeDictionaryChildrenResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "hasChildren": zod.boolean(),
    "id": zod.string().uuid(),
    "parent": zod.object({
      "id": zod.string().uuid()
    }).nullish(),
    "name": zod.string()
  }))
});
var getTreeDictionaryRootQueryTakeDefault = 100;
var getTreeDictionaryRootQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getTreeDictionaryRootQueryTakeDefault)
});
var getTreeDictionaryRootResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "hasChildren": zod.boolean(),
    "id": zod.string().uuid(),
    "parent": zod.object({
      "id": zod.string().uuid()
    }).nullish(),
    "name": zod.string()
  }))
});
var postDocumentBlueprintBody = zod.object({
  "values": zod.array(zod.object({
    "culture": zod.string().nullish(),
    "segment": zod.string().nullish(),
    "alias": zod.string().min(1),
    "value": zod.any().nullish()
  })),
  "variants": zod.array(zod.object({
    "culture": zod.string().nullish(),
    "segment": zod.string().nullish(),
    "name": zod.string().min(1)
  })),
  "id": zod.string().uuid().nullish(),
  "parent": zod.object({
    "id": zod.string().uuid()
  }).nullish(),
  "documentType": zod.object({
    "id": zod.string().uuid()
  })
});
var getDocumentBlueprintByIdParams = zod.object({
  "id": zod.string().uuid()
});
var getDocumentBlueprintByIdResponse = zod.object({
  "values": zod.array(zod.object({
    "culture": zod.string().nullish(),
    "segment": zod.string().nullish(),
    "alias": zod.string().min(1),
    "value": zod.any().nullish(),
    "editorAlias": zod.string().min(1)
  })),
  "variants": zod.array(zod.object({
    "culture": zod.string().nullish(),
    "segment": zod.string().nullish(),
    "name": zod.string().min(1),
    "createDate": zod.string().datetime({ "local": true }),
    "updateDate": zod.string().datetime({ "local": true }),
    "state": zod.enum(["NotCreated", "Draft", "Published", "PublishedPendingChanges"]),
    "publishDate": zod.string().datetime({ "local": true }).nullish(),
    "scheduledPublishDate": zod.string().datetime({ "local": true }).nullish(),
    "scheduledUnpublishDate": zod.string().datetime({ "local": true }).nullish()
  })),
  "id": zod.string().uuid(),
  "documentType": zod.object({
    "id": zod.string().uuid(),
    "icon": zod.string(),
    "collection": zod.object({
      "id": zod.string().uuid()
    }).nullish()
  })
});
var deleteDocumentBlueprintByIdParams = zod.object({
  "id": zod.string().uuid()
});
var putDocumentBlueprintByIdParams = zod.object({
  "id": zod.string().uuid()
});
var putDocumentBlueprintByIdBody = zod.object({
  "values": zod.array(zod.object({
    "culture": zod.string().nullish(),
    "segment": zod.string().nullish(),
    "alias": zod.string().min(1),
    "value": zod.any().nullish()
  })),
  "variants": zod.array(zod.object({
    "culture": zod.string().nullish(),
    "segment": zod.string().nullish(),
    "name": zod.string().min(1)
  }))
});
var putDocumentBlueprintByIdMoveParams = zod.object({
  "id": zod.string().uuid()
});
var putDocumentBlueprintByIdMoveBody = zod.object({
  "target": zod.object({
    "id": zod.string().uuid()
  }).nullish()
});
var postDocumentBlueprintFolderBody = zod.object({
  "name": zod.string().min(1),
  "id": zod.string().uuid().nullish(),
  "parent": zod.object({
    "id": zod.string().uuid()
  }).nullish()
});
var getDocumentBlueprintFolderByIdParams = zod.object({
  "id": zod.string().uuid()
});
var getDocumentBlueprintFolderByIdResponse = zod.object({
  "name": zod.string().min(1),
  "id": zod.string().uuid()
});
var deleteDocumentBlueprintFolderByIdParams = zod.object({
  "id": zod.string().uuid()
});
var putDocumentBlueprintFolderByIdParams = zod.object({
  "id": zod.string().uuid()
});
var putDocumentBlueprintFolderByIdBody = zod.object({
  "name": zod.string().min(1)
});
var postDocumentBlueprintFromDocumentBody = zod.object({
  "document": zod.object({
    "id": zod.string().uuid()
  }),
  "id": zod.string().uuid().nullish(),
  "name": zod.string(),
  "parent": zod.object({
    "id": zod.string().uuid()
  }).nullish()
});
var getItemDocumentBlueprintQueryParams = zod.object({
  "id": zod.array(zod.string().uuid()).optional()
});
var getItemDocumentBlueprintResponseItem = zod.object({
  "id": zod.string().uuid(),
  "name": zod.string(),
  "documentType": zod.object({
    "id": zod.string().uuid(),
    "icon": zod.string(),
    "collection": zod.object({
      "id": zod.string().uuid()
    }).nullish()
  })
});
var getItemDocumentBlueprintResponse = zod.array(getItemDocumentBlueprintResponseItem);
var getTreeDocumentBlueprintAncestorsQueryParams = zod.object({
  "descendantId": zod.string().uuid().optional()
});
var getTreeDocumentBlueprintAncestorsResponseItem = zod.object({
  "hasChildren": zod.boolean(),
  "id": zod.string().uuid(),
  "parent": zod.object({
    "id": zod.string().uuid()
  }).nullish(),
  "name": zod.string(),
  "isFolder": zod.boolean(),
  "documentType": zod.object({
    "id": zod.string().uuid(),
    "icon": zod.string(),
    "collection": zod.object({
      "id": zod.string().uuid()
    }).nullish()
  }).nullish()
});
var getTreeDocumentBlueprintAncestorsResponse = zod.array(getTreeDocumentBlueprintAncestorsResponseItem);
var getTreeDocumentBlueprintChildrenQueryTakeDefault = 100;
var getTreeDocumentBlueprintChildrenQueryParams = zod.object({
  "parentId": zod.string().uuid().optional(),
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getTreeDocumentBlueprintChildrenQueryTakeDefault),
  "foldersOnly": zod.coerce.boolean().optional()
});
var getTreeDocumentBlueprintChildrenResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "hasChildren": zod.boolean(),
    "id": zod.string().uuid(),
    "parent": zod.object({
      "id": zod.string().uuid()
    }).nullish(),
    "name": zod.string(),
    "isFolder": zod.boolean(),
    "documentType": zod.object({
      "id": zod.string().uuid(),
      "icon": zod.string(),
      "collection": zod.object({
        "id": zod.string().uuid()
      }).nullish()
    }).nullish()
  }))
});
var getTreeDocumentBlueprintRootQueryTakeDefault = 100;
var getTreeDocumentBlueprintRootQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getTreeDocumentBlueprintRootQueryTakeDefault),
  "foldersOnly": zod.coerce.boolean().optional()
});
var getTreeDocumentBlueprintRootResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "hasChildren": zod.boolean(),
    "id": zod.string().uuid(),
    "parent": zod.object({
      "id": zod.string().uuid()
    }).nullish(),
    "name": zod.string(),
    "isFolder": zod.boolean(),
    "documentType": zod.object({
      "id": zod.string().uuid(),
      "icon": zod.string(),
      "collection": zod.object({
        "id": zod.string().uuid()
      }).nullish()
    }).nullish()
  }))
});
var postDocumentTypeBody = zod.object({
  "alias": zod.string().min(1),
  "name": zod.string().min(1),
  "description": zod.string().nullish(),
  "icon": zod.string().min(1),
  "allowedAsRoot": zod.boolean(),
  "variesByCulture": zod.boolean(),
  "variesBySegment": zod.boolean(),
  "collection": zod.object({
    "id": zod.string().uuid()
  }).nullish(),
  "isElement": zod.boolean(),
  "properties": zod.array(zod.object({
    "id": zod.string().uuid(),
    "container": zod.object({
      "id": zod.string().uuid()
    }).nullish(),
    "sortOrder": zod.number(),
    "alias": zod.string().min(1),
    "name": zod.string().min(1),
    "description": zod.string().nullish(),
    "dataType": zod.object({
      "id": zod.string().uuid()
    }),
    "variesByCulture": zod.boolean(),
    "variesBySegment": zod.boolean(),
    "validation": zod.object({
      "mandatory": zod.boolean(),
      "mandatoryMessage": zod.string().nullish(),
      "regEx": zod.string().nullish(),
      "regExMessage": zod.string().nullish()
    }),
    "appearance": zod.object({
      "labelOnTop": zod.boolean()
    })
  })),
  "containers": zod.array(zod.object({
    "id": zod.string().uuid(),
    "parent": zod.object({
      "id": zod.string().uuid()
    }).nullish(),
    "name": zod.string().nullish(),
    "type": zod.string().min(1),
    "sortOrder": zod.number()
  })),
  "id": zod.string().uuid().nullish(),
  "parent": zod.object({
    "id": zod.string().uuid()
  }).nullish(),
  "allowedTemplates": zod.array(zod.object({
    "id": zod.string().uuid()
  })),
  "defaultTemplate": zod.object({
    "id": zod.string().uuid()
  }).nullish(),
  "cleanup": zod.object({
    "preventCleanup": zod.boolean(),
    "keepAllVersionsNewerThanDays": zod.number().nullish(),
    "keepLatestVersionPerDayForDays": zod.number().nullish()
  }),
  "allowedDocumentTypes": zod.array(zod.object({
    "documentType": zod.object({
      "id": zod.string().uuid()
    }),
    "sortOrder": zod.number()
  })),
  "compositions": zod.array(zod.object({
    "documentType": zod.object({
      "id": zod.string().uuid()
    }),
    "compositionType": zod.enum(["Composition", "Inheritance"])
  }))
});
var getDocumentTypeByIdParams = zod.object({
  "id": zod.string().uuid()
});
var getDocumentTypeByIdResponse = zod.object({
  "alias": zod.string().min(1),
  "name": zod.string().min(1),
  "description": zod.string().nullish(),
  "icon": zod.string().min(1),
  "allowedAsRoot": zod.boolean(),
  "variesByCulture": zod.boolean(),
  "variesBySegment": zod.boolean(),
  "collection": zod.object({
    "id": zod.string().uuid()
  }).nullish(),
  "isElement": zod.boolean(),
  "properties": zod.array(zod.object({
    "id": zod.string().uuid(),
    "container": zod.object({
      "id": zod.string().uuid()
    }).nullish(),
    "sortOrder": zod.number(),
    "alias": zod.string().min(1),
    "name": zod.string().min(1),
    "description": zod.string().nullish(),
    "dataType": zod.object({
      "id": zod.string().uuid()
    }),
    "variesByCulture": zod.boolean(),
    "variesBySegment": zod.boolean(),
    "validation": zod.object({
      "mandatory": zod.boolean(),
      "mandatoryMessage": zod.string().nullish(),
      "regEx": zod.string().nullish(),
      "regExMessage": zod.string().nullish()
    }),
    "appearance": zod.object({
      "labelOnTop": zod.boolean()
    })
  })),
  "containers": zod.array(zod.object({
    "id": zod.string().uuid(),
    "parent": zod.object({
      "id": zod.string().uuid()
    }).nullish(),
    "name": zod.string().nullish(),
    "type": zod.string().min(1),
    "sortOrder": zod.number()
  })),
  "id": zod.string().uuid(),
  "allowedTemplates": zod.array(zod.object({
    "id": zod.string().uuid()
  })),
  "defaultTemplate": zod.object({
    "id": zod.string().uuid()
  }).nullish(),
  "cleanup": zod.object({
    "preventCleanup": zod.boolean(),
    "keepAllVersionsNewerThanDays": zod.number().nullish(),
    "keepLatestVersionPerDayForDays": zod.number().nullish()
  }),
  "allowedDocumentTypes": zod.array(zod.object({
    "documentType": zod.object({
      "id": zod.string().uuid()
    }),
    "sortOrder": zod.number()
  })),
  "compositions": zod.array(zod.object({
    "documentType": zod.object({
      "id": zod.string().uuid()
    }),
    "compositionType": zod.enum(["Composition", "Inheritance"])
  }))
});
var deleteDocumentTypeByIdParams = zod.object({
  "id": zod.string().uuid()
});
var putDocumentTypeByIdParams = zod.object({
  "id": zod.string().uuid()
});
var putDocumentTypeByIdBody = zod.object({
  "alias": zod.string().min(1),
  "name": zod.string().min(1),
  "description": zod.string().nullish(),
  "icon": zod.string().min(1),
  "allowedAsRoot": zod.boolean(),
  "variesByCulture": zod.boolean(),
  "variesBySegment": zod.boolean(),
  "collection": zod.object({
    "id": zod.string().uuid()
  }).nullish(),
  "isElement": zod.boolean(),
  "properties": zod.array(zod.object({
    "id": zod.string().uuid(),
    "container": zod.object({
      "id": zod.string().uuid()
    }).nullish(),
    "sortOrder": zod.number(),
    "alias": zod.string().min(1),
    "name": zod.string().min(1),
    "description": zod.string().nullish(),
    "dataType": zod.object({
      "id": zod.string().uuid()
    }),
    "variesByCulture": zod.boolean(),
    "variesBySegment": zod.boolean(),
    "validation": zod.object({
      "mandatory": zod.boolean(),
      "mandatoryMessage": zod.string().nullish(),
      "regEx": zod.string().nullish(),
      "regExMessage": zod.string().nullish()
    }),
    "appearance": zod.object({
      "labelOnTop": zod.boolean()
    })
  })),
  "containers": zod.array(zod.object({
    "id": zod.string().uuid(),
    "parent": zod.object({
      "id": zod.string().uuid()
    }).nullish(),
    "name": zod.string().nullish(),
    "type": zod.string().min(1),
    "sortOrder": zod.number()
  })),
  "allowedTemplates": zod.array(zod.object({
    "id": zod.string().uuid()
  })),
  "defaultTemplate": zod.object({
    "id": zod.string().uuid()
  }).nullish(),
  "cleanup": zod.object({
    "preventCleanup": zod.boolean(),
    "keepAllVersionsNewerThanDays": zod.number().nullish(),
    "keepLatestVersionPerDayForDays": zod.number().nullish()
  }),
  "allowedDocumentTypes": zod.array(zod.object({
    "documentType": zod.object({
      "id": zod.string().uuid()
    }),
    "sortOrder": zod.number()
  })),
  "compositions": zod.array(zod.object({
    "documentType": zod.object({
      "id": zod.string().uuid()
    }),
    "compositionType": zod.enum(["Composition", "Inheritance"])
  }))
});
var getDocumentTypeByIdAllowedChildrenParams = zod.object({
  "id": zod.string().uuid()
});
var getDocumentTypeByIdAllowedChildrenQueryTakeDefault = 100;
var getDocumentTypeByIdAllowedChildrenQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getDocumentTypeByIdAllowedChildrenQueryTakeDefault)
});
var getDocumentTypeByIdAllowedChildrenResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "id": zod.string().uuid(),
    "name": zod.string(),
    "description": zod.string().nullish(),
    "icon": zod.string().nullish()
  }))
});
var getDocumentTypeByIdBlueprintParams = zod.object({
  "id": zod.string().uuid()
});
var getDocumentTypeByIdBlueprintQueryTakeDefault = 100;
var getDocumentTypeByIdBlueprintQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getDocumentTypeByIdBlueprintQueryTakeDefault)
});
var getDocumentTypeByIdBlueprintResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "id": zod.string().uuid(),
    "name": zod.string()
  }))
});
var getDocumentTypeByIdCompositionReferencesParams = zod.object({
  "id": zod.string().uuid()
});
var getDocumentTypeByIdCompositionReferencesResponseItem = zod.object({
  "id": zod.string().uuid(),
  "name": zod.string(),
  "icon": zod.string()
});
var getDocumentTypeByIdCompositionReferencesResponse = zod.array(getDocumentTypeByIdCompositionReferencesResponseItem);
var postDocumentTypeByIdCopyParams = zod.object({
  "id": zod.string().uuid()
});
var postDocumentTypeByIdCopyBody = zod.object({
  "target": zod.object({
    "id": zod.string().uuid()
  }).nullish()
});
var getDocumentTypeByIdExportParams = zod.object({
  "id": zod.string().uuid()
});
var getDocumentTypeByIdExportResponse = zod.instanceof(FileLike);
var putDocumentTypeByIdImportParams = zod.object({
  "id": zod.string().uuid()
});
var putDocumentTypeByIdImportBody = zod.object({
  "file": zod.object({
    "id": zod.string().uuid()
  })
});
var putDocumentTypeByIdMoveParams = zod.object({
  "id": zod.string().uuid()
});
var putDocumentTypeByIdMoveBody = zod.object({
  "target": zod.object({
    "id": zod.string().uuid()
  }).nullish()
});
var getDocumentTypeAllowedAtRootQueryTakeDefault = 100;
var getDocumentTypeAllowedAtRootQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getDocumentTypeAllowedAtRootQueryTakeDefault)
});
var getDocumentTypeAllowedAtRootResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "id": zod.string().uuid(),
    "name": zod.string(),
    "description": zod.string().nullish(),
    "icon": zod.string().nullish()
  }))
});
var postDocumentTypeAvailableCompositionsBody = zod.object({
  "id": zod.string().uuid().nullish(),
  "currentPropertyAliases": zod.array(zod.string()),
  "currentCompositeIds": zod.array(zod.string().uuid()),
  "isElement": zod.boolean()
});
var postDocumentTypeAvailableCompositionsResponseItem = zod.object({
  "id": zod.string().uuid(),
  "name": zod.string(),
  "icon": zod.string(),
  "folderPath": zod.array(zod.string()),
  "isCompatible": zod.boolean()
});
var postDocumentTypeAvailableCompositionsResponse = zod.array(postDocumentTypeAvailableCompositionsResponseItem);
var getDocumentTypeConfigurationResponse = zod.object({
  "dataTypesCanBeChanged": zod.enum(["True", "False", "FalseWithHelpText"]),
  "disableTemplates": zod.boolean(),
  "useSegments": zod.boolean(),
  "reservedFieldNames": zod.array(zod.string())
});
var postDocumentTypeFolderBody = zod.object({
  "name": zod.string().min(1),
  "id": zod.string().uuid().nullish(),
  "parent": zod.object({
    "id": zod.string().uuid()
  }).nullish()
});
var getDocumentTypeFolderByIdParams = zod.object({
  "id": zod.string().uuid()
});
var getDocumentTypeFolderByIdResponse = zod.object({
  "name": zod.string().min(1),
  "id": zod.string().uuid()
});
var deleteDocumentTypeFolderByIdParams = zod.object({
  "id": zod.string().uuid()
});
var putDocumentTypeFolderByIdParams = zod.object({
  "id": zod.string().uuid()
});
var putDocumentTypeFolderByIdBody = zod.object({
  "name": zod.string().min(1)
});
var postDocumentTypeImportBody = zod.object({
  "file": zod.object({
    "id": zod.string().uuid()
  })
});
var getItemDocumentTypeQueryParams = zod.object({
  "id": zod.array(zod.string().uuid()).optional()
});
var getItemDocumentTypeResponseItem = zod.object({
  "id": zod.string().uuid(),
  "name": zod.string(),
  "isElement": zod.boolean(),
  "icon": zod.string().nullish(),
  "description": zod.string().nullish()
});
var getItemDocumentTypeResponse = zod.array(getItemDocumentTypeResponseItem);
var getItemDocumentTypeSearchQueryTakeDefault = 100;
var getItemDocumentTypeSearchQueryParams = zod.object({
  "query": zod.string().optional(),
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getItemDocumentTypeSearchQueryTakeDefault)
});
var getItemDocumentTypeSearchResponse = zod.object({
  "items": zod.array(zod.object({
    "id": zod.string().uuid(),
    "name": zod.string(),
    "isElement": zod.boolean(),
    "icon": zod.string().nullish(),
    "description": zod.string().nullish()
  })),
  "total": zod.number()
});
var getTreeDocumentTypeAncestorsQueryParams = zod.object({
  "descendantId": zod.string().uuid().optional()
});
var getTreeDocumentTypeAncestorsResponseItem = zod.object({
  "hasChildren": zod.boolean(),
  "id": zod.string().uuid(),
  "parent": zod.object({
    "id": zod.string().uuid()
  }).nullish(),
  "name": zod.string(),
  "isFolder": zod.boolean(),
  "isElement": zod.boolean(),
  "icon": zod.string()
});
var getTreeDocumentTypeAncestorsResponse = zod.array(getTreeDocumentTypeAncestorsResponseItem);
var getTreeDocumentTypeChildrenQueryTakeDefault = 100;
var getTreeDocumentTypeChildrenQueryParams = zod.object({
  "parentId": zod.string().uuid().optional(),
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getTreeDocumentTypeChildrenQueryTakeDefault),
  "foldersOnly": zod.coerce.boolean().optional()
});
var getTreeDocumentTypeChildrenResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "hasChildren": zod.boolean(),
    "id": zod.string().uuid(),
    "parent": zod.object({
      "id": zod.string().uuid()
    }).nullish(),
    "name": zod.string(),
    "isFolder": zod.boolean(),
    "isElement": zod.boolean(),
    "icon": zod.string()
  }))
});
var getTreeDocumentTypeRootQueryTakeDefault = 100;
var getTreeDocumentTypeRootQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getTreeDocumentTypeRootQueryTakeDefault),
  "foldersOnly": zod.coerce.boolean().optional()
});
var getTreeDocumentTypeRootResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "hasChildren": zod.boolean(),
    "id": zod.string().uuid(),
    "parent": zod.object({
      "id": zod.string().uuid()
    }).nullish(),
    "name": zod.string(),
    "isFolder": zod.boolean(),
    "isElement": zod.boolean(),
    "icon": zod.string()
  }))
});
var getDocumentVersionQueryTakeDefault = 100;
var getDocumentVersionQueryParams = zod.object({
  "documentId": zod.string().uuid(),
  "culture": zod.string().optional(),
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getDocumentVersionQueryTakeDefault)
});
var getDocumentVersionResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "id": zod.string().uuid(),
    "document": zod.object({
      "id": zod.string().uuid()
    }),
    "documentType": zod.object({
      "id": zod.string().uuid()
    }),
    "user": zod.object({
      "id": zod.string().uuid()
    }),
    "versionDate": zod.string().datetime({ "local": true }),
    "isCurrentPublishedVersion": zod.boolean(),
    "isCurrentDraftVersion": zod.boolean(),
    "preventCleanup": zod.boolean()
  }))
});
var getDocumentVersionByIdParams = zod.object({
  "id": zod.string().uuid()
});
var getDocumentVersionByIdResponse = zod.object({
  "values": zod.array(zod.object({
    "culture": zod.string().nullish(),
    "segment": zod.string().nullish(),
    "alias": zod.string().min(1),
    "value": zod.any().nullish(),
    "editorAlias": zod.string().min(1)
  })),
  "variants": zod.array(zod.object({
    "culture": zod.string().nullish(),
    "segment": zod.string().nullish(),
    "name": zod.string().min(1),
    "createDate": zod.string().datetime({ "local": true }),
    "updateDate": zod.string().datetime({ "local": true }),
    "state": zod.enum(["NotCreated", "Draft", "Published", "PublishedPendingChanges"]),
    "publishDate": zod.string().datetime({ "local": true }).nullish(),
    "scheduledPublishDate": zod.string().datetime({ "local": true }).nullish(),
    "scheduledUnpublishDate": zod.string().datetime({ "local": true }).nullish()
  })),
  "id": zod.string().uuid(),
  "documentType": zod.object({
    "id": zod.string().uuid(),
    "icon": zod.string(),
    "collection": zod.object({
      "id": zod.string().uuid()
    }).nullish()
  }),
  "document": zod.object({
    "id": zod.string().uuid()
  }).nullish()
});
var putDocumentVersionByIdPreventCleanupParams = zod.object({
  "id": zod.string().uuid()
});
var putDocumentVersionByIdPreventCleanupQueryParams = zod.object({
  "preventCleanup": zod.coerce.boolean().optional()
});
var postDocumentVersionByIdRollbackParams = zod.object({
  "id": zod.string().uuid()
});
var postDocumentVersionByIdRollbackQueryParams = zod.object({
  "culture": zod.string().optional()
});
var getCollectionDocumentByIdParams = zod.object({
  "id": zod.string().uuid()
});
var getCollectionDocumentByIdQueryOrderByDefault = "updateDate";
var getCollectionDocumentByIdQueryTakeDefault = 100;
var getCollectionDocumentByIdQueryParams = zod.object({
  "dataTypeId": zod.string().uuid().optional(),
  "orderBy": zod.string().default(getCollectionDocumentByIdQueryOrderByDefault),
  "orderCulture": zod.string().optional(),
  "orderDirection": zod.enum(["Ascending", "Descending"]).optional(),
  "filter": zod.string().optional(),
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getCollectionDocumentByIdQueryTakeDefault)
});
var getCollectionDocumentByIdResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "values": zod.array(zod.object({
      "culture": zod.string().nullish(),
      "segment": zod.string().nullish(),
      "alias": zod.string().min(1),
      "value": zod.any().nullish(),
      "editorAlias": zod.string().min(1)
    })),
    "variants": zod.array(zod.object({
      "culture": zod.string().nullish(),
      "segment": zod.string().nullish(),
      "name": zod.string().min(1),
      "createDate": zod.string().datetime({ "local": true }),
      "updateDate": zod.string().datetime({ "local": true }),
      "state": zod.enum(["NotCreated", "Draft", "Published", "PublishedPendingChanges"]),
      "publishDate": zod.string().datetime({ "local": true }).nullish(),
      "scheduledPublishDate": zod.string().datetime({ "local": true }).nullish(),
      "scheduledUnpublishDate": zod.string().datetime({ "local": true }).nullish()
    })),
    "id": zod.string().uuid(),
    "creator": zod.string().nullish(),
    "sortOrder": zod.number(),
    "documentType": zod.object({
      "id": zod.string().uuid(),
      "alias": zod.string(),
      "icon": zod.string()
    }),
    "isTrashed": zod.boolean(),
    "isProtected": zod.boolean(),
    "updater": zod.string().nullish()
  }))
});
var postDocumentBody = zod.object({
  "values": zod.array(zod.object({
    "culture": zod.string().nullish(),
    "segment": zod.string().nullish(),
    "alias": zod.string().min(1),
    "value": zod.any().nullish()
  })),
  "variants": zod.array(zod.object({
    "culture": zod.string().nullish(),
    "segment": zod.string().nullish(),
    "name": zod.string().min(1)
  })),
  "id": zod.string().uuid().nullish(),
  "parent": zod.object({
    "id": zod.string().uuid()
  }).nullish(),
  "documentType": zod.object({
    "id": zod.string().uuid()
  }),
  "template": zod.object({
    "id": zod.string().uuid()
  }).nullable()
});
var getDocumentByIdParams = zod.object({
  "id": zod.string().uuid()
});
var getDocumentByIdResponse = zod.object({
  "values": zod.array(zod.object({
    "culture": zod.string().nullish(),
    "segment": zod.string().nullish(),
    "alias": zod.string().min(1),
    "value": zod.any().nullish(),
    "editorAlias": zod.string().min(1)
  })),
  "variants": zod.array(zod.object({
    "culture": zod.string().nullish(),
    "segment": zod.string().nullish(),
    "name": zod.string().min(1),
    "createDate": zod.string().datetime({ "local": true }),
    "updateDate": zod.string().datetime({ "local": true }),
    "state": zod.enum(["NotCreated", "Draft", "Published", "PublishedPendingChanges"]),
    "publishDate": zod.string().datetime({ "local": true }).nullish(),
    "scheduledPublishDate": zod.string().datetime({ "local": true }).nullish(),
    "scheduledUnpublishDate": zod.string().datetime({ "local": true }).nullish()
  })),
  "id": zod.string().uuid(),
  "documentType": zod.object({
    "id": zod.string().uuid(),
    "icon": zod.string(),
    "collection": zod.object({
      "id": zod.string().uuid()
    }).nullish()
  }),
  "urls": zod.array(zod.object({
    "culture": zod.string().nullable(),
    "url": zod.string()
  })),
  "template": zod.object({
    "id": zod.string().uuid()
  }).nullish(),
  "isTrashed": zod.boolean()
});
var deleteDocumentByIdParams = zod.object({
  "id": zod.string().uuid()
});
var putDocumentByIdParams = zod.object({
  "id": zod.string().uuid()
});
var putDocumentByIdBody = zod.object({
  "values": zod.array(zod.object({
    "culture": zod.string().nullish(),
    "segment": zod.string().nullish(),
    "alias": zod.string().min(1),
    "value": zod.any().nullish()
  })),
  "variants": zod.array(zod.object({
    "culture": zod.string().nullish(),
    "segment": zod.string().nullish(),
    "name": zod.string().min(1)
  })),
  "template": zod.object({
    "id": zod.string().uuid()
  }).nullish()
});
var getDocumentByIdAuditLogParams = zod.object({
  "id": zod.string().uuid()
});
var getDocumentByIdAuditLogQueryTakeDefault = 100;
var getDocumentByIdAuditLogQueryParams = zod.object({
  "orderDirection": zod.enum(["Ascending", "Descending"]).optional(),
  "sinceDate": zod.string().datetime({ "local": true }).optional(),
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getDocumentByIdAuditLogQueryTakeDefault)
});
var getDocumentByIdAuditLogResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "user": zod.object({
      "id": zod.string().uuid()
    }),
    "timestamp": zod.string().datetime({ "local": true }),
    "logType": zod.enum(["New", "Save", "SaveVariant", "Open", "Delete", "Publish", "PublishVariant", "SendToPublish", "SendToPublishVariant", "Unpublish", "UnpublishVariant", "Move", "Copy", "AssignDomain", "PublicAccess", "Sort", "Notify", "System", "RollBack", "PackagerInstall", "PackagerUninstall", "Custom", "ContentVersionPreventCleanup", "ContentVersionEnableCleanup"]),
    "comment": zod.string().nullish(),
    "parameters": zod.string().nullish()
  }))
});
var postDocumentByIdCopyParams = zod.object({
  "id": zod.string().uuid()
});
var postDocumentByIdCopyBody = zod.object({
  "target": zod.object({
    "id": zod.string().uuid()
  }).nullish(),
  "relateToOriginal": zod.boolean(),
  "includeDescendants": zod.boolean()
});
var getDocumentByIdDomainsParams = zod.object({
  "id": zod.string().uuid()
});
var getDocumentByIdDomainsResponse = zod.object({
  "defaultIsoCode": zod.string().nullish(),
  "domains": zod.array(zod.object({
    "domainName": zod.string(),
    "isoCode": zod.string()
  }))
});
var putDocumentByIdDomainsParams = zod.object({
  "id": zod.string().uuid()
});
var putDocumentByIdDomainsBody = zod.object({
  "defaultIsoCode": zod.string().nullish(),
  "domains": zod.array(zod.object({
    "domainName": zod.string(),
    "isoCode": zod.string()
  }))
});
var putDocumentByIdMoveParams = zod.object({
  "id": zod.string().uuid()
});
var putDocumentByIdMoveBody = zod.object({
  "target": zod.object({
    "id": zod.string().uuid()
  }).nullish()
});
var putDocumentByIdMoveToRecycleBinParams = zod.object({
  "id": zod.string().uuid()
});
var getDocumentByIdNotificationsParams = zod.object({
  "id": zod.string().uuid()
});
var getDocumentByIdNotificationsResponseItem = zod.object({
  "actionId": zod.string(),
  "alias": zod.string(),
  "subscribed": zod.boolean()
});
var getDocumentByIdNotificationsResponse = zod.array(getDocumentByIdNotificationsResponseItem);
var putDocumentByIdNotificationsParams = zod.object({
  "id": zod.string().uuid()
});
var putDocumentByIdNotificationsBody = zod.object({
  "subscribedActionIds": zod.array(zod.string())
});
var postDocumentByIdPublicAccessParams = zod.object({
  "id": zod.string().uuid()
});
var postDocumentByIdPublicAccessBody = zod.object({
  "loginDocument": zod.object({
    "id": zod.string().uuid()
  }),
  "errorDocument": zod.object({
    "id": zod.string().uuid()
  }),
  "memberUserNames": zod.array(zod.string()),
  "memberGroupNames": zod.array(zod.string())
});
var deleteDocumentByIdPublicAccessParams = zod.object({
  "id": zod.string().uuid()
});
var getDocumentByIdPublicAccessParams = zod.object({
  "id": zod.string().uuid()
});
var getDocumentByIdPublicAccessResponse = zod.object({
  "loginDocument": zod.object({
    "id": zod.string().uuid()
  }),
  "errorDocument": zod.object({
    "id": zod.string().uuid()
  }),
  "members": zod.array(zod.object({
    "id": zod.string().uuid(),
    "memberType": zod.object({
      "id": zod.string().uuid(),
      "icon": zod.string(),
      "collection": zod.object({
        "id": zod.string().uuid()
      }).nullish()
    }),
    "variants": zod.array(zod.object({
      "name": zod.string(),
      "culture": zod.string().nullish()
    })),
    "kind": zod.enum(["Default", "Api"])
  })),
  "groups": zod.array(zod.object({
    "id": zod.string().uuid(),
    "name": zod.string()
  }))
});
var putDocumentByIdPublicAccessParams = zod.object({
  "id": zod.string().uuid()
});
var putDocumentByIdPublicAccessBody = zod.object({
  "loginDocument": zod.object({
    "id": zod.string().uuid()
  }),
  "errorDocument": zod.object({
    "id": zod.string().uuid()
  }),
  "memberUserNames": zod.array(zod.string()),
  "memberGroupNames": zod.array(zod.string())
});
var putDocumentByIdPublishParams = zod.object({
  "id": zod.string().uuid()
});
var putDocumentByIdPublishBody = zod.object({
  "publishSchedules": zod.array(zod.object({
    "culture": zod.string().nullish(),
    "schedule": zod.object({
      "publishTime": zod.string().datetime({ "local": true }).nullish(),
      "unpublishTime": zod.string().datetime({ "local": true }).nullish()
    }).nullish()
  }))
});
var putDocumentByIdPublishWithDescendantsParams = zod.object({
  "id": zod.string().uuid()
});
var putDocumentByIdPublishWithDescendantsBody = zod.object({
  "includeUnpublishedDescendants": zod.boolean(),
  "cultures": zod.array(zod.string())
});
var getDocumentByIdPublishedParams = zod.object({
  "id": zod.string().uuid()
});
var getDocumentByIdPublishedResponse = zod.object({
  "values": zod.array(zod.object({
    "culture": zod.string().nullish(),
    "segment": zod.string().nullish(),
    "alias": zod.string().min(1),
    "value": zod.any().nullish(),
    "editorAlias": zod.string().min(1)
  })),
  "variants": zod.array(zod.object({
    "culture": zod.string().nullish(),
    "segment": zod.string().nullish(),
    "name": zod.string().min(1),
    "createDate": zod.string().datetime({ "local": true }),
    "updateDate": zod.string().datetime({ "local": true }),
    "state": zod.enum(["NotCreated", "Draft", "Published", "PublishedPendingChanges"]),
    "publishDate": zod.string().datetime({ "local": true }).nullish(),
    "scheduledPublishDate": zod.string().datetime({ "local": true }).nullish(),
    "scheduledUnpublishDate": zod.string().datetime({ "local": true }).nullish()
  })),
  "id": zod.string().uuid(),
  "documentType": zod.object({
    "id": zod.string().uuid(),
    "icon": zod.string(),
    "collection": zod.object({
      "id": zod.string().uuid()
    }).nullish()
  }),
  "urls": zod.array(zod.object({
    "culture": zod.string().nullable(),
    "url": zod.string()
  })),
  "template": zod.object({
    "id": zod.string().uuid()
  }).nullish(),
  "isTrashed": zod.boolean()
});
var getDocumentByIdReferencedByParams = zod.object({
  "id": zod.string().uuid()
});
var getDocumentByIdReferencedByQueryTakeDefault = 20;
var getDocumentByIdReferencedByQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getDocumentByIdReferencedByQueryTakeDefault)
});
var getDocumentByIdReferencedByResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "$type": zod.enum(["DefaultReferenceResponseModel"]),
    "id": zod.string().uuid(),
    "name": zod.string().nullish(),
    "type": zod.string().nullish(),
    "icon": zod.string().nullish()
  }).or(zod.object({
    "$type": zod.enum(["DocumentReferenceResponseModel"]),
    "id": zod.string().uuid(),
    "name": zod.string().nullish(),
    "published": zod.boolean().nullish(),
    "documentType": zod.object({
      "icon": zod.string().nullish(),
      "alias": zod.string().nullish(),
      "name": zod.string().nullish()
    })
  })).or(zod.object({
    "$type": zod.enum(["MediaReferenceResponseModel"]),
    "id": zod.string().uuid(),
    "name": zod.string().nullish(),
    "mediaType": zod.object({
      "icon": zod.string().nullish(),
      "alias": zod.string().nullish(),
      "name": zod.string().nullish()
    })
  })))
});
var getDocumentByIdReferencedDescendantsParams = zod.object({
  "id": zod.string().uuid()
});
var getDocumentByIdReferencedDescendantsQueryTakeDefault = 20;
var getDocumentByIdReferencedDescendantsQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getDocumentByIdReferencedDescendantsQueryTakeDefault)
});
var getDocumentByIdReferencedDescendantsResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "id": zod.string().uuid()
  }))
});
var putDocumentByIdUnpublishParams = zod.object({
  "id": zod.string().uuid()
});
var putDocumentByIdUnpublishBody = zod.object({
  "cultures": zod.array(zod.string()).nullish()
});
var putDocumentByIdValidateParams = zod.object({
  "id": zod.string().uuid()
});
var putDocumentByIdValidateBody = zod.object({
  "values": zod.array(zod.object({
    "culture": zod.string().nullish(),
    "segment": zod.string().nullish(),
    "alias": zod.string().min(1),
    "value": zod.any().nullish()
  })),
  "variants": zod.array(zod.object({
    "culture": zod.string().nullish(),
    "segment": zod.string().nullish(),
    "name": zod.string().min(1)
  })),
  "template": zod.object({
    "id": zod.string().uuid()
  }).nullish()
});
var putUmbracoManagementApiV11DocumentByIdValidate11Params = zod.object({
  "id": zod.string().uuid()
});
var putUmbracoManagementApiV11DocumentByIdValidate11Body = zod.object({
  "values": zod.array(zod.object({
    "culture": zod.string().nullish(),
    "segment": zod.string().nullish(),
    "alias": zod.string().min(1),
    "value": zod.any().nullish()
  })),
  "variants": zod.array(zod.object({
    "culture": zod.string().nullish(),
    "segment": zod.string().nullish(),
    "name": zod.string().min(1)
  })),
  "template": zod.object({
    "id": zod.string().uuid()
  }).nullish(),
  "cultures": zod.array(zod.string()).nullish()
});
var getDocumentAreReferencedQueryTakeDefault = 20;
var getDocumentAreReferencedQueryParams = zod.object({
  "id": zod.array(zod.string().uuid()).optional(),
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getDocumentAreReferencedQueryTakeDefault)
});
var getDocumentAreReferencedResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "id": zod.string().uuid()
  }))
});
var getDocumentConfigurationResponse = zod.object({
  "disableDeleteWhenReferenced": zod.boolean(),
  "disableUnpublishWhenReferenced": zod.boolean(),
  "allowEditInvariantFromNonDefault": zod.boolean(),
  "allowNonExistingSegmentsCreation": zod.boolean(),
  "reservedFieldNames": zod.array(zod.string())
});
var putDocumentSortBody = zod.object({
  "parent": zod.object({
    "id": zod.string().uuid()
  }).nullish(),
  "sorting": zod.array(zod.object({
    "id": zod.string().uuid(),
    "sortOrder": zod.number()
  }))
});
var getDocumentUrlsQueryParams = zod.object({
  "id": zod.array(zod.string().uuid()).optional()
});
var getDocumentUrlsResponseItem = zod.object({
  "id": zod.string().uuid(),
  "urlInfos": zod.array(zod.object({
    "culture": zod.string().nullable(),
    "url": zod.string()
  }))
});
var getDocumentUrlsResponse = zod.array(getDocumentUrlsResponseItem);
var postDocumentValidateBody = zod.object({
  "values": zod.array(zod.object({
    "culture": zod.string().nullish(),
    "segment": zod.string().nullish(),
    "alias": zod.string().min(1),
    "value": zod.any().nullish()
  })),
  "variants": zod.array(zod.object({
    "culture": zod.string().nullish(),
    "segment": zod.string().nullish(),
    "name": zod.string().min(1)
  })),
  "id": zod.string().uuid().nullish(),
  "parent": zod.object({
    "id": zod.string().uuid()
  }).nullish(),
  "documentType": zod.object({
    "id": zod.string().uuid()
  }),
  "template": zod.object({
    "id": zod.string().uuid()
  }).nullable()
});
var getItemDocumentQueryParams = zod.object({
  "id": zod.array(zod.string().uuid()).optional()
});
var getItemDocumentResponseItem = zod.object({
  "id": zod.string().uuid(),
  "isTrashed": zod.boolean(),
  "isProtected": zod.boolean(),
  "parent": zod.object({
    "id": zod.string().uuid()
  }).nullish(),
  "hasChildren": zod.boolean(),
  "documentType": zod.object({
    "id": zod.string().uuid(),
    "icon": zod.string(),
    "collection": zod.object({
      "id": zod.string().uuid()
    }).nullish()
  }),
  "variants": zod.array(zod.object({
    "name": zod.string(),
    "culture": zod.string().nullish(),
    "state": zod.enum(["NotCreated", "Draft", "Published", "PublishedPendingChanges"])
  }))
});
var getItemDocumentResponse = zod.array(getItemDocumentResponseItem);
var getItemDocumentSearchQueryTakeDefault = 100;
var getItemDocumentSearchQueryParams = zod.object({
  "query": zod.string().optional(),
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getItemDocumentSearchQueryTakeDefault),
  "parentId": zod.string().uuid().optional(),
  "allowedDocumentTypes": zod.array(zod.string().uuid()).optional()
});
var getItemDocumentSearchResponse = zod.object({
  "items": zod.array(zod.object({
    "id": zod.string().uuid(),
    "isTrashed": zod.boolean(),
    "isProtected": zod.boolean(),
    "parent": zod.object({
      "id": zod.string().uuid()
    }).nullish(),
    "hasChildren": zod.boolean(),
    "documentType": zod.object({
      "id": zod.string().uuid(),
      "icon": zod.string(),
      "collection": zod.object({
        "id": zod.string().uuid()
      }).nullish()
    }),
    "variants": zod.array(zod.object({
      "name": zod.string(),
      "culture": zod.string().nullish(),
      "state": zod.enum(["NotCreated", "Draft", "Published", "PublishedPendingChanges"])
    }))
  })),
  "total": zod.number()
});
var deleteRecycleBinDocumentByIdParams = zod.object({
  "id": zod.string().uuid()
});
var getRecycleBinDocumentByIdOriginalParentParams = zod.object({
  "id": zod.string().uuid()
});
var getRecycleBinDocumentByIdOriginalParentResponse = zod.object({
  "id": zod.string().uuid()
});
var putRecycleBinDocumentByIdRestoreParams = zod.object({
  "id": zod.string().uuid()
});
var putRecycleBinDocumentByIdRestoreBody = zod.object({
  "target": zod.object({
    "id": zod.string().uuid()
  }).nullish()
});
var getRecycleBinDocumentChildrenQueryTakeDefault = 100;
var getRecycleBinDocumentChildrenQueryParams = zod.object({
  "parentId": zod.string().uuid().optional(),
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getRecycleBinDocumentChildrenQueryTakeDefault)
});
var getRecycleBinDocumentChildrenResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "id": zod.string().uuid(),
    "createDate": zod.string().datetime({ "local": true }),
    "hasChildren": zod.boolean(),
    "parent": zod.object({
      "id": zod.string().uuid()
    }).nullish(),
    "documentType": zod.object({
      "id": zod.string().uuid(),
      "icon": zod.string(),
      "collection": zod.object({
        "id": zod.string().uuid()
      }).nullish()
    }),
    "variants": zod.array(zod.object({
      "name": zod.string(),
      "culture": zod.string().nullish(),
      "state": zod.enum(["NotCreated", "Draft", "Published", "PublishedPendingChanges"])
    }))
  }))
});
var getRecycleBinDocumentRootQueryTakeDefault = 100;
var getRecycleBinDocumentRootQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getRecycleBinDocumentRootQueryTakeDefault)
});
var getRecycleBinDocumentRootResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "id": zod.string().uuid(),
    "createDate": zod.string().datetime({ "local": true }),
    "hasChildren": zod.boolean(),
    "parent": zod.object({
      "id": zod.string().uuid()
    }).nullish(),
    "documentType": zod.object({
      "id": zod.string().uuid(),
      "icon": zod.string(),
      "collection": zod.object({
        "id": zod.string().uuid()
      }).nullish()
    }),
    "variants": zod.array(zod.object({
      "name": zod.string(),
      "culture": zod.string().nullish(),
      "state": zod.enum(["NotCreated", "Draft", "Published", "PublishedPendingChanges"])
    }))
  }))
});
var getTreeDocumentAncestorsQueryParams = zod.object({
  "descendantId": zod.string().uuid().optional()
});
var getTreeDocumentAncestorsResponseItem = zod.object({
  "hasChildren": zod.boolean(),
  "parent": zod.object({
    "id": zod.string().uuid()
  }).nullish(),
  "noAccess": zod.boolean(),
  "isTrashed": zod.boolean(),
  "id": zod.string().uuid(),
  "createDate": zod.string().datetime({ "local": true }),
  "isProtected": zod.boolean(),
  "documentType": zod.object({
    "id": zod.string().uuid(),
    "icon": zod.string(),
    "collection": zod.object({
      "id": zod.string().uuid()
    }).nullish()
  }),
  "variants": zod.array(zod.object({
    "name": zod.string(),
    "culture": zod.string().nullish(),
    "state": zod.enum(["NotCreated", "Draft", "Published", "PublishedPendingChanges"])
  }))
});
var getTreeDocumentAncestorsResponse = zod.array(getTreeDocumentAncestorsResponseItem);
var getTreeDocumentChildrenQueryTakeDefault = 100;
var getTreeDocumentChildrenQueryParams = zod.object({
  "parentId": zod.string().uuid().optional(),
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getTreeDocumentChildrenQueryTakeDefault),
  "dataTypeId": zod.string().uuid().optional()
});
var getTreeDocumentChildrenResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "hasChildren": zod.boolean(),
    "parent": zod.object({
      "id": zod.string().uuid()
    }).nullish(),
    "noAccess": zod.boolean(),
    "isTrashed": zod.boolean(),
    "id": zod.string().uuid(),
    "createDate": zod.string().datetime({ "local": true }),
    "isProtected": zod.boolean(),
    "documentType": zod.object({
      "id": zod.string().uuid(),
      "icon": zod.string(),
      "collection": zod.object({
        "id": zod.string().uuid()
      }).nullish()
    }),
    "variants": zod.array(zod.object({
      "name": zod.string(),
      "culture": zod.string().nullish(),
      "state": zod.enum(["NotCreated", "Draft", "Published", "PublishedPendingChanges"])
    }))
  }))
});
var getTreeDocumentRootQueryTakeDefault = 100;
var getTreeDocumentRootQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getTreeDocumentRootQueryTakeDefault),
  "dataTypeId": zod.string().uuid().optional()
});
var getTreeDocumentRootResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "hasChildren": zod.boolean(),
    "parent": zod.object({
      "id": zod.string().uuid()
    }).nullish(),
    "noAccess": zod.boolean(),
    "isTrashed": zod.boolean(),
    "id": zod.string().uuid(),
    "createDate": zod.string().datetime({ "local": true }),
    "isProtected": zod.boolean(),
    "documentType": zod.object({
      "id": zod.string().uuid(),
      "icon": zod.string(),
      "collection": zod.object({
        "id": zod.string().uuid()
      }).nullish()
    }),
    "variants": zod.array(zod.object({
      "name": zod.string(),
      "culture": zod.string().nullish(),
      "state": zod.enum(["NotCreated", "Draft", "Published", "PublishedPendingChanges"])
    }))
  }))
});
var postDynamicRootQueryBody = zod.object({
  "context": zod.object({
    "id": zod.string().uuid().nullish(),
    "parent": zod.object({
      "id": zod.string().uuid()
    }),
    "culture": zod.string().nullish(),
    "segment": zod.string().nullish()
  }),
  "query": zod.object({
    "origin": zod.object({
      "alias": zod.string(),
      "id": zod.string().uuid().nullish()
    }),
    "steps": zod.array(zod.object({
      "alias": zod.string(),
      "documentTypeIds": zod.array(zod.string().uuid())
    }))
  })
});
var postDynamicRootQueryResponse = zod.object({
  "roots": zod.array(zod.string().uuid())
});
var getDynamicRootStepsResponseItem = zod.string();
var getDynamicRootStepsResponse = zod.array(getDynamicRootStepsResponseItem);
var getHealthCheckGroupQueryTakeDefault = 100;
var getHealthCheckGroupQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getHealthCheckGroupQueryTakeDefault)
});
var getHealthCheckGroupResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "name": zod.string()
  }))
});
var getHealthCheckGroupByNameParams = zod.object({
  "name": zod.string()
});
var getHealthCheckGroupByNameResponse = zod.object({
  "name": zod.string(),
  "checks": zod.array(zod.object({
    "id": zod.string().uuid(),
    "name": zod.string(),
    "description": zod.string().nullish()
  }))
});
var postHealthCheckGroupByNameCheckParams = zod.object({
  "name": zod.string()
});
var postHealthCheckGroupByNameCheckResponse = zod.object({
  "checks": zod.array(zod.object({
    "id": zod.string().uuid(),
    "results": zod.array(zod.object({
      "message": zod.string(),
      "resultType": zod.enum(["Success", "Warning", "Error", "Info"]),
      "actions": zod.array(zod.object({
        "healthCheck": zod.object({
          "id": zod.string().uuid()
        }),
        "alias": zod.string().nullish(),
        "name": zod.string().nullish(),
        "description": zod.string().nullish(),
        "valueRequired": zod.boolean(),
        "providedValue": zod.string().nullish(),
        "providedValueValidation": zod.string().nullish(),
        "providedValueValidationRegex": zod.string().nullish(),
        "actionParameters": zod.record(zod.string(), zod.any()).nullish()
      })).nullish(),
      "readMoreLink": zod.string().nullish()
    })).nullish()
  }))
});
var postHealthCheckExecuteActionBody = zod.object({
  "healthCheck": zod.object({
    "id": zod.string().uuid()
  }),
  "alias": zod.string().nullish(),
  "name": zod.string().nullish(),
  "description": zod.string().nullish(),
  "valueRequired": zod.boolean(),
  "providedValue": zod.string().nullish(),
  "providedValueValidation": zod.string().nullish(),
  "providedValueValidationRegex": zod.string().nullish(),
  "actionParameters": zod.record(zod.string(), zod.any()).nullish()
});
var postHealthCheckExecuteActionResponse = zod.object({
  "message": zod.string(),
  "resultType": zod.enum(["Success", "Warning", "Error", "Info"]),
  "actions": zod.array(zod.object({
    "healthCheck": zod.object({
      "id": zod.string().uuid()
    }),
    "alias": zod.string().nullish(),
    "name": zod.string().nullish(),
    "description": zod.string().nullish(),
    "valueRequired": zod.boolean(),
    "providedValue": zod.string().nullish(),
    "providedValueValidation": zod.string().nullish(),
    "providedValueValidationRegex": zod.string().nullish(),
    "actionParameters": zod.record(zod.string(), zod.any()).nullish()
  })).nullish(),
  "readMoreLink": zod.string().nullish()
});
var getHelpQueryTakeDefault = 100;
var getHelpQueryBaseUrlDefault = "https://our.umbraco.com";
var getHelpQueryParams = zod.object({
  "section": zod.string().optional(),
  "tree": zod.string().optional(),
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getHelpQueryTakeDefault),
  "baseUrl": zod.string().default(getHelpQueryBaseUrlDefault)
});
var getHelpResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "name": zod.string().nullish(),
    "description": zod.string().nullish(),
    "url": zod.string().nullish(),
    "type": zod.string().nullish()
  }))
});
var getImagingResizeUrlsQueryHeightDefault = 200;
var getImagingResizeUrlsQueryWidthDefault = 200;
var getImagingResizeUrlsQueryParams = zod.object({
  "id": zod.array(zod.string().uuid()).optional(),
  "height": zod.coerce.number().default(getImagingResizeUrlsQueryHeightDefault),
  "width": zod.coerce.number().default(getImagingResizeUrlsQueryWidthDefault),
  "mode": zod.enum(["Crop", "Max", "Stretch", "Pad", "BoxPad", "Min"]).optional()
});
var getImagingResizeUrlsResponseItem = zod.object({
  "id": zod.string().uuid(),
  "urlInfos": zod.array(zod.object({
    "culture": zod.string().nullable(),
    "url": zod.string()
  }))
});
var getImagingResizeUrlsResponse = zod.array(getImagingResizeUrlsResponseItem);
var getImportAnalyzeQueryParams = zod.object({
  "temporaryFileId": zod.string().uuid().optional()
});
var getImportAnalyzeResponse = zod.object({
  "entityType": zod.string(),
  "alias": zod.string().nullish(),
  "key": zod.string().uuid().nullish()
});
var getIndexerQueryTakeDefault = 100;
var getIndexerQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getIndexerQueryTakeDefault)
});
var getIndexerResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "name": zod.string().min(1),
    "healthStatus": zod.object({
      "status": zod.enum(["Healthy", "Unhealthy", "Rebuilding", "Corrupt"]),
      "message": zod.string().nullish()
    }),
    "canRebuild": zod.boolean(),
    "searcherName": zod.string(),
    "documentCount": zod.number(),
    "fieldCount": zod.number(),
    "providerProperties": zod.record(zod.string(), zod.any().nullable()).nullish()
  }))
});
var getIndexerByIndexNameParams = zod.object({
  "indexName": zod.string()
});
var getIndexerByIndexNameResponse = zod.object({
  "name": zod.string().min(1),
  "healthStatus": zod.object({
    "status": zod.enum(["Healthy", "Unhealthy", "Rebuilding", "Corrupt"]),
    "message": zod.string().nullish()
  }),
  "canRebuild": zod.boolean(),
  "searcherName": zod.string(),
  "documentCount": zod.number(),
  "fieldCount": zod.number(),
  "providerProperties": zod.record(zod.string(), zod.any().nullable()).nullish()
});
var postIndexerByIndexNameRebuildParams = zod.object({
  "indexName": zod.string()
});
var getInstallSettingsResponse = zod.object({
  "user": zod.object({
    "minCharLength": zod.number(),
    "minNonAlphaNumericLength": zod.number(),
    "consentLevels": zod.array(zod.object({
      "level": zod.enum(["Minimal", "Basic", "Detailed"]),
      "description": zod.string().min(1)
    }))
  }),
  "databases": zod.array(zod.object({
    "id": zod.string().uuid(),
    "sortOrder": zod.number(),
    "displayName": zod.string().min(1),
    "defaultDatabaseName": zod.string().min(1),
    "providerName": zod.string().min(1),
    "isConfigured": zod.boolean(),
    "requiresServer": zod.boolean(),
    "serverPlaceholder": zod.string().min(1),
    "requiresCredentials": zod.boolean(),
    "supportsIntegratedAuthentication": zod.boolean(),
    "requiresConnectionTest": zod.boolean()
  }))
});
var postInstallSetupBodyUserNameMin = 0;
var postInstallSetupBodyUserNameMax = 255;
var postInstallSetupBody = zod.object({
  "user": zod.object({
    "name": zod.string().min(postInstallSetupBodyUserNameMin).max(postInstallSetupBodyUserNameMax),
    "email": zod.string().email().min(1),
    "password": zod.string().min(1),
    "subscribeToNewsletter": zod.boolean()
  }),
  "database": zod.object({
    "id": zod.string().uuid(),
    "providerName": zod.string().min(1),
    "server": zod.string().nullish(),
    "name": zod.string().nullish(),
    "username": zod.string().nullish(),
    "password": zod.string().nullish(),
    "useIntegratedAuthentication": zod.boolean(),
    "connectionString": zod.string().nullish(),
    "trustServerCertificate": zod.boolean()
  }),
  "telemetryLevel": zod.enum(["Minimal", "Basic", "Detailed"])
});
var postInstallValidateDatabaseBody = zod.object({
  "id": zod.string().uuid(),
  "providerName": zod.string().min(1),
  "server": zod.string().nullish(),
  "name": zod.string().nullish(),
  "username": zod.string().nullish(),
  "password": zod.string().nullish(),
  "useIntegratedAuthentication": zod.boolean(),
  "connectionString": zod.string().nullish(),
  "trustServerCertificate": zod.boolean()
});
var getItemLanguageQueryParams = zod.object({
  "isoCode": zod.array(zod.string()).optional()
});
var getItemLanguageResponseItem = zod.object({
  "name": zod.string().min(1),
  "isoCode": zod.string().min(1)
});
var getItemLanguageResponse = zod.array(getItemLanguageResponseItem);
var getItemLanguageDefaultResponse = zod.object({
  "name": zod.string().min(1),
  "isoCode": zod.string().min(1)
});
var getLanguageQueryTakeDefault = 100;
var getLanguageQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getLanguageQueryTakeDefault)
});
var getLanguageResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "name": zod.string().min(1),
    "isDefault": zod.boolean(),
    "isMandatory": zod.boolean(),
    "fallbackIsoCode": zod.string().nullish(),
    "isoCode": zod.string().min(1)
  }))
});
var postLanguageBody = zod.object({
  "name": zod.string().min(1),
  "isDefault": zod.boolean(),
  "isMandatory": zod.boolean(),
  "fallbackIsoCode": zod.string().nullish(),
  "isoCode": zod.string().min(1)
});
var getLanguageByIsoCodeParams = zod.object({
  "isoCode": zod.string()
});
var getLanguageByIsoCodeResponse = zod.object({
  "name": zod.string().min(1),
  "isDefault": zod.boolean(),
  "isMandatory": zod.boolean(),
  "fallbackIsoCode": zod.string().nullish(),
  "isoCode": zod.string().min(1)
});
var deleteLanguageByIsoCodeParams = zod.object({
  "isoCode": zod.string()
});
var putLanguageByIsoCodeParams = zod.object({
  "isoCode": zod.string()
});
var putLanguageByIsoCodeBody = zod.object({
  "name": zod.string().min(1),
  "isDefault": zod.boolean(),
  "isMandatory": zod.boolean(),
  "fallbackIsoCode": zod.string().nullish()
});
var getLogViewerLevelQueryTakeDefault = 100;
var getLogViewerLevelQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getLogViewerLevelQueryTakeDefault)
});
var getLogViewerLevelResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "name": zod.string(),
    "level": zod.enum(["Verbose", "Debug", "Information", "Warning", "Error", "Fatal"])
  }))
});
var getLogViewerLevelCountQueryParams = zod.object({
  "startDate": zod.string().datetime({ "local": true }).optional(),
  "endDate": zod.string().datetime({ "local": true }).optional()
});
var getLogViewerLevelCountResponse = zod.object({
  "information": zod.number(),
  "debug": zod.number(),
  "warning": zod.number(),
  "error": zod.number(),
  "fatal": zod.number()
});
var getLogViewerLogQueryTakeDefault = 100;
var getLogViewerLogQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getLogViewerLogQueryTakeDefault),
  "orderDirection": zod.enum(["Ascending", "Descending"]).optional(),
  "filterExpression": zod.string().optional(),
  "logLevel": zod.array(zod.enum(["Verbose", "Debug", "Information", "Warning", "Error", "Fatal"])).optional(),
  "startDate": zod.string().datetime({ "local": true }).optional(),
  "endDate": zod.string().datetime({ "local": true }).optional()
});
var getLogViewerLogResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "timestamp": zod.string().datetime({ "local": true }),
    "level": zod.enum(["Verbose", "Debug", "Information", "Warning", "Error", "Fatal"]),
    "messageTemplate": zod.string().nullish(),
    "renderedMessage": zod.string().nullish(),
    "properties": zod.array(zod.object({
      "name": zod.string(),
      "value": zod.string().nullish()
    })),
    "exception": zod.string().nullish()
  }))
});
var getLogViewerMessageTemplateQueryTakeDefault = 100;
var getLogViewerMessageTemplateQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getLogViewerMessageTemplateQueryTakeDefault),
  "startDate": zod.string().datetime({ "local": true }).optional(),
  "endDate": zod.string().datetime({ "local": true }).optional()
});
var getLogViewerMessageTemplateResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "messageTemplate": zod.string().nullish(),
    "count": zod.number()
  }))
});
var getLogViewerSavedSearchQueryTakeDefault = 100;
var getLogViewerSavedSearchQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getLogViewerSavedSearchQueryTakeDefault)
});
var getLogViewerSavedSearchResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "name": zod.string(),
    "query": zod.string()
  }))
});
var postLogViewerSavedSearchBody = zod.object({
  "name": zod.string(),
  "query": zod.string()
});
var getLogViewerSavedSearchByNameParams = zod.object({
  "name": zod.string()
});
var getLogViewerSavedSearchByNameResponse = zod.object({
  "name": zod.string(),
  "query": zod.string()
});
var deleteLogViewerSavedSearchByNameParams = zod.object({
  "name": zod.string()
});
var getLogViewerValidateLogsSizeQueryParams = zod.object({
  "startDate": zod.string().datetime({ "local": true }).optional(),
  "endDate": zod.string().datetime({ "local": true }).optional()
});
var getManifestManifestResponseItem = zod.object({
  "name": zod.string().min(1),
  "id": zod.string().nullish(),
  "version": zod.string().nullish(),
  "extensions": zod.array(zod.any())
});
var getManifestManifestResponse = zod.array(getManifestManifestResponseItem);
var getManifestManifestPrivateResponseItem = zod.object({
  "name": zod.string().min(1),
  "id": zod.string().nullish(),
  "version": zod.string().nullish(),
  "extensions": zod.array(zod.any())
});
var getManifestManifestPrivateResponse = zod.array(getManifestManifestPrivateResponseItem);
var getManifestManifestPublicResponseItem = zod.object({
  "name": zod.string().min(1),
  "id": zod.string().nullish(),
  "version": zod.string().nullish(),
  "extensions": zod.array(zod.any())
});
var getManifestManifestPublicResponse = zod.array(getManifestManifestPublicResponseItem);
var getItemMediaTypeQueryParams = zod.object({
  "id": zod.array(zod.string().uuid()).optional()
});
var getItemMediaTypeResponseItem = zod.object({
  "id": zod.string().uuid(),
  "name": zod.string(),
  "icon": zod.string().nullish()
});
var getItemMediaTypeResponse = zod.array(getItemMediaTypeResponseItem);
var getItemMediaTypeAllowedQueryTakeDefault = 100;
var getItemMediaTypeAllowedQueryParams = zod.object({
  "fileExtension": zod.string().optional(),
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getItemMediaTypeAllowedQueryTakeDefault)
});
var getItemMediaTypeAllowedResponse = zod.object({
  "items": zod.array(zod.object({
    "id": zod.string().uuid(),
    "name": zod.string(),
    "icon": zod.string().nullish()
  })),
  "total": zod.number()
});
var getItemMediaTypeFoldersQueryTakeDefault = 100;
var getItemMediaTypeFoldersQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getItemMediaTypeFoldersQueryTakeDefault)
});
var getItemMediaTypeFoldersResponse = zod.object({
  "items": zod.array(zod.object({
    "id": zod.string().uuid(),
    "name": zod.string(),
    "icon": zod.string().nullish()
  })),
  "total": zod.number()
});
var getItemMediaTypeSearchQueryTakeDefault = 100;
var getItemMediaTypeSearchQueryParams = zod.object({
  "query": zod.string().optional(),
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getItemMediaTypeSearchQueryTakeDefault)
});
var getItemMediaTypeSearchResponse = zod.object({
  "items": zod.array(zod.object({
    "id": zod.string().uuid(),
    "name": zod.string(),
    "icon": zod.string().nullish()
  })),
  "total": zod.number()
});
var postMediaTypeBody = zod.object({
  "alias": zod.string().min(1),
  "name": zod.string().min(1),
  "description": zod.string().nullish(),
  "icon": zod.string().min(1),
  "allowedAsRoot": zod.boolean(),
  "variesByCulture": zod.boolean(),
  "variesBySegment": zod.boolean(),
  "isElement": zod.boolean(),
  "properties": zod.array(zod.object({
    "id": zod.string().uuid(),
    "container": zod.object({
      "id": zod.string().uuid()
    }).nullish(),
    "sortOrder": zod.number(),
    "alias": zod.string().min(1),
    "name": zod.string().min(1),
    "description": zod.string().nullish(),
    "dataType": zod.object({
      "id": zod.string().uuid()
    }),
    "variesByCulture": zod.boolean(),
    "variesBySegment": zod.boolean(),
    "validation": zod.object({
      "mandatory": zod.boolean(),
      "mandatoryMessage": zod.string().nullish(),
      "regEx": zod.string().nullish(),
      "regExMessage": zod.string().nullish()
    }),
    "appearance": zod.object({
      "labelOnTop": zod.boolean()
    })
  })),
  "containers": zod.array(zod.object({
    "id": zod.string().uuid(),
    "parent": zod.object({
      "id": zod.string().uuid()
    }).nullish(),
    "name": zod.string().nullish(),
    "type": zod.string().min(1),
    "sortOrder": zod.number()
  })),
  "id": zod.string().uuid().nullish(),
  "parent": zod.object({
    "id": zod.string().uuid()
  }).nullish(),
  "allowedMediaTypes": zod.array(zod.object({
    "mediaType": zod.object({
      "id": zod.string().uuid()
    }),
    "sortOrder": zod.number()
  })),
  "compositions": zod.array(zod.object({
    "mediaType": zod.object({
      "id": zod.string().uuid()
    }),
    "compositionType": zod.enum(["Composition", "Inheritance"])
  })),
  "collection": zod.object({
    "id": zod.string().uuid()
  }).nullish()
});
var getMediaTypeByIdParams = zod.object({
  "id": zod.string().uuid()
});
var getMediaTypeByIdResponse = zod.object({
  "alias": zod.string().min(1),
  "name": zod.string().min(1),
  "description": zod.string().nullish(),
  "icon": zod.string().min(1),
  "allowedAsRoot": zod.boolean(),
  "variesByCulture": zod.boolean(),
  "variesBySegment": zod.boolean(),
  "collection": zod.object({
    "id": zod.string().uuid()
  }).nullish(),
  "isElement": zod.boolean(),
  "properties": zod.array(zod.object({
    "id": zod.string().uuid(),
    "container": zod.object({
      "id": zod.string().uuid()
    }).nullish(),
    "sortOrder": zod.number(),
    "alias": zod.string().min(1),
    "name": zod.string().min(1),
    "description": zod.string().nullish(),
    "dataType": zod.object({
      "id": zod.string().uuid()
    }),
    "variesByCulture": zod.boolean(),
    "variesBySegment": zod.boolean(),
    "validation": zod.object({
      "mandatory": zod.boolean(),
      "mandatoryMessage": zod.string().nullish(),
      "regEx": zod.string().nullish(),
      "regExMessage": zod.string().nullish()
    }),
    "appearance": zod.object({
      "labelOnTop": zod.boolean()
    })
  })),
  "containers": zod.array(zod.object({
    "id": zod.string().uuid(),
    "parent": zod.object({
      "id": zod.string().uuid()
    }).nullish(),
    "name": zod.string().nullish(),
    "type": zod.string().min(1),
    "sortOrder": zod.number()
  })),
  "id": zod.string().uuid(),
  "allowedMediaTypes": zod.array(zod.object({
    "mediaType": zod.object({
      "id": zod.string().uuid()
    }),
    "sortOrder": zod.number()
  })),
  "compositions": zod.array(zod.object({
    "mediaType": zod.object({
      "id": zod.string().uuid()
    }),
    "compositionType": zod.enum(["Composition", "Inheritance"])
  })),
  "isDeletable": zod.boolean(),
  "aliasCanBeChanged": zod.boolean()
});
var deleteMediaTypeByIdParams = zod.object({
  "id": zod.string().uuid()
});
var putMediaTypeByIdParams = zod.object({
  "id": zod.string().uuid()
});
var putMediaTypeByIdBody = zod.object({
  "alias": zod.string().min(1),
  "name": zod.string().min(1),
  "description": zod.string().nullish(),
  "icon": zod.string().min(1),
  "allowedAsRoot": zod.boolean(),
  "variesByCulture": zod.boolean(),
  "variesBySegment": zod.boolean(),
  "collection": zod.object({
    "id": zod.string().uuid()
  }).nullish(),
  "isElement": zod.boolean(),
  "properties": zod.array(zod.object({
    "id": zod.string().uuid(),
    "container": zod.object({
      "id": zod.string().uuid()
    }).nullish(),
    "sortOrder": zod.number(),
    "alias": zod.string().min(1),
    "name": zod.string().min(1),
    "description": zod.string().nullish(),
    "dataType": zod.object({
      "id": zod.string().uuid()
    }),
    "variesByCulture": zod.boolean(),
    "variesBySegment": zod.boolean(),
    "validation": zod.object({
      "mandatory": zod.boolean(),
      "mandatoryMessage": zod.string().nullish(),
      "regEx": zod.string().nullish(),
      "regExMessage": zod.string().nullish()
    }),
    "appearance": zod.object({
      "labelOnTop": zod.boolean()
    })
  })),
  "containers": zod.array(zod.object({
    "id": zod.string().uuid(),
    "parent": zod.object({
      "id": zod.string().uuid()
    }).nullish(),
    "name": zod.string().nullish(),
    "type": zod.string().min(1),
    "sortOrder": zod.number()
  })),
  "allowedMediaTypes": zod.array(zod.object({
    "mediaType": zod.object({
      "id": zod.string().uuid()
    }),
    "sortOrder": zod.number()
  })),
  "compositions": zod.array(zod.object({
    "mediaType": zod.object({
      "id": zod.string().uuid()
    }),
    "compositionType": zod.enum(["Composition", "Inheritance"])
  }))
});
var getMediaTypeByIdAllowedChildrenParams = zod.object({
  "id": zod.string().uuid()
});
var getMediaTypeByIdAllowedChildrenQueryTakeDefault = 100;
var getMediaTypeByIdAllowedChildrenQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getMediaTypeByIdAllowedChildrenQueryTakeDefault)
});
var getMediaTypeByIdAllowedChildrenResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "id": zod.string().uuid(),
    "name": zod.string(),
    "description": zod.string().nullish(),
    "icon": zod.string().nullish()
  }))
});
var getMediaTypeByIdCompositionReferencesParams = zod.object({
  "id": zod.string().uuid()
});
var getMediaTypeByIdCompositionReferencesResponseItem = zod.object({
  "id": zod.string().uuid(),
  "name": zod.string(),
  "icon": zod.string()
});
var getMediaTypeByIdCompositionReferencesResponse = zod.array(getMediaTypeByIdCompositionReferencesResponseItem);
var postMediaTypeByIdCopyParams = zod.object({
  "id": zod.string().uuid()
});
var postMediaTypeByIdCopyBody = zod.object({
  "target": zod.object({
    "id": zod.string().uuid()
  }).nullish()
});
var getMediaTypeByIdExportParams = zod.object({
  "id": zod.string().uuid()
});
var getMediaTypeByIdExportResponse = zod.instanceof(FileLike);
var putMediaTypeByIdImportParams = zod.object({
  "id": zod.string().uuid()
});
var putMediaTypeByIdImportBody = zod.object({
  "file": zod.object({
    "id": zod.string().uuid()
  })
});
var putMediaTypeByIdMoveParams = zod.object({
  "id": zod.string().uuid()
});
var putMediaTypeByIdMoveBody = zod.object({
  "target": zod.object({
    "id": zod.string().uuid()
  }).nullish()
});
var getMediaTypeAllowedAtRootQueryTakeDefault = 100;
var getMediaTypeAllowedAtRootQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getMediaTypeAllowedAtRootQueryTakeDefault)
});
var getMediaTypeAllowedAtRootResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "id": zod.string().uuid(),
    "name": zod.string(),
    "description": zod.string().nullish(),
    "icon": zod.string().nullish()
  }))
});
var postMediaTypeAvailableCompositionsBody = zod.object({
  "id": zod.string().uuid().nullish(),
  "currentPropertyAliases": zod.array(zod.string()),
  "currentCompositeIds": zod.array(zod.string().uuid())
});
var postMediaTypeAvailableCompositionsResponseItem = zod.object({
  "id": zod.string().uuid(),
  "name": zod.string(),
  "icon": zod.string(),
  "folderPath": zod.array(zod.string()),
  "isCompatible": zod.boolean()
});
var postMediaTypeAvailableCompositionsResponse = zod.array(postMediaTypeAvailableCompositionsResponseItem);
var getMediaTypeConfigurationResponse = zod.object({
  "reservedFieldNames": zod.array(zod.string())
});
var postMediaTypeFolderBody = zod.object({
  "name": zod.string().min(1),
  "id": zod.string().uuid().nullish(),
  "parent": zod.object({
    "id": zod.string().uuid()
  }).nullish()
});
var getMediaTypeFolderByIdParams = zod.object({
  "id": zod.string().uuid()
});
var getMediaTypeFolderByIdResponse = zod.object({
  "name": zod.string().min(1),
  "id": zod.string().uuid()
});
var deleteMediaTypeFolderByIdParams = zod.object({
  "id": zod.string().uuid()
});
var putMediaTypeFolderByIdParams = zod.object({
  "id": zod.string().uuid()
});
var putMediaTypeFolderByIdBody = zod.object({
  "name": zod.string().min(1)
});
var postMediaTypeImportBody = zod.object({
  "file": zod.object({
    "id": zod.string().uuid()
  })
});
var getTreeMediaTypeAncestorsQueryParams = zod.object({
  "descendantId": zod.string().uuid().optional()
});
var getTreeMediaTypeAncestorsResponseItem = zod.object({
  "hasChildren": zod.boolean(),
  "id": zod.string().uuid(),
  "parent": zod.object({
    "id": zod.string().uuid()
  }).nullish(),
  "name": zod.string(),
  "isFolder": zod.boolean(),
  "icon": zod.string(),
  "isDeletable": zod.boolean()
});
var getTreeMediaTypeAncestorsResponse = zod.array(getTreeMediaTypeAncestorsResponseItem);
var getTreeMediaTypeChildrenQueryTakeDefault = 100;
var getTreeMediaTypeChildrenQueryParams = zod.object({
  "parentId": zod.string().uuid().optional(),
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getTreeMediaTypeChildrenQueryTakeDefault),
  "foldersOnly": zod.coerce.boolean().optional()
});
var getTreeMediaTypeChildrenResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "hasChildren": zod.boolean(),
    "id": zod.string().uuid(),
    "parent": zod.object({
      "id": zod.string().uuid()
    }).nullish(),
    "name": zod.string(),
    "isFolder": zod.boolean(),
    "icon": zod.string(),
    "isDeletable": zod.boolean()
  }))
});
var getTreeMediaTypeRootQueryTakeDefault = 100;
var getTreeMediaTypeRootQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getTreeMediaTypeRootQueryTakeDefault),
  "foldersOnly": zod.coerce.boolean().optional()
});
var getTreeMediaTypeRootResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "hasChildren": zod.boolean(),
    "id": zod.string().uuid(),
    "parent": zod.object({
      "id": zod.string().uuid()
    }).nullish(),
    "name": zod.string(),
    "isFolder": zod.boolean(),
    "icon": zod.string(),
    "isDeletable": zod.boolean()
  }))
});
var getCollectionMediaQueryOrderByDefault = "updateDate";
var getCollectionMediaQueryTakeDefault = 100;
var getCollectionMediaQueryParams = zod.object({
  "id": zod.string().uuid().optional(),
  "dataTypeId": zod.string().uuid().optional(),
  "orderBy": zod.string().default(getCollectionMediaQueryOrderByDefault),
  "orderDirection": zod.enum(["Ascending", "Descending"]).optional(),
  "filter": zod.string().optional(),
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getCollectionMediaQueryTakeDefault)
});
var getCollectionMediaResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "values": zod.array(zod.object({
      "culture": zod.string().nullish(),
      "segment": zod.string().nullish(),
      "alias": zod.string().min(1),
      "value": zod.any().nullish(),
      "editorAlias": zod.string().min(1)
    })),
    "variants": zod.array(zod.object({
      "culture": zod.string().nullish(),
      "segment": zod.string().nullish(),
      "name": zod.string().min(1),
      "createDate": zod.string().datetime({ "local": true }),
      "updateDate": zod.string().datetime({ "local": true })
    })),
    "id": zod.string().uuid(),
    "creator": zod.string().nullish(),
    "sortOrder": zod.number(),
    "mediaType": zod.object({
      "id": zod.string().uuid(),
      "alias": zod.string(),
      "icon": zod.string()
    })
  }))
});
var getItemMediaQueryParams = zod.object({
  "id": zod.array(zod.string().uuid()).optional()
});
var getItemMediaResponseItem = zod.object({
  "id": zod.string().uuid(),
  "isTrashed": zod.boolean(),
  "parent": zod.object({
    "id": zod.string().uuid()
  }).nullish(),
  "hasChildren": zod.boolean(),
  "mediaType": zod.object({
    "id": zod.string().uuid(),
    "icon": zod.string(),
    "collection": zod.object({
      "id": zod.string().uuid()
    }).nullish()
  }),
  "variants": zod.array(zod.object({
    "name": zod.string(),
    "culture": zod.string().nullish()
  }))
});
var getItemMediaResponse = zod.array(getItemMediaResponseItem);
var getItemMediaSearchQueryTakeDefault = 100;
var getItemMediaSearchQueryParams = zod.object({
  "query": zod.string().optional(),
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getItemMediaSearchQueryTakeDefault),
  "parentId": zod.string().uuid().optional(),
  "allowedMediaTypes": zod.array(zod.string().uuid()).optional()
});
var getItemMediaSearchResponse = zod.object({
  "items": zod.array(zod.object({
    "id": zod.string().uuid(),
    "isTrashed": zod.boolean(),
    "parent": zod.object({
      "id": zod.string().uuid()
    }).nullish(),
    "hasChildren": zod.boolean(),
    "mediaType": zod.object({
      "id": zod.string().uuid(),
      "icon": zod.string(),
      "collection": zod.object({
        "id": zod.string().uuid()
      }).nullish()
    }),
    "variants": zod.array(zod.object({
      "name": zod.string(),
      "culture": zod.string().nullish()
    }))
  })),
  "total": zod.number()
});
var postMediaBody = zod.object({
  "values": zod.array(zod.object({
    "culture": zod.string().nullish(),
    "segment": zod.string().nullish(),
    "alias": zod.string().min(1),
    "value": zod.any().nullish()
  })),
  "variants": zod.array(zod.object({
    "culture": zod.string().nullish(),
    "segment": zod.string().nullish(),
    "name": zod.string().min(1)
  })),
  "id": zod.string().uuid().nullish(),
  "parent": zod.object({
    "id": zod.string().uuid()
  }).nullish(),
  "mediaType": zod.object({
    "id": zod.string().uuid()
  })
});
var getMediaByIdParams = zod.object({
  "id": zod.string().uuid()
});
var getMediaByIdResponse = zod.object({
  "values": zod.array(zod.object({
    "culture": zod.string().nullish(),
    "segment": zod.string().nullish(),
    "alias": zod.string().min(1),
    "value": zod.any().nullish(),
    "editorAlias": zod.string().min(1)
  })),
  "variants": zod.array(zod.object({
    "culture": zod.string().nullish(),
    "segment": zod.string().nullish(),
    "name": zod.string().min(1),
    "createDate": zod.string().datetime({ "local": true }),
    "updateDate": zod.string().datetime({ "local": true })
  })),
  "id": zod.string().uuid(),
  "urls": zod.array(zod.object({
    "culture": zod.string().nullable(),
    "url": zod.string()
  })),
  "isTrashed": zod.boolean(),
  "mediaType": zod.object({
    "id": zod.string().uuid(),
    "icon": zod.string(),
    "collection": zod.object({
      "id": zod.string().uuid()
    }).nullish()
  })
});
var deleteMediaByIdParams = zod.object({
  "id": zod.string().uuid()
});
var putMediaByIdParams = zod.object({
  "id": zod.string().uuid()
});
var putMediaByIdBody = zod.object({
  "values": zod.array(zod.object({
    "culture": zod.string().nullish(),
    "segment": zod.string().nullish(),
    "alias": zod.string().min(1),
    "value": zod.any().nullish()
  })),
  "variants": zod.array(zod.object({
    "culture": zod.string().nullish(),
    "segment": zod.string().nullish(),
    "name": zod.string().min(1)
  }))
});
var getMediaByIdAuditLogParams = zod.object({
  "id": zod.string().uuid()
});
var getMediaByIdAuditLogQueryTakeDefault = 100;
var getMediaByIdAuditLogQueryParams = zod.object({
  "orderDirection": zod.enum(["Ascending", "Descending"]).optional(),
  "sinceDate": zod.string().datetime({ "local": true }).optional(),
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getMediaByIdAuditLogQueryTakeDefault)
});
var getMediaByIdAuditLogResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "user": zod.object({
      "id": zod.string().uuid()
    }),
    "timestamp": zod.string().datetime({ "local": true }),
    "logType": zod.enum(["New", "Save", "SaveVariant", "Open", "Delete", "Publish", "PublishVariant", "SendToPublish", "SendToPublishVariant", "Unpublish", "UnpublishVariant", "Move", "Copy", "AssignDomain", "PublicAccess", "Sort", "Notify", "System", "RollBack", "PackagerInstall", "PackagerUninstall", "Custom", "ContentVersionPreventCleanup", "ContentVersionEnableCleanup"]),
    "comment": zod.string().nullish(),
    "parameters": zod.string().nullish()
  }))
});
var putMediaByIdMoveParams = zod.object({
  "id": zod.string().uuid()
});
var putMediaByIdMoveBody = zod.object({
  "target": zod.object({
    "id": zod.string().uuid()
  }).nullish()
});
var putMediaByIdMoveToRecycleBinParams = zod.object({
  "id": zod.string().uuid()
});
var getMediaByIdReferencedByParams = zod.object({
  "id": zod.string().uuid()
});
var getMediaByIdReferencedByQueryTakeDefault = 20;
var getMediaByIdReferencedByQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getMediaByIdReferencedByQueryTakeDefault)
});
var getMediaByIdReferencedByResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "$type": zod.enum(["DefaultReferenceResponseModel"]),
    "id": zod.string().uuid(),
    "name": zod.string().nullish(),
    "type": zod.string().nullish(),
    "icon": zod.string().nullish()
  }).or(zod.object({
    "$type": zod.enum(["DocumentReferenceResponseModel"]),
    "id": zod.string().uuid(),
    "name": zod.string().nullish(),
    "published": zod.boolean().nullish(),
    "documentType": zod.object({
      "icon": zod.string().nullish(),
      "alias": zod.string().nullish(),
      "name": zod.string().nullish()
    })
  })).or(zod.object({
    "$type": zod.enum(["MediaReferenceResponseModel"]),
    "id": zod.string().uuid(),
    "name": zod.string().nullish(),
    "mediaType": zod.object({
      "icon": zod.string().nullish(),
      "alias": zod.string().nullish(),
      "name": zod.string().nullish()
    })
  })))
});
var getMediaByIdReferencedDescendantsParams = zod.object({
  "id": zod.string().uuid()
});
var getMediaByIdReferencedDescendantsQueryTakeDefault = 20;
var getMediaByIdReferencedDescendantsQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getMediaByIdReferencedDescendantsQueryTakeDefault)
});
var getMediaByIdReferencedDescendantsResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "id": zod.string().uuid()
  }))
});
var putMediaByIdValidateParams = zod.object({
  "id": zod.string().uuid()
});
var putMediaByIdValidateBody = zod.object({
  "values": zod.array(zod.object({
    "culture": zod.string().nullish(),
    "segment": zod.string().nullish(),
    "alias": zod.string().min(1),
    "value": zod.any().nullish()
  })),
  "variants": zod.array(zod.object({
    "culture": zod.string().nullish(),
    "segment": zod.string().nullish(),
    "name": zod.string().min(1)
  }))
});
var getMediaAreReferencedQueryTakeDefault = 20;
var getMediaAreReferencedQueryParams = zod.object({
  "id": zod.array(zod.string().uuid()).optional(),
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getMediaAreReferencedQueryTakeDefault)
});
var getMediaAreReferencedResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "id": zod.string().uuid()
  }))
});
var getMediaConfigurationResponse = zod.object({
  "disableDeleteWhenReferenced": zod.boolean(),
  "disableUnpublishWhenReferenced": zod.boolean(),
  "reservedFieldNames": zod.array(zod.string())
});
var putMediaSortBody = zod.object({
  "parent": zod.object({
    "id": zod.string().uuid()
  }).nullish(),
  "sorting": zod.array(zod.object({
    "id": zod.string().uuid(),
    "sortOrder": zod.number()
  }))
});
var getMediaUrlsQueryParams = zod.object({
  "id": zod.array(zod.string().uuid()).optional()
});
var getMediaUrlsResponseItem = zod.object({
  "id": zod.string().uuid(),
  "urlInfos": zod.array(zod.object({
    "culture": zod.string().nullable(),
    "url": zod.string()
  }))
});
var getMediaUrlsResponse = zod.array(getMediaUrlsResponseItem);
var postMediaValidateBody = zod.object({
  "values": zod.array(zod.object({
    "culture": zod.string().nullish(),
    "segment": zod.string().nullish(),
    "alias": zod.string().min(1),
    "value": zod.any().nullish()
  })),
  "variants": zod.array(zod.object({
    "culture": zod.string().nullish(),
    "segment": zod.string().nullish(),
    "name": zod.string().min(1)
  })),
  "id": zod.string().uuid().nullish(),
  "parent": zod.object({
    "id": zod.string().uuid()
  }).nullish(),
  "mediaType": zod.object({
    "id": zod.string().uuid()
  })
});
var deleteRecycleBinMediaByIdParams = zod.object({
  "id": zod.string().uuid()
});
var getRecycleBinMediaByIdOriginalParentParams = zod.object({
  "id": zod.string().uuid()
});
var getRecycleBinMediaByIdOriginalParentResponse = zod.object({
  "id": zod.string().uuid()
});
var putRecycleBinMediaByIdRestoreParams = zod.object({
  "id": zod.string().uuid()
});
var putRecycleBinMediaByIdRestoreBody = zod.object({
  "target": zod.object({
    "id": zod.string().uuid()
  }).nullish()
});
var getRecycleBinMediaChildrenQueryTakeDefault = 100;
var getRecycleBinMediaChildrenQueryParams = zod.object({
  "parentId": zod.string().uuid().optional(),
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getRecycleBinMediaChildrenQueryTakeDefault)
});
var getRecycleBinMediaChildrenResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "id": zod.string().uuid(),
    "createDate": zod.string().datetime({ "local": true }),
    "hasChildren": zod.boolean(),
    "parent": zod.object({
      "id": zod.string().uuid()
    }).nullish(),
    "mediaType": zod.object({
      "id": zod.string().uuid(),
      "icon": zod.string(),
      "collection": zod.object({
        "id": zod.string().uuid()
      }).nullish()
    }),
    "variants": zod.array(zod.object({
      "name": zod.string(),
      "culture": zod.string().nullish()
    }))
  }))
});
var getRecycleBinMediaRootQueryTakeDefault = 100;
var getRecycleBinMediaRootQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getRecycleBinMediaRootQueryTakeDefault)
});
var getRecycleBinMediaRootResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "id": zod.string().uuid(),
    "createDate": zod.string().datetime({ "local": true }),
    "hasChildren": zod.boolean(),
    "parent": zod.object({
      "id": zod.string().uuid()
    }).nullish(),
    "mediaType": zod.object({
      "id": zod.string().uuid(),
      "icon": zod.string(),
      "collection": zod.object({
        "id": zod.string().uuid()
      }).nullish()
    }),
    "variants": zod.array(zod.object({
      "name": zod.string(),
      "culture": zod.string().nullish()
    }))
  }))
});
var getTreeMediaAncestorsQueryParams = zod.object({
  "descendantId": zod.string().uuid().optional()
});
var getTreeMediaAncestorsResponseItem = zod.object({
  "hasChildren": zod.boolean(),
  "parent": zod.object({
    "id": zod.string().uuid()
  }).nullish(),
  "noAccess": zod.boolean(),
  "isTrashed": zod.boolean(),
  "id": zod.string().uuid(),
  "createDate": zod.string().datetime({ "local": true }),
  "mediaType": zod.object({
    "id": zod.string().uuid(),
    "icon": zod.string(),
    "collection": zod.object({
      "id": zod.string().uuid()
    }).nullish()
  }),
  "variants": zod.array(zod.object({
    "name": zod.string(),
    "culture": zod.string().nullish()
  }))
});
var getTreeMediaAncestorsResponse = zod.array(getTreeMediaAncestorsResponseItem);
var getTreeMediaChildrenQueryTakeDefault = 100;
var getTreeMediaChildrenQueryParams = zod.object({
  "parentId": zod.string().uuid().optional(),
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getTreeMediaChildrenQueryTakeDefault),
  "dataTypeId": zod.string().uuid().optional()
});
var getTreeMediaChildrenResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "hasChildren": zod.boolean(),
    "parent": zod.object({
      "id": zod.string().uuid()
    }).nullish(),
    "noAccess": zod.boolean(),
    "isTrashed": zod.boolean(),
    "id": zod.string().uuid(),
    "createDate": zod.string().datetime({ "local": true }),
    "mediaType": zod.object({
      "id": zod.string().uuid(),
      "icon": zod.string(),
      "collection": zod.object({
        "id": zod.string().uuid()
      }).nullish()
    }),
    "variants": zod.array(zod.object({
      "name": zod.string(),
      "culture": zod.string().nullish()
    }))
  }))
});
var getTreeMediaRootQueryTakeDefault = 100;
var getTreeMediaRootQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getTreeMediaRootQueryTakeDefault),
  "dataTypeId": zod.string().uuid().optional()
});
var getTreeMediaRootResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "hasChildren": zod.boolean(),
    "parent": zod.object({
      "id": zod.string().uuid()
    }).nullish(),
    "noAccess": zod.boolean(),
    "isTrashed": zod.boolean(),
    "id": zod.string().uuid(),
    "createDate": zod.string().datetime({ "local": true }),
    "mediaType": zod.object({
      "id": zod.string().uuid(),
      "icon": zod.string(),
      "collection": zod.object({
        "id": zod.string().uuid()
      }).nullish()
    }),
    "variants": zod.array(zod.object({
      "name": zod.string(),
      "culture": zod.string().nullish()
    }))
  }))
});
var getItemMemberGroupQueryParams = zod.object({
  "id": zod.array(zod.string().uuid()).optional()
});
var getItemMemberGroupResponseItem = zod.object({
  "id": zod.string().uuid(),
  "name": zod.string()
});
var getItemMemberGroupResponse = zod.array(getItemMemberGroupResponseItem);
var getMemberGroupQueryTakeDefault = 100;
var getMemberGroupQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getMemberGroupQueryTakeDefault)
});
var getMemberGroupResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "name": zod.string(),
    "id": zod.string().uuid()
  }))
});
var postMemberGroupBody = zod.object({
  "name": zod.string(),
  "id": zod.string().uuid().nullish()
});
var getMemberGroupByIdParams = zod.object({
  "id": zod.string().uuid()
});
var getMemberGroupByIdResponse = zod.object({
  "name": zod.string(),
  "id": zod.string().uuid()
});
var deleteMemberGroupByIdParams = zod.object({
  "id": zod.string().uuid()
});
var putMemberGroupByIdParams = zod.object({
  "id": zod.string().uuid()
});
var putMemberGroupByIdBody = zod.object({
  "name": zod.string()
});
var getTreeMemberGroupRootQueryTakeDefault = 100;
var getTreeMemberGroupRootQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getTreeMemberGroupRootQueryTakeDefault)
});
var getTreeMemberGroupRootResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "hasChildren": zod.boolean(),
    "id": zod.string().uuid(),
    "parent": zod.object({
      "id": zod.string().uuid()
    }).nullish(),
    "name": zod.string()
  }))
});
var getItemMemberTypeQueryParams = zod.object({
  "id": zod.array(zod.string().uuid()).optional()
});
var getItemMemberTypeResponseItem = zod.object({
  "id": zod.string().uuid(),
  "name": zod.string(),
  "icon": zod.string().nullish()
});
var getItemMemberTypeResponse = zod.array(getItemMemberTypeResponseItem);
var getItemMemberTypeSearchQueryTakeDefault = 100;
var getItemMemberTypeSearchQueryParams = zod.object({
  "query": zod.string().optional(),
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getItemMemberTypeSearchQueryTakeDefault)
});
var getItemMemberTypeSearchResponse = zod.object({
  "items": zod.array(zod.object({
    "id": zod.string().uuid(),
    "name": zod.string(),
    "icon": zod.string().nullish()
  })),
  "total": zod.number()
});
var postMemberTypeBody = zod.object({
  "alias": zod.string().min(1),
  "name": zod.string().min(1),
  "description": zod.string().nullish(),
  "icon": zod.string().min(1),
  "allowedAsRoot": zod.boolean(),
  "variesByCulture": zod.boolean(),
  "variesBySegment": zod.boolean(),
  "collection": zod.object({
    "id": zod.string().uuid()
  }).nullish(),
  "isElement": zod.boolean(),
  "properties": zod.array(zod.object({
    "id": zod.string().uuid(),
    "container": zod.object({
      "id": zod.string().uuid()
    }).nullish(),
    "sortOrder": zod.number(),
    "alias": zod.string().min(1),
    "name": zod.string().min(1),
    "description": zod.string().nullish(),
    "dataType": zod.object({
      "id": zod.string().uuid()
    }),
    "variesByCulture": zod.boolean(),
    "variesBySegment": zod.boolean(),
    "validation": zod.object({
      "mandatory": zod.boolean(),
      "mandatoryMessage": zod.string().nullish(),
      "regEx": zod.string().nullish(),
      "regExMessage": zod.string().nullish()
    }),
    "appearance": zod.object({
      "labelOnTop": zod.boolean()
    }),
    "isSensitive": zod.boolean(),
    "visibility": zod.object({
      "memberCanView": zod.boolean(),
      "memberCanEdit": zod.boolean()
    })
  })),
  "containers": zod.array(zod.object({
    "id": zod.string().uuid(),
    "parent": zod.object({
      "id": zod.string().uuid()
    }).nullish(),
    "name": zod.string().nullish(),
    "type": zod.string().min(1),
    "sortOrder": zod.number()
  })),
  "id": zod.string().uuid().nullish(),
  "compositions": zod.array(zod.object({
    "memberType": zod.object({
      "id": zod.string().uuid()
    }),
    "compositionType": zod.enum(["Composition", "Inheritance"])
  }))
});
var getMemberTypeByIdParams = zod.object({
  "id": zod.string().uuid()
});
var getMemberTypeByIdResponse = zod.object({
  "alias": zod.string().min(1),
  "name": zod.string().min(1),
  "description": zod.string().nullish(),
  "icon": zod.string().min(1),
  "allowedAsRoot": zod.boolean(),
  "variesByCulture": zod.boolean(),
  "variesBySegment": zod.boolean(),
  "collection": zod.object({
    "id": zod.string().uuid()
  }).nullish(),
  "isElement": zod.boolean(),
  "properties": zod.array(zod.object({
    "id": zod.string().uuid(),
    "container": zod.object({
      "id": zod.string().uuid()
    }).nullish(),
    "sortOrder": zod.number(),
    "alias": zod.string().min(1),
    "name": zod.string().min(1),
    "description": zod.string().nullish(),
    "dataType": zod.object({
      "id": zod.string().uuid()
    }),
    "variesByCulture": zod.boolean(),
    "variesBySegment": zod.boolean(),
    "validation": zod.object({
      "mandatory": zod.boolean(),
      "mandatoryMessage": zod.string().nullish(),
      "regEx": zod.string().nullish(),
      "regExMessage": zod.string().nullish()
    }),
    "appearance": zod.object({
      "labelOnTop": zod.boolean()
    }),
    "isSensitive": zod.boolean(),
    "visibility": zod.object({
      "memberCanView": zod.boolean(),
      "memberCanEdit": zod.boolean()
    })
  })),
  "containers": zod.array(zod.object({
    "id": zod.string().uuid(),
    "parent": zod.object({
      "id": zod.string().uuid()
    }).nullish(),
    "name": zod.string().nullish(),
    "type": zod.string().min(1),
    "sortOrder": zod.number()
  })),
  "id": zod.string().uuid(),
  "compositions": zod.array(zod.object({
    "memberType": zod.object({
      "id": zod.string().uuid()
    }),
    "compositionType": zod.enum(["Composition", "Inheritance"])
  }))
});
var deleteMemberTypeByIdParams = zod.object({
  "id": zod.string().uuid()
});
var putMemberTypeByIdParams = zod.object({
  "id": zod.string().uuid()
});
var putMemberTypeByIdBody = zod.object({
  "alias": zod.string().min(1),
  "name": zod.string().min(1),
  "description": zod.string().nullish(),
  "icon": zod.string().min(1),
  "allowedAsRoot": zod.boolean(),
  "variesByCulture": zod.boolean(),
  "variesBySegment": zod.boolean(),
  "collection": zod.object({
    "id": zod.string().uuid()
  }).nullish(),
  "isElement": zod.boolean(),
  "properties": zod.array(zod.object({
    "id": zod.string().uuid(),
    "container": zod.object({
      "id": zod.string().uuid()
    }).nullish(),
    "sortOrder": zod.number(),
    "alias": zod.string().min(1),
    "name": zod.string().min(1),
    "description": zod.string().nullish(),
    "dataType": zod.object({
      "id": zod.string().uuid()
    }),
    "variesByCulture": zod.boolean(),
    "variesBySegment": zod.boolean(),
    "validation": zod.object({
      "mandatory": zod.boolean(),
      "mandatoryMessage": zod.string().nullish(),
      "regEx": zod.string().nullish(),
      "regExMessage": zod.string().nullish()
    }),
    "appearance": zod.object({
      "labelOnTop": zod.boolean()
    }),
    "isSensitive": zod.boolean(),
    "visibility": zod.object({
      "memberCanView": zod.boolean(),
      "memberCanEdit": zod.boolean()
    })
  })),
  "containers": zod.array(zod.object({
    "id": zod.string().uuid(),
    "parent": zod.object({
      "id": zod.string().uuid()
    }).nullish(),
    "name": zod.string().nullish(),
    "type": zod.string().min(1),
    "sortOrder": zod.number()
  })),
  "compositions": zod.array(zod.object({
    "memberType": zod.object({
      "id": zod.string().uuid()
    }),
    "compositionType": zod.enum(["Composition", "Inheritance"])
  }))
});
var getMemberTypeByIdCompositionReferencesParams = zod.object({
  "id": zod.string().uuid()
});
var getMemberTypeByIdCompositionReferencesResponseItem = zod.object({
  "id": zod.string().uuid(),
  "name": zod.string(),
  "icon": zod.string()
});
var getMemberTypeByIdCompositionReferencesResponse = zod.array(getMemberTypeByIdCompositionReferencesResponseItem);
var postMemberTypeByIdCopyParams = zod.object({
  "id": zod.string().uuid()
});
var postMemberTypeAvailableCompositionsBody = zod.object({
  "id": zod.string().uuid().nullish(),
  "currentPropertyAliases": zod.array(zod.string()),
  "currentCompositeIds": zod.array(zod.string().uuid())
});
var postMemberTypeAvailableCompositionsResponseItem = zod.object({
  "id": zod.string().uuid(),
  "name": zod.string(),
  "icon": zod.string(),
  "folderPath": zod.array(zod.string()),
  "isCompatible": zod.boolean()
});
var postMemberTypeAvailableCompositionsResponse = zod.array(postMemberTypeAvailableCompositionsResponseItem);
var getMemberTypeConfigurationResponse = zod.object({
  "reservedFieldNames": zod.array(zod.string())
});
var getTreeMemberTypeRootQueryTakeDefault = 100;
var getTreeMemberTypeRootQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getTreeMemberTypeRootQueryTakeDefault)
});
var getTreeMemberTypeRootResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "hasChildren": zod.boolean(),
    "id": zod.string().uuid(),
    "parent": zod.object({
      "id": zod.string().uuid()
    }).nullish(),
    "name": zod.string(),
    "icon": zod.string()
  }))
});
var getFilterMemberQueryOrderByDefault = "username";
var getFilterMemberQueryTakeDefault = 100;
var getFilterMemberQueryParams = zod.object({
  "memberTypeId": zod.string().uuid().optional(),
  "memberGroupName": zod.string().optional(),
  "isApproved": zod.coerce.boolean().optional(),
  "isLockedOut": zod.coerce.boolean().optional(),
  "orderBy": zod.string().default(getFilterMemberQueryOrderByDefault),
  "orderDirection": zod.enum(["Ascending", "Descending"]).optional(),
  "filter": zod.string().optional(),
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getFilterMemberQueryTakeDefault)
});
var getFilterMemberResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "values": zod.array(zod.object({
      "culture": zod.string().nullish(),
      "segment": zod.string().nullish(),
      "alias": zod.string().min(1),
      "value": zod.any().nullish(),
      "editorAlias": zod.string().min(1)
    })),
    "variants": zod.array(zod.object({
      "culture": zod.string().nullish(),
      "segment": zod.string().nullish(),
      "name": zod.string().min(1),
      "createDate": zod.string().datetime({ "local": true }),
      "updateDate": zod.string().datetime({ "local": true })
    })),
    "id": zod.string().uuid(),
    "email": zod.string(),
    "username": zod.string(),
    "memberType": zod.object({
      "id": zod.string().uuid(),
      "icon": zod.string(),
      "collection": zod.object({
        "id": zod.string().uuid()
      }).nullish()
    }),
    "isApproved": zod.boolean(),
    "isLockedOut": zod.boolean(),
    "isTwoFactorEnabled": zod.boolean(),
    "failedPasswordAttempts": zod.number(),
    "lastLoginDate": zod.string().datetime({ "local": true }).nullish(),
    "lastLockoutDate": zod.string().datetime({ "local": true }).nullish(),
    "lastPasswordChangeDate": zod.string().datetime({ "local": true }).nullish(),
    "groups": zod.array(zod.string().uuid()),
    "kind": zod.enum(["Default", "Api"])
  }))
});
var getItemMemberQueryParams = zod.object({
  "id": zod.array(zod.string().uuid()).optional()
});
var getItemMemberResponseItem = zod.object({
  "id": zod.string().uuid(),
  "memberType": zod.object({
    "id": zod.string().uuid(),
    "icon": zod.string(),
    "collection": zod.object({
      "id": zod.string().uuid()
    }).nullish()
  }),
  "variants": zod.array(zod.object({
    "name": zod.string(),
    "culture": zod.string().nullish()
  })),
  "kind": zod.enum(["Default", "Api"])
});
var getItemMemberResponse = zod.array(getItemMemberResponseItem);
var getItemMemberSearchQueryTakeDefault = 100;
var getItemMemberSearchQueryParams = zod.object({
  "query": zod.string().optional(),
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getItemMemberSearchQueryTakeDefault),
  "allowedMemberTypes": zod.array(zod.string().uuid()).optional()
});
var getItemMemberSearchResponse = zod.object({
  "items": zod.array(zod.object({
    "id": zod.string().uuid(),
    "memberType": zod.object({
      "id": zod.string().uuid(),
      "icon": zod.string(),
      "collection": zod.object({
        "id": zod.string().uuid()
      }).nullish()
    }),
    "variants": zod.array(zod.object({
      "name": zod.string(),
      "culture": zod.string().nullish()
    })),
    "kind": zod.enum(["Default", "Api"])
  })),
  "total": zod.number()
});
var postMemberBody = zod.object({
  "values": zod.array(zod.object({
    "culture": zod.string().nullish(),
    "segment": zod.string().nullish(),
    "alias": zod.string().min(1),
    "value": zod.any().nullish()
  })),
  "variants": zod.array(zod.object({
    "culture": zod.string().nullish(),
    "segment": zod.string().nullish(),
    "name": zod.string().min(1)
  })),
  "id": zod.string().uuid().nullish(),
  "email": zod.string(),
  "username": zod.string(),
  "password": zod.string(),
  "memberType": zod.object({
    "id": zod.string().uuid()
  }),
  "groups": zod.array(zod.string().uuid()).nullish(),
  "isApproved": zod.boolean()
});
var getMemberByIdParams = zod.object({
  "id": zod.string().uuid()
});
var getMemberByIdResponse = zod.object({
  "values": zod.array(zod.object({
    "culture": zod.string().nullish(),
    "segment": zod.string().nullish(),
    "alias": zod.string().min(1),
    "value": zod.any().nullish(),
    "editorAlias": zod.string().min(1)
  })),
  "variants": zod.array(zod.object({
    "culture": zod.string().nullish(),
    "segment": zod.string().nullish(),
    "name": zod.string().min(1),
    "createDate": zod.string().datetime({ "local": true }),
    "updateDate": zod.string().datetime({ "local": true })
  })),
  "id": zod.string().uuid(),
  "email": zod.string(),
  "username": zod.string(),
  "memberType": zod.object({
    "id": zod.string().uuid(),
    "icon": zod.string(),
    "collection": zod.object({
      "id": zod.string().uuid()
    }).nullish()
  }),
  "isApproved": zod.boolean(),
  "isLockedOut": zod.boolean(),
  "isTwoFactorEnabled": zod.boolean(),
  "failedPasswordAttempts": zod.number(),
  "lastLoginDate": zod.string().datetime({ "local": true }).nullish(),
  "lastLockoutDate": zod.string().datetime({ "local": true }).nullish(),
  "lastPasswordChangeDate": zod.string().datetime({ "local": true }).nullish(),
  "groups": zod.array(zod.string().uuid()),
  "kind": zod.enum(["Default", "Api"])
});
var deleteMemberByIdParams = zod.object({
  "id": zod.string().uuid()
});
var putMemberByIdParams = zod.object({
  "id": zod.string().uuid()
});
var putMemberByIdBody = zod.object({
  "values": zod.array(zod.object({
    "culture": zod.string().nullish(),
    "segment": zod.string().nullish(),
    "alias": zod.string().min(1),
    "value": zod.any().nullish()
  })),
  "variants": zod.array(zod.object({
    "culture": zod.string().nullish(),
    "segment": zod.string().nullish(),
    "name": zod.string().min(1)
  })),
  "email": zod.string(),
  "username": zod.string(),
  "oldPassword": zod.string().nullish(),
  "newPassword": zod.string().nullish(),
  "groups": zod.array(zod.string().uuid()).nullish(),
  "isApproved": zod.boolean(),
  "isLockedOut": zod.boolean(),
  "isTwoFactorEnabled": zod.boolean()
});
var putMemberByIdValidateParams = zod.object({
  "id": zod.string().uuid()
});
var putMemberByIdValidateBody = zod.object({
  "values": zod.array(zod.object({
    "culture": zod.string().nullish(),
    "segment": zod.string().nullish(),
    "alias": zod.string().min(1),
    "value": zod.any().nullish()
  })),
  "variants": zod.array(zod.object({
    "culture": zod.string().nullish(),
    "segment": zod.string().nullish(),
    "name": zod.string().min(1)
  })),
  "email": zod.string(),
  "username": zod.string(),
  "oldPassword": zod.string().nullish(),
  "newPassword": zod.string().nullish(),
  "groups": zod.array(zod.string().uuid()).nullish(),
  "isApproved": zod.boolean(),
  "isLockedOut": zod.boolean(),
  "isTwoFactorEnabled": zod.boolean()
});
var getMemberConfigurationResponse = zod.object({
  "reservedFieldNames": zod.array(zod.string())
});
var postMemberValidateBody = zod.object({
  "values": zod.array(zod.object({
    "culture": zod.string().nullish(),
    "segment": zod.string().nullish(),
    "alias": zod.string().min(1),
    "value": zod.any().nullish()
  })),
  "variants": zod.array(zod.object({
    "culture": zod.string().nullish(),
    "segment": zod.string().nullish(),
    "name": zod.string().min(1)
  })),
  "id": zod.string().uuid().nullish(),
  "email": zod.string(),
  "username": zod.string(),
  "password": zod.string(),
  "memberType": zod.object({
    "id": zod.string().uuid()
  }),
  "groups": zod.array(zod.string().uuid()).nullish(),
  "isApproved": zod.boolean()
});
var getModelsBuilderDashboardResponse = zod.object({
  "mode": zod.enum(["Nothing", "InMemoryAuto", "SourceCodeManual", "SourceCodeAuto"]),
  "canGenerate": zod.boolean(),
  "outOfDateModels": zod.boolean(),
  "lastError": zod.string().nullish(),
  "version": zod.string().nullish(),
  "modelsNamespace": zod.string().nullish(),
  "trackingOutOfDateModels": zod.boolean()
});
var getModelsBuilderStatusResponse = zod.object({
  "status": zod.enum(["OutOfDate", "Current", "Unknown"])
});
var getObjectTypesQueryTakeDefault = 100;
var getObjectTypesQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getObjectTypesQueryTakeDefault)
});
var getObjectTypesResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "name": zod.string().nullish(),
    "id": zod.string().uuid()
  }))
});
var getOembedQueryQueryParams = zod.object({
  "url": zod.string().url().optional(),
  "maxWidth": zod.coerce.number().optional(),
  "maxHeight": zod.coerce.number().optional()
});
var getOembedQueryResponse = zod.object({
  "markup": zod.string()
});
var postPackageByNameRunMigrationParams = zod.object({
  "name": zod.string()
});
var getPackageConfigurationResponse = zod.object({
  "marketplaceUrl": zod.string()
});
var getPackageCreatedQueryTakeDefault = 100;
var getPackageCreatedQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getPackageCreatedQueryTakeDefault)
});
var getPackageCreatedResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "name": zod.string(),
    "contentNodeId": zod.string().nullish(),
    "contentLoadChildNodes": zod.boolean(),
    "mediaIds": zod.array(zod.string().uuid()),
    "mediaLoadChildNodes": zod.boolean(),
    "documentTypes": zod.array(zod.string()),
    "mediaTypes": zod.array(zod.string()),
    "dataTypes": zod.array(zod.string()),
    "templates": zod.array(zod.string()),
    "partialViews": zod.array(zod.string()),
    "stylesheets": zod.array(zod.string()),
    "scripts": zod.array(zod.string()),
    "languages": zod.array(zod.string()),
    "dictionaryItems": zod.array(zod.string()),
    "id": zod.string().uuid(),
    "packagePath": zod.string()
  }))
});
var postPackageCreatedBody = zod.object({
  "name": zod.string(),
  "contentNodeId": zod.string().nullish(),
  "contentLoadChildNodes": zod.boolean(),
  "mediaIds": zod.array(zod.string().uuid()),
  "mediaLoadChildNodes": zod.boolean(),
  "documentTypes": zod.array(zod.string()),
  "mediaTypes": zod.array(zod.string()),
  "dataTypes": zod.array(zod.string()),
  "templates": zod.array(zod.string()),
  "partialViews": zod.array(zod.string()),
  "stylesheets": zod.array(zod.string()),
  "scripts": zod.array(zod.string()),
  "languages": zod.array(zod.string()),
  "dictionaryItems": zod.array(zod.string()),
  "id": zod.string().uuid().nullish()
});
var getPackageCreatedByIdParams = zod.object({
  "id": zod.string().uuid()
});
var getPackageCreatedByIdResponse = zod.object({
  "name": zod.string(),
  "contentNodeId": zod.string().nullish(),
  "contentLoadChildNodes": zod.boolean(),
  "mediaIds": zod.array(zod.string().uuid()),
  "mediaLoadChildNodes": zod.boolean(),
  "documentTypes": zod.array(zod.string()),
  "mediaTypes": zod.array(zod.string()),
  "dataTypes": zod.array(zod.string()),
  "templates": zod.array(zod.string()),
  "partialViews": zod.array(zod.string()),
  "stylesheets": zod.array(zod.string()),
  "scripts": zod.array(zod.string()),
  "languages": zod.array(zod.string()),
  "dictionaryItems": zod.array(zod.string()),
  "id": zod.string().uuid(),
  "packagePath": zod.string()
});
var deletePackageCreatedByIdParams = zod.object({
  "id": zod.string().uuid()
});
var putPackageCreatedByIdParams = zod.object({
  "id": zod.string().uuid()
});
var putPackageCreatedByIdBody = zod.object({
  "name": zod.string(),
  "contentNodeId": zod.string().nullish(),
  "contentLoadChildNodes": zod.boolean(),
  "mediaIds": zod.array(zod.string().uuid()),
  "mediaLoadChildNodes": zod.boolean(),
  "documentTypes": zod.array(zod.string()),
  "mediaTypes": zod.array(zod.string()),
  "dataTypes": zod.array(zod.string()),
  "templates": zod.array(zod.string()),
  "partialViews": zod.array(zod.string()),
  "stylesheets": zod.array(zod.string()),
  "scripts": zod.array(zod.string()),
  "languages": zod.array(zod.string()),
  "dictionaryItems": zod.array(zod.string()),
  "packagePath": zod.string()
});
var getPackageCreatedByIdDownloadParams = zod.object({
  "id": zod.string().uuid()
});
var getPackageCreatedByIdDownloadResponse = zod.instanceof(FileLike);
var getPackageMigrationStatusQueryTakeDefault = 100;
var getPackageMigrationStatusQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getPackageMigrationStatusQueryTakeDefault)
});
var getPackageMigrationStatusResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "packageName": zod.string(),
    "hasPendingMigrations": zod.boolean()
  }))
});
var getItemPartialViewQueryParams = zod.object({
  "path": zod.array(zod.string()).optional()
});
var getItemPartialViewResponseItem = zod.object({
  "path": zod.string(),
  "name": zod.string(),
  "parent": zod.object({
    "path": zod.string()
  }).nullish(),
  "isFolder": zod.boolean()
});
var getItemPartialViewResponse = zod.array(getItemPartialViewResponseItem);
var postPartialViewBody = zod.object({
  "name": zod.string(),
  "parent": zod.object({
    "path": zod.string()
  }).nullish(),
  "content": zod.string()
});
var getPartialViewByPathParams = zod.object({
  "path": zod.string()
});
var getPartialViewByPathResponse = zod.object({
  "path": zod.string(),
  "name": zod.string(),
  "parent": zod.object({
    "path": zod.string()
  }).nullish(),
  "content": zod.string()
});
var deletePartialViewByPathParams = zod.object({
  "path": zod.string()
});
var putPartialViewByPathParams = zod.object({
  "path": zod.string()
});
var putPartialViewByPathBody = zod.object({
  "content": zod.string()
});
var putPartialViewByPathRenameParams = zod.object({
  "path": zod.string()
});
var putPartialViewByPathRenameBody = zod.object({
  "name": zod.string()
});
var postPartialViewFolderBody = zod.object({
  "name": zod.string(),
  "parent": zod.object({
    "path": zod.string()
  }).nullish()
});
var getPartialViewFolderByPathParams = zod.object({
  "path": zod.string()
});
var getPartialViewFolderByPathResponse = zod.object({
  "path": zod.string(),
  "name": zod.string(),
  "parent": zod.object({
    "path": zod.string()
  }).nullish()
});
var deletePartialViewFolderByPathParams = zod.object({
  "path": zod.string()
});
var getPartialViewSnippetQueryTakeDefault = 100;
var getPartialViewSnippetQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getPartialViewSnippetQueryTakeDefault)
});
var getPartialViewSnippetResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "id": zod.string(),
    "name": zod.string()
  }))
});
var getPartialViewSnippetByIdParams = zod.object({
  "id": zod.string()
});
var getPartialViewSnippetByIdResponse = zod.object({
  "id": zod.string(),
  "name": zod.string(),
  "content": zod.string()
});
var getTreePartialViewAncestorsQueryParams = zod.object({
  "descendantPath": zod.string().optional()
});
var getTreePartialViewAncestorsResponseItem = zod.object({
  "hasChildren": zod.boolean(),
  "name": zod.string(),
  "path": zod.string(),
  "parent": zod.object({
    "path": zod.string()
  }).nullish(),
  "isFolder": zod.boolean()
});
var getTreePartialViewAncestorsResponse = zod.array(getTreePartialViewAncestorsResponseItem);
var getTreePartialViewChildrenQueryTakeDefault = 100;
var getTreePartialViewChildrenQueryParams = zod.object({
  "parentPath": zod.string().optional(),
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getTreePartialViewChildrenQueryTakeDefault)
});
var getTreePartialViewChildrenResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "hasChildren": zod.boolean(),
    "name": zod.string(),
    "path": zod.string(),
    "parent": zod.object({
      "path": zod.string()
    }).nullish(),
    "isFolder": zod.boolean()
  }))
});
var getTreePartialViewRootQueryTakeDefault = 100;
var getTreePartialViewRootQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getTreePartialViewRootQueryTakeDefault)
});
var getTreePartialViewRootResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "hasChildren": zod.boolean(),
    "name": zod.string(),
    "path": zod.string(),
    "parent": zod.object({
      "path": zod.string()
    }).nullish(),
    "isFolder": zod.boolean()
  }))
});
var getProfilingStatusResponse = zod.object({
  "enabled": zod.boolean()
});
var putProfilingStatusBody = zod.object({
  "enabled": zod.boolean()
});
var getPropertyTypeIsUsedQueryParams = zod.object({
  "contentTypeId": zod.string().uuid().optional(),
  "propertyAlias": zod.string().optional()
});
var getPropertyTypeIsUsedResponse = zod.boolean();
var getRedirectManagementQueryTakeDefault = 100;
var getRedirectManagementQueryParams = zod.object({
  "filter": zod.string().optional(),
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getRedirectManagementQueryTakeDefault)
});
var getRedirectManagementResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "id": zod.string().uuid(),
    "originalUrl": zod.string(),
    "destinationUrl": zod.string(),
    "created": zod.string().datetime({ "local": true }),
    "document": zod.object({
      "id": zod.string().uuid()
    }),
    "culture": zod.string().nullish()
  }))
});
var getRedirectManagementByIdParams = zod.object({
  "id": zod.string().uuid()
});
var getRedirectManagementByIdQueryTakeDefault = 100;
var getRedirectManagementByIdQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getRedirectManagementByIdQueryTakeDefault)
});
var getRedirectManagementByIdResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "id": zod.string().uuid(),
    "originalUrl": zod.string(),
    "destinationUrl": zod.string(),
    "created": zod.string().datetime({ "local": true }),
    "document": zod.object({
      "id": zod.string().uuid()
    }),
    "culture": zod.string().nullish()
  }))
});
var deleteRedirectManagementByIdParams = zod.object({
  "id": zod.string().uuid()
});
var getRedirectManagementStatusResponse = zod.object({
  "status": zod.enum(["Enabled", "Disabled"]),
  "userIsAdmin": zod.boolean()
});
var postRedirectManagementStatusQueryParams = zod.object({
  "status": zod.enum(["Enabled", "Disabled"]).optional()
});
var getItemRelationTypeQueryParams = zod.object({
  "id": zod.array(zod.string().uuid()).optional()
});
var getItemRelationTypeResponseItem = zod.object({
  "id": zod.string().uuid(),
  "name": zod.string(),
  "isDeletable": zod.boolean()
});
var getItemRelationTypeResponse = zod.array(getItemRelationTypeResponseItem);
var getRelationTypeQueryTakeDefault = 100;
var getRelationTypeQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getRelationTypeQueryTakeDefault)
});
var getRelationTypeResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "name": zod.string().min(1),
    "isBidirectional": zod.boolean(),
    "isDependency": zod.boolean(),
    "id": zod.string().uuid(),
    "alias": zod.string().nullish(),
    "parentObject": zod.object({
      "name": zod.string().nullish(),
      "id": zod.string().uuid()
    }).nullish(),
    "childObject": zod.object({
      "name": zod.string().nullish(),
      "id": zod.string().uuid()
    }).nullish()
  }))
});
var getRelationTypeByIdParams = zod.object({
  "id": zod.string().uuid()
});
var getRelationTypeByIdResponse = zod.object({
  "name": zod.string().min(1),
  "isBidirectional": zod.boolean(),
  "isDependency": zod.boolean(),
  "id": zod.string().uuid(),
  "alias": zod.string().nullish(),
  "parentObject": zod.object({
    "name": zod.string().nullish(),
    "id": zod.string().uuid()
  }).nullish(),
  "childObject": zod.object({
    "name": zod.string().nullish(),
    "id": zod.string().uuid()
  }).nullish()
});
var getRelationByRelationTypeIdParams = zod.object({
  "id": zod.string().uuid()
});
var getRelationByRelationTypeIdQueryTakeDefault = 100;
var getRelationByRelationTypeIdQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getRelationByRelationTypeIdQueryTakeDefault)
});
var getRelationByRelationTypeIdResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "id": zod.string().uuid(),
    "relationType": zod.object({
      "id": zod.string().uuid()
    }),
    "parent": zod.object({
      "id": zod.string().uuid(),
      "name": zod.string().nullish()
    }),
    "child": zod.object({
      "id": zod.string().uuid(),
      "name": zod.string().nullish()
    }),
    "createDate": zod.string().datetime({ "local": true }),
    "comment": zod.string().nullish()
  }))
});
var getItemScriptQueryParams = zod.object({
  "path": zod.array(zod.string()).optional()
});
var getItemScriptResponseItem = zod.object({
  "path": zod.string(),
  "name": zod.string(),
  "parent": zod.object({
    "path": zod.string()
  }).nullish(),
  "isFolder": zod.boolean()
});
var getItemScriptResponse = zod.array(getItemScriptResponseItem);
var postScriptBody = zod.object({
  "name": zod.string(),
  "parent": zod.object({
    "path": zod.string()
  }).nullish(),
  "content": zod.string()
});
var getScriptByPathParams = zod.object({
  "path": zod.string()
});
var getScriptByPathResponse = zod.object({
  "path": zod.string(),
  "name": zod.string(),
  "parent": zod.object({
    "path": zod.string()
  }).nullish(),
  "content": zod.string()
});
var deleteScriptByPathParams = zod.object({
  "path": zod.string()
});
var putScriptByPathParams = zod.object({
  "path": zod.string()
});
var putScriptByPathBody = zod.object({
  "content": zod.string()
});
var putScriptByPathRenameParams = zod.object({
  "path": zod.string()
});
var putScriptByPathRenameBody = zod.object({
  "name": zod.string()
});
var postScriptFolderBody = zod.object({
  "name": zod.string(),
  "parent": zod.object({
    "path": zod.string()
  }).nullish()
});
var getScriptFolderByPathParams = zod.object({
  "path": zod.string()
});
var getScriptFolderByPathResponse = zod.object({
  "path": zod.string(),
  "name": zod.string(),
  "parent": zod.object({
    "path": zod.string()
  }).nullish()
});
var deleteScriptFolderByPathParams = zod.object({
  "path": zod.string()
});
var getTreeScriptAncestorsQueryParams = zod.object({
  "descendantPath": zod.string().optional()
});
var getTreeScriptAncestorsResponseItem = zod.object({
  "hasChildren": zod.boolean(),
  "name": zod.string(),
  "path": zod.string(),
  "parent": zod.object({
    "path": zod.string()
  }).nullish(),
  "isFolder": zod.boolean()
});
var getTreeScriptAncestorsResponse = zod.array(getTreeScriptAncestorsResponseItem);
var getTreeScriptChildrenQueryTakeDefault = 100;
var getTreeScriptChildrenQueryParams = zod.object({
  "parentPath": zod.string().optional(),
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getTreeScriptChildrenQueryTakeDefault)
});
var getTreeScriptChildrenResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "hasChildren": zod.boolean(),
    "name": zod.string(),
    "path": zod.string(),
    "parent": zod.object({
      "path": zod.string()
    }).nullish(),
    "isFolder": zod.boolean()
  }))
});
var getTreeScriptRootQueryTakeDefault = 100;
var getTreeScriptRootQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getTreeScriptRootQueryTakeDefault)
});
var getTreeScriptRootResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "hasChildren": zod.boolean(),
    "name": zod.string(),
    "path": zod.string(),
    "parent": zod.object({
      "path": zod.string()
    }).nullish(),
    "isFolder": zod.boolean()
  }))
});
var getSearcherQueryTakeDefault = 100;
var getSearcherQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getSearcherQueryTakeDefault)
});
var getSearcherResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "name": zod.string().min(1)
  }))
});
var getSearcherBySearcherNameQueryParams = zod.object({
  "searcherName": zod.string()
});
var getSearcherBySearcherNameQueryQueryTakeDefault = 100;
var getSearcherBySearcherNameQueryQueryParams = zod.object({
  "term": zod.string().optional(),
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getSearcherBySearcherNameQueryQueryTakeDefault)
});
var getSearcherBySearcherNameQueryResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "id": zod.string().min(1),
    "score": zod.number(),
    "fieldCount": zod.number(),
    "fields": zod.array(zod.object({
      "name": zod.string(),
      "values": zod.array(zod.string())
    }))
  }))
});
var getSecurityConfigurationResponse = zod.object({
  "passwordConfiguration": zod.object({
    "minimumPasswordLength": zod.number(),
    "requireNonLetterOrDigit": zod.boolean(),
    "requireDigit": zod.boolean(),
    "requireLowercase": zod.boolean(),
    "requireUppercase": zod.boolean()
  })
});
var postSecurityForgotPasswordBody = zod.object({
  "email": zod.string().min(1)
});
var postSecurityForgotPasswordResetBody = zod.object({
  "user": zod.object({
    "id": zod.string().uuid()
  }),
  "resetCode": zod.string(),
  "password": zod.string().min(1)
});
var postSecurityForgotPasswordVerifyBody = zod.object({
  "user": zod.object({
    "id": zod.string().uuid()
  }),
  "resetCode": zod.string()
});
var postSecurityForgotPasswordVerifyResponse = zod.object({
  "passwordConfiguration": zod.object({
    "minimumPasswordLength": zod.number(),
    "requireNonLetterOrDigit": zod.boolean(),
    "requireDigit": zod.boolean(),
    "requireLowercase": zod.boolean(),
    "requireUppercase": zod.boolean()
  })
});
var getSegmentQueryTakeDefault = 100;
var getSegmentQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getSegmentQueryTakeDefault)
});
var getSegmentResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "name": zod.string(),
    "alias": zod.string()
  }))
});
var getServerConfigurationResponse = zod.object({
  "allowPasswordReset": zod.boolean(),
  "versionCheckPeriod": zod.number(),
  "allowLocalLogin": zod.boolean()
});
var getServerInformationResponse = zod.object({
  "version": zod.string(),
  "assemblyVersion": zod.string(),
  "baseUtcOffset": zod.string(),
  "runtimeMode": zod.enum(["BackofficeDevelopment", "Development", "Production"])
});
var getServerStatusResponse = zod.object({
  "serverStatus": zod.enum(["Unknown", "Boot", "Install", "Upgrade", "Run", "BootFailed"])
});
var getServerTroubleshootingResponse = zod.object({
  "items": zod.array(zod.object({
    "name": zod.string(),
    "data": zod.string()
  }))
});
var getServerUpgradeCheckResponse = zod.object({
  "type": zod.string(),
  "comment": zod.string(),
  "url": zod.string()
});
var getItemStaticFileQueryParams = zod.object({
  "path": zod.array(zod.string()).optional()
});
var getItemStaticFileResponseItem = zod.object({
  "path": zod.string(),
  "name": zod.string(),
  "parent": zod.object({
    "path": zod.string()
  }).nullish(),
  "isFolder": zod.boolean()
});
var getItemStaticFileResponse = zod.array(getItemStaticFileResponseItem);
var getTreeStaticFileAncestorsQueryParams = zod.object({
  "descendantPath": zod.string().optional()
});
var getTreeStaticFileAncestorsResponseItem = zod.object({
  "hasChildren": zod.boolean(),
  "name": zod.string(),
  "path": zod.string(),
  "parent": zod.object({
    "path": zod.string()
  }).nullish(),
  "isFolder": zod.boolean()
});
var getTreeStaticFileAncestorsResponse = zod.array(getTreeStaticFileAncestorsResponseItem);
var getTreeStaticFileChildrenQueryTakeDefault = 100;
var getTreeStaticFileChildrenQueryParams = zod.object({
  "parentPath": zod.string().optional(),
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getTreeStaticFileChildrenQueryTakeDefault)
});
var getTreeStaticFileChildrenResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "hasChildren": zod.boolean(),
    "name": zod.string(),
    "path": zod.string(),
    "parent": zod.object({
      "path": zod.string()
    }).nullish(),
    "isFolder": zod.boolean()
  }))
});
var getTreeStaticFileRootQueryTakeDefault = 100;
var getTreeStaticFileRootQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getTreeStaticFileRootQueryTakeDefault)
});
var getTreeStaticFileRootResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "hasChildren": zod.boolean(),
    "name": zod.string(),
    "path": zod.string(),
    "parent": zod.object({
      "path": zod.string()
    }).nullish(),
    "isFolder": zod.boolean()
  }))
});
var getItemStylesheetQueryParams = zod.object({
  "path": zod.array(zod.string()).optional()
});
var getItemStylesheetResponseItem = zod.object({
  "path": zod.string(),
  "name": zod.string(),
  "parent": zod.object({
    "path": zod.string()
  }).nullish(),
  "isFolder": zod.boolean()
});
var getItemStylesheetResponse = zod.array(getItemStylesheetResponseItem);
var postStylesheetBody = zod.object({
  "name": zod.string(),
  "parent": zod.object({
    "path": zod.string()
  }).nullish(),
  "content": zod.string()
});
var getStylesheetByPathParams = zod.object({
  "path": zod.string()
});
var getStylesheetByPathResponse = zod.object({
  "path": zod.string(),
  "name": zod.string(),
  "parent": zod.object({
    "path": zod.string()
  }).nullish(),
  "content": zod.string()
});
var deleteStylesheetByPathParams = zod.object({
  "path": zod.string()
});
var putStylesheetByPathParams = zod.object({
  "path": zod.string()
});
var putStylesheetByPathBody = zod.object({
  "content": zod.string()
});
var putStylesheetByPathRenameParams = zod.object({
  "path": zod.string()
});
var putStylesheetByPathRenameBody = zod.object({
  "name": zod.string()
});
var postStylesheetFolderBody = zod.object({
  "name": zod.string(),
  "parent": zod.object({
    "path": zod.string()
  }).nullish()
});
var getStylesheetFolderByPathParams = zod.object({
  "path": zod.string()
});
var getStylesheetFolderByPathResponse = zod.object({
  "path": zod.string(),
  "name": zod.string(),
  "parent": zod.object({
    "path": zod.string()
  }).nullish()
});
var deleteStylesheetFolderByPathParams = zod.object({
  "path": zod.string()
});
var getTreeStylesheetAncestorsQueryParams = zod.object({
  "descendantPath": zod.string().optional()
});
var getTreeStylesheetAncestorsResponseItem = zod.object({
  "hasChildren": zod.boolean(),
  "name": zod.string(),
  "path": zod.string(),
  "parent": zod.object({
    "path": zod.string()
  }).nullish(),
  "isFolder": zod.boolean()
});
var getTreeStylesheetAncestorsResponse = zod.array(getTreeStylesheetAncestorsResponseItem);
var getTreeStylesheetChildrenQueryTakeDefault = 100;
var getTreeStylesheetChildrenQueryParams = zod.object({
  "parentPath": zod.string().optional(),
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getTreeStylesheetChildrenQueryTakeDefault)
});
var getTreeStylesheetChildrenResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "hasChildren": zod.boolean(),
    "name": zod.string(),
    "path": zod.string(),
    "parent": zod.object({
      "path": zod.string()
    }).nullish(),
    "isFolder": zod.boolean()
  }))
});
var getTreeStylesheetRootQueryTakeDefault = 100;
var getTreeStylesheetRootQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getTreeStylesheetRootQueryTakeDefault)
});
var getTreeStylesheetRootResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "hasChildren": zod.boolean(),
    "name": zod.string(),
    "path": zod.string(),
    "parent": zod.object({
      "path": zod.string()
    }).nullish(),
    "isFolder": zod.boolean()
  }))
});
var getTagQueryTakeDefault = 100;
var getTagQueryParams = zod.object({
  "query": zod.string().optional(),
  "tagGroup": zod.string().optional(),
  "culture": zod.string().optional(),
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getTagQueryTakeDefault)
});
var getTagResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "id": zod.string().uuid(),
    "text": zod.string().nullish(),
    "group": zod.string().nullish(),
    "nodeCount": zod.number()
  }))
});
var getTelemetryQueryTakeDefault = 100;
var getTelemetryQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getTelemetryQueryTakeDefault)
});
var getTelemetryResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "telemetryLevel": zod.enum(["Minimal", "Basic", "Detailed"])
  }))
});
var getTelemetryLevelResponse = zod.object({
  "telemetryLevel": zod.enum(["Minimal", "Basic", "Detailed"])
});
var postTelemetryLevelBody = zod.object({
  "telemetryLevel": zod.enum(["Minimal", "Basic", "Detailed"])
});
var getItemTemplateQueryParams = zod.object({
  "id": zod.array(zod.string().uuid()).optional()
});
var getItemTemplateResponseItem = zod.object({
  "id": zod.string().uuid(),
  "name": zod.string(),
  "alias": zod.string()
});
var getItemTemplateResponse = zod.array(getItemTemplateResponseItem);
var getItemTemplateSearchQueryTakeDefault = 100;
var getItemTemplateSearchQueryParams = zod.object({
  "query": zod.string().optional(),
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getItemTemplateSearchQueryTakeDefault)
});
var getItemTemplateSearchResponse = zod.object({
  "items": zod.array(zod.object({
    "id": zod.string().uuid(),
    "name": zod.string(),
    "alias": zod.string()
  })),
  "total": zod.number()
});
var postTemplateBody = zod.object({
  "name": zod.string().min(1),
  "alias": zod.string().min(1),
  "content": zod.string().nullish(),
  "id": zod.string().uuid().nullish()
});
var getTemplateByIdParams = zod.object({
  "id": zod.string().uuid()
});
var getTemplateByIdResponse = zod.object({
  "name": zod.string().min(1),
  "alias": zod.string().min(1),
  "content": zod.string().nullish(),
  "id": zod.string().uuid(),
  "masterTemplate": zod.object({
    "id": zod.string().uuid()
  }).nullish()
});
var deleteTemplateByIdParams = zod.object({
  "id": zod.string().uuid()
});
var putTemplateByIdParams = zod.object({
  "id": zod.string().uuid()
});
var putTemplateByIdBody = zod.object({
  "name": zod.string().min(1),
  "alias": zod.string().min(1),
  "content": zod.string().nullish()
});
var getTemplateConfigurationResponse = zod.object({
  "disabled": zod.boolean()
});
var postTemplateQueryExecuteBody = zod.object({
  "rootDocument": zod.object({
    "id": zod.string().uuid()
  }).nullish(),
  "documentTypeAlias": zod.string().nullish(),
  "filters": zod.array(zod.object({
    "propertyAlias": zod.string().min(1),
    "constraintValue": zod.string().min(1),
    "operator": zod.enum(["Equals", "NotEquals", "Contains", "NotContains", "LessThan", "LessThanEqualTo", "GreaterThan", "GreaterThanEqualTo"])
  })).nullish(),
  "sort": zod.object({
    "propertyAlias": zod.string(),
    "direction": zod.string().nullish()
  }).nullish(),
  "take": zod.number()
});
var postTemplateQueryExecuteResponse = zod.object({
  "queryExpression": zod.string(),
  "sampleResults": zod.array(zod.object({
    "icon": zod.string(),
    "name": zod.string()
  })),
  "resultCount": zod.number(),
  "executionTime": zod.number()
});
var getTemplateQuerySettingsResponse = zod.object({
  "documentTypeAliases": zod.array(zod.string()),
  "properties": zod.array(zod.object({
    "alias": zod.string(),
    "type": zod.enum(["String", "DateTime", "Integer"])
  })),
  "operators": zod.array(zod.object({
    "operator": zod.enum(["Equals", "NotEquals", "Contains", "NotContains", "LessThan", "LessThanEqualTo", "GreaterThan", "GreaterThanEqualTo"]),
    "applicableTypes": zod.array(zod.enum(["String", "DateTime", "Integer"]))
  }))
});
var getTreeTemplateAncestorsQueryParams = zod.object({
  "descendantId": zod.string().uuid().optional()
});
var getTreeTemplateAncestorsResponseItem = zod.object({
  "hasChildren": zod.boolean(),
  "id": zod.string().uuid(),
  "parent": zod.object({
    "id": zod.string().uuid()
  }).nullish(),
  "name": zod.string()
});
var getTreeTemplateAncestorsResponse = zod.array(getTreeTemplateAncestorsResponseItem);
var getTreeTemplateChildrenQueryTakeDefault = 100;
var getTreeTemplateChildrenQueryParams = zod.object({
  "parentId": zod.string().uuid().optional(),
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getTreeTemplateChildrenQueryTakeDefault)
});
var getTreeTemplateChildrenResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "hasChildren": zod.boolean(),
    "id": zod.string().uuid(),
    "parent": zod.object({
      "id": zod.string().uuid()
    }).nullish(),
    "name": zod.string()
  }))
});
var getTreeTemplateRootQueryTakeDefault = 100;
var getTreeTemplateRootQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getTreeTemplateRootQueryTakeDefault)
});
var getTreeTemplateRootResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "hasChildren": zod.boolean(),
    "id": zod.string().uuid(),
    "parent": zod.object({
      "id": zod.string().uuid()
    }).nullish(),
    "name": zod.string()
  }))
});
var postTemporaryFileBody = zod.object({
  "Id": zod.string().uuid(),
  "File": zod.instanceof(FileLike)
});
var getTemporaryFileByIdParams = zod.object({
  "id": zod.string().uuid()
});
var getTemporaryFileByIdResponse = zod.object({
  "id": zod.string().uuid(),
  "availableUntil": zod.string().datetime({ "local": true }).nullish(),
  "fileName": zod.string().min(1)
});
var deleteTemporaryFileByIdParams = zod.object({
  "id": zod.string().uuid()
});
var getTemporaryFileConfigurationResponse = zod.object({
  "imageFileTypes": zod.array(zod.string()),
  "disallowedUploadedFilesExtensions": zod.array(zod.string()),
  "allowedUploadedFileExtensions": zod.array(zod.string()),
  "maxFileSize": zod.number().nullish()
});
var getUpgradeSettingsResponse = zod.object({
  "currentState": zod.string().min(1),
  "newState": zod.string().min(1),
  "newVersion": zod.string().min(1),
  "oldVersion": zod.string().min(1),
  "reportUrl": zod.string()
});
var postUserDataBody = zod.object({
  "group": zod.string(),
  "identifier": zod.string(),
  "value": zod.string(),
  "key": zod.string().uuid().nullish()
});
var getUserDataQueryTakeDefault = 100;
var getUserDataQueryParams = zod.object({
  "groups": zod.array(zod.string()).optional(),
  "identifiers": zod.array(zod.string()).optional(),
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getUserDataQueryTakeDefault)
});
var getUserDataResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "group": zod.string(),
    "identifier": zod.string(),
    "value": zod.string(),
    "key": zod.string().uuid()
  }))
});
var putUserDataBody = zod.object({
  "group": zod.string(),
  "identifier": zod.string(),
  "value": zod.string(),
  "key": zod.string().uuid()
});
var getUserDataByIdParams = zod.object({
  "id": zod.string().uuid()
});
var getUserDataByIdResponse = zod.object({
  "group": zod.string(),
  "identifier": zod.string(),
  "value": zod.string()
});
var getFilterUserGroupQueryTakeDefault = 100;
var getFilterUserGroupQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getFilterUserGroupQueryTakeDefault),
  "filter": zod.string().optional()
});
var getFilterUserGroupResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "name": zod.string(),
    "alias": zod.string(),
    "icon": zod.string().nullish(),
    "sections": zod.array(zod.string()),
    "languages": zod.array(zod.string()),
    "hasAccessToAllLanguages": zod.boolean(),
    "documentStartNode": zod.object({
      "id": zod.string().uuid()
    }).nullish(),
    "documentRootAccess": zod.boolean(),
    "mediaStartNode": zod.object({
      "id": zod.string().uuid()
    }).nullish(),
    "mediaRootAccess": zod.boolean(),
    "fallbackPermissions": zod.array(zod.string()),
    "permissions": zod.array(zod.object({
      "$type": zod.enum(["DocumentPermissionPresentationModel"]),
      "document": zod.object({
        "id": zod.string().uuid()
      }),
      "verbs": zod.array(zod.string())
    }).or(zod.object({
      "$type": zod.enum(["UnknownTypePermissionPresentationModel"]),
      "verbs": zod.array(zod.string()),
      "context": zod.string()
    }))),
    "id": zod.string().uuid(),
    "isDeletable": zod.boolean(),
    "aliasCanBeChanged": zod.boolean()
  }))
});
var getItemUserGroupQueryParams = zod.object({
  "id": zod.array(zod.string().uuid()).optional()
});
var getItemUserGroupResponseItem = zod.object({
  "id": zod.string().uuid(),
  "name": zod.string(),
  "icon": zod.string().nullish(),
  "alias": zod.string().nullish()
});
var getItemUserGroupResponse = zod.array(getItemUserGroupResponseItem);
var deleteUserGroupBody = zod.object({
  "userGroupIds": zod.array(zod.object({
    "id": zod.string().uuid()
  }))
});
var postUserGroupBody = zod.object({
  "name": zod.string(),
  "alias": zod.string(),
  "icon": zod.string().nullish(),
  "sections": zod.array(zod.string()),
  "languages": zod.array(zod.string()),
  "hasAccessToAllLanguages": zod.boolean(),
  "documentStartNode": zod.object({
    "id": zod.string().uuid()
  }).nullish(),
  "documentRootAccess": zod.boolean(),
  "mediaStartNode": zod.object({
    "id": zod.string().uuid()
  }).nullish(),
  "mediaRootAccess": zod.boolean(),
  "fallbackPermissions": zod.array(zod.string()),
  "permissions": zod.array(zod.object({
    "$type": zod.enum(["DocumentPermissionPresentationModel"]),
    "document": zod.object({
      "id": zod.string().uuid()
    }),
    "verbs": zod.array(zod.string())
  }).or(zod.object({
    "$type": zod.enum(["UnknownTypePermissionPresentationModel"]),
    "verbs": zod.array(zod.string()),
    "context": zod.string()
  }))),
  "id": zod.string().uuid().nullish()
});
var getUserGroupQueryTakeDefault = 100;
var getUserGroupQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getUserGroupQueryTakeDefault)
});
var getUserGroupResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "name": zod.string(),
    "alias": zod.string(),
    "icon": zod.string().nullish(),
    "sections": zod.array(zod.string()),
    "languages": zod.array(zod.string()),
    "hasAccessToAllLanguages": zod.boolean(),
    "documentStartNode": zod.object({
      "id": zod.string().uuid()
    }).nullish(),
    "documentRootAccess": zod.boolean(),
    "mediaStartNode": zod.object({
      "id": zod.string().uuid()
    }).nullish(),
    "mediaRootAccess": zod.boolean(),
    "fallbackPermissions": zod.array(zod.string()),
    "permissions": zod.array(zod.object({
      "$type": zod.enum(["DocumentPermissionPresentationModel"]),
      "document": zod.object({
        "id": zod.string().uuid()
      }),
      "verbs": zod.array(zod.string())
    }).or(zod.object({
      "$type": zod.enum(["UnknownTypePermissionPresentationModel"]),
      "verbs": zod.array(zod.string()),
      "context": zod.string()
    }))),
    "id": zod.string().uuid(),
    "isDeletable": zod.boolean(),
    "aliasCanBeChanged": zod.boolean()
  }))
});
var getUserGroupByIdParams = zod.object({
  "id": zod.string().uuid()
});
var getUserGroupByIdResponse = zod.object({
  "name": zod.string(),
  "alias": zod.string(),
  "icon": zod.string().nullish(),
  "sections": zod.array(zod.string()),
  "languages": zod.array(zod.string()),
  "hasAccessToAllLanguages": zod.boolean(),
  "documentStartNode": zod.object({
    "id": zod.string().uuid()
  }).nullish(),
  "documentRootAccess": zod.boolean(),
  "mediaStartNode": zod.object({
    "id": zod.string().uuid()
  }).nullish(),
  "mediaRootAccess": zod.boolean(),
  "fallbackPermissions": zod.array(zod.string()),
  "permissions": zod.array(zod.object({
    "$type": zod.enum(["DocumentPermissionPresentationModel"]),
    "document": zod.object({
      "id": zod.string().uuid()
    }),
    "verbs": zod.array(zod.string())
  }).or(zod.object({
    "$type": zod.enum(["UnknownTypePermissionPresentationModel"]),
    "verbs": zod.array(zod.string()),
    "context": zod.string()
  }))),
  "id": zod.string().uuid(),
  "isDeletable": zod.boolean(),
  "aliasCanBeChanged": zod.boolean()
});
var deleteUserGroupByIdParams = zod.object({
  "id": zod.string().uuid()
});
var putUserGroupByIdParams = zod.object({
  "id": zod.string().uuid()
});
var putUserGroupByIdBody = zod.object({
  "name": zod.string(),
  "alias": zod.string(),
  "icon": zod.string().nullish(),
  "sections": zod.array(zod.string()),
  "languages": zod.array(zod.string()),
  "hasAccessToAllLanguages": zod.boolean(),
  "documentStartNode": zod.object({
    "id": zod.string().uuid()
  }).nullish(),
  "documentRootAccess": zod.boolean(),
  "mediaStartNode": zod.object({
    "id": zod.string().uuid()
  }).nullish(),
  "mediaRootAccess": zod.boolean(),
  "fallbackPermissions": zod.array(zod.string()),
  "permissions": zod.array(zod.object({
    "$type": zod.enum(["DocumentPermissionPresentationModel"]),
    "document": zod.object({
      "id": zod.string().uuid()
    }),
    "verbs": zod.array(zod.string())
  }).or(zod.object({
    "$type": zod.enum(["UnknownTypePermissionPresentationModel"]),
    "verbs": zod.array(zod.string()),
    "context": zod.string()
  })))
});
var deleteUserGroupByIdUsersParams = zod.object({
  "id": zod.string().uuid()
});
var deleteUserGroupByIdUsersBodyItem = zod.object({
  "id": zod.string().uuid()
});
var deleteUserGroupByIdUsersBody = zod.array(deleteUserGroupByIdUsersBodyItem);
var postUserGroupByIdUsersParams = zod.object({
  "id": zod.string().uuid()
});
var postUserGroupByIdUsersBodyItem = zod.object({
  "id": zod.string().uuid()
});
var postUserGroupByIdUsersBody = zod.array(postUserGroupByIdUsersBodyItem);
var getFilterUserQueryTakeDefault = 100;
var getFilterUserQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getFilterUserQueryTakeDefault),
  "orderBy": zod.enum(["UserName", "Language", "Name", "Email", "Id", "CreateDate", "UpdateDate", "IsApproved", "IsLockedOut", "LastLoginDate"]).optional(),
  "orderDirection": zod.enum(["Ascending", "Descending"]).optional(),
  "userGroupIds": zod.array(zod.string().uuid()).optional(),
  "userStates": zod.array(zod.enum(["Active", "Disabled", "LockedOut", "Invited", "Inactive", "All"])).optional(),
  "filter": zod.string().optional()
});
var getFilterUserResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "email": zod.string(),
    "userName": zod.string(),
    "name": zod.string(),
    "userGroupIds": zod.array(zod.object({
      "id": zod.string().uuid()
    })),
    "id": zod.string().uuid(),
    "languageIsoCode": zod.string().nullish(),
    "documentStartNodeIds": zod.array(zod.object({
      "id": zod.string().uuid()
    })),
    "hasDocumentRootAccess": zod.boolean(),
    "mediaStartNodeIds": zod.array(zod.object({
      "id": zod.string().uuid()
    })),
    "hasMediaRootAccess": zod.boolean(),
    "avatarUrls": zod.array(zod.string()),
    "state": zod.enum(["Active", "Disabled", "LockedOut", "Invited", "Inactive", "All"]),
    "failedLoginAttempts": zod.number(),
    "createDate": zod.string().datetime({ "local": true }),
    "updateDate": zod.string().datetime({ "local": true }),
    "lastLoginDate": zod.string().datetime({ "local": true }).nullish(),
    "lastLockoutDate": zod.string().datetime({ "local": true }).nullish(),
    "lastPasswordChangeDate": zod.string().datetime({ "local": true }).nullish(),
    "isAdmin": zod.boolean(),
    "kind": zod.enum(["Default", "Api"])
  }))
});
var getItemUserQueryParams = zod.object({
  "id": zod.array(zod.string().uuid()).optional()
});
var getItemUserResponseItem = zod.object({
  "id": zod.string().uuid(),
  "name": zod.string(),
  "avatarUrls": zod.array(zod.string()),
  "kind": zod.enum(["Default", "Api"])
});
var getItemUserResponse = zod.array(getItemUserResponseItem);
var postUserBody = zod.object({
  "email": zod.string(),
  "userName": zod.string(),
  "name": zod.string(),
  "userGroupIds": zod.array(zod.object({
    "id": zod.string().uuid()
  })),
  "id": zod.string().uuid().nullish(),
  "kind": zod.enum(["Default", "Api"])
});
var deleteUserBody = zod.object({
  "userIds": zod.array(zod.object({
    "id": zod.string().uuid()
  }))
});
var getUserQueryTakeDefault = 100;
var getUserQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getUserQueryTakeDefault)
});
var getUserResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "email": zod.string(),
    "userName": zod.string(),
    "name": zod.string(),
    "userGroupIds": zod.array(zod.object({
      "id": zod.string().uuid()
    })),
    "id": zod.string().uuid(),
    "languageIsoCode": zod.string().nullish(),
    "documentStartNodeIds": zod.array(zod.object({
      "id": zod.string().uuid()
    })),
    "hasDocumentRootAccess": zod.boolean(),
    "mediaStartNodeIds": zod.array(zod.object({
      "id": zod.string().uuid()
    })),
    "hasMediaRootAccess": zod.boolean(),
    "avatarUrls": zod.array(zod.string()),
    "state": zod.enum(["Active", "Disabled", "LockedOut", "Invited", "Inactive", "All"]),
    "failedLoginAttempts": zod.number(),
    "createDate": zod.string().datetime({ "local": true }),
    "updateDate": zod.string().datetime({ "local": true }),
    "lastLoginDate": zod.string().datetime({ "local": true }).nullish(),
    "lastLockoutDate": zod.string().datetime({ "local": true }).nullish(),
    "lastPasswordChangeDate": zod.string().datetime({ "local": true }).nullish(),
    "isAdmin": zod.boolean(),
    "kind": zod.enum(["Default", "Api"])
  }))
});
var getUserByIdParams = zod.object({
  "id": zod.string().uuid()
});
var getUserByIdResponse = zod.object({
  "email": zod.string(),
  "userName": zod.string(),
  "name": zod.string(),
  "userGroupIds": zod.array(zod.object({
    "id": zod.string().uuid()
  })),
  "id": zod.string().uuid(),
  "languageIsoCode": zod.string().nullish(),
  "documentStartNodeIds": zod.array(zod.object({
    "id": zod.string().uuid()
  })),
  "hasDocumentRootAccess": zod.boolean(),
  "mediaStartNodeIds": zod.array(zod.object({
    "id": zod.string().uuid()
  })),
  "hasMediaRootAccess": zod.boolean(),
  "avatarUrls": zod.array(zod.string()),
  "state": zod.enum(["Active", "Disabled", "LockedOut", "Invited", "Inactive", "All"]),
  "failedLoginAttempts": zod.number(),
  "createDate": zod.string().datetime({ "local": true }),
  "updateDate": zod.string().datetime({ "local": true }),
  "lastLoginDate": zod.string().datetime({ "local": true }).nullish(),
  "lastLockoutDate": zod.string().datetime({ "local": true }).nullish(),
  "lastPasswordChangeDate": zod.string().datetime({ "local": true }).nullish(),
  "isAdmin": zod.boolean(),
  "kind": zod.enum(["Default", "Api"])
});
var deleteUserByIdParams = zod.object({
  "id": zod.string().uuid()
});
var putUserByIdParams = zod.object({
  "id": zod.string().uuid()
});
var putUserByIdBody = zod.object({
  "email": zod.string(),
  "userName": zod.string(),
  "name": zod.string(),
  "userGroupIds": zod.array(zod.object({
    "id": zod.string().uuid()
  })),
  "languageIsoCode": zod.string(),
  "documentStartNodeIds": zod.array(zod.object({
    "id": zod.string().uuid()
  })),
  "hasDocumentRootAccess": zod.boolean(),
  "mediaStartNodeIds": zod.array(zod.object({
    "id": zod.string().uuid()
  })),
  "hasMediaRootAccess": zod.boolean()
});
var getUserById2faParams = zod.object({
  "id": zod.string().uuid()
});
var getUserById2faResponseItem = zod.object({
  "providerName": zod.string(),
  "isEnabledOnUser": zod.boolean()
});
var getUserById2faResponse = zod.array(getUserById2faResponseItem);
var deleteUserById2faByProviderNameParams = zod.object({
  "id": zod.string().uuid(),
  "providerName": zod.string()
});
var getUserByIdCalculateStartNodesParams = zod.object({
  "id": zod.string().uuid()
});
var getUserByIdCalculateStartNodesResponse = zod.object({
  "id": zod.string().uuid(),
  "documentStartNodeIds": zod.array(zod.object({
    "id": zod.string().uuid()
  })),
  "hasDocumentRootAccess": zod.boolean(),
  "mediaStartNodeIds": zod.array(zod.object({
    "id": zod.string().uuid()
  })),
  "hasMediaRootAccess": zod.boolean()
});
var postUserByIdChangePasswordParams = zod.object({
  "id": zod.string().uuid()
});
var postUserByIdChangePasswordBody = zod.object({
  "newPassword": zod.string()
});
var postUserByIdClientCredentialsParams = zod.object({
  "id": zod.string().uuid()
});
var postUserByIdClientCredentialsBody = zod.object({
  "clientId": zod.string(),
  "clientSecret": zod.string()
});
var getUserByIdClientCredentialsParams = zod.object({
  "id": zod.string().uuid()
});
var getUserByIdClientCredentialsResponseItem = zod.string();
var getUserByIdClientCredentialsResponse = zod.array(getUserByIdClientCredentialsResponseItem);
var deleteUserByIdClientCredentialsByClientIdParams = zod.object({
  "id": zod.string().uuid(),
  "clientId": zod.string()
});
var postUserByIdResetPasswordParams = zod.object({
  "id": zod.string().uuid()
});
var postUserByIdResetPasswordResponse = zod.object({
  "resetPassword": zod.string().nullish()
});
var deleteUserAvatarByIdParams = zod.object({
  "id": zod.string().uuid()
});
var postUserAvatarByIdParams = zod.object({
  "id": zod.string().uuid()
});
var postUserAvatarByIdBody = zod.object({
  "file": zod.object({
    "id": zod.string().uuid()
  })
});
var getUserConfigurationResponse = zod.object({
  "canInviteUsers": zod.boolean(),
  "usernameIsEmail": zod.boolean(),
  "passwordConfiguration": zod.object({
    "minimumPasswordLength": zod.number(),
    "requireNonLetterOrDigit": zod.boolean(),
    "requireDigit": zod.boolean(),
    "requireLowercase": zod.boolean(),
    "requireUppercase": zod.boolean()
  }),
  "allowChangePassword": zod.boolean(),
  "allowTwoFactor": zod.boolean()
});
var getUserCurrentResponse = zod.object({
  "email": zod.string(),
  "userName": zod.string(),
  "name": zod.string(),
  "userGroupIds": zod.array(zod.object({
    "id": zod.string().uuid()
  })),
  "id": zod.string().uuid(),
  "languageIsoCode": zod.string().nullable(),
  "documentStartNodeIds": zod.array(zod.object({
    "id": zod.string().uuid()
  })),
  "hasDocumentRootAccess": zod.boolean(),
  "mediaStartNodeIds": zod.array(zod.object({
    "id": zod.string().uuid()
  })),
  "hasMediaRootAccess": zod.boolean(),
  "avatarUrls": zod.array(zod.string()),
  "languages": zod.array(zod.string()),
  "hasAccessToAllLanguages": zod.boolean(),
  "hasAccessToSensitiveData": zod.boolean(),
  "fallbackPermissions": zod.array(zod.string()),
  "permissions": zod.array(zod.object({
    "$type": zod.enum(["DocumentPermissionPresentationModel"]),
    "document": zod.object({
      "id": zod.string().uuid()
    }),
    "verbs": zod.array(zod.string())
  }).or(zod.object({
    "$type": zod.enum(["UnknownTypePermissionPresentationModel"]),
    "verbs": zod.array(zod.string()),
    "context": zod.string()
  }))),
  "allowedSections": zod.array(zod.string()),
  "isAdmin": zod.boolean()
});
var getUserCurrent2faResponseItem = zod.object({
  "providerName": zod.string(),
  "isEnabledOnUser": zod.boolean()
});
var getUserCurrent2faResponse = zod.array(getUserCurrent2faResponseItem);
var deleteUserCurrent2faByProviderNameParams = zod.object({
  "providerName": zod.string()
});
var deleteUserCurrent2faByProviderNameQueryParams = zod.object({
  "code": zod.string().optional()
});
var postUserCurrent2faByProviderNameParams = zod.object({
  "providerName": zod.string()
});
var postUserCurrent2faByProviderNameBody = zod.object({
  "code": zod.string(),
  "secret": zod.string()
});
var postUserCurrent2faByProviderNameResponse = zod.object({});
var getUserCurrent2faByProviderNameParams = zod.object({
  "providerName": zod.string()
});
var getUserCurrent2faByProviderNameResponse = zod.object({});
var postUserCurrentAvatarBody = zod.object({
  "file": zod.object({
    "id": zod.string().uuid()
  })
});
var postUserCurrentChangePasswordBody = zod.object({
  "newPassword": zod.string(),
  "oldPassword": zod.string().nullish()
});
var getUserCurrentConfigurationResponse = zod.object({
  "keepUserLoggedIn": zod.boolean(),
  "usernameIsEmail": zod.boolean(),
  "passwordConfiguration": zod.object({
    "minimumPasswordLength": zod.number(),
    "requireNonLetterOrDigit": zod.boolean(),
    "requireDigit": zod.boolean(),
    "requireLowercase": zod.boolean(),
    "requireUppercase": zod.boolean()
  }),
  "allowChangePassword": zod.boolean(),
  "allowTwoFactor": zod.boolean()
});
var getUserCurrentLoginProvidersResponseItem = zod.object({
  "providerSchemeName": zod.string(),
  "providerKey": zod.string().nullish(),
  "isLinkedOnUser": zod.boolean(),
  "hasManualLinkingEnabled": zod.boolean()
});
var getUserCurrentLoginProvidersResponse = zod.array(getUserCurrentLoginProvidersResponseItem);
var getUserCurrentPermissionsQueryParams = zod.object({
  "id": zod.array(zod.string().uuid()).optional()
});
var getUserCurrentPermissionsResponse = zod.object({
  "permissions": zod.array(zod.object({
    "nodeKey": zod.string().uuid(),
    "permissions": zod.array(zod.string())
  }))
});
var getUserCurrentPermissionsDocumentQueryParams = zod.object({
  "id": zod.array(zod.string().uuid()).optional()
});
var getUserCurrentPermissionsDocumentResponseItem = zod.object({
  "permissions": zod.array(zod.object({
    "nodeKey": zod.string().uuid(),
    "permissions": zod.array(zod.string())
  }))
});
var getUserCurrentPermissionsDocumentResponse = zod.array(getUserCurrentPermissionsDocumentResponseItem);
var getUserCurrentPermissionsMediaQueryParams = zod.object({
  "id": zod.array(zod.string().uuid()).optional()
});
var getUserCurrentPermissionsMediaResponse = zod.object({
  "permissions": zod.array(zod.object({
    "nodeKey": zod.string().uuid(),
    "permissions": zod.array(zod.string())
  }))
});
var postUserDisableBody = zod.object({
  "userIds": zod.array(zod.object({
    "id": zod.string().uuid()
  }))
});
var postUserEnableBody = zod.object({
  "userIds": zod.array(zod.object({
    "id": zod.string().uuid()
  }))
});
var postUserInviteBody = zod.object({
  "email": zod.string(),
  "userName": zod.string(),
  "name": zod.string(),
  "userGroupIds": zod.array(zod.object({
    "id": zod.string().uuid()
  })),
  "id": zod.string().uuid().nullish(),
  "message": zod.string().nullish()
});
var postUserInviteCreatePasswordBody = zod.object({
  "user": zod.object({
    "id": zod.string().uuid()
  }),
  "token": zod.string().min(1),
  "password": zod.string()
});
var postUserInviteResendBody = zod.object({
  "user": zod.object({
    "id": zod.string().uuid()
  }),
  "message": zod.string().nullish()
});
var postUserInviteVerifyBody = zod.object({
  "user": zod.object({
    "id": zod.string().uuid()
  }),
  "token": zod.string().min(1)
});
var postUserInviteVerifyResponse = zod.object({
  "passwordConfiguration": zod.object({
    "minimumPasswordLength": zod.number(),
    "requireNonLetterOrDigit": zod.boolean(),
    "requireDigit": zod.boolean(),
    "requireLowercase": zod.boolean(),
    "requireUppercase": zod.boolean()
  })
});
var postUserSetUserGroupsBody = zod.object({
  "userIds": zod.array(zod.object({
    "id": zod.string().uuid()
  })),
  "userGroupIds": zod.array(zod.object({
    "id": zod.string().uuid()
  }))
});
var postUserUnlockBody = zod.object({
  "userIds": zod.array(zod.object({
    "id": zod.string().uuid()
  }))
});
var getItemWebhookQueryParams = zod.object({
  "id": zod.array(zod.string().uuid()).optional()
});
var getItemWebhookResponseItem = zod.object({
  "enabled": zod.boolean(),
  "name": zod.string(),
  "events": zod.string(),
  "url": zod.string(),
  "types": zod.string()
});
var getItemWebhookResponse = zod.array(getItemWebhookResponseItem);
var getWebhookQueryTakeDefault = 100;
var getWebhookQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getWebhookQueryTakeDefault)
});
var getWebhookResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "enabled": zod.boolean(),
    "name": zod.string().nullish(),
    "description": zod.string().nullish(),
    "url": zod.string().min(1),
    "contentTypeKeys": zod.array(zod.string().uuid()),
    "headers": zod.record(zod.string(), zod.string()),
    "id": zod.string().uuid(),
    "events": zod.array(zod.object({
      "eventName": zod.string(),
      "eventType": zod.string(),
      "alias": zod.string()
    }))
  }))
});
var postWebhookBody = zod.object({
  "enabled": zod.boolean(),
  "name": zod.string().nullish(),
  "description": zod.string().nullish(),
  "url": zod.string().min(1),
  "contentTypeKeys": zod.array(zod.string().uuid()),
  "headers": zod.record(zod.string(), zod.string()),
  "id": zod.string().uuid().nullish(),
  "events": zod.array(zod.string())
});
var getWebhookByIdParams = zod.object({
  "id": zod.string().uuid()
});
var getWebhookByIdResponse = zod.object({
  "enabled": zod.boolean(),
  "name": zod.string().nullish(),
  "description": zod.string().nullish(),
  "url": zod.string().min(1),
  "contentTypeKeys": zod.array(zod.string().uuid()),
  "headers": zod.record(zod.string(), zod.string()),
  "id": zod.string().uuid(),
  "events": zod.array(zod.object({
    "eventName": zod.string(),
    "eventType": zod.string(),
    "alias": zod.string()
  }))
});
var deleteWebhookByIdParams = zod.object({
  "id": zod.string().uuid()
});
var putWebhookByIdParams = zod.object({
  "id": zod.string().uuid()
});
var putWebhookByIdBody = zod.object({
  "enabled": zod.boolean(),
  "name": zod.string().nullish(),
  "description": zod.string().nullish(),
  "url": zod.string().min(1),
  "contentTypeKeys": zod.array(zod.string().uuid()),
  "headers": zod.record(zod.string(), zod.string()),
  "events": zod.array(zod.string())
});
var getWebhookByIdLogsParams = zod.object({
  "id": zod.string().uuid()
});
var getWebhookByIdLogsQueryTakeDefault = 100;
var getWebhookByIdLogsQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getWebhookByIdLogsQueryTakeDefault)
});
var getWebhookByIdLogsResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "key": zod.string().uuid(),
    "webhookKey": zod.string().uuid(),
    "statusCode": zod.string(),
    "isSuccessStatusCode": zod.boolean(),
    "date": zod.string().datetime({ "local": true }),
    "eventAlias": zod.string(),
    "url": zod.string(),
    "retryCount": zod.number(),
    "requestHeaders": zod.string(),
    "requestBody": zod.string(),
    "responseHeaders": zod.string(),
    "responseBody": zod.string(),
    "exceptionOccured": zod.boolean()
  }))
});
var getWebhookEventsQueryTakeDefault = 100;
var getWebhookEventsQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getWebhookEventsQueryTakeDefault)
});
var getWebhookEventsResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "eventName": zod.string(),
    "eventType": zod.string(),
    "alias": zod.string()
  }))
});
var getWebhookLogsQueryTakeDefault = 100;
var getWebhookLogsQueryParams = zod.object({
  "skip": zod.coerce.number().optional(),
  "take": zod.coerce.number().default(getWebhookLogsQueryTakeDefault)
});
var getWebhookLogsResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
    "key": zod.string().uuid(),
    "webhookKey": zod.string().uuid(),
    "statusCode": zod.string(),
    "isSuccessStatusCode": zod.boolean(),
    "date": zod.string().datetime({ "local": true }),
    "eventAlias": zod.string(),
    "url": zod.string(),
    "retryCount": zod.number(),
    "requestHeaders": zod.string(),
    "requestBody": zod.string(),
    "responseHeaders": zod.string(),
    "responseBody": zod.string(),
    "exceptionOccured": zod.boolean()
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
import { z } from "zod";
var UpdateDataTypeTool = CreateUmbracoTool(
  "update-data-type",
  "Updates a data type by Id",
  {
    id: putDataTypeByIdParams.shape.id,
    data: z.object(putDataTypeByIdBody.shape)
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
import { z as z2 } from "zod";
var CopyDataTypeTool = CreateUmbracoTool(
  "copy-data-type",
  "Copy a data type by Id",
  {
    id: postDataTypeByIdCopyParams.shape.id,
    body: z2.object(postDataTypeByIdCopyBody.shape)
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
import { z as z3 } from "zod";
var MoveDataTypeTool = CreateUmbracoTool(
  "move-data-type",
  "Updates a data type by Id",
  {
    id: putDataTypeByIdMoveParams.shape.id,
    data: z3.object(putDataTypeByIdMoveBody.shape)
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
import { z as z4 } from "zod";
var UpdateDictionaryItemTool = CreateUmbracoTool(
  "update-dictionary-item",
  "Updates a dictionary item by Id",
  {
    id: putDictionaryByIdParams.shape.id,
    data: z4.object(putDictionaryByIdBody.shape)
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
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
var GetDataTypeRootResource = CreateUmbracoTemplateResource(
  "List Data Types at Root",
  "List the data types at the root of the Umbraco instance",
  new ResourceTemplate("umbraco://data-type/root?skip={skip}&take={take}&foldersOnly={foldersOnly}", {
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

// src/resources/data-types/get/get-children.ts
import { ResourceTemplate as ResourceTemplate2 } from "@modelcontextprotocol/sdk/server/mcp.js";
var GetDataTypeChildrenResource = CreateUmbracoTemplateResource(
  "List Data Type Children",
  "List the children of a data type folder",
  new ResourceTemplate2("umbraco://data-type/children?parentId={parentId}&skip={skip}&take={take}&foldersOnly={foldersOnly}", {
    list: void 0,
    complete: {
      parentId: (value) => [],
      // This will be populated dynamically
      skip: (value) => ["0", "10", "20", "30", "40", "50", "60", "70", "80", "90", "100"],
      take: (value) => ["10", "20", "50", "100"],
      foldersOnly: (value) => ["true", "false"]
    }
  }),
  async (uri, variables) => {
    try {
      const client = UmbracoManagementClient2.getClient();
      const params = getTreeDataTypeChildrenQueryParams.parse(variables);
      const response = await client.getTreeDataTypeChildren(params);
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify(response, null, 2),
          mimeType: "application/json"
        }]
      };
    } catch (error) {
      console.error("Error in GetDataTypeChildrenResource:", error);
      throw error;
    }
  }
);
var get_children_default = GetDataTypeChildrenResource;

// src/resources/data-types/get/get-search.ts
import { ResourceTemplate as ResourceTemplate3 } from "@modelcontextprotocol/sdk/server/mcp.js";
var GetDataTypeSearchResource = CreateUmbracoTemplateResource(
  "Search Data Types",
  "Search for data types by name",
  new ResourceTemplate3("umbraco://data-type/search?query={query}&skip={skip}&take={take}", {
    list: void 0,
    complete: {
      query: (value) => [],
      // This will be populated dynamically
      skip: (value) => ["0", "10", "20", "30", "40", "50", "60", "70", "80", "90", "100"],
      take: (value) => ["10", "20", "50", "100"]
    }
  }),
  async (uri, variables) => {
    try {
      const client = UmbracoManagementClient2.getClient();
      const params = getItemDataTypeSearchQueryParams.parse(variables);
      const response = await client.getItemDataTypeSearch(params);
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify(response, null, 2),
          mimeType: "application/json"
        }]
      };
    } catch (error) {
      console.error("Error in GetDataTypeSearchResource:", error);
      throw error;
    }
  }
);
var get_search_default2 = GetDataTypeSearchResource;

// src/resources/data-types/get/get-ancestors.ts
import { ResourceTemplate as ResourceTemplate4 } from "@modelcontextprotocol/sdk/server/mcp.js";
var GetDataTypeAncestorsResource = CreateUmbracoTemplateResource(
  "List Ancestor Data Types",
  "List the ancestors of a data type",
  new ResourceTemplate4("umbraco://data-type/ancestors?descendantId={descendantId}", {
    list: void 0,
    complete: {
      descendantId: (value) => []
      // This will be populated dynamically
    }
  }),
  async (uri, variables) => {
    try {
      const client = UmbracoManagementClient2.getClient();
      const params = getTreeDataTypeAncestorsQueryParams.parse(variables);
      const response = await client.getTreeDataTypeAncestors(params);
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify(response, null, 2),
          mimeType: "application/json"
        }]
      };
    } catch (error) {
      console.error("Error in GetDataTypeAncestorsResource:", error);
      throw error;
    }
  }
);
var get_ancestors_default = GetDataTypeAncestorsResource;

// src/resources/data-types/get/get-filter.ts
import { ResourceTemplate as ResourceTemplate5 } from "@modelcontextprotocol/sdk/server/mcp.js";
var GetDataTypeFilterResource = CreateUmbracoTemplateResource(
  "Filter Data Types",
  "Filter data types by name, editor UI alias, or editor alias",
  new ResourceTemplate5("umbraco://data-type/filter?name={name}&editorUiAlias={editorUiAlias}&editorAlias={editorAlias}&skip={skip}&take={take}", {
    list: void 0,
    complete: {
      name: (value) => [],
      // This will be populated dynamically
      editorUiAlias: (value) => [],
      // This will be populated dynamically
      editorAlias: (value) => [],
      // This will be populated dynamically
      skip: (value) => ["0", "10", "20", "30", "40", "50", "60", "70", "80", "90", "100"],
      take: (value) => ["10", "20", "50", "100"]
    }
  }),
  async (uri, variables) => {
    try {
      const client = UmbracoManagementClient2.getClient();
      const params = getFilterDataTypeQueryParams.parse(variables);
      const response = await client.getFilterDataType(params);
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify(response, null, 2),
          mimeType: "application/json"
        }]
      };
    } catch (error) {
      console.error("Error in GetDataTypeFilterResource:", error);
      throw error;
    }
  }
);
var get_filter_default = GetDataTypeFilterResource;

// src/resources/data-types/get/get-folder.ts
import { ResourceTemplate as ResourceTemplate6 } from "@modelcontextprotocol/sdk/server/mcp.js";
var GetDataTypeFolderResource = CreateUmbracoTemplateResource(
  "Get Data Type Folder",
  "Get details of a data type folder",
  new ResourceTemplate6("umbraco://data-type/folder/{id}", {
    list: void 0,
    complete: {
      id: (value) => []
      // This will be populated dynamically
    }
  }),
  async (uri, variables) => {
    try {
      const client = UmbracoManagementClient2.getClient();
      const params = getDataTypeFolderByIdParams.parse(variables);
      const response = await client.getDataTypeFolderById(params.id);
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify(response, null, 2),
          mimeType: "application/json"
        }]
      };
    } catch (error) {
      console.error("Error in GetDataTypeFolderResource:", error);
      throw error;
    }
  }
);
var get_folder_default2 = GetDataTypeFolderResource;

// src/resources/data-types/get/get-is-used.ts
import { ResourceTemplate as ResourceTemplate7 } from "@modelcontextprotocol/sdk/server/mcp.js";
var GetDataTypeIsUsedResource = CreateUmbracoTemplateResource(
  "Check Data Type Usage",
  "Check if a data type is used within Umbraco",
  new ResourceTemplate7("umbraco://data-type/{id}/is-used", {
    list: void 0,
    complete: {
      id: (value) => []
      // This will be populated dynamically
    }
  }),
  async (uri, variables) => {
    try {
      const client = UmbracoManagementClient2.getClient();
      const params = getDataTypeByIdIsUsedParams.parse(variables);
      const response = await client.getDataTypeByIdIsUsed(params.id);
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify(response, null, 2),
          mimeType: "application/json"
        }]
      };
    } catch (error) {
      console.error("Error in GetDataTypeIsUsedResource:", error);
      throw error;
    }
  }
);
var get_is_used_default = GetDataTypeIsUsedResource;

// src/resources/data-types/index.ts
var DataTypeTemplateResources = [
  get_root_default2,
  get_children_default,
  get_search_default2,
  get_ancestors_default,
  get_filter_default,
  get_folder_default2,
  get_is_used_default
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
  const transport = new StdioServerTransport();
  await server.connect(transport);
};
main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
//# sourceMappingURL=index.js.map