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
                            path.join(resolverRoot, entityRelativePath),
                            resolverRoot
                        ],
                        extensions: ["", ".js", ".jsx"]
                    },

                    module: {
                        loaders: [{
                            test: /\.jsx$|\.js$/,
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
                                presets: ["react", "es2015"],
                                cacheDirectory: false,
                                plugins: ["transform-runtime"]
                            }
                        }]
                    },

                    plugins: [
                        new webpack.BannerPlugin(bannerCode, {raw: true, entryOnly: true})
                    ]
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
    compileJSXEntity: __compileJSXEntity,
    getStaticResourceFolder: () => {
        return staticResourcesFolder
    }
};
