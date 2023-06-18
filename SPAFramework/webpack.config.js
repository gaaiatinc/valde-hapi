const {resolve} = require("path");
const webpack = require("webpack");

var libraryName = "SPAFramework";
var outputFile = libraryName + ".js";

module.exports = {
    // configuration
    mode: "production",
    name: "jsx_bundling",
    entry: {
        libFacade: resolve(__dirname, "./lib/SPAFramework")
    },
    output: {
        path: resolve(__dirname),
        filename: outputFile,
        library: libraryName,
        libraryTarget: "umd",
        umdNamedDefine: true
    },
    context: resolve(__dirname),

    externals: {
        //don"t bundle the following npm module packages within our bundle page.js
        //but get them from global variables
        "react": "React",
        "react-dom": "ReactDOM",
        "react-dom/server": "ReactDOMServer"
    },
    resolve: {
        // modules: [
        //     resolve(__dirname, "app"),
        //     resolve(__dirname, "node_modules")
        // ],
        // alias: {
        //   "react": resolve("/node_modules/react"),
        //   "react-dom":resolve("/node_modules/react-dom"),
        // },
        // ALIAS are no more valid in Webpack 2, remove them.

        // modules: [//path.resolve(__dirname, "node_modules")
        //      path.join(app_config.get("application_root_folder"), "node_modules"),
        //      path.path.resolve("./node_modules"),
        //      path.path.resolve("./lib")
        // ],
        extensions: [".js", ".jsx"]
    },

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                // exclude: /(node_modules|bower_components)/,
                // "include" is commonly used to match the directories
                // include: [
                //     path.resolve(__dirname),
                //      path.join(path.resolverRoot, entityRelativePath, "resources"),
                //      path.join(path.resolverRoot, "resources"),
                //      path.resolverRoot
                // ],
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-env", "@babel/preset-react"]
                        }
                    }
                ]
            }
        ]
    },
    plugins: [new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify("production")
            }
        })]
};
// config
//     .plugins
//     .push(new webpack.optimize.xxxx({
//         compressor: {
//             screw_ie8: true,
//             warnings: false
//         }
//     }));
