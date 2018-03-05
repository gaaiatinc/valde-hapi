/**
 * Created by aismael on 12/24/2015.
 */

"use strict";

const LRUCache = require("lru-cache-js"),
    path = require("path"),
    fs = require("fs"),
    app_config = require("../../app_config").get_config(),
    app_utils = require("../../app_utils"),
    MemoryFS = require("memory-fs"),
    appConstants = require("../../app_constants");

const {promiseSequencer} = require("../../app_utils");

const logger_factory = require("../../app_logger");
const logger = logger_factory.getLogger(
    "DynJSXCompiler", (app_config.get("env:production") || app_config.get("env:sandbox"))
    ? "WARN"
    : "DEBUG");

let resolverRoot = path.resolve(__dirname);

const webpack = require("webpack");

let staticResourcesRootFolder = app_config.get("platform:static_resources_path") || appConstants.APP_DEFAULT_STATIC_RESOURCES_PATH;
let staticJsResourcesFolder = path.resolve(path.posix.join(staticResourcesRootFolder, "/js"));
let staticCssResourcesFolder = path.resolve(path.posix.join(staticResourcesRootFolder, "/css"));

////////////////////////////////////////////////////////////////////////////////
///  uber compiler cache
///
/**
 *
 * @param evictedEntry
 */
const evictionNotifyCallback = (evictedEntry) => {
    /**
     * if the LRU cache starts to fill up and evict elements.
     */

    logger.info("evicting:" + evictedEntry.toString());
};

const uber_compilers_cache = new LRUCache(12, evictionNotifyCallback);

const create_uber_cache_entry = (entityRelativePath, entityName, forServerSide) => {
    let entry_path = path.relative(resolverRoot, path.join(resolverRoot, entityRelativePath, entityName + ".jsx"));
    let targetCompilerPath = path.join(staticJsResourcesFolder, entityRelativePath);

    // a Compiler config instance
    let webpackConfig = {
        // configuration
        // The configuration for the server-side rendering
        context: resolverRoot,
        name: "dynamic server-side jsx compiler",
        entry: entry_path,
        target: forServerSide
            ? "node"
            : "web",

        mode: "production",
        output: {
            path: targetCompilerPath,
            filename: entityName + ".js",
            publicPath: staticResourcesRootFolder,
            libraryTarget: forServerSide
                ? "commonjs2"
                : "var",
            library: "PageBundle"
        },

        externals: {
            //don"t bundle the following npm module packages within our bundle page.js
            //but get them from global variables
            "react": forServerSide
                ? "React"
                : "React",
            "react-dom": forServerSide
                ? "ReactDOM"
                : "ReactDOM",
            "react-dom/server": forServerSide
                ? "ReactDOMServer"
                : "ReactDOMServer"
        },

        resolve: {
            modules: [
                path.join(app_config.get("application_root_folder"), "node_modules"),
                resolverRoot,
                path.join(resolverRoot, "node_modules")
            ],
            extensions: [".js", ".jsx"]
        },
        resolveLoader: {
            modules: [path.join(app_config.get("application_root_folder"), "node_modules")]
        },

        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /(node_modules|bower_components)/,

                    // "include" is commonly used to match the directories
                    include: [
                        path.join(resolverRoot, entityRelativePath),
                        path.join(resolverRoot, entityRelativePath, "resources"),
                        path.join(resolverRoot, "resources"),
                        resolverRoot
                    ],

                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                "env", "react"
                            ],
                            comments: false,
                            cacheDirectory: true,
                            plugins: [require.resolve("babel-plugin-transform-runtime")]
                        }
                    }
                }
            ]
        },

        plugins: [new webpack.DefinePlugin({
                "process.env": {
                    "NODE_ENV": JSON.stringify("production")
                }
            })]
    };
    let uber_compiler = {};
    uber_compiler.compiler = webpack(webpackConfig);
    uber_compiler.fs = new MemoryFS();
    uber_compiler.compiler.outputFileSystem = uber_compiler.fs;

    return uber_compiler;
};

const get_uber_compiler = (entityRelativePath, entityName, forServerSide) => {
    let entry_path = path.relative(resolverRoot, path.join(resolverRoot, entityRelativePath, entityName + ".jsx"));

    let uber_compiler = uber_compilers_cache.get(entry_path);

    if (!uber_compiler) {
        uber_compiler = create_uber_cache_entry(entityRelativePath, entityName, forServerSide);
        uber_compilers_cache.put(entry_path, uber_compiler);
    }

    return uber_compiler;
};

////////////////////////////////////////////////////////////////////////////////
///   end uber compiler cache
///

/**
 *
 */
const init = (newLibraryRoot) => {
    resolverRoot = path.resolve(newLibraryRoot);
};

/**
 *
 */
const compileJSXEntity = (entityRelativePath, entityName, forServerSide) => {

    // let bannerCode = "/* Generated code for react page */";

    /**
     *
     * @returns {*}
     * @private
     */
    const __createStaticResourceFolder = () => {
        return app_utils.mkdirp(staticJsResourcesFolder, entityRelativePath);
    };

    let targetCompilerPath = path.join(staticJsResourcesFolder, entityRelativePath);

    /**
     *
     * @returns {*}
     * @private
     */
    const __actualCompileTask = () => {
        return new Promise((resolve, reject) => {
            let output_bundle_path = path.join(targetCompilerPath, entityName + ".js");

            let uber_compiler;
            try {
                uber_compiler = get_uber_compiler(entityRelativePath, entityName, forServerSide);
            } catch (err) {
                logger.error(err);
                return reject(err);
            }

            uber_compiler
                .compiler
                .run((err, stats) => {
                    // ...
                    if (err) {
                        logger.error(err);
                        return reject(err);
                    }

                    let jsonStats = stats.toJson();
                    if (jsonStats.warnings.length > 0) {
                        logger.warn(jsonStats.warnings);
                    }

                    if (jsonStats.errors.length > 0) {
                        logger.error(jsonStats.errors);
                        return reject(new Error("JSX compilation errors!"));
                    }

                    try {

                        let bundle_code = uber_compiler
                            .fs
                            .readFileSync(output_bundle_path, "utf8");

                        fs.writeFileSync(output_bundle_path, bundle_code, {encoding: "utf8"});

                        return resolve(stats.compilation.fileDependencies);
                    } catch (err) {
                        logger.error(err);
                        return reject(err);
                    }

                });
        });
    };

    const allCompileTasks = [__createStaticResourceFolder, __actualCompileTask];

    return promiseSequencer(allCompileTasks);
};

/**
 *
 */
module.exports = {
    init,
    compileJSXEntity,
    getStaticJsResourceFolder: () => {
        return staticJsResourcesFolder;
    },
    getStaticCssResourceFolder: () => {
        return staticCssResourcesFolder;
    }

};
