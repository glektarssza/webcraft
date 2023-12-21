declare module 'pug-plugin' {
    import {AssetInfo, Compilation, Compiler, PathData} from 'webpack';
    /**
     * A callback for post-processing resources.
     *
     * @param content - The content of the resource being post-processed.
     * @param resourceInfo - The resource information of the asset being
     * post-processed.
     * @param compilation - The Webpack compilation instance.
     *
     * @returns The post-processed version of the resource content or `null` to
     * perform no post-processing.
     */
    type PostprocessCallback = (
        content: string,
        resourceInfo: ResourceInfo,
        compilation: Compilation
    ) => string | null;

    /**
     * A callback for transforming the name of a file.
     *
     * @param pathData - The information about the path to be transformed.
     * @param assetInfo - The information about the asset the path represents.
     *
     * @returns A transformed file name.
     */
    type FilenameCallback = (
        pathData: PathData,
        assetInfo: AssetInfo
    ) => string;

    /**
     * Information about a resource being processed.
     */
    interface ResourceInfo {
        /**
         * Is verbose logging enabled?
         */
        verbose: boolean;

        /**
         * Is this resource an entry point?
         */
        isEntry: boolean;

        /**
         * The absolute path to the source file being processed.
         */
        sourceFile: string;

        /**
         * The absolute path to the output directory.
         */
        outputPath: string;

        /**
         * The name of the processed resource, relative to the output path.
         */
        assetFile: string;

        /**
         * The file name template or function.
         */
        filename: string | FilenameCallback;
    }

    /**
     * Options for configuring a resource module.
     */
    interface ModuleOptions {
        /**
         * Is this module enabled?
         */
        enabled?: boolean;

        /**
         * Should this module produce verbose logging?
         */
        verbose?: boolean;

        /**
         * A regular expression to use to match resources that should be
         * processed by this module.
         */
        test?: RegExp;

        /**
         * The absolute path to the source file being processed.
         */
        sourcePath?: string;

        /**
         * The absolute path to the output directory.
         */
        outputPath?: string;

        /**
         * The file name template or function.
         */
        filename?: string | FilenameCallback;

        /**
         * A callback to use to post-process resources.
         */
        postprocess?: PostprocessCallback;
    }

    /**
     * General plugin options.
     */
    interface PluginOptions {
        /**
         * Is the plugin enabled?
         */
        enabled?: boolean;

        /**
         * Should the plugin produce verbose logging?
         */
        verbose?: boolean;

        /**
         * Should the plugin produce pretty-printed output?
         */
        pretty?: boolean;

        /**
         * Whether to allow the plugin to extract comments into a separate file.
         */
        extractComments?: boolean;

        /**
         * A regular expression to use to match resources that should be
         * processed by the plugin.
         */
        test?: RegExp;

        /**
         * The absolute path to the source file being processed.
         */
        sourcePath?: string;

        /**
         * The absolute path to the output directory.
         */
        outputPath?: string;

        /**
         * The file name template or function.
         */
        filename?: string | FilenameCallback;

        /**
         * An array of modules to use to process resources.
         */
        modules?: ModuleOptions[];

        /**
         * Options for processing stylesheet resources.
         */
        css?: ModuleOptions;

        /**
         * Options for processing JavaScript resources.
         */
        js?: ModuleOptions;

        /**
         * A callback to use to post-process resources.
         */
        postprocess?: PostprocessCallback;
    }

    /**
     * The main plugin.
     */
    class PugPlugin {
        /**
         * The loader to use.
         */
        static loader: string;

        /**
         * Create a new instance.
         *
         * @param options - The options to use.
         */
        constructor(options?: PluginOptions);

        /**
         * Apply the plugin to a Webpack compiler.
         *
         * @param compiler - The Webpack compiler to apply the plugin to.
         */
        apply(compiler: Compiler): void;
    }

    export = PugPlugin;
}
