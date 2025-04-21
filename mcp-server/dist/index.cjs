#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/index.ts
var import_stdio = require("@modelcontextprotocol/sdk/server/stdio.js");

// src/server/umbraco-mcp-server.ts
var import_mcp = require("@modelcontextprotocol/sdk/server/mcp.js");
var UmbracoMcpServer = class _UmbracoMcpServer {
  static instance = null;
  constructor() {
  }
  static GetServer() {
    if (_UmbracoMcpServer.instance === null) {
      _UmbracoMcpServer.instance = new import_mcp.McpServer({
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
var import_axios = __toESM(require("axios"), 1);
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
var UmbracoAxios = import_axios.default.create({ baseURL });
var accessToken = null;
var tokenExpiry = null;
var fetchAccessToken = async () => {
  const response = await import_axios.default.post(
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
  const source = import_axios.default.CancelToken.source();
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

// src/tools/culture/get-cultures.ts
var import_zod = require("zod");
var GetCulturesTool = CreateUmbracoTool(
  "get-culture",
  "Retrieves a paginated list of cultures that Umbraco can be configured to use",
  {
    skip: import_zod.z.number().nonnegative().default(0),
    take: import_zod.z.number().positive().default(100)
  },
  async ({ skip, take }) => {
    const client = UmbracoManagementClient2.getClient();
    var response = await client.getCulture({ skip, take });
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
var import_zod2 = require("zod");
var GetDataTypeTool = CreateUmbracoTool(
  "get-data-type-root",
  "Gets the root level of the data type tree.",
  {
    skip: import_zod2.z.number().nonnegative().default(0),
    take: import_zod2.z.number().positive().default(100),
    foldersOnly: import_zod2.z.boolean().default(false).describe("If true, only folders will be returned.")
  },
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
var get_root_default = GetDataTypeTool;

// src/api/umbraco/management/umbracoManagementAPI.zod.ts
var import_zod3 = require("zod");
var getCultureQueryTakeDefault = 100;
var getCultureQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getCultureQueryTakeDefault)
});
var getCultureResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "name": import_zod3.z.string().min(1),
    "englishName": import_zod3.z.string().min(1)
  }))
});
var postDataTypeBody = import_zod3.z.object({
  "name": import_zod3.z.string().min(1),
  "editorAlias": import_zod3.z.string().min(1),
  "editorUiAlias": import_zod3.z.string(),
  "values": import_zod3.z.array(import_zod3.z.object({
    "alias": import_zod3.z.string(),
    "value": import_zod3.z.any().nullish()
  })),
  "id": import_zod3.z.string().uuid().nullish(),
  "parent": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish()
});
var getDataTypeByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getDataTypeByIdResponse = import_zod3.z.object({
  "name": import_zod3.z.string().min(1),
  "editorAlias": import_zod3.z.string().min(1),
  "editorUiAlias": import_zod3.z.string(),
  "values": import_zod3.z.array(import_zod3.z.object({
    "alias": import_zod3.z.string(),
    "value": import_zod3.z.any().nullish()
  })),
  "id": import_zod3.z.string().uuid(),
  "isDeletable": import_zod3.z.boolean(),
  "canIgnoreStartNodes": import_zod3.z.boolean()
});
var deleteDataTypeByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putDataTypeByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putDataTypeByIdBody = import_zod3.z.object({
  "name": import_zod3.z.string().min(1),
  "editorAlias": import_zod3.z.string().min(1),
  "editorUiAlias": import_zod3.z.string(),
  "values": import_zod3.z.array(import_zod3.z.object({
    "alias": import_zod3.z.string(),
    "value": import_zod3.z.any().nullish()
  }))
});
var postDataTypeByIdCopyParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var postDataTypeByIdCopyBody = import_zod3.z.object({
  "target": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish()
});
var getDataTypeByIdIsUsedParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getDataTypeByIdIsUsedResponse = import_zod3.z.boolean();
var putDataTypeByIdMoveParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putDataTypeByIdMoveBody = import_zod3.z.object({
  "target": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish()
});
var getDataTypeByIdReferencesParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getDataTypeByIdReferencesResponseItem = import_zod3.z.object({
  "contentType": import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "type": import_zod3.z.string().nullable(),
    "name": import_zod3.z.string().nullable(),
    "icon": import_zod3.z.string().nullable()
  }),
  "properties": import_zod3.z.array(import_zod3.z.object({
    "name": import_zod3.z.string(),
    "alias": import_zod3.z.string()
  }))
});
var getDataTypeByIdReferencesResponse = import_zod3.z.array(getDataTypeByIdReferencesResponseItem);
var getDataTypeConfigurationResponse = import_zod3.z.object({
  "canBeChanged": import_zod3.z.enum(["True", "False", "FalseWithHelpText"]),
  "documentListViewId": import_zod3.z.string().uuid(),
  "mediaListViewId": import_zod3.z.string().uuid()
});
var postDataTypeFolderBody = import_zod3.z.object({
  "name": import_zod3.z.string().min(1),
  "id": import_zod3.z.string().uuid().nullish(),
  "parent": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish()
});
var getDataTypeFolderByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getDataTypeFolderByIdResponse = import_zod3.z.object({
  "name": import_zod3.z.string().min(1),
  "id": import_zod3.z.string().uuid()
});
var deleteDataTypeFolderByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putDataTypeFolderByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putDataTypeFolderByIdBody = import_zod3.z.object({
  "name": import_zod3.z.string().min(1)
});
var getFilterDataTypeQueryTakeDefault = 100;
var getFilterDataTypeQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getFilterDataTypeQueryTakeDefault),
  "name": import_zod3.z.string().optional(),
  "editorUiAlias": import_zod3.z.string().optional(),
  "editorAlias": import_zod3.z.string().optional()
});
var getFilterDataTypeResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "name": import_zod3.z.string(),
    "editorUiAlias": import_zod3.z.string().nullish(),
    "editorAlias": import_zod3.z.string(),
    "isDeletable": import_zod3.z.boolean()
  }))
});
var getItemDataTypeQueryParams = import_zod3.z.object({
  "id": import_zod3.z.array(import_zod3.z.string().uuid()).optional()
});
var getItemDataTypeResponseItem = import_zod3.z.object({
  "id": import_zod3.z.string().uuid(),
  "name": import_zod3.z.string(),
  "editorUiAlias": import_zod3.z.string().nullish(),
  "editorAlias": import_zod3.z.string(),
  "isDeletable": import_zod3.z.boolean()
});
var getItemDataTypeResponse = import_zod3.z.array(getItemDataTypeResponseItem);
var getItemDataTypeSearchQueryTakeDefault = 100;
var getItemDataTypeSearchQueryParams = import_zod3.z.object({
  "query": import_zod3.z.string().optional(),
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getItemDataTypeSearchQueryTakeDefault)
});
var getItemDataTypeSearchResponse = import_zod3.z.object({
  "items": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "name": import_zod3.z.string(),
    "editorUiAlias": import_zod3.z.string().nullish(),
    "editorAlias": import_zod3.z.string(),
    "isDeletable": import_zod3.z.boolean()
  })),
  "total": import_zod3.z.number()
});
var getTreeDataTypeAncestorsQueryParams = import_zod3.z.object({
  "descendantId": import_zod3.z.string().uuid().optional()
});
var getTreeDataTypeAncestorsResponseItem = import_zod3.z.object({
  "hasChildren": import_zod3.z.boolean(),
  "id": import_zod3.z.string().uuid(),
  "parent": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish(),
  "name": import_zod3.z.string(),
  "isFolder": import_zod3.z.boolean(),
  "editorUiAlias": import_zod3.z.string().nullish(),
  "isDeletable": import_zod3.z.boolean()
});
var getTreeDataTypeAncestorsResponse = import_zod3.z.array(getTreeDataTypeAncestorsResponseItem);
var getTreeDataTypeChildrenQueryTakeDefault = 100;
var getTreeDataTypeChildrenQueryParams = import_zod3.z.object({
  "parentId": import_zod3.z.string().uuid().optional(),
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getTreeDataTypeChildrenQueryTakeDefault),
  "foldersOnly": import_zod3.z.boolean().optional()
});
var getTreeDataTypeChildrenResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "hasChildren": import_zod3.z.boolean(),
    "id": import_zod3.z.string().uuid(),
    "parent": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "name": import_zod3.z.string(),
    "isFolder": import_zod3.z.boolean(),
    "editorUiAlias": import_zod3.z.string().nullish(),
    "isDeletable": import_zod3.z.boolean()
  }))
});
var getTreeDataTypeRootQueryTakeDefault = 100;
var getTreeDataTypeRootQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getTreeDataTypeRootQueryTakeDefault),
  "foldersOnly": import_zod3.z.boolean().optional()
});
var getTreeDataTypeRootResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "hasChildren": import_zod3.z.boolean(),
    "id": import_zod3.z.string().uuid(),
    "parent": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "name": import_zod3.z.string(),
    "isFolder": import_zod3.z.boolean(),
    "editorUiAlias": import_zod3.z.string().nullish(),
    "isDeletable": import_zod3.z.boolean()
  }))
});
var getDictionaryQueryTakeDefault = 100;
var getDictionaryQueryParams = import_zod3.z.object({
  "filter": import_zod3.z.string().optional(),
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getDictionaryQueryTakeDefault)
});
var getDictionaryResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "name": import_zod3.z.string().nullish(),
    "id": import_zod3.z.string().uuid(),
    "parent": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "translatedIsoCodes": import_zod3.z.array(import_zod3.z.string())
  }))
});
var postDictionaryBody = import_zod3.z.object({
  "name": import_zod3.z.string().min(1),
  "translations": import_zod3.z.array(import_zod3.z.object({
    "isoCode": import_zod3.z.string().min(1),
    "translation": import_zod3.z.string().min(1)
  })),
  "id": import_zod3.z.string().uuid().nullish(),
  "parent": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish()
});
var getDictionaryByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getDictionaryByIdResponse = import_zod3.z.object({
  "name": import_zod3.z.string().min(1),
  "translations": import_zod3.z.array(import_zod3.z.object({
    "isoCode": import_zod3.z.string().min(1),
    "translation": import_zod3.z.string().min(1)
  })),
  "id": import_zod3.z.string().uuid()
});
var deleteDictionaryByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putDictionaryByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putDictionaryByIdBody = import_zod3.z.object({
  "name": import_zod3.z.string().min(1),
  "translations": import_zod3.z.array(import_zod3.z.object({
    "isoCode": import_zod3.z.string().min(1),
    "translation": import_zod3.z.string().min(1)
  }))
});
var getDictionaryByIdExportParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getDictionaryByIdExportQueryParams = import_zod3.z.object({
  "includeChildren": import_zod3.z.boolean().optional()
});
var getDictionaryByIdExportResponse = import_zod3.z.instanceof(File);
var putDictionaryByIdMoveParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putDictionaryByIdMoveBody = import_zod3.z.object({
  "target": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish()
});
var postDictionaryImportBody = import_zod3.z.object({
  "temporaryFile": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }),
  "parent": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish()
});
var getItemDictionaryQueryParams = import_zod3.z.object({
  "id": import_zod3.z.array(import_zod3.z.string().uuid()).optional()
});
var getItemDictionaryResponseItem = import_zod3.z.object({
  "id": import_zod3.z.string().uuid(),
  "name": import_zod3.z.string()
});
var getItemDictionaryResponse = import_zod3.z.array(getItemDictionaryResponseItem);
var getTreeDictionaryAncestorsQueryParams = import_zod3.z.object({
  "descendantId": import_zod3.z.string().uuid().optional()
});
var getTreeDictionaryAncestorsResponseItem = import_zod3.z.object({
  "hasChildren": import_zod3.z.boolean(),
  "id": import_zod3.z.string().uuid(),
  "parent": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish(),
  "name": import_zod3.z.string()
});
var getTreeDictionaryAncestorsResponse = import_zod3.z.array(getTreeDictionaryAncestorsResponseItem);
var getTreeDictionaryChildrenQueryTakeDefault = 100;
var getTreeDictionaryChildrenQueryParams = import_zod3.z.object({
  "parentId": import_zod3.z.string().uuid().optional(),
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getTreeDictionaryChildrenQueryTakeDefault)
});
var getTreeDictionaryChildrenResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "hasChildren": import_zod3.z.boolean(),
    "id": import_zod3.z.string().uuid(),
    "parent": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "name": import_zod3.z.string()
  }))
});
var getTreeDictionaryRootQueryTakeDefault = 100;
var getTreeDictionaryRootQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getTreeDictionaryRootQueryTakeDefault)
});
var getTreeDictionaryRootResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "hasChildren": import_zod3.z.boolean(),
    "id": import_zod3.z.string().uuid(),
    "parent": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "name": import_zod3.z.string()
  }))
});
var postDocumentBlueprintBody = import_zod3.z.object({
  "values": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullish(),
    "segment": import_zod3.z.string().nullish(),
    "alias": import_zod3.z.string().min(1),
    "value": import_zod3.z.any().nullish()
  })),
  "variants": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullish(),
    "segment": import_zod3.z.string().nullish(),
    "name": import_zod3.z.string().min(1)
  })),
  "id": import_zod3.z.string().uuid().nullish(),
  "parent": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish(),
  "documentType": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  })
});
var getDocumentBlueprintByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getDocumentBlueprintByIdResponse = import_zod3.z.object({
  "values": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullish(),
    "segment": import_zod3.z.string().nullish(),
    "alias": import_zod3.z.string().min(1),
    "value": import_zod3.z.any().nullish(),
    "editorAlias": import_zod3.z.string().min(1)
  })),
  "variants": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullish(),
    "segment": import_zod3.z.string().nullish(),
    "name": import_zod3.z.string().min(1),
    "createDate": import_zod3.z.string().datetime({ "local": true }),
    "updateDate": import_zod3.z.string().datetime({ "local": true }),
    "state": import_zod3.z.enum(["NotCreated", "Draft", "Published", "PublishedPendingChanges"]),
    "publishDate": import_zod3.z.string().datetime({ "local": true }).nullish(),
    "scheduledPublishDate": import_zod3.z.string().datetime({ "local": true }).nullish(),
    "scheduledUnpublishDate": import_zod3.z.string().datetime({ "local": true }).nullish()
  })),
  "id": import_zod3.z.string().uuid(),
  "documentType": import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "icon": import_zod3.z.string(),
    "collection": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish()
  })
});
var deleteDocumentBlueprintByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putDocumentBlueprintByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putDocumentBlueprintByIdBody = import_zod3.z.object({
  "values": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullish(),
    "segment": import_zod3.z.string().nullish(),
    "alias": import_zod3.z.string().min(1),
    "value": import_zod3.z.any().nullish()
  })),
  "variants": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullish(),
    "segment": import_zod3.z.string().nullish(),
    "name": import_zod3.z.string().min(1)
  }))
});
var putDocumentBlueprintByIdMoveParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putDocumentBlueprintByIdMoveBody = import_zod3.z.object({
  "target": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish()
});
var postDocumentBlueprintFolderBody = import_zod3.z.object({
  "name": import_zod3.z.string().min(1),
  "id": import_zod3.z.string().uuid().nullish(),
  "parent": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish()
});
var getDocumentBlueprintFolderByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getDocumentBlueprintFolderByIdResponse = import_zod3.z.object({
  "name": import_zod3.z.string().min(1),
  "id": import_zod3.z.string().uuid()
});
var deleteDocumentBlueprintFolderByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putDocumentBlueprintFolderByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putDocumentBlueprintFolderByIdBody = import_zod3.z.object({
  "name": import_zod3.z.string().min(1)
});
var postDocumentBlueprintFromDocumentBody = import_zod3.z.object({
  "document": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }),
  "id": import_zod3.z.string().uuid().nullish(),
  "name": import_zod3.z.string(),
  "parent": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish()
});
var getItemDocumentBlueprintQueryParams = import_zod3.z.object({
  "id": import_zod3.z.array(import_zod3.z.string().uuid()).optional()
});
var getItemDocumentBlueprintResponseItem = import_zod3.z.object({
  "id": import_zod3.z.string().uuid(),
  "name": import_zod3.z.string(),
  "documentType": import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "icon": import_zod3.z.string(),
    "collection": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish()
  })
});
var getItemDocumentBlueprintResponse = import_zod3.z.array(getItemDocumentBlueprintResponseItem);
var getTreeDocumentBlueprintAncestorsQueryParams = import_zod3.z.object({
  "descendantId": import_zod3.z.string().uuid().optional()
});
var getTreeDocumentBlueprintAncestorsResponseItem = import_zod3.z.object({
  "hasChildren": import_zod3.z.boolean(),
  "id": import_zod3.z.string().uuid(),
  "parent": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish(),
  "name": import_zod3.z.string(),
  "isFolder": import_zod3.z.boolean(),
  "documentType": import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "icon": import_zod3.z.string(),
    "collection": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish()
  }).nullish()
});
var getTreeDocumentBlueprintAncestorsResponse = import_zod3.z.array(getTreeDocumentBlueprintAncestorsResponseItem);
var getTreeDocumentBlueprintChildrenQueryTakeDefault = 100;
var getTreeDocumentBlueprintChildrenQueryParams = import_zod3.z.object({
  "parentId": import_zod3.z.string().uuid().optional(),
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getTreeDocumentBlueprintChildrenQueryTakeDefault),
  "foldersOnly": import_zod3.z.boolean().optional()
});
var getTreeDocumentBlueprintChildrenResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "hasChildren": import_zod3.z.boolean(),
    "id": import_zod3.z.string().uuid(),
    "parent": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "name": import_zod3.z.string(),
    "isFolder": import_zod3.z.boolean(),
    "documentType": import_zod3.z.object({
      "id": import_zod3.z.string().uuid(),
      "icon": import_zod3.z.string(),
      "collection": import_zod3.z.object({
        "id": import_zod3.z.string().uuid()
      }).nullish()
    }).nullish()
  }))
});
var getTreeDocumentBlueprintRootQueryTakeDefault = 100;
var getTreeDocumentBlueprintRootQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getTreeDocumentBlueprintRootQueryTakeDefault),
  "foldersOnly": import_zod3.z.boolean().optional()
});
var getTreeDocumentBlueprintRootResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "hasChildren": import_zod3.z.boolean(),
    "id": import_zod3.z.string().uuid(),
    "parent": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "name": import_zod3.z.string(),
    "isFolder": import_zod3.z.boolean(),
    "documentType": import_zod3.z.object({
      "id": import_zod3.z.string().uuid(),
      "icon": import_zod3.z.string(),
      "collection": import_zod3.z.object({
        "id": import_zod3.z.string().uuid()
      }).nullish()
    }).nullish()
  }))
});
var postDocumentTypeBody = import_zod3.z.object({
  "alias": import_zod3.z.string().min(1),
  "name": import_zod3.z.string().min(1),
  "description": import_zod3.z.string().nullish(),
  "icon": import_zod3.z.string().min(1),
  "allowedAsRoot": import_zod3.z.boolean(),
  "variesByCulture": import_zod3.z.boolean(),
  "variesBySegment": import_zod3.z.boolean(),
  "collection": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish(),
  "isElement": import_zod3.z.boolean(),
  "properties": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "container": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "sortOrder": import_zod3.z.number(),
    "alias": import_zod3.z.string().min(1),
    "name": import_zod3.z.string().min(1),
    "description": import_zod3.z.string().nullish(),
    "dataType": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }),
    "variesByCulture": import_zod3.z.boolean(),
    "variesBySegment": import_zod3.z.boolean(),
    "validation": import_zod3.z.object({
      "mandatory": import_zod3.z.boolean(),
      "mandatoryMessage": import_zod3.z.string().nullish(),
      "regEx": import_zod3.z.string().nullish(),
      "regExMessage": import_zod3.z.string().nullish()
    }),
    "appearance": import_zod3.z.object({
      "labelOnTop": import_zod3.z.boolean()
    })
  })),
  "containers": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "parent": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "name": import_zod3.z.string().nullish(),
    "type": import_zod3.z.string().min(1),
    "sortOrder": import_zod3.z.number()
  })),
  "id": import_zod3.z.string().uuid().nullish(),
  "parent": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish(),
  "allowedTemplates": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  })),
  "defaultTemplate": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish(),
  "cleanup": import_zod3.z.object({
    "preventCleanup": import_zod3.z.boolean(),
    "keepAllVersionsNewerThanDays": import_zod3.z.number().nullish(),
    "keepLatestVersionPerDayForDays": import_zod3.z.number().nullish()
  }),
  "allowedDocumentTypes": import_zod3.z.array(import_zod3.z.object({
    "documentType": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }),
    "sortOrder": import_zod3.z.number()
  })),
  "compositions": import_zod3.z.array(import_zod3.z.object({
    "documentType": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }),
    "compositionType": import_zod3.z.enum(["Composition", "Inheritance"])
  }))
});
var getDocumentTypeByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getDocumentTypeByIdResponse = import_zod3.z.object({
  "alias": import_zod3.z.string().min(1),
  "name": import_zod3.z.string().min(1),
  "description": import_zod3.z.string().nullish(),
  "icon": import_zod3.z.string().min(1),
  "allowedAsRoot": import_zod3.z.boolean(),
  "variesByCulture": import_zod3.z.boolean(),
  "variesBySegment": import_zod3.z.boolean(),
  "collection": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish(),
  "isElement": import_zod3.z.boolean(),
  "properties": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "container": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "sortOrder": import_zod3.z.number(),
    "alias": import_zod3.z.string().min(1),
    "name": import_zod3.z.string().min(1),
    "description": import_zod3.z.string().nullish(),
    "dataType": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }),
    "variesByCulture": import_zod3.z.boolean(),
    "variesBySegment": import_zod3.z.boolean(),
    "validation": import_zod3.z.object({
      "mandatory": import_zod3.z.boolean(),
      "mandatoryMessage": import_zod3.z.string().nullish(),
      "regEx": import_zod3.z.string().nullish(),
      "regExMessage": import_zod3.z.string().nullish()
    }),
    "appearance": import_zod3.z.object({
      "labelOnTop": import_zod3.z.boolean()
    })
  })),
  "containers": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "parent": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "name": import_zod3.z.string().nullish(),
    "type": import_zod3.z.string().min(1),
    "sortOrder": import_zod3.z.number()
  })),
  "id": import_zod3.z.string().uuid(),
  "allowedTemplates": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  })),
  "defaultTemplate": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish(),
  "cleanup": import_zod3.z.object({
    "preventCleanup": import_zod3.z.boolean(),
    "keepAllVersionsNewerThanDays": import_zod3.z.number().nullish(),
    "keepLatestVersionPerDayForDays": import_zod3.z.number().nullish()
  }),
  "allowedDocumentTypes": import_zod3.z.array(import_zod3.z.object({
    "documentType": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }),
    "sortOrder": import_zod3.z.number()
  })),
  "compositions": import_zod3.z.array(import_zod3.z.object({
    "documentType": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }),
    "compositionType": import_zod3.z.enum(["Composition", "Inheritance"])
  }))
});
var deleteDocumentTypeByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putDocumentTypeByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putDocumentTypeByIdBody = import_zod3.z.object({
  "alias": import_zod3.z.string().min(1),
  "name": import_zod3.z.string().min(1),
  "description": import_zod3.z.string().nullish(),
  "icon": import_zod3.z.string().min(1),
  "allowedAsRoot": import_zod3.z.boolean(),
  "variesByCulture": import_zod3.z.boolean(),
  "variesBySegment": import_zod3.z.boolean(),
  "collection": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish(),
  "isElement": import_zod3.z.boolean(),
  "properties": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "container": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "sortOrder": import_zod3.z.number(),
    "alias": import_zod3.z.string().min(1),
    "name": import_zod3.z.string().min(1),
    "description": import_zod3.z.string().nullish(),
    "dataType": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }),
    "variesByCulture": import_zod3.z.boolean(),
    "variesBySegment": import_zod3.z.boolean(),
    "validation": import_zod3.z.object({
      "mandatory": import_zod3.z.boolean(),
      "mandatoryMessage": import_zod3.z.string().nullish(),
      "regEx": import_zod3.z.string().nullish(),
      "regExMessage": import_zod3.z.string().nullish()
    }),
    "appearance": import_zod3.z.object({
      "labelOnTop": import_zod3.z.boolean()
    })
  })),
  "containers": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "parent": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "name": import_zod3.z.string().nullish(),
    "type": import_zod3.z.string().min(1),
    "sortOrder": import_zod3.z.number()
  })),
  "allowedTemplates": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  })),
  "defaultTemplate": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish(),
  "cleanup": import_zod3.z.object({
    "preventCleanup": import_zod3.z.boolean(),
    "keepAllVersionsNewerThanDays": import_zod3.z.number().nullish(),
    "keepLatestVersionPerDayForDays": import_zod3.z.number().nullish()
  }),
  "allowedDocumentTypes": import_zod3.z.array(import_zod3.z.object({
    "documentType": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }),
    "sortOrder": import_zod3.z.number()
  })),
  "compositions": import_zod3.z.array(import_zod3.z.object({
    "documentType": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }),
    "compositionType": import_zod3.z.enum(["Composition", "Inheritance"])
  }))
});
var getDocumentTypeByIdAllowedChildrenParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getDocumentTypeByIdAllowedChildrenQueryTakeDefault = 100;
var getDocumentTypeByIdAllowedChildrenQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getDocumentTypeByIdAllowedChildrenQueryTakeDefault)
});
var getDocumentTypeByIdAllowedChildrenResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "name": import_zod3.z.string(),
    "description": import_zod3.z.string().nullish(),
    "icon": import_zod3.z.string().nullish()
  }))
});
var getDocumentTypeByIdBlueprintParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getDocumentTypeByIdBlueprintQueryTakeDefault = 100;
var getDocumentTypeByIdBlueprintQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getDocumentTypeByIdBlueprintQueryTakeDefault)
});
var getDocumentTypeByIdBlueprintResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "name": import_zod3.z.string()
  }))
});
var getDocumentTypeByIdCompositionReferencesParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getDocumentTypeByIdCompositionReferencesResponseItem = import_zod3.z.object({
  "id": import_zod3.z.string().uuid(),
  "name": import_zod3.z.string(),
  "icon": import_zod3.z.string()
});
var getDocumentTypeByIdCompositionReferencesResponse = import_zod3.z.array(getDocumentTypeByIdCompositionReferencesResponseItem);
var postDocumentTypeByIdCopyParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var postDocumentTypeByIdCopyBody = import_zod3.z.object({
  "target": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish()
});
var getDocumentTypeByIdExportParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getDocumentTypeByIdExportResponse = import_zod3.z.instanceof(File);
var putDocumentTypeByIdImportParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putDocumentTypeByIdImportBody = import_zod3.z.object({
  "file": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  })
});
var putDocumentTypeByIdMoveParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putDocumentTypeByIdMoveBody = import_zod3.z.object({
  "target": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish()
});
var getDocumentTypeAllowedAtRootQueryTakeDefault = 100;
var getDocumentTypeAllowedAtRootQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getDocumentTypeAllowedAtRootQueryTakeDefault)
});
var getDocumentTypeAllowedAtRootResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "name": import_zod3.z.string(),
    "description": import_zod3.z.string().nullish(),
    "icon": import_zod3.z.string().nullish()
  }))
});
var postDocumentTypeAvailableCompositionsBody = import_zod3.z.object({
  "id": import_zod3.z.string().uuid().nullish(),
  "currentPropertyAliases": import_zod3.z.array(import_zod3.z.string()),
  "currentCompositeIds": import_zod3.z.array(import_zod3.z.string().uuid()),
  "isElement": import_zod3.z.boolean()
});
var postDocumentTypeAvailableCompositionsResponseItem = import_zod3.z.object({
  "id": import_zod3.z.string().uuid(),
  "name": import_zod3.z.string(),
  "icon": import_zod3.z.string(),
  "folderPath": import_zod3.z.array(import_zod3.z.string()),
  "isCompatible": import_zod3.z.boolean()
});
var postDocumentTypeAvailableCompositionsResponse = import_zod3.z.array(postDocumentTypeAvailableCompositionsResponseItem);
var getDocumentTypeConfigurationResponse = import_zod3.z.object({
  "dataTypesCanBeChanged": import_zod3.z.enum(["True", "False", "FalseWithHelpText"]),
  "disableTemplates": import_zod3.z.boolean(),
  "useSegments": import_zod3.z.boolean(),
  "reservedFieldNames": import_zod3.z.array(import_zod3.z.string())
});
var postDocumentTypeFolderBody = import_zod3.z.object({
  "name": import_zod3.z.string().min(1),
  "id": import_zod3.z.string().uuid().nullish(),
  "parent": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish()
});
var getDocumentTypeFolderByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getDocumentTypeFolderByIdResponse = import_zod3.z.object({
  "name": import_zod3.z.string().min(1),
  "id": import_zod3.z.string().uuid()
});
var deleteDocumentTypeFolderByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putDocumentTypeFolderByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putDocumentTypeFolderByIdBody = import_zod3.z.object({
  "name": import_zod3.z.string().min(1)
});
var postDocumentTypeImportBody = import_zod3.z.object({
  "file": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  })
});
var getItemDocumentTypeQueryParams = import_zod3.z.object({
  "id": import_zod3.z.array(import_zod3.z.string().uuid()).optional()
});
var getItemDocumentTypeResponseItem = import_zod3.z.object({
  "id": import_zod3.z.string().uuid(),
  "name": import_zod3.z.string(),
  "isElement": import_zod3.z.boolean(),
  "icon": import_zod3.z.string().nullish(),
  "description": import_zod3.z.string().nullish()
});
var getItemDocumentTypeResponse = import_zod3.z.array(getItemDocumentTypeResponseItem);
var getItemDocumentTypeSearchQueryTakeDefault = 100;
var getItemDocumentTypeSearchQueryParams = import_zod3.z.object({
  "query": import_zod3.z.string().optional(),
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getItemDocumentTypeSearchQueryTakeDefault)
});
var getItemDocumentTypeSearchResponse = import_zod3.z.object({
  "items": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "name": import_zod3.z.string(),
    "isElement": import_zod3.z.boolean(),
    "icon": import_zod3.z.string().nullish(),
    "description": import_zod3.z.string().nullish()
  })),
  "total": import_zod3.z.number()
});
var getTreeDocumentTypeAncestorsQueryParams = import_zod3.z.object({
  "descendantId": import_zod3.z.string().uuid().optional()
});
var getTreeDocumentTypeAncestorsResponseItem = import_zod3.z.object({
  "hasChildren": import_zod3.z.boolean(),
  "id": import_zod3.z.string().uuid(),
  "parent": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish(),
  "name": import_zod3.z.string(),
  "isFolder": import_zod3.z.boolean(),
  "isElement": import_zod3.z.boolean(),
  "icon": import_zod3.z.string()
});
var getTreeDocumentTypeAncestorsResponse = import_zod3.z.array(getTreeDocumentTypeAncestorsResponseItem);
var getTreeDocumentTypeChildrenQueryTakeDefault = 100;
var getTreeDocumentTypeChildrenQueryParams = import_zod3.z.object({
  "parentId": import_zod3.z.string().uuid().optional(),
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getTreeDocumentTypeChildrenQueryTakeDefault),
  "foldersOnly": import_zod3.z.boolean().optional()
});
var getTreeDocumentTypeChildrenResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "hasChildren": import_zod3.z.boolean(),
    "id": import_zod3.z.string().uuid(),
    "parent": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "name": import_zod3.z.string(),
    "isFolder": import_zod3.z.boolean(),
    "isElement": import_zod3.z.boolean(),
    "icon": import_zod3.z.string()
  }))
});
var getTreeDocumentTypeRootQueryTakeDefault = 100;
var getTreeDocumentTypeRootQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getTreeDocumentTypeRootQueryTakeDefault),
  "foldersOnly": import_zod3.z.boolean().optional()
});
var getTreeDocumentTypeRootResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "hasChildren": import_zod3.z.boolean(),
    "id": import_zod3.z.string().uuid(),
    "parent": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "name": import_zod3.z.string(),
    "isFolder": import_zod3.z.boolean(),
    "isElement": import_zod3.z.boolean(),
    "icon": import_zod3.z.string()
  }))
});
var getDocumentVersionQueryTakeDefault = 100;
var getDocumentVersionQueryParams = import_zod3.z.object({
  "documentId": import_zod3.z.string().uuid(),
  "culture": import_zod3.z.string().optional(),
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getDocumentVersionQueryTakeDefault)
});
var getDocumentVersionResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "document": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }),
    "documentType": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }),
    "user": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }),
    "versionDate": import_zod3.z.string().datetime({ "local": true }),
    "isCurrentPublishedVersion": import_zod3.z.boolean(),
    "isCurrentDraftVersion": import_zod3.z.boolean(),
    "preventCleanup": import_zod3.z.boolean()
  }))
});
var getDocumentVersionByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getDocumentVersionByIdResponse = import_zod3.z.object({
  "values": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullish(),
    "segment": import_zod3.z.string().nullish(),
    "alias": import_zod3.z.string().min(1),
    "value": import_zod3.z.any().nullish(),
    "editorAlias": import_zod3.z.string().min(1)
  })),
  "variants": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullish(),
    "segment": import_zod3.z.string().nullish(),
    "name": import_zod3.z.string().min(1),
    "createDate": import_zod3.z.string().datetime({ "local": true }),
    "updateDate": import_zod3.z.string().datetime({ "local": true }),
    "state": import_zod3.z.enum(["NotCreated", "Draft", "Published", "PublishedPendingChanges"]),
    "publishDate": import_zod3.z.string().datetime({ "local": true }).nullish(),
    "scheduledPublishDate": import_zod3.z.string().datetime({ "local": true }).nullish(),
    "scheduledUnpublishDate": import_zod3.z.string().datetime({ "local": true }).nullish()
  })),
  "id": import_zod3.z.string().uuid(),
  "documentType": import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "icon": import_zod3.z.string(),
    "collection": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish()
  }),
  "document": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish()
});
var putDocumentVersionByIdPreventCleanupParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putDocumentVersionByIdPreventCleanupQueryParams = import_zod3.z.object({
  "preventCleanup": import_zod3.z.boolean().optional()
});
var postDocumentVersionByIdRollbackParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var postDocumentVersionByIdRollbackQueryParams = import_zod3.z.object({
  "culture": import_zod3.z.string().optional()
});
var getCollectionDocumentByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getCollectionDocumentByIdQueryOrderByDefault = "updateDate";
var getCollectionDocumentByIdQueryTakeDefault = 100;
var getCollectionDocumentByIdQueryParams = import_zod3.z.object({
  "dataTypeId": import_zod3.z.string().uuid().optional(),
  "orderBy": import_zod3.z.string().default(getCollectionDocumentByIdQueryOrderByDefault),
  "orderCulture": import_zod3.z.string().optional(),
  "orderDirection": import_zod3.z.enum(["Ascending", "Descending"]).optional(),
  "filter": import_zod3.z.string().optional(),
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getCollectionDocumentByIdQueryTakeDefault)
});
var getCollectionDocumentByIdResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "values": import_zod3.z.array(import_zod3.z.object({
      "culture": import_zod3.z.string().nullish(),
      "segment": import_zod3.z.string().nullish(),
      "alias": import_zod3.z.string().min(1),
      "value": import_zod3.z.any().nullish(),
      "editorAlias": import_zod3.z.string().min(1)
    })),
    "variants": import_zod3.z.array(import_zod3.z.object({
      "culture": import_zod3.z.string().nullish(),
      "segment": import_zod3.z.string().nullish(),
      "name": import_zod3.z.string().min(1),
      "createDate": import_zod3.z.string().datetime({ "local": true }),
      "updateDate": import_zod3.z.string().datetime({ "local": true }),
      "state": import_zod3.z.enum(["NotCreated", "Draft", "Published", "PublishedPendingChanges"]),
      "publishDate": import_zod3.z.string().datetime({ "local": true }).nullish(),
      "scheduledPublishDate": import_zod3.z.string().datetime({ "local": true }).nullish(),
      "scheduledUnpublishDate": import_zod3.z.string().datetime({ "local": true }).nullish()
    })),
    "id": import_zod3.z.string().uuid(),
    "creator": import_zod3.z.string().nullish(),
    "sortOrder": import_zod3.z.number(),
    "documentType": import_zod3.z.object({
      "id": import_zod3.z.string().uuid(),
      "alias": import_zod3.z.string(),
      "icon": import_zod3.z.string()
    }),
    "isTrashed": import_zod3.z.boolean(),
    "isProtected": import_zod3.z.boolean(),
    "updater": import_zod3.z.string().nullish()
  }))
});
var postDocumentBody = import_zod3.z.object({
  "values": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullish(),
    "segment": import_zod3.z.string().nullish(),
    "alias": import_zod3.z.string().min(1),
    "value": import_zod3.z.any().nullish()
  })),
  "variants": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullish(),
    "segment": import_zod3.z.string().nullish(),
    "name": import_zod3.z.string().min(1)
  })),
  "id": import_zod3.z.string().uuid().nullish(),
  "parent": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish(),
  "documentType": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }),
  "template": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullable()
});
var getDocumentByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getDocumentByIdResponse = import_zod3.z.object({
  "values": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullish(),
    "segment": import_zod3.z.string().nullish(),
    "alias": import_zod3.z.string().min(1),
    "value": import_zod3.z.any().nullish(),
    "editorAlias": import_zod3.z.string().min(1)
  })),
  "variants": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullish(),
    "segment": import_zod3.z.string().nullish(),
    "name": import_zod3.z.string().min(1),
    "createDate": import_zod3.z.string().datetime({ "local": true }),
    "updateDate": import_zod3.z.string().datetime({ "local": true }),
    "state": import_zod3.z.enum(["NotCreated", "Draft", "Published", "PublishedPendingChanges"]),
    "publishDate": import_zod3.z.string().datetime({ "local": true }).nullish(),
    "scheduledPublishDate": import_zod3.z.string().datetime({ "local": true }).nullish(),
    "scheduledUnpublishDate": import_zod3.z.string().datetime({ "local": true }).nullish()
  })),
  "id": import_zod3.z.string().uuid(),
  "documentType": import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "icon": import_zod3.z.string(),
    "collection": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish()
  }),
  "urls": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullable(),
    "url": import_zod3.z.string()
  })),
  "template": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish(),
  "isTrashed": import_zod3.z.boolean()
});
var deleteDocumentByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putDocumentByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putDocumentByIdBody = import_zod3.z.object({
  "values": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullish(),
    "segment": import_zod3.z.string().nullish(),
    "alias": import_zod3.z.string().min(1),
    "value": import_zod3.z.any().nullish()
  })),
  "variants": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullish(),
    "segment": import_zod3.z.string().nullish(),
    "name": import_zod3.z.string().min(1)
  })),
  "template": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish()
});
var getDocumentByIdAuditLogParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getDocumentByIdAuditLogQueryTakeDefault = 100;
var getDocumentByIdAuditLogQueryParams = import_zod3.z.object({
  "orderDirection": import_zod3.z.enum(["Ascending", "Descending"]).optional(),
  "sinceDate": import_zod3.z.string().datetime({ "local": true }).optional(),
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getDocumentByIdAuditLogQueryTakeDefault)
});
var getDocumentByIdAuditLogResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "user": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }),
    "timestamp": import_zod3.z.string().datetime({ "local": true }),
    "logType": import_zod3.z.enum(["New", "Save", "SaveVariant", "Open", "Delete", "Publish", "PublishVariant", "SendToPublish", "SendToPublishVariant", "Unpublish", "UnpublishVariant", "Move", "Copy", "AssignDomain", "PublicAccess", "Sort", "Notify", "System", "RollBack", "PackagerInstall", "PackagerUninstall", "Custom", "ContentVersionPreventCleanup", "ContentVersionEnableCleanup"]),
    "comment": import_zod3.z.string().nullish(),
    "parameters": import_zod3.z.string().nullish()
  }))
});
var postDocumentByIdCopyParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var postDocumentByIdCopyBody = import_zod3.z.object({
  "target": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish(),
  "relateToOriginal": import_zod3.z.boolean(),
  "includeDescendants": import_zod3.z.boolean()
});
var getDocumentByIdDomainsParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getDocumentByIdDomainsResponse = import_zod3.z.object({
  "defaultIsoCode": import_zod3.z.string().nullish(),
  "domains": import_zod3.z.array(import_zod3.z.object({
    "domainName": import_zod3.z.string(),
    "isoCode": import_zod3.z.string()
  }))
});
var putDocumentByIdDomainsParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putDocumentByIdDomainsBody = import_zod3.z.object({
  "defaultIsoCode": import_zod3.z.string().nullish(),
  "domains": import_zod3.z.array(import_zod3.z.object({
    "domainName": import_zod3.z.string(),
    "isoCode": import_zod3.z.string()
  }))
});
var putDocumentByIdMoveParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putDocumentByIdMoveBody = import_zod3.z.object({
  "target": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish()
});
var putDocumentByIdMoveToRecycleBinParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getDocumentByIdNotificationsParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getDocumentByIdNotificationsResponseItem = import_zod3.z.object({
  "actionId": import_zod3.z.string(),
  "alias": import_zod3.z.string(),
  "subscribed": import_zod3.z.boolean()
});
var getDocumentByIdNotificationsResponse = import_zod3.z.array(getDocumentByIdNotificationsResponseItem);
var putDocumentByIdNotificationsParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putDocumentByIdNotificationsBody = import_zod3.z.object({
  "subscribedActionIds": import_zod3.z.array(import_zod3.z.string())
});
var postDocumentByIdPublicAccessParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var postDocumentByIdPublicAccessBody = import_zod3.z.object({
  "loginDocument": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }),
  "errorDocument": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }),
  "memberUserNames": import_zod3.z.array(import_zod3.z.string()),
  "memberGroupNames": import_zod3.z.array(import_zod3.z.string())
});
var deleteDocumentByIdPublicAccessParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getDocumentByIdPublicAccessParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getDocumentByIdPublicAccessResponse = import_zod3.z.object({
  "loginDocument": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }),
  "errorDocument": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }),
  "members": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "memberType": import_zod3.z.object({
      "id": import_zod3.z.string().uuid(),
      "icon": import_zod3.z.string(),
      "collection": import_zod3.z.object({
        "id": import_zod3.z.string().uuid()
      }).nullish()
    }),
    "variants": import_zod3.z.array(import_zod3.z.object({
      "name": import_zod3.z.string(),
      "culture": import_zod3.z.string().nullish()
    })),
    "kind": import_zod3.z.enum(["Default", "Api"])
  })),
  "groups": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "name": import_zod3.z.string()
  }))
});
var putDocumentByIdPublicAccessParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putDocumentByIdPublicAccessBody = import_zod3.z.object({
  "loginDocument": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }),
  "errorDocument": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }),
  "memberUserNames": import_zod3.z.array(import_zod3.z.string()),
  "memberGroupNames": import_zod3.z.array(import_zod3.z.string())
});
var putDocumentByIdPublishParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putDocumentByIdPublishBody = import_zod3.z.object({
  "publishSchedules": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullish(),
    "schedule": import_zod3.z.object({
      "publishTime": import_zod3.z.string().datetime({ "local": true }).nullish(),
      "unpublishTime": import_zod3.z.string().datetime({ "local": true }).nullish()
    }).nullish()
  }))
});
var putDocumentByIdPublishWithDescendantsParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putDocumentByIdPublishWithDescendantsBody = import_zod3.z.object({
  "includeUnpublishedDescendants": import_zod3.z.boolean(),
  "cultures": import_zod3.z.array(import_zod3.z.string())
});
var getDocumentByIdPublishedParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getDocumentByIdPublishedResponse = import_zod3.z.object({
  "values": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullish(),
    "segment": import_zod3.z.string().nullish(),
    "alias": import_zod3.z.string().min(1),
    "value": import_zod3.z.any().nullish(),
    "editorAlias": import_zod3.z.string().min(1)
  })),
  "variants": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullish(),
    "segment": import_zod3.z.string().nullish(),
    "name": import_zod3.z.string().min(1),
    "createDate": import_zod3.z.string().datetime({ "local": true }),
    "updateDate": import_zod3.z.string().datetime({ "local": true }),
    "state": import_zod3.z.enum(["NotCreated", "Draft", "Published", "PublishedPendingChanges"]),
    "publishDate": import_zod3.z.string().datetime({ "local": true }).nullish(),
    "scheduledPublishDate": import_zod3.z.string().datetime({ "local": true }).nullish(),
    "scheduledUnpublishDate": import_zod3.z.string().datetime({ "local": true }).nullish()
  })),
  "id": import_zod3.z.string().uuid(),
  "documentType": import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "icon": import_zod3.z.string(),
    "collection": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish()
  }),
  "urls": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullable(),
    "url": import_zod3.z.string()
  })),
  "template": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish(),
  "isTrashed": import_zod3.z.boolean()
});
var getDocumentByIdReferencedByParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getDocumentByIdReferencedByQueryTakeDefault = 20;
var getDocumentByIdReferencedByQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getDocumentByIdReferencedByQueryTakeDefault)
});
var getDocumentByIdReferencedByResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "$type": import_zod3.z.enum(["DefaultReferenceResponseModel"]),
    "id": import_zod3.z.string().uuid(),
    "name": import_zod3.z.string().nullish(),
    "type": import_zod3.z.string().nullish(),
    "icon": import_zod3.z.string().nullish()
  }).or(import_zod3.z.object({
    "$type": import_zod3.z.enum(["DocumentReferenceResponseModel"]),
    "id": import_zod3.z.string().uuid(),
    "name": import_zod3.z.string().nullish(),
    "published": import_zod3.z.boolean().nullish(),
    "documentType": import_zod3.z.object({
      "icon": import_zod3.z.string().nullish(),
      "alias": import_zod3.z.string().nullish(),
      "name": import_zod3.z.string().nullish()
    })
  })).or(import_zod3.z.object({
    "$type": import_zod3.z.enum(["MediaReferenceResponseModel"]),
    "id": import_zod3.z.string().uuid(),
    "name": import_zod3.z.string().nullish(),
    "mediaType": import_zod3.z.object({
      "icon": import_zod3.z.string().nullish(),
      "alias": import_zod3.z.string().nullish(),
      "name": import_zod3.z.string().nullish()
    })
  })))
});
var getDocumentByIdReferencedDescendantsParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getDocumentByIdReferencedDescendantsQueryTakeDefault = 20;
var getDocumentByIdReferencedDescendantsQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getDocumentByIdReferencedDescendantsQueryTakeDefault)
});
var getDocumentByIdReferencedDescendantsResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }))
});
var putDocumentByIdUnpublishParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putDocumentByIdUnpublishBody = import_zod3.z.object({
  "cultures": import_zod3.z.array(import_zod3.z.string()).nullish()
});
var putDocumentByIdValidateParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putDocumentByIdValidateBody = import_zod3.z.object({
  "values": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullish(),
    "segment": import_zod3.z.string().nullish(),
    "alias": import_zod3.z.string().min(1),
    "value": import_zod3.z.any().nullish()
  })),
  "variants": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullish(),
    "segment": import_zod3.z.string().nullish(),
    "name": import_zod3.z.string().min(1)
  })),
  "template": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish()
});
var putUmbracoManagementApiV11DocumentByIdValidate11Params = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putUmbracoManagementApiV11DocumentByIdValidate11Body = import_zod3.z.object({
  "values": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullish(),
    "segment": import_zod3.z.string().nullish(),
    "alias": import_zod3.z.string().min(1),
    "value": import_zod3.z.any().nullish()
  })),
  "variants": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullish(),
    "segment": import_zod3.z.string().nullish(),
    "name": import_zod3.z.string().min(1)
  })),
  "template": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish(),
  "cultures": import_zod3.z.array(import_zod3.z.string()).nullish()
});
var getDocumentAreReferencedQueryTakeDefault = 20;
var getDocumentAreReferencedQueryParams = import_zod3.z.object({
  "id": import_zod3.z.array(import_zod3.z.string().uuid()).optional(),
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getDocumentAreReferencedQueryTakeDefault)
});
var getDocumentAreReferencedResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }))
});
var getDocumentConfigurationResponse = import_zod3.z.object({
  "disableDeleteWhenReferenced": import_zod3.z.boolean(),
  "disableUnpublishWhenReferenced": import_zod3.z.boolean(),
  "allowEditInvariantFromNonDefault": import_zod3.z.boolean(),
  "allowNonExistingSegmentsCreation": import_zod3.z.boolean(),
  "reservedFieldNames": import_zod3.z.array(import_zod3.z.string())
});
var putDocumentSortBody = import_zod3.z.object({
  "parent": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish(),
  "sorting": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "sortOrder": import_zod3.z.number()
  }))
});
var getDocumentUrlsQueryParams = import_zod3.z.object({
  "id": import_zod3.z.array(import_zod3.z.string().uuid()).optional()
});
var getDocumentUrlsResponseItem = import_zod3.z.object({
  "id": import_zod3.z.string().uuid(),
  "urlInfos": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullable(),
    "url": import_zod3.z.string()
  }))
});
var getDocumentUrlsResponse = import_zod3.z.array(getDocumentUrlsResponseItem);
var postDocumentValidateBody = import_zod3.z.object({
  "values": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullish(),
    "segment": import_zod3.z.string().nullish(),
    "alias": import_zod3.z.string().min(1),
    "value": import_zod3.z.any().nullish()
  })),
  "variants": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullish(),
    "segment": import_zod3.z.string().nullish(),
    "name": import_zod3.z.string().min(1)
  })),
  "id": import_zod3.z.string().uuid().nullish(),
  "parent": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish(),
  "documentType": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }),
  "template": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullable()
});
var getItemDocumentQueryParams = import_zod3.z.object({
  "id": import_zod3.z.array(import_zod3.z.string().uuid()).optional()
});
var getItemDocumentResponseItem = import_zod3.z.object({
  "id": import_zod3.z.string().uuid(),
  "isTrashed": import_zod3.z.boolean(),
  "isProtected": import_zod3.z.boolean(),
  "parent": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish(),
  "hasChildren": import_zod3.z.boolean(),
  "documentType": import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "icon": import_zod3.z.string(),
    "collection": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish()
  }),
  "variants": import_zod3.z.array(import_zod3.z.object({
    "name": import_zod3.z.string(),
    "culture": import_zod3.z.string().nullish(),
    "state": import_zod3.z.enum(["NotCreated", "Draft", "Published", "PublishedPendingChanges"])
  }))
});
var getItemDocumentResponse = import_zod3.z.array(getItemDocumentResponseItem);
var getItemDocumentSearchQueryTakeDefault = 100;
var getItemDocumentSearchQueryParams = import_zod3.z.object({
  "query": import_zod3.z.string().optional(),
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getItemDocumentSearchQueryTakeDefault),
  "parentId": import_zod3.z.string().uuid().optional(),
  "allowedDocumentTypes": import_zod3.z.array(import_zod3.z.string().uuid()).optional()
});
var getItemDocumentSearchResponse = import_zod3.z.object({
  "items": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "isTrashed": import_zod3.z.boolean(),
    "isProtected": import_zod3.z.boolean(),
    "parent": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "hasChildren": import_zod3.z.boolean(),
    "documentType": import_zod3.z.object({
      "id": import_zod3.z.string().uuid(),
      "icon": import_zod3.z.string(),
      "collection": import_zod3.z.object({
        "id": import_zod3.z.string().uuid()
      }).nullish()
    }),
    "variants": import_zod3.z.array(import_zod3.z.object({
      "name": import_zod3.z.string(),
      "culture": import_zod3.z.string().nullish(),
      "state": import_zod3.z.enum(["NotCreated", "Draft", "Published", "PublishedPendingChanges"])
    }))
  })),
  "total": import_zod3.z.number()
});
var deleteRecycleBinDocumentByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getRecycleBinDocumentByIdOriginalParentParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getRecycleBinDocumentByIdOriginalParentResponse = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putRecycleBinDocumentByIdRestoreParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putRecycleBinDocumentByIdRestoreBody = import_zod3.z.object({
  "target": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish()
});
var getRecycleBinDocumentChildrenQueryTakeDefault = 100;
var getRecycleBinDocumentChildrenQueryParams = import_zod3.z.object({
  "parentId": import_zod3.z.string().uuid().optional(),
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getRecycleBinDocumentChildrenQueryTakeDefault)
});
var getRecycleBinDocumentChildrenResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "createDate": import_zod3.z.string().datetime({ "local": true }),
    "hasChildren": import_zod3.z.boolean(),
    "parent": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "documentType": import_zod3.z.object({
      "id": import_zod3.z.string().uuid(),
      "icon": import_zod3.z.string(),
      "collection": import_zod3.z.object({
        "id": import_zod3.z.string().uuid()
      }).nullish()
    }),
    "variants": import_zod3.z.array(import_zod3.z.object({
      "name": import_zod3.z.string(),
      "culture": import_zod3.z.string().nullish(),
      "state": import_zod3.z.enum(["NotCreated", "Draft", "Published", "PublishedPendingChanges"])
    }))
  }))
});
var getRecycleBinDocumentRootQueryTakeDefault = 100;
var getRecycleBinDocumentRootQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getRecycleBinDocumentRootQueryTakeDefault)
});
var getRecycleBinDocumentRootResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "createDate": import_zod3.z.string().datetime({ "local": true }),
    "hasChildren": import_zod3.z.boolean(),
    "parent": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "documentType": import_zod3.z.object({
      "id": import_zod3.z.string().uuid(),
      "icon": import_zod3.z.string(),
      "collection": import_zod3.z.object({
        "id": import_zod3.z.string().uuid()
      }).nullish()
    }),
    "variants": import_zod3.z.array(import_zod3.z.object({
      "name": import_zod3.z.string(),
      "culture": import_zod3.z.string().nullish(),
      "state": import_zod3.z.enum(["NotCreated", "Draft", "Published", "PublishedPendingChanges"])
    }))
  }))
});
var getTreeDocumentAncestorsQueryParams = import_zod3.z.object({
  "descendantId": import_zod3.z.string().uuid().optional()
});
var getTreeDocumentAncestorsResponseItem = import_zod3.z.object({
  "hasChildren": import_zod3.z.boolean(),
  "parent": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish(),
  "noAccess": import_zod3.z.boolean(),
  "isTrashed": import_zod3.z.boolean(),
  "id": import_zod3.z.string().uuid(),
  "createDate": import_zod3.z.string().datetime({ "local": true }),
  "isProtected": import_zod3.z.boolean(),
  "documentType": import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "icon": import_zod3.z.string(),
    "collection": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish()
  }),
  "variants": import_zod3.z.array(import_zod3.z.object({
    "name": import_zod3.z.string(),
    "culture": import_zod3.z.string().nullish(),
    "state": import_zod3.z.enum(["NotCreated", "Draft", "Published", "PublishedPendingChanges"])
  }))
});
var getTreeDocumentAncestorsResponse = import_zod3.z.array(getTreeDocumentAncestorsResponseItem);
var getTreeDocumentChildrenQueryTakeDefault = 100;
var getTreeDocumentChildrenQueryParams = import_zod3.z.object({
  "parentId": import_zod3.z.string().uuid().optional(),
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getTreeDocumentChildrenQueryTakeDefault),
  "dataTypeId": import_zod3.z.string().uuid().optional()
});
var getTreeDocumentChildrenResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "hasChildren": import_zod3.z.boolean(),
    "parent": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "noAccess": import_zod3.z.boolean(),
    "isTrashed": import_zod3.z.boolean(),
    "id": import_zod3.z.string().uuid(),
    "createDate": import_zod3.z.string().datetime({ "local": true }),
    "isProtected": import_zod3.z.boolean(),
    "documentType": import_zod3.z.object({
      "id": import_zod3.z.string().uuid(),
      "icon": import_zod3.z.string(),
      "collection": import_zod3.z.object({
        "id": import_zod3.z.string().uuid()
      }).nullish()
    }),
    "variants": import_zod3.z.array(import_zod3.z.object({
      "name": import_zod3.z.string(),
      "culture": import_zod3.z.string().nullish(),
      "state": import_zod3.z.enum(["NotCreated", "Draft", "Published", "PublishedPendingChanges"])
    }))
  }))
});
var getTreeDocumentRootQueryTakeDefault = 100;
var getTreeDocumentRootQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getTreeDocumentRootQueryTakeDefault),
  "dataTypeId": import_zod3.z.string().uuid().optional()
});
var getTreeDocumentRootResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "hasChildren": import_zod3.z.boolean(),
    "parent": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "noAccess": import_zod3.z.boolean(),
    "isTrashed": import_zod3.z.boolean(),
    "id": import_zod3.z.string().uuid(),
    "createDate": import_zod3.z.string().datetime({ "local": true }),
    "isProtected": import_zod3.z.boolean(),
    "documentType": import_zod3.z.object({
      "id": import_zod3.z.string().uuid(),
      "icon": import_zod3.z.string(),
      "collection": import_zod3.z.object({
        "id": import_zod3.z.string().uuid()
      }).nullish()
    }),
    "variants": import_zod3.z.array(import_zod3.z.object({
      "name": import_zod3.z.string(),
      "culture": import_zod3.z.string().nullish(),
      "state": import_zod3.z.enum(["NotCreated", "Draft", "Published", "PublishedPendingChanges"])
    }))
  }))
});
var postDynamicRootQueryBody = import_zod3.z.object({
  "context": import_zod3.z.object({
    "id": import_zod3.z.string().uuid().nullish(),
    "parent": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }),
    "culture": import_zod3.z.string().nullish(),
    "segment": import_zod3.z.string().nullish()
  }),
  "query": import_zod3.z.object({
    "origin": import_zod3.z.object({
      "alias": import_zod3.z.string(),
      "id": import_zod3.z.string().uuid().nullish()
    }),
    "steps": import_zod3.z.array(import_zod3.z.object({
      "alias": import_zod3.z.string(),
      "documentTypeIds": import_zod3.z.array(import_zod3.z.string().uuid())
    }))
  })
});
var postDynamicRootQueryResponse = import_zod3.z.object({
  "roots": import_zod3.z.array(import_zod3.z.string().uuid())
});
var getDynamicRootStepsResponseItem = import_zod3.z.string();
var getDynamicRootStepsResponse = import_zod3.z.array(getDynamicRootStepsResponseItem);
var getHealthCheckGroupQueryTakeDefault = 100;
var getHealthCheckGroupQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getHealthCheckGroupQueryTakeDefault)
});
var getHealthCheckGroupResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "name": import_zod3.z.string()
  }))
});
var getHealthCheckGroupByNameParams = import_zod3.z.object({
  "name": import_zod3.z.string()
});
var getHealthCheckGroupByNameResponse = import_zod3.z.object({
  "name": import_zod3.z.string(),
  "checks": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "name": import_zod3.z.string(),
    "description": import_zod3.z.string().nullish()
  }))
});
var postHealthCheckGroupByNameCheckParams = import_zod3.z.object({
  "name": import_zod3.z.string()
});
var postHealthCheckGroupByNameCheckResponse = import_zod3.z.object({
  "checks": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "results": import_zod3.z.array(import_zod3.z.object({
      "message": import_zod3.z.string(),
      "resultType": import_zod3.z.enum(["Success", "Warning", "Error", "Info"]),
      "actions": import_zod3.z.array(import_zod3.z.object({
        "healthCheck": import_zod3.z.object({
          "id": import_zod3.z.string().uuid()
        }),
        "alias": import_zod3.z.string().nullish(),
        "name": import_zod3.z.string().nullish(),
        "description": import_zod3.z.string().nullish(),
        "valueRequired": import_zod3.z.boolean(),
        "providedValue": import_zod3.z.string().nullish(),
        "providedValueValidation": import_zod3.z.string().nullish(),
        "providedValueValidationRegex": import_zod3.z.string().nullish(),
        "actionParameters": import_zod3.z.record(import_zod3.z.string(), import_zod3.z.any()).nullish()
      })).nullish(),
      "readMoreLink": import_zod3.z.string().nullish()
    })).nullish()
  }))
});
var postHealthCheckExecuteActionBody = import_zod3.z.object({
  "healthCheck": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }),
  "alias": import_zod3.z.string().nullish(),
  "name": import_zod3.z.string().nullish(),
  "description": import_zod3.z.string().nullish(),
  "valueRequired": import_zod3.z.boolean(),
  "providedValue": import_zod3.z.string().nullish(),
  "providedValueValidation": import_zod3.z.string().nullish(),
  "providedValueValidationRegex": import_zod3.z.string().nullish(),
  "actionParameters": import_zod3.z.record(import_zod3.z.string(), import_zod3.z.any()).nullish()
});
var postHealthCheckExecuteActionResponse = import_zod3.z.object({
  "message": import_zod3.z.string(),
  "resultType": import_zod3.z.enum(["Success", "Warning", "Error", "Info"]),
  "actions": import_zod3.z.array(import_zod3.z.object({
    "healthCheck": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }),
    "alias": import_zod3.z.string().nullish(),
    "name": import_zod3.z.string().nullish(),
    "description": import_zod3.z.string().nullish(),
    "valueRequired": import_zod3.z.boolean(),
    "providedValue": import_zod3.z.string().nullish(),
    "providedValueValidation": import_zod3.z.string().nullish(),
    "providedValueValidationRegex": import_zod3.z.string().nullish(),
    "actionParameters": import_zod3.z.record(import_zod3.z.string(), import_zod3.z.any()).nullish()
  })).nullish(),
  "readMoreLink": import_zod3.z.string().nullish()
});
var getHelpQueryTakeDefault = 100;
var getHelpQueryBaseUrlDefault = "https://our.umbraco.com";
var getHelpQueryParams = import_zod3.z.object({
  "section": import_zod3.z.string().optional(),
  "tree": import_zod3.z.string().optional(),
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getHelpQueryTakeDefault),
  "baseUrl": import_zod3.z.string().default(getHelpQueryBaseUrlDefault)
});
var getHelpResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "name": import_zod3.z.string().nullish(),
    "description": import_zod3.z.string().nullish(),
    "url": import_zod3.z.string().nullish(),
    "type": import_zod3.z.string().nullish()
  }))
});
var getImagingResizeUrlsQueryHeightDefault = 200;
var getImagingResizeUrlsQueryWidthDefault = 200;
var getImagingResizeUrlsQueryParams = import_zod3.z.object({
  "id": import_zod3.z.array(import_zod3.z.string().uuid()).optional(),
  "height": import_zod3.z.number().default(getImagingResizeUrlsQueryHeightDefault),
  "width": import_zod3.z.number().default(getImagingResizeUrlsQueryWidthDefault),
  "mode": import_zod3.z.enum(["Crop", "Max", "Stretch", "Pad", "BoxPad", "Min"]).optional()
});
var getImagingResizeUrlsResponseItem = import_zod3.z.object({
  "id": import_zod3.z.string().uuid(),
  "urlInfos": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullable(),
    "url": import_zod3.z.string()
  }))
});
var getImagingResizeUrlsResponse = import_zod3.z.array(getImagingResizeUrlsResponseItem);
var getImportAnalyzeQueryParams = import_zod3.z.object({
  "temporaryFileId": import_zod3.z.string().uuid().optional()
});
var getImportAnalyzeResponse = import_zod3.z.object({
  "entityType": import_zod3.z.string(),
  "alias": import_zod3.z.string().nullish(),
  "key": import_zod3.z.string().uuid().nullish()
});
var getIndexerQueryTakeDefault = 100;
var getIndexerQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getIndexerQueryTakeDefault)
});
var getIndexerResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "name": import_zod3.z.string().min(1),
    "healthStatus": import_zod3.z.object({
      "status": import_zod3.z.enum(["Healthy", "Unhealthy", "Rebuilding", "Corrupt"]),
      "message": import_zod3.z.string().nullish()
    }),
    "canRebuild": import_zod3.z.boolean(),
    "searcherName": import_zod3.z.string(),
    "documentCount": import_zod3.z.number(),
    "fieldCount": import_zod3.z.number(),
    "providerProperties": import_zod3.z.record(import_zod3.z.string(), import_zod3.z.any().nullable()).nullish()
  }))
});
var getIndexerByIndexNameParams = import_zod3.z.object({
  "indexName": import_zod3.z.string()
});
var getIndexerByIndexNameResponse = import_zod3.z.object({
  "name": import_zod3.z.string().min(1),
  "healthStatus": import_zod3.z.object({
    "status": import_zod3.z.enum(["Healthy", "Unhealthy", "Rebuilding", "Corrupt"]),
    "message": import_zod3.z.string().nullish()
  }),
  "canRebuild": import_zod3.z.boolean(),
  "searcherName": import_zod3.z.string(),
  "documentCount": import_zod3.z.number(),
  "fieldCount": import_zod3.z.number(),
  "providerProperties": import_zod3.z.record(import_zod3.z.string(), import_zod3.z.any().nullable()).nullish()
});
var postIndexerByIndexNameRebuildParams = import_zod3.z.object({
  "indexName": import_zod3.z.string()
});
var getInstallSettingsResponse = import_zod3.z.object({
  "user": import_zod3.z.object({
    "minCharLength": import_zod3.z.number(),
    "minNonAlphaNumericLength": import_zod3.z.number(),
    "consentLevels": import_zod3.z.array(import_zod3.z.object({
      "level": import_zod3.z.enum(["Minimal", "Basic", "Detailed"]),
      "description": import_zod3.z.string().min(1)
    }))
  }),
  "databases": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "sortOrder": import_zod3.z.number(),
    "displayName": import_zod3.z.string().min(1),
    "defaultDatabaseName": import_zod3.z.string().min(1),
    "providerName": import_zod3.z.string().min(1),
    "isConfigured": import_zod3.z.boolean(),
    "requiresServer": import_zod3.z.boolean(),
    "serverPlaceholder": import_zod3.z.string().min(1),
    "requiresCredentials": import_zod3.z.boolean(),
    "supportsIntegratedAuthentication": import_zod3.z.boolean(),
    "requiresConnectionTest": import_zod3.z.boolean()
  }))
});
var postInstallSetupBodyUserNameMin = 0;
var postInstallSetupBodyUserNameMax = 255;
var postInstallSetupBody = import_zod3.z.object({
  "user": import_zod3.z.object({
    "name": import_zod3.z.string().min(postInstallSetupBodyUserNameMin).max(postInstallSetupBodyUserNameMax),
    "email": import_zod3.z.string().email().min(1),
    "password": import_zod3.z.string().min(1),
    "subscribeToNewsletter": import_zod3.z.boolean()
  }),
  "database": import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "providerName": import_zod3.z.string().min(1),
    "server": import_zod3.z.string().nullish(),
    "name": import_zod3.z.string().nullish(),
    "username": import_zod3.z.string().nullish(),
    "password": import_zod3.z.string().nullish(),
    "useIntegratedAuthentication": import_zod3.z.boolean(),
    "connectionString": import_zod3.z.string().nullish(),
    "trustServerCertificate": import_zod3.z.boolean()
  }),
  "telemetryLevel": import_zod3.z.enum(["Minimal", "Basic", "Detailed"])
});
var postInstallValidateDatabaseBody = import_zod3.z.object({
  "id": import_zod3.z.string().uuid(),
  "providerName": import_zod3.z.string().min(1),
  "server": import_zod3.z.string().nullish(),
  "name": import_zod3.z.string().nullish(),
  "username": import_zod3.z.string().nullish(),
  "password": import_zod3.z.string().nullish(),
  "useIntegratedAuthentication": import_zod3.z.boolean(),
  "connectionString": import_zod3.z.string().nullish(),
  "trustServerCertificate": import_zod3.z.boolean()
});
var getItemLanguageQueryParams = import_zod3.z.object({
  "isoCode": import_zod3.z.array(import_zod3.z.string()).optional()
});
var getItemLanguageResponseItem = import_zod3.z.object({
  "name": import_zod3.z.string().min(1),
  "isoCode": import_zod3.z.string().min(1)
});
var getItemLanguageResponse = import_zod3.z.array(getItemLanguageResponseItem);
var getItemLanguageDefaultResponse = import_zod3.z.object({
  "name": import_zod3.z.string().min(1),
  "isoCode": import_zod3.z.string().min(1)
});
var getLanguageQueryTakeDefault = 100;
var getLanguageQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getLanguageQueryTakeDefault)
});
var getLanguageResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "name": import_zod3.z.string().min(1),
    "isDefault": import_zod3.z.boolean(),
    "isMandatory": import_zod3.z.boolean(),
    "fallbackIsoCode": import_zod3.z.string().nullish(),
    "isoCode": import_zod3.z.string().min(1)
  }))
});
var postLanguageBody = import_zod3.z.object({
  "name": import_zod3.z.string().min(1),
  "isDefault": import_zod3.z.boolean(),
  "isMandatory": import_zod3.z.boolean(),
  "fallbackIsoCode": import_zod3.z.string().nullish(),
  "isoCode": import_zod3.z.string().min(1)
});
var getLanguageByIsoCodeParams = import_zod3.z.object({
  "isoCode": import_zod3.z.string()
});
var getLanguageByIsoCodeResponse = import_zod3.z.object({
  "name": import_zod3.z.string().min(1),
  "isDefault": import_zod3.z.boolean(),
  "isMandatory": import_zod3.z.boolean(),
  "fallbackIsoCode": import_zod3.z.string().nullish(),
  "isoCode": import_zod3.z.string().min(1)
});
var deleteLanguageByIsoCodeParams = import_zod3.z.object({
  "isoCode": import_zod3.z.string()
});
var putLanguageByIsoCodeParams = import_zod3.z.object({
  "isoCode": import_zod3.z.string()
});
var putLanguageByIsoCodeBody = import_zod3.z.object({
  "name": import_zod3.z.string().min(1),
  "isDefault": import_zod3.z.boolean(),
  "isMandatory": import_zod3.z.boolean(),
  "fallbackIsoCode": import_zod3.z.string().nullish()
});
var getLogViewerLevelQueryTakeDefault = 100;
var getLogViewerLevelQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getLogViewerLevelQueryTakeDefault)
});
var getLogViewerLevelResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "name": import_zod3.z.string(),
    "level": import_zod3.z.enum(["Verbose", "Debug", "Information", "Warning", "Error", "Fatal"])
  }))
});
var getLogViewerLevelCountQueryParams = import_zod3.z.object({
  "startDate": import_zod3.z.string().datetime({ "local": true }).optional(),
  "endDate": import_zod3.z.string().datetime({ "local": true }).optional()
});
var getLogViewerLevelCountResponse = import_zod3.z.object({
  "information": import_zod3.z.number(),
  "debug": import_zod3.z.number(),
  "warning": import_zod3.z.number(),
  "error": import_zod3.z.number(),
  "fatal": import_zod3.z.number()
});
var getLogViewerLogQueryTakeDefault = 100;
var getLogViewerLogQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getLogViewerLogQueryTakeDefault),
  "orderDirection": import_zod3.z.enum(["Ascending", "Descending"]).optional(),
  "filterExpression": import_zod3.z.string().optional(),
  "logLevel": import_zod3.z.array(import_zod3.z.enum(["Verbose", "Debug", "Information", "Warning", "Error", "Fatal"])).optional(),
  "startDate": import_zod3.z.string().datetime({ "local": true }).optional(),
  "endDate": import_zod3.z.string().datetime({ "local": true }).optional()
});
var getLogViewerLogResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "timestamp": import_zod3.z.string().datetime({ "local": true }),
    "level": import_zod3.z.enum(["Verbose", "Debug", "Information", "Warning", "Error", "Fatal"]),
    "messageTemplate": import_zod3.z.string().nullish(),
    "renderedMessage": import_zod3.z.string().nullish(),
    "properties": import_zod3.z.array(import_zod3.z.object({
      "name": import_zod3.z.string(),
      "value": import_zod3.z.string().nullish()
    })),
    "exception": import_zod3.z.string().nullish()
  }))
});
var getLogViewerMessageTemplateQueryTakeDefault = 100;
var getLogViewerMessageTemplateQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getLogViewerMessageTemplateQueryTakeDefault),
  "startDate": import_zod3.z.string().datetime({ "local": true }).optional(),
  "endDate": import_zod3.z.string().datetime({ "local": true }).optional()
});
var getLogViewerMessageTemplateResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "messageTemplate": import_zod3.z.string().nullish(),
    "count": import_zod3.z.number()
  }))
});
var getLogViewerSavedSearchQueryTakeDefault = 100;
var getLogViewerSavedSearchQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getLogViewerSavedSearchQueryTakeDefault)
});
var getLogViewerSavedSearchResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "name": import_zod3.z.string(),
    "query": import_zod3.z.string()
  }))
});
var postLogViewerSavedSearchBody = import_zod3.z.object({
  "name": import_zod3.z.string(),
  "query": import_zod3.z.string()
});
var getLogViewerSavedSearchByNameParams = import_zod3.z.object({
  "name": import_zod3.z.string()
});
var getLogViewerSavedSearchByNameResponse = import_zod3.z.object({
  "name": import_zod3.z.string(),
  "query": import_zod3.z.string()
});
var deleteLogViewerSavedSearchByNameParams = import_zod3.z.object({
  "name": import_zod3.z.string()
});
var getLogViewerValidateLogsSizeQueryParams = import_zod3.z.object({
  "startDate": import_zod3.z.string().datetime({ "local": true }).optional(),
  "endDate": import_zod3.z.string().datetime({ "local": true }).optional()
});
var getManifestManifestResponseItem = import_zod3.z.object({
  "name": import_zod3.z.string().min(1),
  "id": import_zod3.z.string().nullish(),
  "version": import_zod3.z.string().nullish(),
  "extensions": import_zod3.z.array(import_zod3.z.any())
});
var getManifestManifestResponse = import_zod3.z.array(getManifestManifestResponseItem);
var getManifestManifestPrivateResponseItem = import_zod3.z.object({
  "name": import_zod3.z.string().min(1),
  "id": import_zod3.z.string().nullish(),
  "version": import_zod3.z.string().nullish(),
  "extensions": import_zod3.z.array(import_zod3.z.any())
});
var getManifestManifestPrivateResponse = import_zod3.z.array(getManifestManifestPrivateResponseItem);
var getManifestManifestPublicResponseItem = import_zod3.z.object({
  "name": import_zod3.z.string().min(1),
  "id": import_zod3.z.string().nullish(),
  "version": import_zod3.z.string().nullish(),
  "extensions": import_zod3.z.array(import_zod3.z.any())
});
var getManifestManifestPublicResponse = import_zod3.z.array(getManifestManifestPublicResponseItem);
var getItemMediaTypeQueryParams = import_zod3.z.object({
  "id": import_zod3.z.array(import_zod3.z.string().uuid()).optional()
});
var getItemMediaTypeResponseItem = import_zod3.z.object({
  "id": import_zod3.z.string().uuid(),
  "name": import_zod3.z.string(),
  "icon": import_zod3.z.string().nullish()
});
var getItemMediaTypeResponse = import_zod3.z.array(getItemMediaTypeResponseItem);
var getItemMediaTypeAllowedQueryTakeDefault = 100;
var getItemMediaTypeAllowedQueryParams = import_zod3.z.object({
  "fileExtension": import_zod3.z.string().optional(),
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getItemMediaTypeAllowedQueryTakeDefault)
});
var getItemMediaTypeAllowedResponse = import_zod3.z.object({
  "items": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "name": import_zod3.z.string(),
    "icon": import_zod3.z.string().nullish()
  })),
  "total": import_zod3.z.number()
});
var getItemMediaTypeFoldersQueryTakeDefault = 100;
var getItemMediaTypeFoldersQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getItemMediaTypeFoldersQueryTakeDefault)
});
var getItemMediaTypeFoldersResponse = import_zod3.z.object({
  "items": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "name": import_zod3.z.string(),
    "icon": import_zod3.z.string().nullish()
  })),
  "total": import_zod3.z.number()
});
var getItemMediaTypeSearchQueryTakeDefault = 100;
var getItemMediaTypeSearchQueryParams = import_zod3.z.object({
  "query": import_zod3.z.string().optional(),
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getItemMediaTypeSearchQueryTakeDefault)
});
var getItemMediaTypeSearchResponse = import_zod3.z.object({
  "items": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "name": import_zod3.z.string(),
    "icon": import_zod3.z.string().nullish()
  })),
  "total": import_zod3.z.number()
});
var postMediaTypeBody = import_zod3.z.object({
  "alias": import_zod3.z.string().min(1),
  "name": import_zod3.z.string().min(1),
  "description": import_zod3.z.string().nullish(),
  "icon": import_zod3.z.string().min(1),
  "allowedAsRoot": import_zod3.z.boolean(),
  "variesByCulture": import_zod3.z.boolean(),
  "variesBySegment": import_zod3.z.boolean(),
  "isElement": import_zod3.z.boolean(),
  "properties": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "container": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "sortOrder": import_zod3.z.number(),
    "alias": import_zod3.z.string().min(1),
    "name": import_zod3.z.string().min(1),
    "description": import_zod3.z.string().nullish(),
    "dataType": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }),
    "variesByCulture": import_zod3.z.boolean(),
    "variesBySegment": import_zod3.z.boolean(),
    "validation": import_zod3.z.object({
      "mandatory": import_zod3.z.boolean(),
      "mandatoryMessage": import_zod3.z.string().nullish(),
      "regEx": import_zod3.z.string().nullish(),
      "regExMessage": import_zod3.z.string().nullish()
    }),
    "appearance": import_zod3.z.object({
      "labelOnTop": import_zod3.z.boolean()
    })
  })),
  "containers": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "parent": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "name": import_zod3.z.string().nullish(),
    "type": import_zod3.z.string().min(1),
    "sortOrder": import_zod3.z.number()
  })),
  "id": import_zod3.z.string().uuid().nullish(),
  "parent": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish(),
  "allowedMediaTypes": import_zod3.z.array(import_zod3.z.object({
    "mediaType": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }),
    "sortOrder": import_zod3.z.number()
  })),
  "compositions": import_zod3.z.array(import_zod3.z.object({
    "mediaType": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }),
    "compositionType": import_zod3.z.enum(["Composition", "Inheritance"])
  })),
  "collection": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish()
});
var getMediaTypeByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getMediaTypeByIdResponse = import_zod3.z.object({
  "alias": import_zod3.z.string().min(1),
  "name": import_zod3.z.string().min(1),
  "description": import_zod3.z.string().nullish(),
  "icon": import_zod3.z.string().min(1),
  "allowedAsRoot": import_zod3.z.boolean(),
  "variesByCulture": import_zod3.z.boolean(),
  "variesBySegment": import_zod3.z.boolean(),
  "collection": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish(),
  "isElement": import_zod3.z.boolean(),
  "properties": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "container": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "sortOrder": import_zod3.z.number(),
    "alias": import_zod3.z.string().min(1),
    "name": import_zod3.z.string().min(1),
    "description": import_zod3.z.string().nullish(),
    "dataType": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }),
    "variesByCulture": import_zod3.z.boolean(),
    "variesBySegment": import_zod3.z.boolean(),
    "validation": import_zod3.z.object({
      "mandatory": import_zod3.z.boolean(),
      "mandatoryMessage": import_zod3.z.string().nullish(),
      "regEx": import_zod3.z.string().nullish(),
      "regExMessage": import_zod3.z.string().nullish()
    }),
    "appearance": import_zod3.z.object({
      "labelOnTop": import_zod3.z.boolean()
    })
  })),
  "containers": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "parent": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "name": import_zod3.z.string().nullish(),
    "type": import_zod3.z.string().min(1),
    "sortOrder": import_zod3.z.number()
  })),
  "id": import_zod3.z.string().uuid(),
  "allowedMediaTypes": import_zod3.z.array(import_zod3.z.object({
    "mediaType": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }),
    "sortOrder": import_zod3.z.number()
  })),
  "compositions": import_zod3.z.array(import_zod3.z.object({
    "mediaType": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }),
    "compositionType": import_zod3.z.enum(["Composition", "Inheritance"])
  })),
  "isDeletable": import_zod3.z.boolean(),
  "aliasCanBeChanged": import_zod3.z.boolean()
});
var deleteMediaTypeByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putMediaTypeByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putMediaTypeByIdBody = import_zod3.z.object({
  "alias": import_zod3.z.string().min(1),
  "name": import_zod3.z.string().min(1),
  "description": import_zod3.z.string().nullish(),
  "icon": import_zod3.z.string().min(1),
  "allowedAsRoot": import_zod3.z.boolean(),
  "variesByCulture": import_zod3.z.boolean(),
  "variesBySegment": import_zod3.z.boolean(),
  "collection": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish(),
  "isElement": import_zod3.z.boolean(),
  "properties": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "container": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "sortOrder": import_zod3.z.number(),
    "alias": import_zod3.z.string().min(1),
    "name": import_zod3.z.string().min(1),
    "description": import_zod3.z.string().nullish(),
    "dataType": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }),
    "variesByCulture": import_zod3.z.boolean(),
    "variesBySegment": import_zod3.z.boolean(),
    "validation": import_zod3.z.object({
      "mandatory": import_zod3.z.boolean(),
      "mandatoryMessage": import_zod3.z.string().nullish(),
      "regEx": import_zod3.z.string().nullish(),
      "regExMessage": import_zod3.z.string().nullish()
    }),
    "appearance": import_zod3.z.object({
      "labelOnTop": import_zod3.z.boolean()
    })
  })),
  "containers": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "parent": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "name": import_zod3.z.string().nullish(),
    "type": import_zod3.z.string().min(1),
    "sortOrder": import_zod3.z.number()
  })),
  "allowedMediaTypes": import_zod3.z.array(import_zod3.z.object({
    "mediaType": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }),
    "sortOrder": import_zod3.z.number()
  })),
  "compositions": import_zod3.z.array(import_zod3.z.object({
    "mediaType": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }),
    "compositionType": import_zod3.z.enum(["Composition", "Inheritance"])
  }))
});
var getMediaTypeByIdAllowedChildrenParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getMediaTypeByIdAllowedChildrenQueryTakeDefault = 100;
var getMediaTypeByIdAllowedChildrenQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getMediaTypeByIdAllowedChildrenQueryTakeDefault)
});
var getMediaTypeByIdAllowedChildrenResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "name": import_zod3.z.string(),
    "description": import_zod3.z.string().nullish(),
    "icon": import_zod3.z.string().nullish()
  }))
});
var getMediaTypeByIdCompositionReferencesParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getMediaTypeByIdCompositionReferencesResponseItem = import_zod3.z.object({
  "id": import_zod3.z.string().uuid(),
  "name": import_zod3.z.string(),
  "icon": import_zod3.z.string()
});
var getMediaTypeByIdCompositionReferencesResponse = import_zod3.z.array(getMediaTypeByIdCompositionReferencesResponseItem);
var postMediaTypeByIdCopyParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var postMediaTypeByIdCopyBody = import_zod3.z.object({
  "target": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish()
});
var getMediaTypeByIdExportParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getMediaTypeByIdExportResponse = import_zod3.z.instanceof(File);
var putMediaTypeByIdImportParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putMediaTypeByIdImportBody = import_zod3.z.object({
  "file": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  })
});
var putMediaTypeByIdMoveParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putMediaTypeByIdMoveBody = import_zod3.z.object({
  "target": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish()
});
var getMediaTypeAllowedAtRootQueryTakeDefault = 100;
var getMediaTypeAllowedAtRootQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getMediaTypeAllowedAtRootQueryTakeDefault)
});
var getMediaTypeAllowedAtRootResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "name": import_zod3.z.string(),
    "description": import_zod3.z.string().nullish(),
    "icon": import_zod3.z.string().nullish()
  }))
});
var postMediaTypeAvailableCompositionsBody = import_zod3.z.object({
  "id": import_zod3.z.string().uuid().nullish(),
  "currentPropertyAliases": import_zod3.z.array(import_zod3.z.string()),
  "currentCompositeIds": import_zod3.z.array(import_zod3.z.string().uuid())
});
var postMediaTypeAvailableCompositionsResponseItem = import_zod3.z.object({
  "id": import_zod3.z.string().uuid(),
  "name": import_zod3.z.string(),
  "icon": import_zod3.z.string(),
  "folderPath": import_zod3.z.array(import_zod3.z.string()),
  "isCompatible": import_zod3.z.boolean()
});
var postMediaTypeAvailableCompositionsResponse = import_zod3.z.array(postMediaTypeAvailableCompositionsResponseItem);
var getMediaTypeConfigurationResponse = import_zod3.z.object({
  "reservedFieldNames": import_zod3.z.array(import_zod3.z.string())
});
var postMediaTypeFolderBody = import_zod3.z.object({
  "name": import_zod3.z.string().min(1),
  "id": import_zod3.z.string().uuid().nullish(),
  "parent": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish()
});
var getMediaTypeFolderByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getMediaTypeFolderByIdResponse = import_zod3.z.object({
  "name": import_zod3.z.string().min(1),
  "id": import_zod3.z.string().uuid()
});
var deleteMediaTypeFolderByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putMediaTypeFolderByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putMediaTypeFolderByIdBody = import_zod3.z.object({
  "name": import_zod3.z.string().min(1)
});
var postMediaTypeImportBody = import_zod3.z.object({
  "file": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  })
});
var getTreeMediaTypeAncestorsQueryParams = import_zod3.z.object({
  "descendantId": import_zod3.z.string().uuid().optional()
});
var getTreeMediaTypeAncestorsResponseItem = import_zod3.z.object({
  "hasChildren": import_zod3.z.boolean(),
  "id": import_zod3.z.string().uuid(),
  "parent": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish(),
  "name": import_zod3.z.string(),
  "isFolder": import_zod3.z.boolean(),
  "icon": import_zod3.z.string(),
  "isDeletable": import_zod3.z.boolean()
});
var getTreeMediaTypeAncestorsResponse = import_zod3.z.array(getTreeMediaTypeAncestorsResponseItem);
var getTreeMediaTypeChildrenQueryTakeDefault = 100;
var getTreeMediaTypeChildrenQueryParams = import_zod3.z.object({
  "parentId": import_zod3.z.string().uuid().optional(),
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getTreeMediaTypeChildrenQueryTakeDefault),
  "foldersOnly": import_zod3.z.boolean().optional()
});
var getTreeMediaTypeChildrenResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "hasChildren": import_zod3.z.boolean(),
    "id": import_zod3.z.string().uuid(),
    "parent": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "name": import_zod3.z.string(),
    "isFolder": import_zod3.z.boolean(),
    "icon": import_zod3.z.string(),
    "isDeletable": import_zod3.z.boolean()
  }))
});
var getTreeMediaTypeRootQueryTakeDefault = 100;
var getTreeMediaTypeRootQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getTreeMediaTypeRootQueryTakeDefault),
  "foldersOnly": import_zod3.z.boolean().optional()
});
var getTreeMediaTypeRootResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "hasChildren": import_zod3.z.boolean(),
    "id": import_zod3.z.string().uuid(),
    "parent": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "name": import_zod3.z.string(),
    "isFolder": import_zod3.z.boolean(),
    "icon": import_zod3.z.string(),
    "isDeletable": import_zod3.z.boolean()
  }))
});
var getCollectionMediaQueryOrderByDefault = "updateDate";
var getCollectionMediaQueryTakeDefault = 100;
var getCollectionMediaQueryParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid().optional(),
  "dataTypeId": import_zod3.z.string().uuid().optional(),
  "orderBy": import_zod3.z.string().default(getCollectionMediaQueryOrderByDefault),
  "orderDirection": import_zod3.z.enum(["Ascending", "Descending"]).optional(),
  "filter": import_zod3.z.string().optional(),
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getCollectionMediaQueryTakeDefault)
});
var getCollectionMediaResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "values": import_zod3.z.array(import_zod3.z.object({
      "culture": import_zod3.z.string().nullish(),
      "segment": import_zod3.z.string().nullish(),
      "alias": import_zod3.z.string().min(1),
      "value": import_zod3.z.any().nullish(),
      "editorAlias": import_zod3.z.string().min(1)
    })),
    "variants": import_zod3.z.array(import_zod3.z.object({
      "culture": import_zod3.z.string().nullish(),
      "segment": import_zod3.z.string().nullish(),
      "name": import_zod3.z.string().min(1),
      "createDate": import_zod3.z.string().datetime({ "local": true }),
      "updateDate": import_zod3.z.string().datetime({ "local": true })
    })),
    "id": import_zod3.z.string().uuid(),
    "creator": import_zod3.z.string().nullish(),
    "sortOrder": import_zod3.z.number(),
    "mediaType": import_zod3.z.object({
      "id": import_zod3.z.string().uuid(),
      "alias": import_zod3.z.string(),
      "icon": import_zod3.z.string()
    })
  }))
});
var getItemMediaQueryParams = import_zod3.z.object({
  "id": import_zod3.z.array(import_zod3.z.string().uuid()).optional()
});
var getItemMediaResponseItem = import_zod3.z.object({
  "id": import_zod3.z.string().uuid(),
  "isTrashed": import_zod3.z.boolean(),
  "parent": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish(),
  "hasChildren": import_zod3.z.boolean(),
  "mediaType": import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "icon": import_zod3.z.string(),
    "collection": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish()
  }),
  "variants": import_zod3.z.array(import_zod3.z.object({
    "name": import_zod3.z.string(),
    "culture": import_zod3.z.string().nullish()
  }))
});
var getItemMediaResponse = import_zod3.z.array(getItemMediaResponseItem);
var getItemMediaSearchQueryTakeDefault = 100;
var getItemMediaSearchQueryParams = import_zod3.z.object({
  "query": import_zod3.z.string().optional(),
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getItemMediaSearchQueryTakeDefault),
  "parentId": import_zod3.z.string().uuid().optional(),
  "allowedMediaTypes": import_zod3.z.array(import_zod3.z.string().uuid()).optional()
});
var getItemMediaSearchResponse = import_zod3.z.object({
  "items": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "isTrashed": import_zod3.z.boolean(),
    "parent": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "hasChildren": import_zod3.z.boolean(),
    "mediaType": import_zod3.z.object({
      "id": import_zod3.z.string().uuid(),
      "icon": import_zod3.z.string(),
      "collection": import_zod3.z.object({
        "id": import_zod3.z.string().uuid()
      }).nullish()
    }),
    "variants": import_zod3.z.array(import_zod3.z.object({
      "name": import_zod3.z.string(),
      "culture": import_zod3.z.string().nullish()
    }))
  })),
  "total": import_zod3.z.number()
});
var postMediaBody = import_zod3.z.object({
  "values": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullish(),
    "segment": import_zod3.z.string().nullish(),
    "alias": import_zod3.z.string().min(1),
    "value": import_zod3.z.any().nullish()
  })),
  "variants": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullish(),
    "segment": import_zod3.z.string().nullish(),
    "name": import_zod3.z.string().min(1)
  })),
  "id": import_zod3.z.string().uuid().nullish(),
  "parent": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish(),
  "mediaType": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  })
});
var getMediaByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getMediaByIdResponse = import_zod3.z.object({
  "values": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullish(),
    "segment": import_zod3.z.string().nullish(),
    "alias": import_zod3.z.string().min(1),
    "value": import_zod3.z.any().nullish(),
    "editorAlias": import_zod3.z.string().min(1)
  })),
  "variants": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullish(),
    "segment": import_zod3.z.string().nullish(),
    "name": import_zod3.z.string().min(1),
    "createDate": import_zod3.z.string().datetime({ "local": true }),
    "updateDate": import_zod3.z.string().datetime({ "local": true })
  })),
  "id": import_zod3.z.string().uuid(),
  "urls": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullable(),
    "url": import_zod3.z.string()
  })),
  "isTrashed": import_zod3.z.boolean(),
  "mediaType": import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "icon": import_zod3.z.string(),
    "collection": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish()
  })
});
var deleteMediaByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putMediaByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putMediaByIdBody = import_zod3.z.object({
  "values": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullish(),
    "segment": import_zod3.z.string().nullish(),
    "alias": import_zod3.z.string().min(1),
    "value": import_zod3.z.any().nullish()
  })),
  "variants": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullish(),
    "segment": import_zod3.z.string().nullish(),
    "name": import_zod3.z.string().min(1)
  }))
});
var getMediaByIdAuditLogParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getMediaByIdAuditLogQueryTakeDefault = 100;
var getMediaByIdAuditLogQueryParams = import_zod3.z.object({
  "orderDirection": import_zod3.z.enum(["Ascending", "Descending"]).optional(),
  "sinceDate": import_zod3.z.string().datetime({ "local": true }).optional(),
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getMediaByIdAuditLogQueryTakeDefault)
});
var getMediaByIdAuditLogResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "user": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }),
    "timestamp": import_zod3.z.string().datetime({ "local": true }),
    "logType": import_zod3.z.enum(["New", "Save", "SaveVariant", "Open", "Delete", "Publish", "PublishVariant", "SendToPublish", "SendToPublishVariant", "Unpublish", "UnpublishVariant", "Move", "Copy", "AssignDomain", "PublicAccess", "Sort", "Notify", "System", "RollBack", "PackagerInstall", "PackagerUninstall", "Custom", "ContentVersionPreventCleanup", "ContentVersionEnableCleanup"]),
    "comment": import_zod3.z.string().nullish(),
    "parameters": import_zod3.z.string().nullish()
  }))
});
var putMediaByIdMoveParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putMediaByIdMoveBody = import_zod3.z.object({
  "target": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish()
});
var putMediaByIdMoveToRecycleBinParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getMediaByIdReferencedByParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getMediaByIdReferencedByQueryTakeDefault = 20;
var getMediaByIdReferencedByQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getMediaByIdReferencedByQueryTakeDefault)
});
var getMediaByIdReferencedByResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "$type": import_zod3.z.enum(["DefaultReferenceResponseModel"]),
    "id": import_zod3.z.string().uuid(),
    "name": import_zod3.z.string().nullish(),
    "type": import_zod3.z.string().nullish(),
    "icon": import_zod3.z.string().nullish()
  }).or(import_zod3.z.object({
    "$type": import_zod3.z.enum(["DocumentReferenceResponseModel"]),
    "id": import_zod3.z.string().uuid(),
    "name": import_zod3.z.string().nullish(),
    "published": import_zod3.z.boolean().nullish(),
    "documentType": import_zod3.z.object({
      "icon": import_zod3.z.string().nullish(),
      "alias": import_zod3.z.string().nullish(),
      "name": import_zod3.z.string().nullish()
    })
  })).or(import_zod3.z.object({
    "$type": import_zod3.z.enum(["MediaReferenceResponseModel"]),
    "id": import_zod3.z.string().uuid(),
    "name": import_zod3.z.string().nullish(),
    "mediaType": import_zod3.z.object({
      "icon": import_zod3.z.string().nullish(),
      "alias": import_zod3.z.string().nullish(),
      "name": import_zod3.z.string().nullish()
    })
  })))
});
var getMediaByIdReferencedDescendantsParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getMediaByIdReferencedDescendantsQueryTakeDefault = 20;
var getMediaByIdReferencedDescendantsQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getMediaByIdReferencedDescendantsQueryTakeDefault)
});
var getMediaByIdReferencedDescendantsResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }))
});
var putMediaByIdValidateParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putMediaByIdValidateBody = import_zod3.z.object({
  "values": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullish(),
    "segment": import_zod3.z.string().nullish(),
    "alias": import_zod3.z.string().min(1),
    "value": import_zod3.z.any().nullish()
  })),
  "variants": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullish(),
    "segment": import_zod3.z.string().nullish(),
    "name": import_zod3.z.string().min(1)
  }))
});
var getMediaAreReferencedQueryTakeDefault = 20;
var getMediaAreReferencedQueryParams = import_zod3.z.object({
  "id": import_zod3.z.array(import_zod3.z.string().uuid()).optional(),
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getMediaAreReferencedQueryTakeDefault)
});
var getMediaAreReferencedResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }))
});
var getMediaConfigurationResponse = import_zod3.z.object({
  "disableDeleteWhenReferenced": import_zod3.z.boolean(),
  "disableUnpublishWhenReferenced": import_zod3.z.boolean(),
  "reservedFieldNames": import_zod3.z.array(import_zod3.z.string())
});
var putMediaSortBody = import_zod3.z.object({
  "parent": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish(),
  "sorting": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "sortOrder": import_zod3.z.number()
  }))
});
var getMediaUrlsQueryParams = import_zod3.z.object({
  "id": import_zod3.z.array(import_zod3.z.string().uuid()).optional()
});
var getMediaUrlsResponseItem = import_zod3.z.object({
  "id": import_zod3.z.string().uuid(),
  "urlInfos": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullable(),
    "url": import_zod3.z.string()
  }))
});
var getMediaUrlsResponse = import_zod3.z.array(getMediaUrlsResponseItem);
var postMediaValidateBody = import_zod3.z.object({
  "values": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullish(),
    "segment": import_zod3.z.string().nullish(),
    "alias": import_zod3.z.string().min(1),
    "value": import_zod3.z.any().nullish()
  })),
  "variants": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullish(),
    "segment": import_zod3.z.string().nullish(),
    "name": import_zod3.z.string().min(1)
  })),
  "id": import_zod3.z.string().uuid().nullish(),
  "parent": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish(),
  "mediaType": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  })
});
var deleteRecycleBinMediaByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getRecycleBinMediaByIdOriginalParentParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getRecycleBinMediaByIdOriginalParentResponse = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putRecycleBinMediaByIdRestoreParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putRecycleBinMediaByIdRestoreBody = import_zod3.z.object({
  "target": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish()
});
var getRecycleBinMediaChildrenQueryTakeDefault = 100;
var getRecycleBinMediaChildrenQueryParams = import_zod3.z.object({
  "parentId": import_zod3.z.string().uuid().optional(),
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getRecycleBinMediaChildrenQueryTakeDefault)
});
var getRecycleBinMediaChildrenResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "createDate": import_zod3.z.string().datetime({ "local": true }),
    "hasChildren": import_zod3.z.boolean(),
    "parent": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "mediaType": import_zod3.z.object({
      "id": import_zod3.z.string().uuid(),
      "icon": import_zod3.z.string(),
      "collection": import_zod3.z.object({
        "id": import_zod3.z.string().uuid()
      }).nullish()
    }),
    "variants": import_zod3.z.array(import_zod3.z.object({
      "name": import_zod3.z.string(),
      "culture": import_zod3.z.string().nullish()
    }))
  }))
});
var getRecycleBinMediaRootQueryTakeDefault = 100;
var getRecycleBinMediaRootQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getRecycleBinMediaRootQueryTakeDefault)
});
var getRecycleBinMediaRootResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "createDate": import_zod3.z.string().datetime({ "local": true }),
    "hasChildren": import_zod3.z.boolean(),
    "parent": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "mediaType": import_zod3.z.object({
      "id": import_zod3.z.string().uuid(),
      "icon": import_zod3.z.string(),
      "collection": import_zod3.z.object({
        "id": import_zod3.z.string().uuid()
      }).nullish()
    }),
    "variants": import_zod3.z.array(import_zod3.z.object({
      "name": import_zod3.z.string(),
      "culture": import_zod3.z.string().nullish()
    }))
  }))
});
var getTreeMediaAncestorsQueryParams = import_zod3.z.object({
  "descendantId": import_zod3.z.string().uuid().optional()
});
var getTreeMediaAncestorsResponseItem = import_zod3.z.object({
  "hasChildren": import_zod3.z.boolean(),
  "parent": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish(),
  "noAccess": import_zod3.z.boolean(),
  "isTrashed": import_zod3.z.boolean(),
  "id": import_zod3.z.string().uuid(),
  "createDate": import_zod3.z.string().datetime({ "local": true }),
  "mediaType": import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "icon": import_zod3.z.string(),
    "collection": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish()
  }),
  "variants": import_zod3.z.array(import_zod3.z.object({
    "name": import_zod3.z.string(),
    "culture": import_zod3.z.string().nullish()
  }))
});
var getTreeMediaAncestorsResponse = import_zod3.z.array(getTreeMediaAncestorsResponseItem);
var getTreeMediaChildrenQueryTakeDefault = 100;
var getTreeMediaChildrenQueryParams = import_zod3.z.object({
  "parentId": import_zod3.z.string().uuid().optional(),
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getTreeMediaChildrenQueryTakeDefault),
  "dataTypeId": import_zod3.z.string().uuid().optional()
});
var getTreeMediaChildrenResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "hasChildren": import_zod3.z.boolean(),
    "parent": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "noAccess": import_zod3.z.boolean(),
    "isTrashed": import_zod3.z.boolean(),
    "id": import_zod3.z.string().uuid(),
    "createDate": import_zod3.z.string().datetime({ "local": true }),
    "mediaType": import_zod3.z.object({
      "id": import_zod3.z.string().uuid(),
      "icon": import_zod3.z.string(),
      "collection": import_zod3.z.object({
        "id": import_zod3.z.string().uuid()
      }).nullish()
    }),
    "variants": import_zod3.z.array(import_zod3.z.object({
      "name": import_zod3.z.string(),
      "culture": import_zod3.z.string().nullish()
    }))
  }))
});
var getTreeMediaRootQueryTakeDefault = 100;
var getTreeMediaRootQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getTreeMediaRootQueryTakeDefault),
  "dataTypeId": import_zod3.z.string().uuid().optional()
});
var getTreeMediaRootResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "hasChildren": import_zod3.z.boolean(),
    "parent": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "noAccess": import_zod3.z.boolean(),
    "isTrashed": import_zod3.z.boolean(),
    "id": import_zod3.z.string().uuid(),
    "createDate": import_zod3.z.string().datetime({ "local": true }),
    "mediaType": import_zod3.z.object({
      "id": import_zod3.z.string().uuid(),
      "icon": import_zod3.z.string(),
      "collection": import_zod3.z.object({
        "id": import_zod3.z.string().uuid()
      }).nullish()
    }),
    "variants": import_zod3.z.array(import_zod3.z.object({
      "name": import_zod3.z.string(),
      "culture": import_zod3.z.string().nullish()
    }))
  }))
});
var getItemMemberGroupQueryParams = import_zod3.z.object({
  "id": import_zod3.z.array(import_zod3.z.string().uuid()).optional()
});
var getItemMemberGroupResponseItem = import_zod3.z.object({
  "id": import_zod3.z.string().uuid(),
  "name": import_zod3.z.string()
});
var getItemMemberGroupResponse = import_zod3.z.array(getItemMemberGroupResponseItem);
var getMemberGroupQueryTakeDefault = 100;
var getMemberGroupQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getMemberGroupQueryTakeDefault)
});
var getMemberGroupResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "name": import_zod3.z.string(),
    "id": import_zod3.z.string().uuid()
  }))
});
var postMemberGroupBody = import_zod3.z.object({
  "name": import_zod3.z.string(),
  "id": import_zod3.z.string().uuid().nullish()
});
var getMemberGroupByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getMemberGroupByIdResponse = import_zod3.z.object({
  "name": import_zod3.z.string(),
  "id": import_zod3.z.string().uuid()
});
var deleteMemberGroupByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putMemberGroupByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putMemberGroupByIdBody = import_zod3.z.object({
  "name": import_zod3.z.string()
});
var getTreeMemberGroupRootQueryTakeDefault = 100;
var getTreeMemberGroupRootQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getTreeMemberGroupRootQueryTakeDefault)
});
var getTreeMemberGroupRootResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "hasChildren": import_zod3.z.boolean(),
    "id": import_zod3.z.string().uuid(),
    "parent": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "name": import_zod3.z.string()
  }))
});
var getItemMemberTypeQueryParams = import_zod3.z.object({
  "id": import_zod3.z.array(import_zod3.z.string().uuid()).optional()
});
var getItemMemberTypeResponseItem = import_zod3.z.object({
  "id": import_zod3.z.string().uuid(),
  "name": import_zod3.z.string(),
  "icon": import_zod3.z.string().nullish()
});
var getItemMemberTypeResponse = import_zod3.z.array(getItemMemberTypeResponseItem);
var getItemMemberTypeSearchQueryTakeDefault = 100;
var getItemMemberTypeSearchQueryParams = import_zod3.z.object({
  "query": import_zod3.z.string().optional(),
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getItemMemberTypeSearchQueryTakeDefault)
});
var getItemMemberTypeSearchResponse = import_zod3.z.object({
  "items": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "name": import_zod3.z.string(),
    "icon": import_zod3.z.string().nullish()
  })),
  "total": import_zod3.z.number()
});
var postMemberTypeBody = import_zod3.z.object({
  "alias": import_zod3.z.string().min(1),
  "name": import_zod3.z.string().min(1),
  "description": import_zod3.z.string().nullish(),
  "icon": import_zod3.z.string().min(1),
  "allowedAsRoot": import_zod3.z.boolean(),
  "variesByCulture": import_zod3.z.boolean(),
  "variesBySegment": import_zod3.z.boolean(),
  "collection": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish(),
  "isElement": import_zod3.z.boolean(),
  "properties": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "container": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "sortOrder": import_zod3.z.number(),
    "alias": import_zod3.z.string().min(1),
    "name": import_zod3.z.string().min(1),
    "description": import_zod3.z.string().nullish(),
    "dataType": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }),
    "variesByCulture": import_zod3.z.boolean(),
    "variesBySegment": import_zod3.z.boolean(),
    "validation": import_zod3.z.object({
      "mandatory": import_zod3.z.boolean(),
      "mandatoryMessage": import_zod3.z.string().nullish(),
      "regEx": import_zod3.z.string().nullish(),
      "regExMessage": import_zod3.z.string().nullish()
    }),
    "appearance": import_zod3.z.object({
      "labelOnTop": import_zod3.z.boolean()
    }),
    "isSensitive": import_zod3.z.boolean(),
    "visibility": import_zod3.z.object({
      "memberCanView": import_zod3.z.boolean(),
      "memberCanEdit": import_zod3.z.boolean()
    })
  })),
  "containers": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "parent": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "name": import_zod3.z.string().nullish(),
    "type": import_zod3.z.string().min(1),
    "sortOrder": import_zod3.z.number()
  })),
  "id": import_zod3.z.string().uuid().nullish(),
  "compositions": import_zod3.z.array(import_zod3.z.object({
    "memberType": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }),
    "compositionType": import_zod3.z.enum(["Composition", "Inheritance"])
  }))
});
var getMemberTypeByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getMemberTypeByIdResponse = import_zod3.z.object({
  "alias": import_zod3.z.string().min(1),
  "name": import_zod3.z.string().min(1),
  "description": import_zod3.z.string().nullish(),
  "icon": import_zod3.z.string().min(1),
  "allowedAsRoot": import_zod3.z.boolean(),
  "variesByCulture": import_zod3.z.boolean(),
  "variesBySegment": import_zod3.z.boolean(),
  "collection": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish(),
  "isElement": import_zod3.z.boolean(),
  "properties": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "container": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "sortOrder": import_zod3.z.number(),
    "alias": import_zod3.z.string().min(1),
    "name": import_zod3.z.string().min(1),
    "description": import_zod3.z.string().nullish(),
    "dataType": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }),
    "variesByCulture": import_zod3.z.boolean(),
    "variesBySegment": import_zod3.z.boolean(),
    "validation": import_zod3.z.object({
      "mandatory": import_zod3.z.boolean(),
      "mandatoryMessage": import_zod3.z.string().nullish(),
      "regEx": import_zod3.z.string().nullish(),
      "regExMessage": import_zod3.z.string().nullish()
    }),
    "appearance": import_zod3.z.object({
      "labelOnTop": import_zod3.z.boolean()
    }),
    "isSensitive": import_zod3.z.boolean(),
    "visibility": import_zod3.z.object({
      "memberCanView": import_zod3.z.boolean(),
      "memberCanEdit": import_zod3.z.boolean()
    })
  })),
  "containers": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "parent": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "name": import_zod3.z.string().nullish(),
    "type": import_zod3.z.string().min(1),
    "sortOrder": import_zod3.z.number()
  })),
  "id": import_zod3.z.string().uuid(),
  "compositions": import_zod3.z.array(import_zod3.z.object({
    "memberType": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }),
    "compositionType": import_zod3.z.enum(["Composition", "Inheritance"])
  }))
});
var deleteMemberTypeByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putMemberTypeByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putMemberTypeByIdBody = import_zod3.z.object({
  "alias": import_zod3.z.string().min(1),
  "name": import_zod3.z.string().min(1),
  "description": import_zod3.z.string().nullish(),
  "icon": import_zod3.z.string().min(1),
  "allowedAsRoot": import_zod3.z.boolean(),
  "variesByCulture": import_zod3.z.boolean(),
  "variesBySegment": import_zod3.z.boolean(),
  "collection": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish(),
  "isElement": import_zod3.z.boolean(),
  "properties": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "container": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "sortOrder": import_zod3.z.number(),
    "alias": import_zod3.z.string().min(1),
    "name": import_zod3.z.string().min(1),
    "description": import_zod3.z.string().nullish(),
    "dataType": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }),
    "variesByCulture": import_zod3.z.boolean(),
    "variesBySegment": import_zod3.z.boolean(),
    "validation": import_zod3.z.object({
      "mandatory": import_zod3.z.boolean(),
      "mandatoryMessage": import_zod3.z.string().nullish(),
      "regEx": import_zod3.z.string().nullish(),
      "regExMessage": import_zod3.z.string().nullish()
    }),
    "appearance": import_zod3.z.object({
      "labelOnTop": import_zod3.z.boolean()
    }),
    "isSensitive": import_zod3.z.boolean(),
    "visibility": import_zod3.z.object({
      "memberCanView": import_zod3.z.boolean(),
      "memberCanEdit": import_zod3.z.boolean()
    })
  })),
  "containers": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "parent": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "name": import_zod3.z.string().nullish(),
    "type": import_zod3.z.string().min(1),
    "sortOrder": import_zod3.z.number()
  })),
  "compositions": import_zod3.z.array(import_zod3.z.object({
    "memberType": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }),
    "compositionType": import_zod3.z.enum(["Composition", "Inheritance"])
  }))
});
var getMemberTypeByIdCompositionReferencesParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getMemberTypeByIdCompositionReferencesResponseItem = import_zod3.z.object({
  "id": import_zod3.z.string().uuid(),
  "name": import_zod3.z.string(),
  "icon": import_zod3.z.string()
});
var getMemberTypeByIdCompositionReferencesResponse = import_zod3.z.array(getMemberTypeByIdCompositionReferencesResponseItem);
var postMemberTypeByIdCopyParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var postMemberTypeAvailableCompositionsBody = import_zod3.z.object({
  "id": import_zod3.z.string().uuid().nullish(),
  "currentPropertyAliases": import_zod3.z.array(import_zod3.z.string()),
  "currentCompositeIds": import_zod3.z.array(import_zod3.z.string().uuid())
});
var postMemberTypeAvailableCompositionsResponseItem = import_zod3.z.object({
  "id": import_zod3.z.string().uuid(),
  "name": import_zod3.z.string(),
  "icon": import_zod3.z.string(),
  "folderPath": import_zod3.z.array(import_zod3.z.string()),
  "isCompatible": import_zod3.z.boolean()
});
var postMemberTypeAvailableCompositionsResponse = import_zod3.z.array(postMemberTypeAvailableCompositionsResponseItem);
var getMemberTypeConfigurationResponse = import_zod3.z.object({
  "reservedFieldNames": import_zod3.z.array(import_zod3.z.string())
});
var getTreeMemberTypeRootQueryTakeDefault = 100;
var getTreeMemberTypeRootQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getTreeMemberTypeRootQueryTakeDefault)
});
var getTreeMemberTypeRootResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "hasChildren": import_zod3.z.boolean(),
    "id": import_zod3.z.string().uuid(),
    "parent": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "name": import_zod3.z.string(),
    "icon": import_zod3.z.string()
  }))
});
var getFilterMemberQueryOrderByDefault = "username";
var getFilterMemberQueryTakeDefault = 100;
var getFilterMemberQueryParams = import_zod3.z.object({
  "memberTypeId": import_zod3.z.string().uuid().optional(),
  "memberGroupName": import_zod3.z.string().optional(),
  "isApproved": import_zod3.z.boolean().optional(),
  "isLockedOut": import_zod3.z.boolean().optional(),
  "orderBy": import_zod3.z.string().default(getFilterMemberQueryOrderByDefault),
  "orderDirection": import_zod3.z.enum(["Ascending", "Descending"]).optional(),
  "filter": import_zod3.z.string().optional(),
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getFilterMemberQueryTakeDefault)
});
var getFilterMemberResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "values": import_zod3.z.array(import_zod3.z.object({
      "culture": import_zod3.z.string().nullish(),
      "segment": import_zod3.z.string().nullish(),
      "alias": import_zod3.z.string().min(1),
      "value": import_zod3.z.any().nullish(),
      "editorAlias": import_zod3.z.string().min(1)
    })),
    "variants": import_zod3.z.array(import_zod3.z.object({
      "culture": import_zod3.z.string().nullish(),
      "segment": import_zod3.z.string().nullish(),
      "name": import_zod3.z.string().min(1),
      "createDate": import_zod3.z.string().datetime({ "local": true }),
      "updateDate": import_zod3.z.string().datetime({ "local": true })
    })),
    "id": import_zod3.z.string().uuid(),
    "email": import_zod3.z.string(),
    "username": import_zod3.z.string(),
    "memberType": import_zod3.z.object({
      "id": import_zod3.z.string().uuid(),
      "icon": import_zod3.z.string(),
      "collection": import_zod3.z.object({
        "id": import_zod3.z.string().uuid()
      }).nullish()
    }),
    "isApproved": import_zod3.z.boolean(),
    "isLockedOut": import_zod3.z.boolean(),
    "isTwoFactorEnabled": import_zod3.z.boolean(),
    "failedPasswordAttempts": import_zod3.z.number(),
    "lastLoginDate": import_zod3.z.string().datetime({ "local": true }).nullish(),
    "lastLockoutDate": import_zod3.z.string().datetime({ "local": true }).nullish(),
    "lastPasswordChangeDate": import_zod3.z.string().datetime({ "local": true }).nullish(),
    "groups": import_zod3.z.array(import_zod3.z.string().uuid()),
    "kind": import_zod3.z.enum(["Default", "Api"])
  }))
});
var getItemMemberQueryParams = import_zod3.z.object({
  "id": import_zod3.z.array(import_zod3.z.string().uuid()).optional()
});
var getItemMemberResponseItem = import_zod3.z.object({
  "id": import_zod3.z.string().uuid(),
  "memberType": import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "icon": import_zod3.z.string(),
    "collection": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish()
  }),
  "variants": import_zod3.z.array(import_zod3.z.object({
    "name": import_zod3.z.string(),
    "culture": import_zod3.z.string().nullish()
  })),
  "kind": import_zod3.z.enum(["Default", "Api"])
});
var getItemMemberResponse = import_zod3.z.array(getItemMemberResponseItem);
var getItemMemberSearchQueryTakeDefault = 100;
var getItemMemberSearchQueryParams = import_zod3.z.object({
  "query": import_zod3.z.string().optional(),
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getItemMemberSearchQueryTakeDefault),
  "allowedMemberTypes": import_zod3.z.array(import_zod3.z.string().uuid()).optional()
});
var getItemMemberSearchResponse = import_zod3.z.object({
  "items": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "memberType": import_zod3.z.object({
      "id": import_zod3.z.string().uuid(),
      "icon": import_zod3.z.string(),
      "collection": import_zod3.z.object({
        "id": import_zod3.z.string().uuid()
      }).nullish()
    }),
    "variants": import_zod3.z.array(import_zod3.z.object({
      "name": import_zod3.z.string(),
      "culture": import_zod3.z.string().nullish()
    })),
    "kind": import_zod3.z.enum(["Default", "Api"])
  })),
  "total": import_zod3.z.number()
});
var postMemberBody = import_zod3.z.object({
  "values": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullish(),
    "segment": import_zod3.z.string().nullish(),
    "alias": import_zod3.z.string().min(1),
    "value": import_zod3.z.any().nullish()
  })),
  "variants": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullish(),
    "segment": import_zod3.z.string().nullish(),
    "name": import_zod3.z.string().min(1)
  })),
  "id": import_zod3.z.string().uuid().nullish(),
  "email": import_zod3.z.string(),
  "username": import_zod3.z.string(),
  "password": import_zod3.z.string(),
  "memberType": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }),
  "groups": import_zod3.z.array(import_zod3.z.string().uuid()).nullish(),
  "isApproved": import_zod3.z.boolean()
});
var getMemberByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getMemberByIdResponse = import_zod3.z.object({
  "values": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullish(),
    "segment": import_zod3.z.string().nullish(),
    "alias": import_zod3.z.string().min(1),
    "value": import_zod3.z.any().nullish(),
    "editorAlias": import_zod3.z.string().min(1)
  })),
  "variants": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullish(),
    "segment": import_zod3.z.string().nullish(),
    "name": import_zod3.z.string().min(1),
    "createDate": import_zod3.z.string().datetime({ "local": true }),
    "updateDate": import_zod3.z.string().datetime({ "local": true })
  })),
  "id": import_zod3.z.string().uuid(),
  "email": import_zod3.z.string(),
  "username": import_zod3.z.string(),
  "memberType": import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "icon": import_zod3.z.string(),
    "collection": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish()
  }),
  "isApproved": import_zod3.z.boolean(),
  "isLockedOut": import_zod3.z.boolean(),
  "isTwoFactorEnabled": import_zod3.z.boolean(),
  "failedPasswordAttempts": import_zod3.z.number(),
  "lastLoginDate": import_zod3.z.string().datetime({ "local": true }).nullish(),
  "lastLockoutDate": import_zod3.z.string().datetime({ "local": true }).nullish(),
  "lastPasswordChangeDate": import_zod3.z.string().datetime({ "local": true }).nullish(),
  "groups": import_zod3.z.array(import_zod3.z.string().uuid()),
  "kind": import_zod3.z.enum(["Default", "Api"])
});
var deleteMemberByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putMemberByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putMemberByIdBody = import_zod3.z.object({
  "values": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullish(),
    "segment": import_zod3.z.string().nullish(),
    "alias": import_zod3.z.string().min(1),
    "value": import_zod3.z.any().nullish()
  })),
  "variants": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullish(),
    "segment": import_zod3.z.string().nullish(),
    "name": import_zod3.z.string().min(1)
  })),
  "email": import_zod3.z.string(),
  "username": import_zod3.z.string(),
  "oldPassword": import_zod3.z.string().nullish(),
  "newPassword": import_zod3.z.string().nullish(),
  "groups": import_zod3.z.array(import_zod3.z.string().uuid()).nullish(),
  "isApproved": import_zod3.z.boolean(),
  "isLockedOut": import_zod3.z.boolean(),
  "isTwoFactorEnabled": import_zod3.z.boolean()
});
var putMemberByIdValidateParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putMemberByIdValidateBody = import_zod3.z.object({
  "values": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullish(),
    "segment": import_zod3.z.string().nullish(),
    "alias": import_zod3.z.string().min(1),
    "value": import_zod3.z.any().nullish()
  })),
  "variants": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullish(),
    "segment": import_zod3.z.string().nullish(),
    "name": import_zod3.z.string().min(1)
  })),
  "email": import_zod3.z.string(),
  "username": import_zod3.z.string(),
  "oldPassword": import_zod3.z.string().nullish(),
  "newPassword": import_zod3.z.string().nullish(),
  "groups": import_zod3.z.array(import_zod3.z.string().uuid()).nullish(),
  "isApproved": import_zod3.z.boolean(),
  "isLockedOut": import_zod3.z.boolean(),
  "isTwoFactorEnabled": import_zod3.z.boolean()
});
var getMemberConfigurationResponse = import_zod3.z.object({
  "reservedFieldNames": import_zod3.z.array(import_zod3.z.string())
});
var postMemberValidateBody = import_zod3.z.object({
  "values": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullish(),
    "segment": import_zod3.z.string().nullish(),
    "alias": import_zod3.z.string().min(1),
    "value": import_zod3.z.any().nullish()
  })),
  "variants": import_zod3.z.array(import_zod3.z.object({
    "culture": import_zod3.z.string().nullish(),
    "segment": import_zod3.z.string().nullish(),
    "name": import_zod3.z.string().min(1)
  })),
  "id": import_zod3.z.string().uuid().nullish(),
  "email": import_zod3.z.string(),
  "username": import_zod3.z.string(),
  "password": import_zod3.z.string(),
  "memberType": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }),
  "groups": import_zod3.z.array(import_zod3.z.string().uuid()).nullish(),
  "isApproved": import_zod3.z.boolean()
});
var getModelsBuilderDashboardResponse = import_zod3.z.object({
  "mode": import_zod3.z.enum(["Nothing", "InMemoryAuto", "SourceCodeManual", "SourceCodeAuto"]),
  "canGenerate": import_zod3.z.boolean(),
  "outOfDateModels": import_zod3.z.boolean(),
  "lastError": import_zod3.z.string().nullish(),
  "version": import_zod3.z.string().nullish(),
  "modelsNamespace": import_zod3.z.string().nullish(),
  "trackingOutOfDateModels": import_zod3.z.boolean()
});
var getModelsBuilderStatusResponse = import_zod3.z.object({
  "status": import_zod3.z.enum(["OutOfDate", "Current", "Unknown"])
});
var getObjectTypesQueryTakeDefault = 100;
var getObjectTypesQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getObjectTypesQueryTakeDefault)
});
var getObjectTypesResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "name": import_zod3.z.string().nullish(),
    "id": import_zod3.z.string().uuid()
  }))
});
var getOembedQueryQueryParams = import_zod3.z.object({
  "url": import_zod3.z.string().url().optional(),
  "maxWidth": import_zod3.z.number().optional(),
  "maxHeight": import_zod3.z.number().optional()
});
var getOembedQueryResponse = import_zod3.z.object({
  "markup": import_zod3.z.string()
});
var postPackageByNameRunMigrationParams = import_zod3.z.object({
  "name": import_zod3.z.string()
});
var getPackageConfigurationResponse = import_zod3.z.object({
  "marketplaceUrl": import_zod3.z.string()
});
var getPackageCreatedQueryTakeDefault = 100;
var getPackageCreatedQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getPackageCreatedQueryTakeDefault)
});
var getPackageCreatedResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "name": import_zod3.z.string(),
    "contentNodeId": import_zod3.z.string().nullish(),
    "contentLoadChildNodes": import_zod3.z.boolean(),
    "mediaIds": import_zod3.z.array(import_zod3.z.string().uuid()),
    "mediaLoadChildNodes": import_zod3.z.boolean(),
    "documentTypes": import_zod3.z.array(import_zod3.z.string()),
    "mediaTypes": import_zod3.z.array(import_zod3.z.string()),
    "dataTypes": import_zod3.z.array(import_zod3.z.string()),
    "templates": import_zod3.z.array(import_zod3.z.string()),
    "partialViews": import_zod3.z.array(import_zod3.z.string()),
    "stylesheets": import_zod3.z.array(import_zod3.z.string()),
    "scripts": import_zod3.z.array(import_zod3.z.string()),
    "languages": import_zod3.z.array(import_zod3.z.string()),
    "dictionaryItems": import_zod3.z.array(import_zod3.z.string()),
    "id": import_zod3.z.string().uuid(),
    "packagePath": import_zod3.z.string()
  }))
});
var postPackageCreatedBody = import_zod3.z.object({
  "name": import_zod3.z.string(),
  "contentNodeId": import_zod3.z.string().nullish(),
  "contentLoadChildNodes": import_zod3.z.boolean(),
  "mediaIds": import_zod3.z.array(import_zod3.z.string().uuid()),
  "mediaLoadChildNodes": import_zod3.z.boolean(),
  "documentTypes": import_zod3.z.array(import_zod3.z.string()),
  "mediaTypes": import_zod3.z.array(import_zod3.z.string()),
  "dataTypes": import_zod3.z.array(import_zod3.z.string()),
  "templates": import_zod3.z.array(import_zod3.z.string()),
  "partialViews": import_zod3.z.array(import_zod3.z.string()),
  "stylesheets": import_zod3.z.array(import_zod3.z.string()),
  "scripts": import_zod3.z.array(import_zod3.z.string()),
  "languages": import_zod3.z.array(import_zod3.z.string()),
  "dictionaryItems": import_zod3.z.array(import_zod3.z.string()),
  "id": import_zod3.z.string().uuid().nullish()
});
var getPackageCreatedByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getPackageCreatedByIdResponse = import_zod3.z.object({
  "name": import_zod3.z.string(),
  "contentNodeId": import_zod3.z.string().nullish(),
  "contentLoadChildNodes": import_zod3.z.boolean(),
  "mediaIds": import_zod3.z.array(import_zod3.z.string().uuid()),
  "mediaLoadChildNodes": import_zod3.z.boolean(),
  "documentTypes": import_zod3.z.array(import_zod3.z.string()),
  "mediaTypes": import_zod3.z.array(import_zod3.z.string()),
  "dataTypes": import_zod3.z.array(import_zod3.z.string()),
  "templates": import_zod3.z.array(import_zod3.z.string()),
  "partialViews": import_zod3.z.array(import_zod3.z.string()),
  "stylesheets": import_zod3.z.array(import_zod3.z.string()),
  "scripts": import_zod3.z.array(import_zod3.z.string()),
  "languages": import_zod3.z.array(import_zod3.z.string()),
  "dictionaryItems": import_zod3.z.array(import_zod3.z.string()),
  "id": import_zod3.z.string().uuid(),
  "packagePath": import_zod3.z.string()
});
var deletePackageCreatedByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putPackageCreatedByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putPackageCreatedByIdBody = import_zod3.z.object({
  "name": import_zod3.z.string(),
  "contentNodeId": import_zod3.z.string().nullish(),
  "contentLoadChildNodes": import_zod3.z.boolean(),
  "mediaIds": import_zod3.z.array(import_zod3.z.string().uuid()),
  "mediaLoadChildNodes": import_zod3.z.boolean(),
  "documentTypes": import_zod3.z.array(import_zod3.z.string()),
  "mediaTypes": import_zod3.z.array(import_zod3.z.string()),
  "dataTypes": import_zod3.z.array(import_zod3.z.string()),
  "templates": import_zod3.z.array(import_zod3.z.string()),
  "partialViews": import_zod3.z.array(import_zod3.z.string()),
  "stylesheets": import_zod3.z.array(import_zod3.z.string()),
  "scripts": import_zod3.z.array(import_zod3.z.string()),
  "languages": import_zod3.z.array(import_zod3.z.string()),
  "dictionaryItems": import_zod3.z.array(import_zod3.z.string()),
  "packagePath": import_zod3.z.string()
});
var getPackageCreatedByIdDownloadParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getPackageCreatedByIdDownloadResponse = import_zod3.z.instanceof(File);
var getPackageMigrationStatusQueryTakeDefault = 100;
var getPackageMigrationStatusQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getPackageMigrationStatusQueryTakeDefault)
});
var getPackageMigrationStatusResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "packageName": import_zod3.z.string(),
    "hasPendingMigrations": import_zod3.z.boolean()
  }))
});
var getItemPartialViewQueryParams = import_zod3.z.object({
  "path": import_zod3.z.array(import_zod3.z.string()).optional()
});
var getItemPartialViewResponseItem = import_zod3.z.object({
  "path": import_zod3.z.string(),
  "name": import_zod3.z.string(),
  "parent": import_zod3.z.object({
    "path": import_zod3.z.string()
  }).nullish(),
  "isFolder": import_zod3.z.boolean()
});
var getItemPartialViewResponse = import_zod3.z.array(getItemPartialViewResponseItem);
var postPartialViewBody = import_zod3.z.object({
  "name": import_zod3.z.string(),
  "parent": import_zod3.z.object({
    "path": import_zod3.z.string()
  }).nullish(),
  "content": import_zod3.z.string()
});
var getPartialViewByPathParams = import_zod3.z.object({
  "path": import_zod3.z.string()
});
var getPartialViewByPathResponse = import_zod3.z.object({
  "path": import_zod3.z.string(),
  "name": import_zod3.z.string(),
  "parent": import_zod3.z.object({
    "path": import_zod3.z.string()
  }).nullish(),
  "content": import_zod3.z.string()
});
var deletePartialViewByPathParams = import_zod3.z.object({
  "path": import_zod3.z.string()
});
var putPartialViewByPathParams = import_zod3.z.object({
  "path": import_zod3.z.string()
});
var putPartialViewByPathBody = import_zod3.z.object({
  "content": import_zod3.z.string()
});
var putPartialViewByPathRenameParams = import_zod3.z.object({
  "path": import_zod3.z.string()
});
var putPartialViewByPathRenameBody = import_zod3.z.object({
  "name": import_zod3.z.string()
});
var postPartialViewFolderBody = import_zod3.z.object({
  "name": import_zod3.z.string(),
  "parent": import_zod3.z.object({
    "path": import_zod3.z.string()
  }).nullish()
});
var getPartialViewFolderByPathParams = import_zod3.z.object({
  "path": import_zod3.z.string()
});
var getPartialViewFolderByPathResponse = import_zod3.z.object({
  "path": import_zod3.z.string(),
  "name": import_zod3.z.string(),
  "parent": import_zod3.z.object({
    "path": import_zod3.z.string()
  }).nullish()
});
var deletePartialViewFolderByPathParams = import_zod3.z.object({
  "path": import_zod3.z.string()
});
var getPartialViewSnippetQueryTakeDefault = 100;
var getPartialViewSnippetQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getPartialViewSnippetQueryTakeDefault)
});
var getPartialViewSnippetResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string(),
    "name": import_zod3.z.string()
  }))
});
var getPartialViewSnippetByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string()
});
var getPartialViewSnippetByIdResponse = import_zod3.z.object({
  "id": import_zod3.z.string(),
  "name": import_zod3.z.string(),
  "content": import_zod3.z.string()
});
var getTreePartialViewAncestorsQueryParams = import_zod3.z.object({
  "descendantPath": import_zod3.z.string().optional()
});
var getTreePartialViewAncestorsResponseItem = import_zod3.z.object({
  "hasChildren": import_zod3.z.boolean(),
  "name": import_zod3.z.string(),
  "path": import_zod3.z.string(),
  "parent": import_zod3.z.object({
    "path": import_zod3.z.string()
  }).nullish(),
  "isFolder": import_zod3.z.boolean()
});
var getTreePartialViewAncestorsResponse = import_zod3.z.array(getTreePartialViewAncestorsResponseItem);
var getTreePartialViewChildrenQueryTakeDefault = 100;
var getTreePartialViewChildrenQueryParams = import_zod3.z.object({
  "parentPath": import_zod3.z.string().optional(),
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getTreePartialViewChildrenQueryTakeDefault)
});
var getTreePartialViewChildrenResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "hasChildren": import_zod3.z.boolean(),
    "name": import_zod3.z.string(),
    "path": import_zod3.z.string(),
    "parent": import_zod3.z.object({
      "path": import_zod3.z.string()
    }).nullish(),
    "isFolder": import_zod3.z.boolean()
  }))
});
var getTreePartialViewRootQueryTakeDefault = 100;
var getTreePartialViewRootQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getTreePartialViewRootQueryTakeDefault)
});
var getTreePartialViewRootResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "hasChildren": import_zod3.z.boolean(),
    "name": import_zod3.z.string(),
    "path": import_zod3.z.string(),
    "parent": import_zod3.z.object({
      "path": import_zod3.z.string()
    }).nullish(),
    "isFolder": import_zod3.z.boolean()
  }))
});
var getProfilingStatusResponse = import_zod3.z.object({
  "enabled": import_zod3.z.boolean()
});
var putProfilingStatusBody = import_zod3.z.object({
  "enabled": import_zod3.z.boolean()
});
var getPropertyTypeIsUsedQueryParams = import_zod3.z.object({
  "contentTypeId": import_zod3.z.string().uuid().optional(),
  "propertyAlias": import_zod3.z.string().optional()
});
var getPropertyTypeIsUsedResponse = import_zod3.z.boolean();
var getRedirectManagementQueryTakeDefault = 100;
var getRedirectManagementQueryParams = import_zod3.z.object({
  "filter": import_zod3.z.string().optional(),
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getRedirectManagementQueryTakeDefault)
});
var getRedirectManagementResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "originalUrl": import_zod3.z.string(),
    "destinationUrl": import_zod3.z.string(),
    "created": import_zod3.z.string().datetime({ "local": true }),
    "document": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }),
    "culture": import_zod3.z.string().nullish()
  }))
});
var getRedirectManagementByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getRedirectManagementByIdQueryTakeDefault = 100;
var getRedirectManagementByIdQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getRedirectManagementByIdQueryTakeDefault)
});
var getRedirectManagementByIdResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "originalUrl": import_zod3.z.string(),
    "destinationUrl": import_zod3.z.string(),
    "created": import_zod3.z.string().datetime({ "local": true }),
    "document": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }),
    "culture": import_zod3.z.string().nullish()
  }))
});
var deleteRedirectManagementByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getRedirectManagementStatusResponse = import_zod3.z.object({
  "status": import_zod3.z.enum(["Enabled", "Disabled"]),
  "userIsAdmin": import_zod3.z.boolean()
});
var postRedirectManagementStatusQueryParams = import_zod3.z.object({
  "status": import_zod3.z.enum(["Enabled", "Disabled"]).optional()
});
var getItemRelationTypeQueryParams = import_zod3.z.object({
  "id": import_zod3.z.array(import_zod3.z.string().uuid()).optional()
});
var getItemRelationTypeResponseItem = import_zod3.z.object({
  "id": import_zod3.z.string().uuid(),
  "name": import_zod3.z.string(),
  "isDeletable": import_zod3.z.boolean()
});
var getItemRelationTypeResponse = import_zod3.z.array(getItemRelationTypeResponseItem);
var getRelationTypeQueryTakeDefault = 100;
var getRelationTypeQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getRelationTypeQueryTakeDefault)
});
var getRelationTypeResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "name": import_zod3.z.string().min(1),
    "isBidirectional": import_zod3.z.boolean(),
    "isDependency": import_zod3.z.boolean(),
    "id": import_zod3.z.string().uuid(),
    "alias": import_zod3.z.string().nullish(),
    "parentObject": import_zod3.z.object({
      "name": import_zod3.z.string().nullish(),
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "childObject": import_zod3.z.object({
      "name": import_zod3.z.string().nullish(),
      "id": import_zod3.z.string().uuid()
    }).nullish()
  }))
});
var getRelationTypeByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getRelationTypeByIdResponse = import_zod3.z.object({
  "name": import_zod3.z.string().min(1),
  "isBidirectional": import_zod3.z.boolean(),
  "isDependency": import_zod3.z.boolean(),
  "id": import_zod3.z.string().uuid(),
  "alias": import_zod3.z.string().nullish(),
  "parentObject": import_zod3.z.object({
    "name": import_zod3.z.string().nullish(),
    "id": import_zod3.z.string().uuid()
  }).nullish(),
  "childObject": import_zod3.z.object({
    "name": import_zod3.z.string().nullish(),
    "id": import_zod3.z.string().uuid()
  }).nullish()
});
var getRelationByRelationTypeIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getRelationByRelationTypeIdQueryTakeDefault = 100;
var getRelationByRelationTypeIdQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getRelationByRelationTypeIdQueryTakeDefault)
});
var getRelationByRelationTypeIdResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "relationType": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }),
    "parent": import_zod3.z.object({
      "id": import_zod3.z.string().uuid(),
      "name": import_zod3.z.string().nullish()
    }),
    "child": import_zod3.z.object({
      "id": import_zod3.z.string().uuid(),
      "name": import_zod3.z.string().nullish()
    }),
    "createDate": import_zod3.z.string().datetime({ "local": true }),
    "comment": import_zod3.z.string().nullish()
  }))
});
var getItemScriptQueryParams = import_zod3.z.object({
  "path": import_zod3.z.array(import_zod3.z.string()).optional()
});
var getItemScriptResponseItem = import_zod3.z.object({
  "path": import_zod3.z.string(),
  "name": import_zod3.z.string(),
  "parent": import_zod3.z.object({
    "path": import_zod3.z.string()
  }).nullish(),
  "isFolder": import_zod3.z.boolean()
});
var getItemScriptResponse = import_zod3.z.array(getItemScriptResponseItem);
var postScriptBody = import_zod3.z.object({
  "name": import_zod3.z.string(),
  "parent": import_zod3.z.object({
    "path": import_zod3.z.string()
  }).nullish(),
  "content": import_zod3.z.string()
});
var getScriptByPathParams = import_zod3.z.object({
  "path": import_zod3.z.string()
});
var getScriptByPathResponse = import_zod3.z.object({
  "path": import_zod3.z.string(),
  "name": import_zod3.z.string(),
  "parent": import_zod3.z.object({
    "path": import_zod3.z.string()
  }).nullish(),
  "content": import_zod3.z.string()
});
var deleteScriptByPathParams = import_zod3.z.object({
  "path": import_zod3.z.string()
});
var putScriptByPathParams = import_zod3.z.object({
  "path": import_zod3.z.string()
});
var putScriptByPathBody = import_zod3.z.object({
  "content": import_zod3.z.string()
});
var putScriptByPathRenameParams = import_zod3.z.object({
  "path": import_zod3.z.string()
});
var putScriptByPathRenameBody = import_zod3.z.object({
  "name": import_zod3.z.string()
});
var postScriptFolderBody = import_zod3.z.object({
  "name": import_zod3.z.string(),
  "parent": import_zod3.z.object({
    "path": import_zod3.z.string()
  }).nullish()
});
var getScriptFolderByPathParams = import_zod3.z.object({
  "path": import_zod3.z.string()
});
var getScriptFolderByPathResponse = import_zod3.z.object({
  "path": import_zod3.z.string(),
  "name": import_zod3.z.string(),
  "parent": import_zod3.z.object({
    "path": import_zod3.z.string()
  }).nullish()
});
var deleteScriptFolderByPathParams = import_zod3.z.object({
  "path": import_zod3.z.string()
});
var getTreeScriptAncestorsQueryParams = import_zod3.z.object({
  "descendantPath": import_zod3.z.string().optional()
});
var getTreeScriptAncestorsResponseItem = import_zod3.z.object({
  "hasChildren": import_zod3.z.boolean(),
  "name": import_zod3.z.string(),
  "path": import_zod3.z.string(),
  "parent": import_zod3.z.object({
    "path": import_zod3.z.string()
  }).nullish(),
  "isFolder": import_zod3.z.boolean()
});
var getTreeScriptAncestorsResponse = import_zod3.z.array(getTreeScriptAncestorsResponseItem);
var getTreeScriptChildrenQueryTakeDefault = 100;
var getTreeScriptChildrenQueryParams = import_zod3.z.object({
  "parentPath": import_zod3.z.string().optional(),
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getTreeScriptChildrenQueryTakeDefault)
});
var getTreeScriptChildrenResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "hasChildren": import_zod3.z.boolean(),
    "name": import_zod3.z.string(),
    "path": import_zod3.z.string(),
    "parent": import_zod3.z.object({
      "path": import_zod3.z.string()
    }).nullish(),
    "isFolder": import_zod3.z.boolean()
  }))
});
var getTreeScriptRootQueryTakeDefault = 100;
var getTreeScriptRootQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getTreeScriptRootQueryTakeDefault)
});
var getTreeScriptRootResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "hasChildren": import_zod3.z.boolean(),
    "name": import_zod3.z.string(),
    "path": import_zod3.z.string(),
    "parent": import_zod3.z.object({
      "path": import_zod3.z.string()
    }).nullish(),
    "isFolder": import_zod3.z.boolean()
  }))
});
var getSearcherQueryTakeDefault = 100;
var getSearcherQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getSearcherQueryTakeDefault)
});
var getSearcherResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "name": import_zod3.z.string().min(1)
  }))
});
var getSearcherBySearcherNameQueryParams = import_zod3.z.object({
  "searcherName": import_zod3.z.string()
});
var getSearcherBySearcherNameQueryQueryTakeDefault = 100;
var getSearcherBySearcherNameQueryQueryParams = import_zod3.z.object({
  "term": import_zod3.z.string().optional(),
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getSearcherBySearcherNameQueryQueryTakeDefault)
});
var getSearcherBySearcherNameQueryResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().min(1),
    "score": import_zod3.z.number(),
    "fieldCount": import_zod3.z.number(),
    "fields": import_zod3.z.array(import_zod3.z.object({
      "name": import_zod3.z.string(),
      "values": import_zod3.z.array(import_zod3.z.string())
    }))
  }))
});
var getSecurityConfigurationResponse = import_zod3.z.object({
  "passwordConfiguration": import_zod3.z.object({
    "minimumPasswordLength": import_zod3.z.number(),
    "requireNonLetterOrDigit": import_zod3.z.boolean(),
    "requireDigit": import_zod3.z.boolean(),
    "requireLowercase": import_zod3.z.boolean(),
    "requireUppercase": import_zod3.z.boolean()
  })
});
var postSecurityForgotPasswordBody = import_zod3.z.object({
  "email": import_zod3.z.string().min(1)
});
var postSecurityForgotPasswordResetBody = import_zod3.z.object({
  "user": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }),
  "resetCode": import_zod3.z.string(),
  "password": import_zod3.z.string().min(1)
});
var postSecurityForgotPasswordVerifyBody = import_zod3.z.object({
  "user": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }),
  "resetCode": import_zod3.z.string()
});
var postSecurityForgotPasswordVerifyResponse = import_zod3.z.object({
  "passwordConfiguration": import_zod3.z.object({
    "minimumPasswordLength": import_zod3.z.number(),
    "requireNonLetterOrDigit": import_zod3.z.boolean(),
    "requireDigit": import_zod3.z.boolean(),
    "requireLowercase": import_zod3.z.boolean(),
    "requireUppercase": import_zod3.z.boolean()
  })
});
var getSegmentQueryTakeDefault = 100;
var getSegmentQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getSegmentQueryTakeDefault)
});
var getSegmentResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "name": import_zod3.z.string(),
    "alias": import_zod3.z.string()
  }))
});
var getServerConfigurationResponse = import_zod3.z.object({
  "allowPasswordReset": import_zod3.z.boolean(),
  "versionCheckPeriod": import_zod3.z.number(),
  "allowLocalLogin": import_zod3.z.boolean()
});
var getServerInformationResponse = import_zod3.z.object({
  "version": import_zod3.z.string(),
  "assemblyVersion": import_zod3.z.string(),
  "baseUtcOffset": import_zod3.z.string(),
  "runtimeMode": import_zod3.z.enum(["BackofficeDevelopment", "Development", "Production"])
});
var getServerStatusResponse = import_zod3.z.object({
  "serverStatus": import_zod3.z.enum(["Unknown", "Boot", "Install", "Upgrade", "Run", "BootFailed"])
});
var getServerTroubleshootingResponse = import_zod3.z.object({
  "items": import_zod3.z.array(import_zod3.z.object({
    "name": import_zod3.z.string(),
    "data": import_zod3.z.string()
  }))
});
var getServerUpgradeCheckResponse = import_zod3.z.object({
  "type": import_zod3.z.string(),
  "comment": import_zod3.z.string(),
  "url": import_zod3.z.string()
});
var getItemStaticFileQueryParams = import_zod3.z.object({
  "path": import_zod3.z.array(import_zod3.z.string()).optional()
});
var getItemStaticFileResponseItem = import_zod3.z.object({
  "path": import_zod3.z.string(),
  "name": import_zod3.z.string(),
  "parent": import_zod3.z.object({
    "path": import_zod3.z.string()
  }).nullish(),
  "isFolder": import_zod3.z.boolean()
});
var getItemStaticFileResponse = import_zod3.z.array(getItemStaticFileResponseItem);
var getTreeStaticFileAncestorsQueryParams = import_zod3.z.object({
  "descendantPath": import_zod3.z.string().optional()
});
var getTreeStaticFileAncestorsResponseItem = import_zod3.z.object({
  "hasChildren": import_zod3.z.boolean(),
  "name": import_zod3.z.string(),
  "path": import_zod3.z.string(),
  "parent": import_zod3.z.object({
    "path": import_zod3.z.string()
  }).nullish(),
  "isFolder": import_zod3.z.boolean()
});
var getTreeStaticFileAncestorsResponse = import_zod3.z.array(getTreeStaticFileAncestorsResponseItem);
var getTreeStaticFileChildrenQueryTakeDefault = 100;
var getTreeStaticFileChildrenQueryParams = import_zod3.z.object({
  "parentPath": import_zod3.z.string().optional(),
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getTreeStaticFileChildrenQueryTakeDefault)
});
var getTreeStaticFileChildrenResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "hasChildren": import_zod3.z.boolean(),
    "name": import_zod3.z.string(),
    "path": import_zod3.z.string(),
    "parent": import_zod3.z.object({
      "path": import_zod3.z.string()
    }).nullish(),
    "isFolder": import_zod3.z.boolean()
  }))
});
var getTreeStaticFileRootQueryTakeDefault = 100;
var getTreeStaticFileRootQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getTreeStaticFileRootQueryTakeDefault)
});
var getTreeStaticFileRootResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "hasChildren": import_zod3.z.boolean(),
    "name": import_zod3.z.string(),
    "path": import_zod3.z.string(),
    "parent": import_zod3.z.object({
      "path": import_zod3.z.string()
    }).nullish(),
    "isFolder": import_zod3.z.boolean()
  }))
});
var getItemStylesheetQueryParams = import_zod3.z.object({
  "path": import_zod3.z.array(import_zod3.z.string()).optional()
});
var getItemStylesheetResponseItem = import_zod3.z.object({
  "path": import_zod3.z.string(),
  "name": import_zod3.z.string(),
  "parent": import_zod3.z.object({
    "path": import_zod3.z.string()
  }).nullish(),
  "isFolder": import_zod3.z.boolean()
});
var getItemStylesheetResponse = import_zod3.z.array(getItemStylesheetResponseItem);
var postStylesheetBody = import_zod3.z.object({
  "name": import_zod3.z.string(),
  "parent": import_zod3.z.object({
    "path": import_zod3.z.string()
  }).nullish(),
  "content": import_zod3.z.string()
});
var getStylesheetByPathParams = import_zod3.z.object({
  "path": import_zod3.z.string()
});
var getStylesheetByPathResponse = import_zod3.z.object({
  "path": import_zod3.z.string(),
  "name": import_zod3.z.string(),
  "parent": import_zod3.z.object({
    "path": import_zod3.z.string()
  }).nullish(),
  "content": import_zod3.z.string()
});
var deleteStylesheetByPathParams = import_zod3.z.object({
  "path": import_zod3.z.string()
});
var putStylesheetByPathParams = import_zod3.z.object({
  "path": import_zod3.z.string()
});
var putStylesheetByPathBody = import_zod3.z.object({
  "content": import_zod3.z.string()
});
var putStylesheetByPathRenameParams = import_zod3.z.object({
  "path": import_zod3.z.string()
});
var putStylesheetByPathRenameBody = import_zod3.z.object({
  "name": import_zod3.z.string()
});
var postStylesheetFolderBody = import_zod3.z.object({
  "name": import_zod3.z.string(),
  "parent": import_zod3.z.object({
    "path": import_zod3.z.string()
  }).nullish()
});
var getStylesheetFolderByPathParams = import_zod3.z.object({
  "path": import_zod3.z.string()
});
var getStylesheetFolderByPathResponse = import_zod3.z.object({
  "path": import_zod3.z.string(),
  "name": import_zod3.z.string(),
  "parent": import_zod3.z.object({
    "path": import_zod3.z.string()
  }).nullish()
});
var deleteStylesheetFolderByPathParams = import_zod3.z.object({
  "path": import_zod3.z.string()
});
var getTreeStylesheetAncestorsQueryParams = import_zod3.z.object({
  "descendantPath": import_zod3.z.string().optional()
});
var getTreeStylesheetAncestorsResponseItem = import_zod3.z.object({
  "hasChildren": import_zod3.z.boolean(),
  "name": import_zod3.z.string(),
  "path": import_zod3.z.string(),
  "parent": import_zod3.z.object({
    "path": import_zod3.z.string()
  }).nullish(),
  "isFolder": import_zod3.z.boolean()
});
var getTreeStylesheetAncestorsResponse = import_zod3.z.array(getTreeStylesheetAncestorsResponseItem);
var getTreeStylesheetChildrenQueryTakeDefault = 100;
var getTreeStylesheetChildrenQueryParams = import_zod3.z.object({
  "parentPath": import_zod3.z.string().optional(),
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getTreeStylesheetChildrenQueryTakeDefault)
});
var getTreeStylesheetChildrenResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "hasChildren": import_zod3.z.boolean(),
    "name": import_zod3.z.string(),
    "path": import_zod3.z.string(),
    "parent": import_zod3.z.object({
      "path": import_zod3.z.string()
    }).nullish(),
    "isFolder": import_zod3.z.boolean()
  }))
});
var getTreeStylesheetRootQueryTakeDefault = 100;
var getTreeStylesheetRootQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getTreeStylesheetRootQueryTakeDefault)
});
var getTreeStylesheetRootResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "hasChildren": import_zod3.z.boolean(),
    "name": import_zod3.z.string(),
    "path": import_zod3.z.string(),
    "parent": import_zod3.z.object({
      "path": import_zod3.z.string()
    }).nullish(),
    "isFolder": import_zod3.z.boolean()
  }))
});
var getTagQueryTakeDefault = 100;
var getTagQueryParams = import_zod3.z.object({
  "query": import_zod3.z.string().optional(),
  "tagGroup": import_zod3.z.string().optional(),
  "culture": import_zod3.z.string().optional(),
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getTagQueryTakeDefault)
});
var getTagResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "text": import_zod3.z.string().nullish(),
    "group": import_zod3.z.string().nullish(),
    "nodeCount": import_zod3.z.number()
  }))
});
var getTelemetryQueryTakeDefault = 100;
var getTelemetryQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getTelemetryQueryTakeDefault)
});
var getTelemetryResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "telemetryLevel": import_zod3.z.enum(["Minimal", "Basic", "Detailed"])
  }))
});
var getTelemetryLevelResponse = import_zod3.z.object({
  "telemetryLevel": import_zod3.z.enum(["Minimal", "Basic", "Detailed"])
});
var postTelemetryLevelBody = import_zod3.z.object({
  "telemetryLevel": import_zod3.z.enum(["Minimal", "Basic", "Detailed"])
});
var getItemTemplateQueryParams = import_zod3.z.object({
  "id": import_zod3.z.array(import_zod3.z.string().uuid()).optional()
});
var getItemTemplateResponseItem = import_zod3.z.object({
  "id": import_zod3.z.string().uuid(),
  "name": import_zod3.z.string(),
  "alias": import_zod3.z.string()
});
var getItemTemplateResponse = import_zod3.z.array(getItemTemplateResponseItem);
var getItemTemplateSearchQueryTakeDefault = 100;
var getItemTemplateSearchQueryParams = import_zod3.z.object({
  "query": import_zod3.z.string().optional(),
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getItemTemplateSearchQueryTakeDefault)
});
var getItemTemplateSearchResponse = import_zod3.z.object({
  "items": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid(),
    "name": import_zod3.z.string(),
    "alias": import_zod3.z.string()
  })),
  "total": import_zod3.z.number()
});
var postTemplateBody = import_zod3.z.object({
  "name": import_zod3.z.string().min(1),
  "alias": import_zod3.z.string().min(1),
  "content": import_zod3.z.string().nullish(),
  "id": import_zod3.z.string().uuid().nullish()
});
var getTemplateByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getTemplateByIdResponse = import_zod3.z.object({
  "name": import_zod3.z.string().min(1),
  "alias": import_zod3.z.string().min(1),
  "content": import_zod3.z.string().nullish(),
  "id": import_zod3.z.string().uuid(),
  "masterTemplate": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish()
});
var deleteTemplateByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putTemplateByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putTemplateByIdBody = import_zod3.z.object({
  "name": import_zod3.z.string().min(1),
  "alias": import_zod3.z.string().min(1),
  "content": import_zod3.z.string().nullish()
});
var getTemplateConfigurationResponse = import_zod3.z.object({
  "disabled": import_zod3.z.boolean()
});
var postTemplateQueryExecuteBody = import_zod3.z.object({
  "rootDocument": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish(),
  "documentTypeAlias": import_zod3.z.string().nullish(),
  "filters": import_zod3.z.array(import_zod3.z.object({
    "propertyAlias": import_zod3.z.string().min(1),
    "constraintValue": import_zod3.z.string().min(1),
    "operator": import_zod3.z.enum(["Equals", "NotEquals", "Contains", "NotContains", "LessThan", "LessThanEqualTo", "GreaterThan", "GreaterThanEqualTo"])
  })).nullish(),
  "sort": import_zod3.z.object({
    "propertyAlias": import_zod3.z.string(),
    "direction": import_zod3.z.string().nullish()
  }).nullish(),
  "take": import_zod3.z.number()
});
var postTemplateQueryExecuteResponse = import_zod3.z.object({
  "queryExpression": import_zod3.z.string(),
  "sampleResults": import_zod3.z.array(import_zod3.z.object({
    "icon": import_zod3.z.string(),
    "name": import_zod3.z.string()
  })),
  "resultCount": import_zod3.z.number(),
  "executionTime": import_zod3.z.number()
});
var getTemplateQuerySettingsResponse = import_zod3.z.object({
  "documentTypeAliases": import_zod3.z.array(import_zod3.z.string()),
  "properties": import_zod3.z.array(import_zod3.z.object({
    "alias": import_zod3.z.string(),
    "type": import_zod3.z.enum(["String", "DateTime", "Integer"])
  })),
  "operators": import_zod3.z.array(import_zod3.z.object({
    "operator": import_zod3.z.enum(["Equals", "NotEquals", "Contains", "NotContains", "LessThan", "LessThanEqualTo", "GreaterThan", "GreaterThanEqualTo"]),
    "applicableTypes": import_zod3.z.array(import_zod3.z.enum(["String", "DateTime", "Integer"]))
  }))
});
var getTreeTemplateAncestorsQueryParams = import_zod3.z.object({
  "descendantId": import_zod3.z.string().uuid().optional()
});
var getTreeTemplateAncestorsResponseItem = import_zod3.z.object({
  "hasChildren": import_zod3.z.boolean(),
  "id": import_zod3.z.string().uuid(),
  "parent": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish(),
  "name": import_zod3.z.string()
});
var getTreeTemplateAncestorsResponse = import_zod3.z.array(getTreeTemplateAncestorsResponseItem);
var getTreeTemplateChildrenQueryTakeDefault = 100;
var getTreeTemplateChildrenQueryParams = import_zod3.z.object({
  "parentId": import_zod3.z.string().uuid().optional(),
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getTreeTemplateChildrenQueryTakeDefault)
});
var getTreeTemplateChildrenResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "hasChildren": import_zod3.z.boolean(),
    "id": import_zod3.z.string().uuid(),
    "parent": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "name": import_zod3.z.string()
  }))
});
var getTreeTemplateRootQueryTakeDefault = 100;
var getTreeTemplateRootQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getTreeTemplateRootQueryTakeDefault)
});
var getTreeTemplateRootResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "hasChildren": import_zod3.z.boolean(),
    "id": import_zod3.z.string().uuid(),
    "parent": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "name": import_zod3.z.string()
  }))
});
var postTemporaryFileBody = import_zod3.z.object({
  "Id": import_zod3.z.string().uuid(),
  "File": import_zod3.z.instanceof(File)
});
var getTemporaryFileByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getTemporaryFileByIdResponse = import_zod3.z.object({
  "id": import_zod3.z.string().uuid(),
  "availableUntil": import_zod3.z.string().datetime({ "local": true }).nullish(),
  "fileName": import_zod3.z.string().min(1)
});
var deleteTemporaryFileByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getTemporaryFileConfigurationResponse = import_zod3.z.object({
  "imageFileTypes": import_zod3.z.array(import_zod3.z.string()),
  "disallowedUploadedFilesExtensions": import_zod3.z.array(import_zod3.z.string()),
  "allowedUploadedFileExtensions": import_zod3.z.array(import_zod3.z.string()),
  "maxFileSize": import_zod3.z.number().nullish()
});
var getUpgradeSettingsResponse = import_zod3.z.object({
  "currentState": import_zod3.z.string().min(1),
  "newState": import_zod3.z.string().min(1),
  "newVersion": import_zod3.z.string().min(1),
  "oldVersion": import_zod3.z.string().min(1),
  "reportUrl": import_zod3.z.string()
});
var postUserDataBody = import_zod3.z.object({
  "group": import_zod3.z.string(),
  "identifier": import_zod3.z.string(),
  "value": import_zod3.z.string(),
  "key": import_zod3.z.string().uuid().nullish()
});
var getUserDataQueryTakeDefault = 100;
var getUserDataQueryParams = import_zod3.z.object({
  "groups": import_zod3.z.array(import_zod3.z.string()).optional(),
  "identifiers": import_zod3.z.array(import_zod3.z.string()).optional(),
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getUserDataQueryTakeDefault)
});
var getUserDataResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "group": import_zod3.z.string(),
    "identifier": import_zod3.z.string(),
    "value": import_zod3.z.string(),
    "key": import_zod3.z.string().uuid()
  }))
});
var putUserDataBody = import_zod3.z.object({
  "group": import_zod3.z.string(),
  "identifier": import_zod3.z.string(),
  "value": import_zod3.z.string(),
  "key": import_zod3.z.string().uuid()
});
var getUserDataByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getUserDataByIdResponse = import_zod3.z.object({
  "group": import_zod3.z.string(),
  "identifier": import_zod3.z.string(),
  "value": import_zod3.z.string()
});
var getFilterUserGroupQueryTakeDefault = 100;
var getFilterUserGroupQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getFilterUserGroupQueryTakeDefault),
  "filter": import_zod3.z.string().optional()
});
var getFilterUserGroupResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "name": import_zod3.z.string(),
    "alias": import_zod3.z.string(),
    "icon": import_zod3.z.string().nullish(),
    "sections": import_zod3.z.array(import_zod3.z.string()),
    "languages": import_zod3.z.array(import_zod3.z.string()),
    "hasAccessToAllLanguages": import_zod3.z.boolean(),
    "documentStartNode": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "documentRootAccess": import_zod3.z.boolean(),
    "mediaStartNode": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "mediaRootAccess": import_zod3.z.boolean(),
    "fallbackPermissions": import_zod3.z.array(import_zod3.z.string()),
    "permissions": import_zod3.z.array(import_zod3.z.object({
      "$type": import_zod3.z.enum(["DocumentPermissionPresentationModel"]),
      "document": import_zod3.z.object({
        "id": import_zod3.z.string().uuid()
      }),
      "verbs": import_zod3.z.array(import_zod3.z.string())
    }).or(import_zod3.z.object({
      "$type": import_zod3.z.enum(["UnknownTypePermissionPresentationModel"]),
      "verbs": import_zod3.z.array(import_zod3.z.string()),
      "context": import_zod3.z.string()
    }))),
    "id": import_zod3.z.string().uuid(),
    "isDeletable": import_zod3.z.boolean(),
    "aliasCanBeChanged": import_zod3.z.boolean()
  }))
});
var getItemUserGroupQueryParams = import_zod3.z.object({
  "id": import_zod3.z.array(import_zod3.z.string().uuid()).optional()
});
var getItemUserGroupResponseItem = import_zod3.z.object({
  "id": import_zod3.z.string().uuid(),
  "name": import_zod3.z.string(),
  "icon": import_zod3.z.string().nullish(),
  "alias": import_zod3.z.string().nullish()
});
var getItemUserGroupResponse = import_zod3.z.array(getItemUserGroupResponseItem);
var deleteUserGroupBody = import_zod3.z.object({
  "userGroupIds": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }))
});
var postUserGroupBody = import_zod3.z.object({
  "name": import_zod3.z.string(),
  "alias": import_zod3.z.string(),
  "icon": import_zod3.z.string().nullish(),
  "sections": import_zod3.z.array(import_zod3.z.string()),
  "languages": import_zod3.z.array(import_zod3.z.string()),
  "hasAccessToAllLanguages": import_zod3.z.boolean(),
  "documentStartNode": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish(),
  "documentRootAccess": import_zod3.z.boolean(),
  "mediaStartNode": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish(),
  "mediaRootAccess": import_zod3.z.boolean(),
  "fallbackPermissions": import_zod3.z.array(import_zod3.z.string()),
  "permissions": import_zod3.z.array(import_zod3.z.object({
    "$type": import_zod3.z.enum(["DocumentPermissionPresentationModel"]),
    "document": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }),
    "verbs": import_zod3.z.array(import_zod3.z.string())
  }).or(import_zod3.z.object({
    "$type": import_zod3.z.enum(["UnknownTypePermissionPresentationModel"]),
    "verbs": import_zod3.z.array(import_zod3.z.string()),
    "context": import_zod3.z.string()
  }))),
  "id": import_zod3.z.string().uuid().nullish()
});
var getUserGroupQueryTakeDefault = 100;
var getUserGroupQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getUserGroupQueryTakeDefault)
});
var getUserGroupResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "name": import_zod3.z.string(),
    "alias": import_zod3.z.string(),
    "icon": import_zod3.z.string().nullish(),
    "sections": import_zod3.z.array(import_zod3.z.string()),
    "languages": import_zod3.z.array(import_zod3.z.string()),
    "hasAccessToAllLanguages": import_zod3.z.boolean(),
    "documentStartNode": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "documentRootAccess": import_zod3.z.boolean(),
    "mediaStartNode": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }).nullish(),
    "mediaRootAccess": import_zod3.z.boolean(),
    "fallbackPermissions": import_zod3.z.array(import_zod3.z.string()),
    "permissions": import_zod3.z.array(import_zod3.z.object({
      "$type": import_zod3.z.enum(["DocumentPermissionPresentationModel"]),
      "document": import_zod3.z.object({
        "id": import_zod3.z.string().uuid()
      }),
      "verbs": import_zod3.z.array(import_zod3.z.string())
    }).or(import_zod3.z.object({
      "$type": import_zod3.z.enum(["UnknownTypePermissionPresentationModel"]),
      "verbs": import_zod3.z.array(import_zod3.z.string()),
      "context": import_zod3.z.string()
    }))),
    "id": import_zod3.z.string().uuid(),
    "isDeletable": import_zod3.z.boolean(),
    "aliasCanBeChanged": import_zod3.z.boolean()
  }))
});
var getUserGroupByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getUserGroupByIdResponse = import_zod3.z.object({
  "name": import_zod3.z.string(),
  "alias": import_zod3.z.string(),
  "icon": import_zod3.z.string().nullish(),
  "sections": import_zod3.z.array(import_zod3.z.string()),
  "languages": import_zod3.z.array(import_zod3.z.string()),
  "hasAccessToAllLanguages": import_zod3.z.boolean(),
  "documentStartNode": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish(),
  "documentRootAccess": import_zod3.z.boolean(),
  "mediaStartNode": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish(),
  "mediaRootAccess": import_zod3.z.boolean(),
  "fallbackPermissions": import_zod3.z.array(import_zod3.z.string()),
  "permissions": import_zod3.z.array(import_zod3.z.object({
    "$type": import_zod3.z.enum(["DocumentPermissionPresentationModel"]),
    "document": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }),
    "verbs": import_zod3.z.array(import_zod3.z.string())
  }).or(import_zod3.z.object({
    "$type": import_zod3.z.enum(["UnknownTypePermissionPresentationModel"]),
    "verbs": import_zod3.z.array(import_zod3.z.string()),
    "context": import_zod3.z.string()
  }))),
  "id": import_zod3.z.string().uuid(),
  "isDeletable": import_zod3.z.boolean(),
  "aliasCanBeChanged": import_zod3.z.boolean()
});
var deleteUserGroupByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putUserGroupByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putUserGroupByIdBody = import_zod3.z.object({
  "name": import_zod3.z.string(),
  "alias": import_zod3.z.string(),
  "icon": import_zod3.z.string().nullish(),
  "sections": import_zod3.z.array(import_zod3.z.string()),
  "languages": import_zod3.z.array(import_zod3.z.string()),
  "hasAccessToAllLanguages": import_zod3.z.boolean(),
  "documentStartNode": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish(),
  "documentRootAccess": import_zod3.z.boolean(),
  "mediaStartNode": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }).nullish(),
  "mediaRootAccess": import_zod3.z.boolean(),
  "fallbackPermissions": import_zod3.z.array(import_zod3.z.string()),
  "permissions": import_zod3.z.array(import_zod3.z.object({
    "$type": import_zod3.z.enum(["DocumentPermissionPresentationModel"]),
    "document": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }),
    "verbs": import_zod3.z.array(import_zod3.z.string())
  }).or(import_zod3.z.object({
    "$type": import_zod3.z.enum(["UnknownTypePermissionPresentationModel"]),
    "verbs": import_zod3.z.array(import_zod3.z.string()),
    "context": import_zod3.z.string()
  })))
});
var deleteUserGroupByIdUsersParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var deleteUserGroupByIdUsersBodyItem = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var deleteUserGroupByIdUsersBody = import_zod3.z.array(deleteUserGroupByIdUsersBodyItem);
var postUserGroupByIdUsersParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var postUserGroupByIdUsersBodyItem = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var postUserGroupByIdUsersBody = import_zod3.z.array(postUserGroupByIdUsersBodyItem);
var getFilterUserQueryTakeDefault = 100;
var getFilterUserQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getFilterUserQueryTakeDefault),
  "orderBy": import_zod3.z.enum(["UserName", "Language", "Name", "Email", "Id", "CreateDate", "UpdateDate", "IsApproved", "IsLockedOut", "LastLoginDate"]).optional(),
  "orderDirection": import_zod3.z.enum(["Ascending", "Descending"]).optional(),
  "userGroupIds": import_zod3.z.array(import_zod3.z.string().uuid()).optional(),
  "userStates": import_zod3.z.array(import_zod3.z.enum(["Active", "Disabled", "LockedOut", "Invited", "Inactive", "All"])).optional(),
  "filter": import_zod3.z.string().optional()
});
var getFilterUserResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "email": import_zod3.z.string(),
    "userName": import_zod3.z.string(),
    "name": import_zod3.z.string(),
    "userGroupIds": import_zod3.z.array(import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    })),
    "id": import_zod3.z.string().uuid(),
    "languageIsoCode": import_zod3.z.string().nullish(),
    "documentStartNodeIds": import_zod3.z.array(import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    })),
    "hasDocumentRootAccess": import_zod3.z.boolean(),
    "mediaStartNodeIds": import_zod3.z.array(import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    })),
    "hasMediaRootAccess": import_zod3.z.boolean(),
    "avatarUrls": import_zod3.z.array(import_zod3.z.string()),
    "state": import_zod3.z.enum(["Active", "Disabled", "LockedOut", "Invited", "Inactive", "All"]),
    "failedLoginAttempts": import_zod3.z.number(),
    "createDate": import_zod3.z.string().datetime({ "local": true }),
    "updateDate": import_zod3.z.string().datetime({ "local": true }),
    "lastLoginDate": import_zod3.z.string().datetime({ "local": true }).nullish(),
    "lastLockoutDate": import_zod3.z.string().datetime({ "local": true }).nullish(),
    "lastPasswordChangeDate": import_zod3.z.string().datetime({ "local": true }).nullish(),
    "isAdmin": import_zod3.z.boolean(),
    "kind": import_zod3.z.enum(["Default", "Api"])
  }))
});
var getItemUserQueryParams = import_zod3.z.object({
  "id": import_zod3.z.array(import_zod3.z.string().uuid()).optional()
});
var getItemUserResponseItem = import_zod3.z.object({
  "id": import_zod3.z.string().uuid(),
  "name": import_zod3.z.string(),
  "avatarUrls": import_zod3.z.array(import_zod3.z.string()),
  "kind": import_zod3.z.enum(["Default", "Api"])
});
var getItemUserResponse = import_zod3.z.array(getItemUserResponseItem);
var postUserBody = import_zod3.z.object({
  "email": import_zod3.z.string(),
  "userName": import_zod3.z.string(),
  "name": import_zod3.z.string(),
  "userGroupIds": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  })),
  "id": import_zod3.z.string().uuid().nullish(),
  "kind": import_zod3.z.enum(["Default", "Api"])
});
var deleteUserBody = import_zod3.z.object({
  "userIds": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }))
});
var getUserQueryTakeDefault = 100;
var getUserQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getUserQueryTakeDefault)
});
var getUserResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "email": import_zod3.z.string(),
    "userName": import_zod3.z.string(),
    "name": import_zod3.z.string(),
    "userGroupIds": import_zod3.z.array(import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    })),
    "id": import_zod3.z.string().uuid(),
    "languageIsoCode": import_zod3.z.string().nullish(),
    "documentStartNodeIds": import_zod3.z.array(import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    })),
    "hasDocumentRootAccess": import_zod3.z.boolean(),
    "mediaStartNodeIds": import_zod3.z.array(import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    })),
    "hasMediaRootAccess": import_zod3.z.boolean(),
    "avatarUrls": import_zod3.z.array(import_zod3.z.string()),
    "state": import_zod3.z.enum(["Active", "Disabled", "LockedOut", "Invited", "Inactive", "All"]),
    "failedLoginAttempts": import_zod3.z.number(),
    "createDate": import_zod3.z.string().datetime({ "local": true }),
    "updateDate": import_zod3.z.string().datetime({ "local": true }),
    "lastLoginDate": import_zod3.z.string().datetime({ "local": true }).nullish(),
    "lastLockoutDate": import_zod3.z.string().datetime({ "local": true }).nullish(),
    "lastPasswordChangeDate": import_zod3.z.string().datetime({ "local": true }).nullish(),
    "isAdmin": import_zod3.z.boolean(),
    "kind": import_zod3.z.enum(["Default", "Api"])
  }))
});
var getUserByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getUserByIdResponse = import_zod3.z.object({
  "email": import_zod3.z.string(),
  "userName": import_zod3.z.string(),
  "name": import_zod3.z.string(),
  "userGroupIds": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  })),
  "id": import_zod3.z.string().uuid(),
  "languageIsoCode": import_zod3.z.string().nullish(),
  "documentStartNodeIds": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  })),
  "hasDocumentRootAccess": import_zod3.z.boolean(),
  "mediaStartNodeIds": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  })),
  "hasMediaRootAccess": import_zod3.z.boolean(),
  "avatarUrls": import_zod3.z.array(import_zod3.z.string()),
  "state": import_zod3.z.enum(["Active", "Disabled", "LockedOut", "Invited", "Inactive", "All"]),
  "failedLoginAttempts": import_zod3.z.number(),
  "createDate": import_zod3.z.string().datetime({ "local": true }),
  "updateDate": import_zod3.z.string().datetime({ "local": true }),
  "lastLoginDate": import_zod3.z.string().datetime({ "local": true }).nullish(),
  "lastLockoutDate": import_zod3.z.string().datetime({ "local": true }).nullish(),
  "lastPasswordChangeDate": import_zod3.z.string().datetime({ "local": true }).nullish(),
  "isAdmin": import_zod3.z.boolean(),
  "kind": import_zod3.z.enum(["Default", "Api"])
});
var deleteUserByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putUserByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putUserByIdBody = import_zod3.z.object({
  "email": import_zod3.z.string(),
  "userName": import_zod3.z.string(),
  "name": import_zod3.z.string(),
  "userGroupIds": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  })),
  "languageIsoCode": import_zod3.z.string(),
  "documentStartNodeIds": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  })),
  "hasDocumentRootAccess": import_zod3.z.boolean(),
  "mediaStartNodeIds": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  })),
  "hasMediaRootAccess": import_zod3.z.boolean()
});
var getUserById2faParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getUserById2faResponseItem = import_zod3.z.object({
  "providerName": import_zod3.z.string(),
  "isEnabledOnUser": import_zod3.z.boolean()
});
var getUserById2faResponse = import_zod3.z.array(getUserById2faResponseItem);
var deleteUserById2faByProviderNameParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid(),
  "providerName": import_zod3.z.string()
});
var getUserByIdCalculateStartNodesParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getUserByIdCalculateStartNodesResponse = import_zod3.z.object({
  "id": import_zod3.z.string().uuid(),
  "documentStartNodeIds": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  })),
  "hasDocumentRootAccess": import_zod3.z.boolean(),
  "mediaStartNodeIds": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  })),
  "hasMediaRootAccess": import_zod3.z.boolean()
});
var postUserByIdChangePasswordParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var postUserByIdChangePasswordBody = import_zod3.z.object({
  "newPassword": import_zod3.z.string()
});
var postUserByIdClientCredentialsParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var postUserByIdClientCredentialsBody = import_zod3.z.object({
  "clientId": import_zod3.z.string(),
  "clientSecret": import_zod3.z.string()
});
var getUserByIdClientCredentialsParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getUserByIdClientCredentialsResponseItem = import_zod3.z.string();
var getUserByIdClientCredentialsResponse = import_zod3.z.array(getUserByIdClientCredentialsResponseItem);
var deleteUserByIdClientCredentialsByClientIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid(),
  "clientId": import_zod3.z.string()
});
var postUserByIdResetPasswordParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var postUserByIdResetPasswordResponse = import_zod3.z.object({
  "resetPassword": import_zod3.z.string().nullish()
});
var deleteUserAvatarByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var postUserAvatarByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var postUserAvatarByIdBody = import_zod3.z.object({
  "file": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  })
});
var getUserConfigurationResponse = import_zod3.z.object({
  "canInviteUsers": import_zod3.z.boolean(),
  "usernameIsEmail": import_zod3.z.boolean(),
  "passwordConfiguration": import_zod3.z.object({
    "minimumPasswordLength": import_zod3.z.number(),
    "requireNonLetterOrDigit": import_zod3.z.boolean(),
    "requireDigit": import_zod3.z.boolean(),
    "requireLowercase": import_zod3.z.boolean(),
    "requireUppercase": import_zod3.z.boolean()
  }),
  "allowChangePassword": import_zod3.z.boolean(),
  "allowTwoFactor": import_zod3.z.boolean()
});
var getUserCurrentResponse = import_zod3.z.object({
  "email": import_zod3.z.string(),
  "userName": import_zod3.z.string(),
  "name": import_zod3.z.string(),
  "userGroupIds": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  })),
  "id": import_zod3.z.string().uuid(),
  "languageIsoCode": import_zod3.z.string().nullable(),
  "documentStartNodeIds": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  })),
  "hasDocumentRootAccess": import_zod3.z.boolean(),
  "mediaStartNodeIds": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  })),
  "hasMediaRootAccess": import_zod3.z.boolean(),
  "avatarUrls": import_zod3.z.array(import_zod3.z.string()),
  "languages": import_zod3.z.array(import_zod3.z.string()),
  "hasAccessToAllLanguages": import_zod3.z.boolean(),
  "hasAccessToSensitiveData": import_zod3.z.boolean(),
  "fallbackPermissions": import_zod3.z.array(import_zod3.z.string()),
  "permissions": import_zod3.z.array(import_zod3.z.object({
    "$type": import_zod3.z.enum(["DocumentPermissionPresentationModel"]),
    "document": import_zod3.z.object({
      "id": import_zod3.z.string().uuid()
    }),
    "verbs": import_zod3.z.array(import_zod3.z.string())
  }).or(import_zod3.z.object({
    "$type": import_zod3.z.enum(["UnknownTypePermissionPresentationModel"]),
    "verbs": import_zod3.z.array(import_zod3.z.string()),
    "context": import_zod3.z.string()
  }))),
  "allowedSections": import_zod3.z.array(import_zod3.z.string()),
  "isAdmin": import_zod3.z.boolean()
});
var getUserCurrent2faResponseItem = import_zod3.z.object({
  "providerName": import_zod3.z.string(),
  "isEnabledOnUser": import_zod3.z.boolean()
});
var getUserCurrent2faResponse = import_zod3.z.array(getUserCurrent2faResponseItem);
var deleteUserCurrent2faByProviderNameParams = import_zod3.z.object({
  "providerName": import_zod3.z.string()
});
var deleteUserCurrent2faByProviderNameQueryParams = import_zod3.z.object({
  "code": import_zod3.z.string().optional()
});
var postUserCurrent2faByProviderNameParams = import_zod3.z.object({
  "providerName": import_zod3.z.string()
});
var postUserCurrent2faByProviderNameBody = import_zod3.z.object({
  "code": import_zod3.z.string(),
  "secret": import_zod3.z.string()
});
var postUserCurrent2faByProviderNameResponse = import_zod3.z.object({});
var getUserCurrent2faByProviderNameParams = import_zod3.z.object({
  "providerName": import_zod3.z.string()
});
var getUserCurrent2faByProviderNameResponse = import_zod3.z.object({});
var postUserCurrentAvatarBody = import_zod3.z.object({
  "file": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  })
});
var postUserCurrentChangePasswordBody = import_zod3.z.object({
  "newPassword": import_zod3.z.string(),
  "oldPassword": import_zod3.z.string().nullish()
});
var getUserCurrentConfigurationResponse = import_zod3.z.object({
  "keepUserLoggedIn": import_zod3.z.boolean(),
  "usernameIsEmail": import_zod3.z.boolean(),
  "passwordConfiguration": import_zod3.z.object({
    "minimumPasswordLength": import_zod3.z.number(),
    "requireNonLetterOrDigit": import_zod3.z.boolean(),
    "requireDigit": import_zod3.z.boolean(),
    "requireLowercase": import_zod3.z.boolean(),
    "requireUppercase": import_zod3.z.boolean()
  }),
  "allowChangePassword": import_zod3.z.boolean(),
  "allowTwoFactor": import_zod3.z.boolean()
});
var getUserCurrentLoginProvidersResponseItem = import_zod3.z.object({
  "providerSchemeName": import_zod3.z.string(),
  "providerKey": import_zod3.z.string().nullish(),
  "isLinkedOnUser": import_zod3.z.boolean(),
  "hasManualLinkingEnabled": import_zod3.z.boolean()
});
var getUserCurrentLoginProvidersResponse = import_zod3.z.array(getUserCurrentLoginProvidersResponseItem);
var getUserCurrentPermissionsQueryParams = import_zod3.z.object({
  "id": import_zod3.z.array(import_zod3.z.string().uuid()).optional()
});
var getUserCurrentPermissionsResponse = import_zod3.z.object({
  "permissions": import_zod3.z.array(import_zod3.z.object({
    "nodeKey": import_zod3.z.string().uuid(),
    "permissions": import_zod3.z.array(import_zod3.z.string())
  }))
});
var getUserCurrentPermissionsDocumentQueryParams = import_zod3.z.object({
  "id": import_zod3.z.array(import_zod3.z.string().uuid()).optional()
});
var getUserCurrentPermissionsDocumentResponseItem = import_zod3.z.object({
  "permissions": import_zod3.z.array(import_zod3.z.object({
    "nodeKey": import_zod3.z.string().uuid(),
    "permissions": import_zod3.z.array(import_zod3.z.string())
  }))
});
var getUserCurrentPermissionsDocumentResponse = import_zod3.z.array(getUserCurrentPermissionsDocumentResponseItem);
var getUserCurrentPermissionsMediaQueryParams = import_zod3.z.object({
  "id": import_zod3.z.array(import_zod3.z.string().uuid()).optional()
});
var getUserCurrentPermissionsMediaResponse = import_zod3.z.object({
  "permissions": import_zod3.z.array(import_zod3.z.object({
    "nodeKey": import_zod3.z.string().uuid(),
    "permissions": import_zod3.z.array(import_zod3.z.string())
  }))
});
var postUserDisableBody = import_zod3.z.object({
  "userIds": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }))
});
var postUserEnableBody = import_zod3.z.object({
  "userIds": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }))
});
var postUserInviteBody = import_zod3.z.object({
  "email": import_zod3.z.string(),
  "userName": import_zod3.z.string(),
  "name": import_zod3.z.string(),
  "userGroupIds": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  })),
  "id": import_zod3.z.string().uuid().nullish(),
  "message": import_zod3.z.string().nullish()
});
var postUserInviteCreatePasswordBody = import_zod3.z.object({
  "user": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }),
  "token": import_zod3.z.string().min(1),
  "password": import_zod3.z.string()
});
var postUserInviteResendBody = import_zod3.z.object({
  "user": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }),
  "message": import_zod3.z.string().nullish()
});
var postUserInviteVerifyBody = import_zod3.z.object({
  "user": import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }),
  "token": import_zod3.z.string().min(1)
});
var postUserInviteVerifyResponse = import_zod3.z.object({
  "passwordConfiguration": import_zod3.z.object({
    "minimumPasswordLength": import_zod3.z.number(),
    "requireNonLetterOrDigit": import_zod3.z.boolean(),
    "requireDigit": import_zod3.z.boolean(),
    "requireLowercase": import_zod3.z.boolean(),
    "requireUppercase": import_zod3.z.boolean()
  })
});
var postUserSetUserGroupsBody = import_zod3.z.object({
  "userIds": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  })),
  "userGroupIds": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }))
});
var postUserUnlockBody = import_zod3.z.object({
  "userIds": import_zod3.z.array(import_zod3.z.object({
    "id": import_zod3.z.string().uuid()
  }))
});
var getItemWebhookQueryParams = import_zod3.z.object({
  "id": import_zod3.z.array(import_zod3.z.string().uuid()).optional()
});
var getItemWebhookResponseItem = import_zod3.z.object({
  "enabled": import_zod3.z.boolean(),
  "name": import_zod3.z.string(),
  "events": import_zod3.z.string(),
  "url": import_zod3.z.string(),
  "types": import_zod3.z.string()
});
var getItemWebhookResponse = import_zod3.z.array(getItemWebhookResponseItem);
var getWebhookQueryTakeDefault = 100;
var getWebhookQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getWebhookQueryTakeDefault)
});
var getWebhookResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "enabled": import_zod3.z.boolean(),
    "name": import_zod3.z.string().nullish(),
    "description": import_zod3.z.string().nullish(),
    "url": import_zod3.z.string().min(1),
    "contentTypeKeys": import_zod3.z.array(import_zod3.z.string().uuid()),
    "headers": import_zod3.z.record(import_zod3.z.string(), import_zod3.z.string()),
    "id": import_zod3.z.string().uuid(),
    "events": import_zod3.z.array(import_zod3.z.object({
      "eventName": import_zod3.z.string(),
      "eventType": import_zod3.z.string(),
      "alias": import_zod3.z.string()
    }))
  }))
});
var postWebhookBody = import_zod3.z.object({
  "enabled": import_zod3.z.boolean(),
  "name": import_zod3.z.string().nullish(),
  "description": import_zod3.z.string().nullish(),
  "url": import_zod3.z.string().min(1),
  "contentTypeKeys": import_zod3.z.array(import_zod3.z.string().uuid()),
  "headers": import_zod3.z.record(import_zod3.z.string(), import_zod3.z.string()),
  "id": import_zod3.z.string().uuid().nullish(),
  "events": import_zod3.z.array(import_zod3.z.string())
});
var getWebhookByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getWebhookByIdResponse = import_zod3.z.object({
  "enabled": import_zod3.z.boolean(),
  "name": import_zod3.z.string().nullish(),
  "description": import_zod3.z.string().nullish(),
  "url": import_zod3.z.string().min(1),
  "contentTypeKeys": import_zod3.z.array(import_zod3.z.string().uuid()),
  "headers": import_zod3.z.record(import_zod3.z.string(), import_zod3.z.string()),
  "id": import_zod3.z.string().uuid(),
  "events": import_zod3.z.array(import_zod3.z.object({
    "eventName": import_zod3.z.string(),
    "eventType": import_zod3.z.string(),
    "alias": import_zod3.z.string()
  }))
});
var deleteWebhookByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putWebhookByIdParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var putWebhookByIdBody = import_zod3.z.object({
  "enabled": import_zod3.z.boolean(),
  "name": import_zod3.z.string().nullish(),
  "description": import_zod3.z.string().nullish(),
  "url": import_zod3.z.string().min(1),
  "contentTypeKeys": import_zod3.z.array(import_zod3.z.string().uuid()),
  "headers": import_zod3.z.record(import_zod3.z.string(), import_zod3.z.string()),
  "events": import_zod3.z.array(import_zod3.z.string())
});
var getWebhookByIdLogsParams = import_zod3.z.object({
  "id": import_zod3.z.string().uuid()
});
var getWebhookByIdLogsQueryTakeDefault = 100;
var getWebhookByIdLogsQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getWebhookByIdLogsQueryTakeDefault)
});
var getWebhookByIdLogsResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "key": import_zod3.z.string().uuid(),
    "webhookKey": import_zod3.z.string().uuid(),
    "statusCode": import_zod3.z.string(),
    "isSuccessStatusCode": import_zod3.z.boolean(),
    "date": import_zod3.z.string().datetime({ "local": true }),
    "eventAlias": import_zod3.z.string(),
    "url": import_zod3.z.string(),
    "retryCount": import_zod3.z.number(),
    "requestHeaders": import_zod3.z.string(),
    "requestBody": import_zod3.z.string(),
    "responseHeaders": import_zod3.z.string(),
    "responseBody": import_zod3.z.string(),
    "exceptionOccured": import_zod3.z.boolean()
  }))
});
var getWebhookEventsQueryTakeDefault = 100;
var getWebhookEventsQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getWebhookEventsQueryTakeDefault)
});
var getWebhookEventsResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "eventName": import_zod3.z.string(),
    "eventType": import_zod3.z.string(),
    "alias": import_zod3.z.string()
  }))
});
var getWebhookLogsQueryTakeDefault = 100;
var getWebhookLogsQueryParams = import_zod3.z.object({
  "skip": import_zod3.z.number().optional(),
  "take": import_zod3.z.number().default(getWebhookLogsQueryTakeDefault)
});
var getWebhookLogsResponse = import_zod3.z.object({
  "total": import_zod3.z.number(),
  "items": import_zod3.z.array(import_zod3.z.object({
    "key": import_zod3.z.string().uuid(),
    "webhookKey": import_zod3.z.string().uuid(),
    "statusCode": import_zod3.z.string(),
    "isSuccessStatusCode": import_zod3.z.boolean(),
    "date": import_zod3.z.string().datetime({ "local": true }),
    "eventAlias": import_zod3.z.string(),
    "url": import_zod3.z.string(),
    "retryCount": import_zod3.z.number(),
    "requestHeaders": import_zod3.z.string(),
    "requestBody": import_zod3.z.string(),
    "responseHeaders": import_zod3.z.string(),
    "responseBody": import_zod3.z.string(),
    "exceptionOccured": import_zod3.z.boolean()
  }))
});

// src/tools/data-types/post/create-data-type.ts
var CreateDataTypeTool = CreateUmbracoTool(
  "create-data-type-root",
  "Creates a new data type",
  postDataTypeBody.shape,
  async (input) => {
    try {
      console.log("Creating data type with params:", input);
      const client = UmbracoManagementClient2.getClient();
      const body = postDataTypeBody.parse(input);
      console.log(body);
      var response = await client.postDataType(
        body
      );
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

// src/tools/data-types/index.ts
var DataTypeTools = [get_root_default, create_data_type_default];

// src/tools/tool-factory.ts
function ToolFactory(server) {
  CultureTools.map((tool) => tool()).forEach(
    (tool) => server.tool(tool.name, tool.description, tool.schema, tool.handler)
  );
  DataTypeTools.map((tool) => tool()).forEach(
    (tool) => server.tool(tool.name, tool.description, tool.schema, tool.handler)
  );
}

// src/index.ts
var main = async () => {
  const server = UmbracoMcpServer.GetServer();
  ToolFactory(server);
  const transport = new import_stdio.StdioServerTransport();
  await server.connect(transport);
};
main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
