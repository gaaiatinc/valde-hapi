/**
 * Created by aismael on 3/12/2015.
 */


"use strict";


var path = require("path")
    , appConfig = require("../../app_config").getConfig()
    , jsxArtifactCache = require("./jsx_artifact_cache");


//var appRoot = path.resolve(".");
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
        jsxArtifactCache.get(
            context.pageViewID,
            function (err, jsxCacheEntry) {
                if (err) {
                    if (err) {
                        logger.error(err.stack);
                        callback(err, "");
                    }
                } else {

                    let muckHtml = "<h1>You got it!!!</h1>";
                    callback(err, muckHtml);
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