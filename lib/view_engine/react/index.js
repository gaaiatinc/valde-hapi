/**
 * Created by aismael on 3/12/2015.
 */

"use strict";

let path = require("path"),
    appConfig = require("../../app_config").getConfig(),
    vm = require("vm"),
    React = require("react"),
    ReactDOM = require("react-dom"),
    ReactDOMServer = require("react-dom/server"),
    util = require("util"),
    jsxArtifactCache = require("./jsx_artifact_cache");

//let appRoot = path.posix.resolve(".");
let loggerFactory = require("../../app_logger");
let logger = loggerFactory.getLogger("ReactViewEngine", (appConfig.get("env:production") || appConfig.get("env:sandbox")) ? "WARN" : "DEBUG");

/**
 *
 * @param template
 * @param compileOpts
 * @param next
 * @returns {*}
 */
function compile(template, compileOpts, next) {

    return next(null, (context, renderOpts, callback) => {
        let templateID = context.metaData.template_id;
        let pageViewID = context.pageViewID;

        if (!templateID || !pageViewID) {
            return callback(new Error("no template_id or pageViewID in metadata!!"));
        }

        jsxArtifactCache.get(
            pageViewID,
            (err, jsxCacheEntry) => {
                if (err) {
                    if (err) {
                        logger.error(err.stack);
                        callback(err, "");
                    }
                } else {
                    let muckHtml = "<h1></h1>";
                    try {
                        let tempCtx = {
                            module: module,
                            console: console,
                            React: React,
                            ReactDOM: ReactDOM,
                            ReactDOMServer: ReactDOMServer,
                            require: require,
                            modelData: context
                        };
                        let sandBox = vm.createContext(tempCtx);

                        jsxCacheEntry.compiledSource.runInContext(sandBox);
                        let renderer = vm.runInContext("PageBundle;", sandBox);
                        //let renderer = jsxCacheEntry.compiledSource.runInContext(sandBox);

                        if (typeof renderer.default === "function") {
                            let temp01 = React.createElement(renderer.default, {
                                modelData: context
                            });

                            muckHtml = ReactDOMServer.renderToString(temp01);
                        }
                    } catch (err) {
                        logger.error(err.stack);
                    }
                    callback(null, muckHtml);
                }
            });
    });
}

/**
 *
 * @param config
 * @param next
 */
function prepare(config, next) {
    next();
}

/**
 *
 * @type {{compile: compile, prepare: prepare, registerPartial: registerPartial, registerHelper: registerHelper}}
 */
module.exports = {
    compile: compile,
    prepare: prepare
};
