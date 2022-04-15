const suite = process.env.TEST_SUITE || 'unit';

const suiteParams = {
    screenshots: {
        globalSetup: './test/global-setup.js',
        globalTeardown: './test/global-teardown.js',
        maxWorkers: 5,
        maxConcurrency: 3,
        testTimeout: 15000,
        testEnvironment: 'node',
        testMatch: ['**/*/*.screen.ts'],
        testRunner: 'jest-jasmine2',
    },
    unit: {
        globalSetup: './test/global-setup.js',
        globalTeardown: './test/global-teardown.js',
        maxWorkers: 5,
        maxConcurrency: 3,
        testTimeout: 15000,
        testEnvironment: 'node',
        testMatch: ['**/units/*.ts'],
        testRunner: 'jest-jasmine2',
    },
};

module.exports = {
    preset: 'ts-jest',
    ...suiteParams[suite],
};
