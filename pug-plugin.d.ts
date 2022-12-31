declare module 'pug-plugin' {
    import {Compiler} from 'webpack';

    class PugPlugin {
        static loader: string;

        constructor(options: unknown);

        apply(compiler: Compiler): void;
    }

    export default PugPlugin;
}
