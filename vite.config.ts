//-- NodeJS
import path from 'node:path';

//-- NPM Packages
import {defineConfig} from 'vitest/config';

export default defineConfig({
    test: {
        projects: [
            path.resolve(import.meta.dirname, './app/vite.config.ts'),
            path.resolve(
                import.meta.dirname,
                './packages/common/vite.config.ts'
            ),
            path.resolve(
                import.meta.dirname,
                './packages/logging/vite.config.ts'
            )
        ],
        coverage: {
            enabled: true,
            all: true,
            provider: 'istanbul',
            reporter: ['text'],
            exclude: [
                'scripts/**',
                'templates/**',
                'coverage/**',
                '**/dist/**',
                '**/[.]**',
                'packages/*/test?(s)/**',
                '**/*.d.ts',
                '**/virtual:*',
                '**/__x00__*',
                '**/\x00*',
                'cypress/**',
                'test?(s)/**',
                'test?(-*).?(c|m)[jt]s?(x)',
                '**/*{.,-}{test,spec}?(-d).?(c|m)[jt]s?(x)',
                '**/__tests__/**',
                '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
                '**/vitest.{workspace,projects}.[jt]s?(on)',
                '**/.{eslint,mocha,prettier}rc.{?(c|m)js,yml}'
            ]
        },
        passWithNoTests: true,
        reporters: 'default'
    }
});
