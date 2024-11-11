module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'prettier'],
    rules: {
        'no-console': 'off',
        'no-constant-condition': 'error',
        'eqeqeq': 'error', // Точно такое же поведение, как у 'triple-equals' в TSLint
        'no-multi-spaces': 'off',
        'array-bracket-spacing': ['error', 'never'],
        'block-spacing': ['error', 'always'],
        'brace-style': ['error', '1tbs', { allowSingleLine: true }],
        'linebreak-style': ['error', 'unix'],
        'no-bitwise': 'off',
        'indent': ['error', 4],
        'no-trailing-whitespace': 'off',
        'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true, allowTaggedTemplates: true }],
        'object-curly-spacing': 'off',
        'quote-props': ['error', 'as-needed'],
        'quotes': ['error', 'single', { avoidEscape: true }],
        'space-in-parens': 'off',
        'arrow-parens': ['error', 'always'],
        'no-shadow': 'off', // Аналогично 'no-shadowed-variable'
        'import/order': 'off', // Аналогично 'ordered-imports'
        'no-confusing-arrow': 'off', // Аналогично 'only-arrow-functions'
        'for-direction': 'off', // Аналогично 'forin'
        'max-classes-per-file': ['off'],
        'max-len': 'off', // Аналогично 'max-line-length'
        'class-name-casing': 'error', // Аналогично 'class-name'
        'no-namespace': ['error', { allowDeclarations: true }],
        'object-shorthand': 'off', // Аналогично 'object-literal-sort-keys'
        'prefer-for-of': 'off',
        'comma-dangle': 'off', // Аналогично 'trailing-comma'
        'no-irregular-whitespace': 'error',
        'no-default-export': 'error',
        'no-undef': 'off', // Аналогично 'variable-name'
        'no-empty': 'off',
        'one-var': 'off', // Аналогично 'one-variable-per-declaration'
        'align': 'off',
        'no-tabs': 'error', // Аналогично 'ter-no-tabs'
        'jsdoc/require-returns': 'off', // Аналогично 'no-redundant-jsdoc'
        'jsdoc/valid-types': 'error', // Аналогично 'jsdoc-format'
        '@typescript-eslint/no-inferrable-types': 'error',
        'semi': 'off', // Аналогично 'semicolon'
        'no-restricted-globals': ['error', 'isNaN'], // Используем Number.isNaN
        'space-before-function-paren': 'off',
        '@typescript-eslint/member-ordering': [
            'error',
            {
                default: [
                    'public-instance-field',
                    'protected-instance-field',
                    'private-instance-field',
                    'constructor',
                    'public-instance-method',
                    'protected-instance-method',
                    'private-instance-method',
                ],
            },
        ],
    },
};
