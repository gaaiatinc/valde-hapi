/**
 * Created by aismael on 3/12/2015.
 */


"use strict";


var path = require("path"),
    appConfig = require("../../app_config").getConfig(),
    vm = require("vm"),
    util = require("util"),
    jsxArtifactCache = require("./jsx_artifact_cache");


//var appRoot = path.posix.resolve(".");
var loggerFactory = require("../../app_logger");
var logger = loggerFactory.getLogger("ReactViewEngine", (appConfig.get("env:production") || appConfig.get("env:sandbox")) ? "WARN" : "DEBUG");

/**
 *
 * @param template
 * @param compileOpts
 * @param next
 * @returns {*}
 */
function compile(template, compileOpts, next) {

    return next(null, function render(context, renderOpts, callback) {
        let templateID = context.metaData.template_id;
        let pageViewID = context.pageViewID;

        if (!templateID || !pageViewID) {
            return callback(new Error("no template_id or pageViewID in metadata!!"));
        }


        jsxArtifactCache.get(
            pageViewID,
            function (err, jsxCacheEntry) {
                if (err) {
                    if (err) {
                        logger.error(err.stack);
                        callback(err, "");
                    }
                } else {
                    jsxArtifactCache.get(
                        templateID,
                        function (err, jsxCacheEntry) {
                            if (err) {
                                if (err) {
                                    logger.error(err.stack);
                                    callback(err, "");
                                }
                            } else {

                                let tempCtx = {
                                    module: module,
                                    require: require,
                                    modelData: context,
                                    entityRelativePath: context.pageViewID,
                                    __valde_hapi_jsx_renderer__: function (viewId, context) {
                                        return "<h1></h1>";
                                    }
                                };
                                let sandBox = vm.createContext(tempCtx);
                                let renderer = jsxCacheEntry.compiledSource.runInContext(sandBox);
                                tempCtx.__valde_hapi_jsx_renderer__ = renderer.renderTemplate;

                                let muckHtml = vm.runInContext("__valde_hapi_jsx_renderer__(entityRelativePath,  modelData);", tempCtx);
                                callback(null, renderer.renderTemplate(context.pageViewID, context));
                            }

                        });
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