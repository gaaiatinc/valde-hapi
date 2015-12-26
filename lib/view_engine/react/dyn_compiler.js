/**
 * Created by aismael on 12/24/2015.
 */

"use strict";

var path = require("path"),
    Q = require("q"),
    fs = require("fs");

var resolverRoot = path.resolve(__dirname);

var webpack = require("webpack");


/**
 *
 */
function __init(newLibraryRoot) {

    resolverRoot = path.resolve(newLibraryRoot);

    console.log("resolverRoot:", resolverRoot);

}


/**
 *
 */
function __compileJSXEntity(entityRelativePath, entityName, forServerSide, publicPath) {

    return Q.Promise(function (resolve, reject) {
        publicPath = publicPath || "./assetsDir";

        // returns a Compiler instance
        let webpackConfig = {
            // configuration
            // The configuration for the server-side rendering
            name: "dynamic server-side jsx compiler",
            entry: path.resolve(resolverRoot, entityRelativePath, entityName + ".jsx"),
            target: forServerSide ? "node" : "web",

            output: {
                path: path.resolve(resolverRoot, entityRelativePath),
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
                    path.resolve(resolverRoot, entityRelativePath),
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
                        path.resolve(resolverRoot, entityRelativePath),
                        path.resolve(resolverRoot, entityRelativePath, "resources", "jsx_components"),
                        path.resolve(resolverRoot, "resources", "jsx_components")
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
            // console.log(stats.toJson());
            // console.log("\n\n\n", stats);

            if (err || (stats.compilation && (stats.compilation.errors.length > 0))) {
                console.log(err);
                console.log(stats.compilation.errors);
                reject(new Error(stats.compilation.errors));
            } else {
                resolve();
            }
        });
    });
}


/**
 *
 */
module.exports = {
    init: __init,
    compileJSXEntity: __compileJSXEntity
};
