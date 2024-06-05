//-- NPM Packages
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
    {
        extends: [eslint.configs.recommended, ...tseslint.configs.recommendedTypeChecked, prettierPlugin],
        files: ['**/*.ts'],
        ignores: ['**/dist/**'],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname
            }
        }
    },
    {
        files: ['**/tests/**/*.ts'],
        rules: {
            '@typescript-eslint/no-unused-expressions': 'off'
        }
    }
);
