# Umbraco MCP ![GitHub License](https://img.shields.io/github/license/matthew-wise/umbraco-mcp?style=plastic&link=https%3A%2F%2Fgithub.com%2FMatthew-Wise%2Fumbraco-mcp%3Ftab%3DMIT-1-ov-file%23readme)

An MCP (Model Context Protocol) server for [Umbraco CMS](https://umbraco.com/)
it provides access to key parts of the Management API enabling you to do back office tasks with your agent.

## Key Features

The tables below shows which endpoints are covered by swagger document group,
if you want to see individual endpoints please refer to your sites swagger definition `<domain>/umbraco/swagger/index.html?urls.primaryName=Umbraco+Management+API`

###  Umbraco Management API

|                       |                  |                 |                 |
| --------------------- | ---------------- | --------------- | --------------- |
| ✅ Culture            | ✅ Data Type     | ✅ Dictionary   | ✅ Document     |
| ✅ Document Blueprint | ✅ Document Type | ✅ Language     | ✅ Log Viewer   |
| ✅ Media             | ✅ Media Type    | ✅ Member       | ✅ Member Group |
| ✅ Member Type       | ✅ Property Type | ✅ Redirect     | ✅ Server      |
| ✅ Temporary File    | ✅ User Group    | ✅ Webhook      |

## Getting Started

### Umbraco

In order for the MCP to talk to the Management API you will need to create a API user
if you are unsure how to do this follow [Umbraco's documentation](https://docs.umbraco.com/umbraco-cms/fundamentals/data/users/api-users).

The level of access you provider this user will determine what your agent is able to do.

### Installation

Currently project is not on npm so you need to use `npm build` to generate the server.



```json
{
  "servers": {
    "umbraco-mcp": {
      "type": "stdio",
      "command": "node",
      "args": ["<path to project>/mcp-server/build/index.js"],
      "env": {
        "UMBRACO_CLIENT_ID": "<API user name>",
        "UMBRACO_CLIENT_SECRET": "<API client secert>",
        "UMBRACO_BASE_URL": "https://<domain>",
        "EXCLUDE_MANAGEMENT_TOOLS": "<toolname>,<<toolname>"
      }
    }
  }
}
```
