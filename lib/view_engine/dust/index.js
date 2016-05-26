/**
 * Created by aismael on 3/12/2015.
 */

"use strict";

let path = require("path"),
    appConfig = require("../../app_config").getConfig(),
    dustArtifactCache = require("./dust_artifact_cache"),
    dust = require("dustjs-linkedin");

// Load helpers
dust.helpers = require("dustjs-helpers").helpers;

// load APP helpers:
//require("../app_helpers");

dust.optimizers.format = function (ctx, node) {
    return node;
};

/**
 *
 * @param name
 * @param next
 */
dust.onLoad = function (name, next) {
    dustArtifactCache.get(
        name,
        (err, dustArtifact) => {
            if (err) {
                next(err, "");
            } else {
                dust.loadSource(dustArtifact.compiledSource);
                next(undefined, "");
            }
        }
    );
};

//let appRoot = path.resolve(".");
let loggerFactory = require("../../app_logger");
let logger = loggerFactory.getLogger("DustViewEngine", (appConfig.get("env:production") || appConfig.get("env:sandbox")) ? "WARN" : "DEBUG");

/**
 *
 * @param template
 * @param compileOpts
 * @param next
 * @returns {*}
 */
function compile(template, compileOpts, next) {

    return next(null, function render(context, renderOpts, callback) {
        dustArtifactCache.get(
            context.pageViewID,
            (err, dustArtifact) => {
                if (err) {
                    if (err) {
                        logger.error(err.stack);
                        callback(err, "");
                    }
                } else {
                    dust.render(
                        dustArtifact.partialID,
                        context,
                        (err, htmlOut) => {
                            if (err) {
                                logger.error(err.stack);
                            }

                            try {
                                callback(err, htmlOut);
                            } catch (err) {
                                logger.error(err.stack);
                            }
                        });
                }

            });
    });

}

/**
 *
 * @param name
 * @param data
 */
function registerPartial(name, data) {
    //dust.compileFn(data, name)
}

/**
 *
 */
function registerHelper(name, helper) {
    //if (helper.length > 1)
    //    dust.helpers[name] = helper
    //else
    //    dust.filters[name] = helper
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
    prepare: prepare,
    registerPartial: registerPartial,
    registerHelper: registerHelper
};
