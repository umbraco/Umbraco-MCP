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

- **`./docs/comments.md`** - Documents API quirks, known issues, and limitations discovered during development
- **`./docs/crd.md`** - Content requirements and specifications for new features
- **`README.md`** - Complete tool documentation and setup instructions

## Current State

The project has:
- **100+ MCP tools** covering the full Umbraco Management API surface
- **Established testing standards** with builders and helpers
- **Consistent patterns** for tool creation, validation, and error handling
- **Mature codebase** - prioritize consistency with existing patterns over innovation

## Tool and Testing Creation Process

This project follows a standardized 4-step process for creating new features with comprehensive testing:
Sub agents are only availble in Claude Code

### Step 1: Create MCP Tools
- **Agent**: `mcp-tool-creator`
- **Output**: MCP tools with proper Zod validation and error handling
- **Organization**: RESTful grouping by entity type and HTTP verb (GET, POST, PUT, DELETE)
- **Requirements**: Must pass TypeScript compilation

### Step 2: Create Test Builders and Helpers  
- **Agent**: `test-builder-helper-creator`
- **Output**: 
  - Builders using the builder pattern for test data creation
  - Test helpers with cleanup, normalization, and entity finding methods
- **Pattern**: Follow Dictionary entity as the gold standard
- **Requirements**: Must include integration tests for builders and helpers

### Step 3: Verify Infrastructure
- **Requirement**: All builder tests must pass
- **Requirement**: All helper tests must pass  
- **Requirement**: TypeScript compilation must pass
- **Checkpoint**: Do not proceed until all prerequisites are green

### Step 4: Create Integration Tests
- **Agent**: `integration-test-creator`
- **Output**: Comprehensive integration test suites for MCP tools
- **Pattern**: CRUD testing with proper cleanup and snapshot testing
- **Infrastructure**: Uses existing builders and helpers from Step 2

## Development Philosophy

- **Follow existing patterns** rather than creating new ones
- **Consistency over innovation** - this is a mature codebase
- **Comprehensive testing** with proper cleanup and normalization
- **Type safety first** - always use Zod validation
- **RESTful organization** - group tools by entity and HTTP verb
- **Sequential workflow** - complete each step before moving to the next

When working on this project, always refer to existing implementations as the gold standard and maintain consistency with established patterns.