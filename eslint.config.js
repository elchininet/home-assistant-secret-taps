const tseslint = require('typescript-eslint');
const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
    {
        languageOptions: {
            globals: {
                Atomics: 'readonly',
                SharedArrayBuffer: 'readonly',
                ...globals.browser,
                ...globals.node,
                ...globals.es2015
            }
        }
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        rules: {
            quotes: [
                'error',
                'single',
                {
                    avoidEscape: true,
                    allowTemplateLiterals: true
                }
            ],
            indent: ['error', 4],
            semi: ['error', 'always'],
            'comma-dangle': ['error', 'never'],
            'no-trailing-spaces': ['error'],
            'array-bracket-spacing': ['error', 'never'],
            'comma-spacing': ['error'],
            '@typescript-eslint/no-duplicate-enum-values': 'off',
            '@typescript-eslint/no-var-requires': 'off'
        }
    },
    {
        files: ['eslint.config.js'],
        rules: {
            '@typescript-eslint/no-require-imports': 'off'
        }
    }
];