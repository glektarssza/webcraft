declare module 'pug-plugin' {
    import {Compiler, RuleSetUseItem, WebpackPluginInstance} from 'webpack';
    export default class PugPlugin implements WebpackPluginInstance {
        static loader: RuleSetUseItem;
        constructor(options: unknown);
        apply(compiler: Compiler): void;
    }
}
