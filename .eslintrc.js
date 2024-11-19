module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'prettier',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        sourceType: 'module',
    },
    plugins: [
        'eslint-plugin-import',
        'eslint-plugin-prefer-arrow',
        'eslint-plugin-jsdoc',
        '@typescript-eslint',
    ],
    root: true,
    rules: {
        '@typescript-eslint/adjacent-overload-signatures': 'error',
        '@typescript-eslint/array-type': [
            'error',
            {
                default: 'array-simple',
            },
        ],
        '@typescript-eslint/ban-types': [
            'error',
            {
                types: {
                    Object: {
                        message: 'Avoid using the `Object` type. Did you mean `object`?',
                    },
                    Function: {
                        message:
                            'Avoid using the `Function` type. Prefer a specific function type, like `() => void`.',
                    },
                    Boolean: {
                        message: 'Avoid using the `Boolean` type. Did you mean `boolean`?',
                    },
                    Number: {
                        message: 'Avoid using the `Number` type. Did you mean `number`?',
                    },
                    String: {
                        message: 'Avoid using the `String` type. Did you mean `string`?',
                    },
                    Symbol: {
                        message: 'Avoid using the `Symbol` type. Did you mean `symbol`?',
                    },
                },
            },
        ],
        '@typescript-eslint/consistent-type-assertions': 'error',
        '@typescript-eslint/consistent-type-definitions': 'error',
        '@typescript-eslint/dot-notation': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/member-delimiter-style': [
            'off',
            {
                multiline: {
                    delimiter: 'none',
                    requireLast: true,
                },
                singleline: {
                    delimiter: 'semi',
                    requireLast: false,
                },
            },
        ],
        '@typescript-eslint/member-ordering': 'error',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-inferrable-types': 'error',
        '@typescript-eslint/no-misused-new': 'error',
        '@typescript-eslint/no-namespace': 'error',
        '@typescript-eslint/no-parameter-properties': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/restrict-plus-operands': 'warn',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'warn',
        '@typescript-eslint/no-unsafe-call': 'warn',
        '@typescript-eslint/no-unsafe-return': 'warn',
        '@typescript-eslint/no-unsafe-argument': 'warn',
        '@typescript-eslint/no-unused-vars': 'warn',
        '@typescript-eslint/naming-convention': 'off',
        'arrow-body-style': 'warn',
        '@typescript-eslint/restrict-template-expressions': 'warn',
        '@typescript-eslint/ban-ts-comment': 'warn',
        'quote-props': 'off',
        'object-shorthand': 'warn',
        'jsdoc/check-indentation': 'off',
        'jsdoc/newline-after-description': 'off',
        '@typescript-eslint/explicit-member-accessibility': [
            'warn',
            { overrides: { constructors: 'no-public' } },
        ],
        '@typescript-eslint/unbound-method': 'warn',
        '@typescript-eslint/require-await': 'warn',
        '@typescript-eslint/no-misused-promises': 'warn',
        '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
        '@typescript-eslint/no-namespace': 'warn',
        '@typescript-eslint/await-thenable': 'warn',
        '@typescript-eslint/no-loss-of-precision': 'warn',
        '@typescript-eslint/no-array-constructor': 'warn',
        '@typescript-eslint/member-ordering': 'warn',
        '@typescript-eslint/no-this-alias': 'warn',
        '@typescript-eslint/ban-types': 'warn',
        '@typescript-eslint/no-unnecessary-type-constraint': 'warn',
        '@typescript-eslint/prefer-as-const': 'warn',
        '@typescript-eslint/member-ordering': 'warn',
        '@typescript-eslint/no-inferrable-types': 'warn',
        '@typescript-eslint/no-unused-expressions': 'warn',
        'prefer-rest-params': 'warn',
        '@typescript-eslint/no-shadow': [
            'off',
            {
                hoist: 'all',
            },
        ],
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/prefer-for-of': 'off',
        '@typescript-eslint/prefer-function-type': 'error',
        '@typescript-eslint/prefer-namespace-keyword': 'error',
        '@typescript-eslint/quotes': 'off',
        '@typescript-eslint/semi': ['off', null],
        '@typescript-eslint/triple-slash-reference': [
            'error',
            {
                path: 'always',
                types: 'prefer-import',
                lib: 'always',
            },
        ],
        '@typescript-eslint/typedef': 'off',
        '@typescript-eslint/unified-signatures': 'error',
        'comma-dangle': 'off',
        complexity: 'off',
        'constructor-super': 'error',
        curly: 'error',
        'dot-notation': 'off',
        eqeqeq: ['error', 'always'],
        'guard-for-in': 'off',
        'id-denylist': 'off',
        'id-match': 'off',
        'import/no-default-export': 'error',
        'import/order': 'off',
        'jsdoc/check-alignment': 'error',
        'jsdoc/no-types': 'off',
        'max-classes-per-file': ['off', 1],
        'max-len': 'off',
        'no-bitwise': 'off',
        'no-caller': 'error',
        'no-cond-assign': 'error',
        'no-console': 'off',
        'no-constant-condition': 'error',
        'no-debugger': 'error',
        'no-empty': 'off',
        'no-empty-function': 'off',
        'no-eval': 'error',
        'no-fallthrough': 'off',
        'no-invalid-this': 'off',
        'no-irregular-whitespace': 'error',
        'no-new-wrappers': 'error',
        'no-shadow': 'off',
        'no-throw-literal': 'error',
        'no-trailing-spaces': 'off',
        'no-undef-init': 'error',
        'no-underscore-dangle': 'off',
        'no-unsafe-finally': 'error',
        'no-unused-expressions': 'off',
        'no-unused-labels': 'error',
        'no-use-before-define': 'off',
        'no-var': 'error',
        'one-var': ['off', 'never'],
        'prefer-arrow/prefer-arrow-functions': 'off',
        'prefer-const': 'error',
        quotes: 'off',
        radix: 'error',
        semi: 'off',
        'space-before-function-paren': 'off',
        'spaced-comment': 'warn',
        'use-isnan': 'error',
        'valid-typeof': 'off',
    },
};
