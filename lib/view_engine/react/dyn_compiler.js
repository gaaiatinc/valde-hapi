/**
 * Created by aismael on 12/24/2015.
 */

"use strict";

let path = require("path"),
    Q = require("q"),
    app_config = require("../../app_config").get_config(),
    app_utils = require("../../app_utils"),
    appConstants = require("../../app_constants"),
    fs = require("fs");

let logger_factory = require("../../app_logger");
let logger = logger_factory.getLogger("DynJSXCompiler", (app_config.get("env:production") || app_config.get("env:sandbox")) ? "WARN" : "DEBUG");

let resolverRoot = path.resolve(__dirname);

let webpack = require("webpack");

let staticResourcesRootFolder = app_config.get("platform:static_resources_path") || appConstants.APP_DEFAULT_STATIC_RESOURCES_PATH;
let staticJsResourcesFolder = path.resolve(path.posix.join(staticResourcesRootFolder, "/js"));
let staticCssResourcesFolder = path.resolve(path.posix.join(staticResourcesRootFolder, "/css"));

/**
 *
 */
function __init(newLibraryRoot) {

    resolverRoot = path.resolve(newLibraryRoot);
}

/**
 *
 */
function __compileJSXEntity(entityRelativePath, entityName, forServerSide, publicPath) {

    let bannerCode = "/* Generated code for react page */";

    /**
     *
     * @returns {*}
     * @private
     */
    function __createStaticResourceFolder() {
        return app_utils.mkdirp(staticJsResourcesFolder, entityRelativePath);
    }

    let targetCompilerPath = path.join(staticJsResourcesFolder, entityRelativePath);

    /**
     *
     * @returns {*}
     * @private
     */
    function __actualCompileTask() {
        return Q.Promise((resolve, reject) => {
            publicPath = publicPath || "./assetsDir";

            // a Compiler config instance
            let webpackConfig = {
                // configuration
                // The configuration for the server-side rendering
                context: resolverRoot,
                name: "dynamic server-side jsx compiler",
                entry: path.relative(resolverRoot, path.join(resolverRoot, entityRelativePath, entityName + ".jsx")),
                target: forServerSide ? "node" : "web",

                output: {
                    path: targetCompilerPath,
                    filename: entityName + ".js",
                    publicPath: staticResourcesRootFolder,
                    libraryTarget: forServerSide ? "commonjs2" : "var",
                    library: "PageBundle"
                },

                externals: {
                    //don"t bundle the following npm module packages within our bundle page.js
                    //but get them from global variables
                    "react": forServerSide ? "React" : "React",
                    "react-dom": forServerSide ? "ReactDOM" : "ReactDOM",
                    "react-dom/server": forServerSide ? "ReactDOMServer" : "ReactDOMServer"
                },

                resolve: {
                    root: [
                        path.join(app_config.get("application_root_folder"), "node_modules"),
                        resolverRoot
                    ],
                    extensions: ["", ".js", ".jsx"]
                },
                resolveLoader: {
                    root: [
                        path.join(app_config.get("application_root_folder"), "node_modules")
                    ]
                },

                module: {
                    loaders: [{
                        test: /\.jsx?$/,
                        loader: "babel",
                        exclude: /(node_modules|bower_components)/,

                        // "include" is commonly used to match the directories
                        include: [path.join(resolverRoot, entityRelativePath),
                            resolverRoot
                        ],

                        query: {
                            presets: [require.resolve("babel-preset-es2015"),
                                require.resolve("babel-preset-react")
                            ],
                            cacheDirectory: false,
                            plugins: [require.resolve("babel-plugin-transform-runtime")]
                        }
                    }, {
                        test: /\.json$/,
                        loader: "json",
                        exclude: /(node_modules|bower_components)/,

                        // "include" is commonly used to match the directories
                        include: [
                            path.join(resolverRoot, entityRelativePath),
                            path.join(resolverRoot, entityRelativePath, "resources", "jsx_components"),
                            path.join(resolverRoot, "resources", "jsx_components")
                        ]
                    }]
                },

                plugins: [
                    new webpack.BannerPlugin(bannerCode, {
                        raw: true,
                        entryOnly: true
                    }),
                    new webpack.optimize.UglifyJsPlugin({
                        minimize: true,
                        compress: {
                            warnings: false
                        }
                    })
                ]
            };

            let compiler = webpack(webpackConfig);
            compiler.run((err, stats) => {
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

                return resolve(stats.compilation.fileDependencies);
            });
        });
    }

    let allCompileTasks = [__createStaticResourceFolder, __actualCompileTask];

    return allCompileTasks.reduce(Q.when, Q());
}

/**
 *
 */
module.exports = {
    init: __init,
    compileJSXEntity: __compileJSXEntity,
    getStaticJsResourceFolder: () => {
        return staticJsResourcesFolder;
    },
    getStaticCssResourceFolder: () => {
        return staticCssResourcesFolder;
    }

};
