/**
 * Created by aismael on 3/12/2015.
 */

"use strict";

let path = require("path"),
    fs = require("fs"),
    appConfig = require("../../app_config").getConfig(),
    vm = require("vm"),
    Q = require("q"),
    React = require("react"),
    ReactDOM = require("react-dom"),
    ReactDOMServer = require("react-dom/server"),
    util = require("util"),
    jsxArtifactCache = require("./jsx_artifact_cache");

//let appRoot = path.posix.resolve(".");
let loggerFactory = require("../../app_logger");
let logger = loggerFactory.getLogger("ReactViewEngine", (appConfig.get("env:production") || appConfig.get("env:sandbox")) ? "WARN" : "DEBUG");

let render_react_script = null;

/**
 *
 * @private
 */
function __getReactPage(processingContext) {
    return Q.Promise((resolve, reject) => {
        Q.nfcall(jsxArtifactCache.get, processingContext.context.pageViewID)
            .then((react_page_entry) => {
                processingContext.react_page_entry = react_page_entry;
                resolve(processingContext);
            }, reject);
    });
}

/**
 *
 * @private
 */
function __performIsomorphicRendering(processingContext) {
    return Q.Promise((resolve, reject) => {

        let render_template_element;
        let renderContext;

        let runMode = "production";
        try {
            runMode = processingContext.context.runMode;
        } catch (err) {}

        let markup = (runMode !== "production") ? "<h1>React engine default markup!!</h1>" : "<h1></h1>";

        try {
            renderContext = vm.createContext({
                page_css_assets: [
                    processingContext.react_page_entry.globalCSSHashFileNameDescriptor,
                    processingContext.react_page_entry.pageCSSHashFileNameDescriptor
                ],
                app_script_url: processingContext.react_page_entry.resourceHashFileNameDescriptor,
                isomorphic_template: require("./isomorphic_template"),
                modelData: processingContext.context,
                React: React,
                ReactDOM: ReactDOM,
                ReactDOMServer: ReactDOMServer
            });

            processingContext.react_page_entry.compiledSource.runInContext(renderContext);

            vm.runInContext(render_react_script, renderContext);
            markup = vm.runInContext("perform_react_render(page_css_assets,  app_script_url, isomorphic_template, modelData);", renderContext);

            resolve(markup);
        } catch (err) {
            logger.error(">>>>> ", err.stack);
            return reject(err);
        } finally {
            renderContext.PageBundle = null;
            renderContext.page_css_assets = null;
            renderContext.app_script_url = null;
            renderContext.isomorphic_template = null;
            renderContext.modelData = null;
            renderContext.React = null;
            renderContext.ReactDOM = null;
            renderContext.ReactDOMServer = null;
        }
    });
}

/**
 *
 * @param template
 * @param compileOpts
 * @param next
 * @returns {*}
 */
function compile(template, compileOpts, next) {

    return next(null, (context, renderOpts, callback) => {

        /**
         * In dev mode, the view caches will be flushed per invocation to
         * force re-compilation of relevant artifacts:
         */
        if ((appConfig.get("env:development") && (!appConfig.get("liveEmulation")))) {
            jsxArtifactCache.clear();
        }

        context = context || {};

        let processingContext = {
            context: context
        };
        let renderTaskArray = [__getReactPage, __performIsomorphicRendering];

        renderTaskArray.reduce(Q.when, Q(processingContext))
            .then((markup) => {
                processingContext.context = null;
                processingContext.react_page_entry = null;
                callback(null, markup);
            }, (err) => {
                processingContext.context = null;
                processingContext.react_page_entry = null;
                logger.error(">>>>> ", err.stack);
                callback(null, "");
            });
    });
}

/**
 *
 * @param config
 * @param next
 */
function prepare(config, next) {
    if (render_react_script) {
        return next();
    } else {
        Q.Promise((resolve, reject) => {
            Q.nfcall(
                    fs.readFile, path.join(__dirname, "render_react_script.js"), {
                        encoding: "utf8"
                    })
                .then((render_react_script_source) => {
                    render_react_script = render_react_script_source;
                    return next();
                }, next);
        });
    }
}

/**
 *
 * @type {Object}
 */
module.exports = {
    compile,
    prepare
};
