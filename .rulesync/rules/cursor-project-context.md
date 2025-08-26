---
root: false
targets:
  - '*'
description: Project context and background for the Umbraco MCP Server
globs:
  - '**/*'
cursorRuleType: always
---

# Umbraco MCP Server - Project Context

## Project Overview

This is an **MCP (Model Context Protocol) server** that provides AI assistants with access to **Umbraco CMS Management API**. It allows AI tools to perform back office tasks like content management, user administration, and system configuration through standardized MCP interfaces.

## Architecture

- **MCP Server**: Exposes Umbraco Management API as MCP tools and resources
- **Authentication**: Uses Umbraco API users with configurable permissions
- **API Coverage**: Comprehensive tool coverage for all major Umbraco Management API endpoints
- **Type Safety**: Full TypeScript implementation with Zod schema validation

## Project Maturity

This is a **well-established, production-ready codebase** with:
- ✅ Comprehensive testing patterns established
- ✅ Strong TypeScript typing throughout
- ✅ Established code conventions and helpers
- ✅ Builder pattern for test data creation
- ✅ Snapshot testing with normalization helpers
- ✅ RESTful tool organization by entity type

## Key Project Files

- **`wtf.md`** - Documents API quirks, known issues, and limitations discovered during development
- **`crd.md`** - Content requirements and specifications for new features
- **`README.md`** - Complete tool documentation and setup instructions

## Current State

The project has:
- **100+ MCP tools** covering the full Umbraco Management API surface
- **Established testing standards** with builders and helpers
- **Consistent patterns** for tool creation, validation, and error handling
- **Mature codebase** - prioritize consistency with existing patterns over innovation

## Development Philosophy

- **Follow existing patterns** rather than creating new ones
- **Consistency over innovation** - this is a mature codebase
- **Comprehensive testing** with proper cleanup and normalization
- **Type safety first** - always use Zod validation
- **RESTful organization** - group tools by entity and HTTP verb

When working on this project, always refer to existing implementations as the gold standard and maintain consistency with established patterns.