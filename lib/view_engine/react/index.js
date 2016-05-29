/**
 * Created by aismael on 3/12/2015.
 */

"use strict";

let path = require("path"),
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

        /**
         * In dev mode, the view caches will be flushed per invocation to
         * force re-compilation of relevant artifacts:
         */
        if ((appConfig.get("env:development") && (!appConfig.get("liveEmulation")))) {
            jsxArtifactCache.clear();
        }

        /**
         *
         * @param react_page_cache_entry
         * @private
         */
        function __getapp_element_descriptor(react_page_cache_entry) {

            let pageElemDescr = {
                app_element: null,
                app_class: null
            };

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

                react_page_cache_entry.compiledSource.runInContext(sandBox);
                let PageBundle = vm.runInContext("PageBundle;", sandBox);

                if (typeof PageBundle.default === "function") {

                    pageElemDescr.app_element = React.createElement(PageBundle.default, {
                        modelData: context
                    });

                    pageElemDescr.app_class = PageBundle.default;

                    return pageElemDescr;
                } else {
                    throw new Error("Could not instantiate the page react element!");
                }
            } catch (err) {
                logger.error(err);
                return null;
            }
        }

        /**
         *
         * @private
         */
        function __getReactPage() {
            return Q.nfcall(jsxArtifactCache.get, pageViewID);
        }

        /**
         *
         * @private
         */
        function __getIsomorphicTemplate(react_page_entry) {
            return Q.Promise((resolve, reject) => {
                let renderer;
                let render_template_element;

                let app_element_descr = __getapp_element_descriptor(react_page_entry);
                let markup_preamble = "";

                try {
                    let runMode = "production";
                    try {
                        runMode = context.runMode;
                    } catch (err) {}

                    let markup = (runMode !== "production") ? "<h1>React engine default markup!!</h1>" : "<h1></h1>";

                    if (context.renderEngineDirectives && context.renderEngineDirectives.staticRender) {
                        render_template_element = app_element_descr.app_element;
                    } else {
                        renderer = require("./isomorphic_template");

                        if (typeof renderer.default === "function") {
                            let isomorphic_props = {
                                app_element: app_element_descr.app_element,
                                body_class_name: "",
                                filter_model_data: (typeof app_element_descr.app_class.filterModelData === "function") ? app_element_descr.app_class.filterModelData : function (modelData) {
                                    return {};
                                },
                                assets: {
                                    styles: [
                                        react_page_entry.globalCSSHashFileNameDescriptor,
                                        react_page_entry.pageCSSHashFileNameDescriptor
                                    ],
                                    javascript: []
                                },
                                app_script_url: react_page_entry.resourceHashFileNameDescriptor,
                                body_end_element: null,
                                header_tags: [],
                                modelData: context
                            };

                            if (typeof app_element_descr.app_class.getExternalAssetsDescriptor === "function") {
                                try {
                                    let app_assets = app_element_descr.app_class.getExternalAssetsDescriptor(context);
                                    isomorphic_props.assets.styles = isomorphic_props.assets.styles.concat(app_assets.styles);
                                    isomorphic_props.assets.javascript = isomorphic_props.assets.javascript.concat(app_assets.javascript);
                                } catch (err) {
                                    logger.warn("Application's getExternalAssetsDescriptor caused an error: " + err);
                                }
                            }

                            if (typeof app_element_descr.app_class.getBodyEndElement === "function") {
                                try {
                                    isomorphic_props.body_end_element = React.createElement(app_element_descr.app_class.getBodyEndElement(), {
                                        modelData: context
                                    });
                                } catch (err) {
                                    logger.warn("Application's getBodyEndElement caused an error: " + err);
                                }
                            }

                            if (typeof app_element_descr.app_class.getHeaderTags === "function") {
                                try {
                                    isomorphic_props.header_tags = app_element_descr.app_class.getHeaderTags(context);
                                } catch (err) {
                                    logger.warn("Application's getHeaderTags caused an error: " + err);
                                }
                            }

                            if (typeof app_element_descr.app_class.getBodyClassName === "function") {
                                try {
                                    isomorphic_props.body_class_name = app_element_descr.app_class.getBodyClassName(context);
                                } catch (err) {
                                    logger.warn("Application's getBodyClassName caused an error: " + err);
                                }
                            }

                            render_template_element = React.createElement(renderer.default, isomorphic_props);
                            markup_preamble = "<!doctype html>\n";
                        }
                    }
                    markup = markup_preamble + ReactDOMServer.renderToStaticMarkup(render_template_element);
                    resolve(markup);
                } catch (err) {
                    logger.error(">>>>> ", err.stack);
                    return reject(err);
                }
            });
        }

        let renderTaskArray = [__getReactPage, __getIsomorphicTemplate];

        renderTaskArray.reduce(Q.when, Q())
            .then(
                (markup) => {
                    callback(null, markup);
                },
                (err) => {
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
