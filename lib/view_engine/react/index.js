/**
 * Created by aismael on 3/12/2015.
 */

"use strict";

const path = require("path"),
    fs = require("fs"),
    app_config = require("../../app_config").get_config(),
    vm = require("vm"),
    React = require("react"),
    ReactDOM = require("react-dom"),
    ReactDOMServer = require("react-dom/server"),
    jsxArtifactCache = require("./jsx_artifact_cache");

const {promiseSequencer} = require("../../app_utils");
const {promisify} = require("util");

//let appRoot = path.posix.resolve(".");
const logger_factory = require("../../app_logger");
const logger = logger_factory.getLogger("ReactViewEngine", (app_config.get("env:production") || app_config.get("env:sandbox"))
    ? "WARN"
    : "DEBUG");

let render_react_script = null;

/**
 *
 * @private
 */
const __getReactPage = (processingContext) => {
    return new Promise((resolve, reject) => {
        promisify(jsxArtifactCache.get)(processingContext.context.pageViewID).then((react_page_entry) => {
            processingContext.react_page_entry = react_page_entry;
            resolve(processingContext);
        }, reject);
    });
};

/**
 *
 * @private
 */
const __performIsomorphicRendering = (processingContext) => {
    return new Promise((resolve, reject) => {

        let renderContext;

        let run_mode = "production";
        try {
            run_mode = processingContext.context.run_mode;
        } catch (err) {
            //
        }

        let markup = (run_mode !== "production")
            ? "<h1>React engine default markup!!</h1>"
            : "<h1></h1>";

        try {
            renderContext = vm.createContext({
                window: undefined,
                page_css_assets: [
                    processingContext.react_page_entry.globalCSSHashFileNameDescriptor, processingContext.react_page_entry.pageCSSHashFileNameDescriptor
                ],
                app_script_url: processingContext.react_page_entry.resourceHashFileNameDescriptor,
                isomorphic_template: require("./isomorphic_template"),
                model: processingContext.context,
                React: React,
                ReactDOM: ReactDOM,
                ReactDOMServer: ReactDOMServer
            });

            processingContext.react_page_entry.compiledSource.runInContext(renderContext);

            vm.runInContext(render_react_script, renderContext);
            markup = vm.runInContext("perform_react_render(page_css_assets,  app_script_url, isomorphic_template, model);", renderContext);

            resolve(markup);
        } catch (err) {
            logger.error(`>>>>> ${err.stack}`);
            return reject(err);
        } finally {
            renderContext.PageBundle = null;
            renderContext.page_css_assets = null;
            renderContext.app_script_url = null;
            renderContext.isomorphic_template = null;
            renderContext.model = null;
            renderContext.React = null;
            renderContext.ReactDOM = null;
            renderContext.ReactDOMServer = null;
        }
    });
};

/**
 *
 * @param template
 * @param compileOpts
 * @param next
 * @returns {*}
 */
const compile = (template, compileOpts, next) => {

    return next(null, (context, renderOpts, callback) => {

        /**
         * In dev mode, the view caches will be flushed per invocation to
         * force re-compilation of relevant artifacts:
         */
        if ((app_config.get("env:development") && (!app_config.get("liveEmulation")))) {
            jsxArtifactCache.clear();
        }

        context = context || {};

        let processingContext = {
            context: context
        };
        let renderTaskArray = [__getReactPage, __performIsomorphicRendering];

        promiseSequencer(renderTaskArray, processingContext).then((markup) => {
            processingContext.context = null;
            processingContext.react_page_entry = null;
            callback(null, markup);
        }, (err) => {
            processingContext.context = null;
            processingContext.react_page_entry = null;
            logger.error(`>>>>> ${err.stack}`);
            callback(null, "");
        });
    });
};

/**
 *
 * @param config
 * @param next
 */
const prepare = (config, next) => {
    if (render_react_script) {
        return next();
    } else {
        promisify(fs.readFile)(path.join(__dirname, "render_react_script.js"), {encoding: "utf8"}).then((render_react_script_source) => {
            render_react_script = render_react_script_source;
            return next();
        }, next);
    }
};

/**
 *
 * @type {Object}
 */
module.exports = {
    compile,
    prepare
};
