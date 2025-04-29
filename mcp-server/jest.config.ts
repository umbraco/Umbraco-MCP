/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
    preset: 'ts-jest/presets/js-with-ts-esm',
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.js$': '$1',
      '^@/clients/(.*)\\.js$': '<rootDir>/src/clients/$1',
      '^@/helpers/(.*)\\.js$': '<rootDir>/src/helpers/$1',
      '^@/umb-management-api/(.*)\\.js$': '<rootDir>/src/api/umbraco/management/$1',
    },
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            useESM: true
        }]
    },
    testMatch: [
        '**/src/**/__tests__/**/*.test.ts'
    ],
    setupFiles: ['<rootDir>/jest.setup.ts'] 
};

module.exports = config;