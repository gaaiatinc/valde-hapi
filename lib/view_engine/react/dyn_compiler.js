/**
 * Created by aismael on 12/24/2015.
 */

"use strict";

let path = require("path"),
    Q = require("q"),
    appConfig = require("../../app_config").getConfig(),
    appUtils = require("../../app_utils"),
    appConstants = require("../../app_constants"),
    fs = require("fs");

let resolverRoot = path.resolve(__dirname);

let webpack = require("webpack");


let staticResourcesFolder = appConfig.get("platform:static_resources_path") || appConstants.APP_DEFAULT_STATIC_RESOURCES_PATH;
staticResourcesFolder = path.resolve(path.posix.join(staticResourcesFolder, "/js"));


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

    /**
     * loadintg the browser pilot code which will re-attach the react elements previously rendered on the server.
     * @type {browserBanner|exports|module.exports}
     */
    let bannerCode = require("./browser_pilot");

    /**
     *
     * @returns {*}
     * @private
     */
    function __createStaticResourceFolder() {
        return appUtils.mkdirp(staticResourcesFolder, entityRelativePath);
        //if (!forServerSide) {
        //    return appUtils.mkdirp(staticResourcesFolder, entityRelativePath);
        //} else {
        //    return Q();
        //}
    }

    let targetCompilerPath = path.join(staticResourcesFolder, entityRelativePath);
    //let targetCompilerPath = path.join(resolverRoot, entityRelativePath);
    //if (!forServerSide) {
    //    targetCompilerPath = path.join(staticResourcesFolder, entityRelativePath);
    //}

    /**
     *
     * @returns {*}
     * @private
     */
    function __actualCompileTask() {
        return Q.Promise((resolve, reject) => {
                publicPath = publicPath || "./assetsDir";

                let appMainFolder = path.resolve(path.dirname(require.main.filename));

                // returns a Compiler config instance
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
                        publicPath: publicPath,
                        libraryTarget: forServerSide ? "commonjs2" : "var",
                        library: "PageBundle"
                    },

                    externals: {
                        //don"t bundle the following npm module packages within our bundle page.js
                        //but get them from global variables
                        "react": forServerSide ? "react" : "React",
                        "react-dom": forServerSide ? "react-dom" : "ReactDOM",
                        "react-dom/server": forServerSide ? "react-dom/server" : "ReactDOMServer"
                    },

                    resolve: {
                        root: [
                            path.join(appMainFolder, "node_modules"),
                            resolverRoot
                        ],
                        extensions: ["", ".js", ".jsx"]
                    },
                    resolveLoader: {
                        root: [
                            path.join(appMainFolder, "node_modules")
                        ]
                    },

                    module: {
                        loaders: [{
                            test: /\.jsx?$/,
                            loader: "babel",
                            exclude: /(node_modules|bower_components)/,

                            // "include" is commonly used to match the directories
                            include: [
                                "./browser_pilot",
                                path.join(resolverRoot, entityRelativePath),
                                path.join(resolverRoot, entityRelativePath, "resources", "jsx_components"),
                                path.join(resolverRoot, "resources", "jsx_components")
                            ],

                            query: {
                                presets: [
                                    require.resolve("babel-preset-es2015"),
                                    require.resolve("babel-preset-react")
                                ],
                                cacheDirectory: false,
                                plugins: [require.resolve("babel-plugin-transform-runtime")]
                            }
                        }]
                    },

                    plugins: [
                        new webpack.BannerPlugin(bannerCode, {raw: true, entryOnly: true})
                    ]
                };

                let compiler = webpack(webpackConfig);
                compiler.run((err, stats) => {
                    // ...
                    if (err || (stats.compilation && (stats.compilation.errors.length > 0))) {
                        console.log(err);
                        console.log(stats.compilation.errors);
                        reject(new Error(stats.compilation.errors));
                    } else {
                        resolve();
                    }
                });
            }
        );
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
    getStaticResourceFolder: () => {
        return staticResourcesFolder
    }
};
