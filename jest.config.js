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
    },
    unit: {
        testEnvironment: 'node',
        testMatch: ['**/test/units/**/*.ts'],
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
    globals: {
        'ts-jest': {
            diagnostics: {
                // Игнорируем воргинги про esModuleInterop, которые нам чинить, кажется не требуется
                // потому что в тестах импорты работают без проблем.
                ignoreCodes: [151001],
            },
        },
    },
    ...suiteParams[suite],
};
