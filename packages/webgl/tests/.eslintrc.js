module.exports = {
    extends: '../.eslintrc.js',
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json']
    },
    rules: {
        '@typescript-eslint/unbound-method': 'off'
    }
};
