/**
 * Created by aismael on 12/24/2015.
 */

"use strict";

var path = require("path"),
    Q = require("q"),
    appConfig = require("../../app_config").getConfig(),
    appUtils = require("../../app_utils"),
    appConstants = require("../../app_constants"),
    fs = require("fs");

var resolverRoot = path.resolve(__dirname);

var webpack = require("webpack");


var staticResourcesFolder = appConfig.get("platform:static_resources_path") || appConstants.APP_DEFAULT_STATIC_RESOURCES_PATH;
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

    //logger.info("Creating static folder for: " + path.posix.basename(jsxFilePath, ".jsx") + " in " + compiledJSXStaticResourcePath);

    /**
     *
     * @returns {*}
     * @private
     */
    function __createStaticResourceFolder() {
        if (!forServerSide) {
            return appUtils.mkdirp(staticResourcesFolder, entityRelativePath);
        } else {
            return Q();
        }
    }

    let targetCompilerPath = path.join(resolverRoot, entityRelativePath);
    if (!forServerSide) {
        targetCompilerPath = path.join(staticResourcesFolder, entityRelativePath);
    }

    /**
     *
     * @returns {*}
     * @private
     */
    function __actualCompileTask() {
        return Q.Promise(function (resolve, reject) {
                publicPath = publicPath || "./assetsDir";

                // returns a Compiler instance
                let webpackConfig = {
                    // configuration
                    // The configuration for the server-side rendering
                    name: "dynamic server-side jsx compiler",
                    entry: path.join(resolverRoot, entityRelativePath, entityName + ".jsx"),
                    target: forServerSide ? "node" : "web",

                    output: {
                        path: targetCompilerPath,
                        filename: entityName + ".js",
                        publicPath: publicPath,
                        libraryTarget: forServerSide ? "commonjs2" : "var"
                    },

                    externals: {
                        //don"t bundle the "react" npm package with our bundle.js
                        //but get it from a global "React" variable
                        "react": forServerSide ? "react" : "React",
                        "react-dom": forServerSide ? "react-dom" : "ReactDOM",
                        "react-dom/server": forServerSide ? "react-dom/server" : "ReactDOMServer"
                    },

                    resolve: {
                        root: [
                            path.join(resolverRoot, entityRelativePath),
                            resolverRoot
                        ],
                        extensions: ["", ".js", ".jsx"]
                    },

                    module: {
                        loaders: [{
                            test: /\.jsx$/,
                            loader: "babel",
                            exclude: /(node_modules|bower_components)/,

                            // "include" is commonly used to match the directories
                            include: [
                                path.join(resolverRoot, entityRelativePath),
                                path.join(resolverRoot, entityRelativePath, "resources", "jsx_components"),
                                path.join(resolverRoot, "resources", "jsx_components")
                            ],

                            query: {
                                presets: ["react", "es2015"],
                                cacheDirectory: false,
                                plugins: ["transform-runtime"]
                            }
                        }]
                    }
                };

                let compiler = webpack(webpackConfig);
                compiler.run(function (err, stats) {
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
    compileJSXEntity: __compileJSXEntity
};
