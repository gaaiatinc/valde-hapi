/**
 * Created by aismael on 3/12/2015.
 */


"use strict";


var path = require("path")
    , appConfig = require("app_config").getConfig()
    , dustArtifactCache = require("./dust_artifact_cache")
    , dust = require("dustjs-linkedin");


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
        function (err, dustArtifact) {
            if (err) {
                next(err, "");
            } else {
                dust.loadSource(dustArtifact.compiledSource);
                next(undefined, "");
            }
        }
    );
};

var appRoot = path.resolve(".");
var loggerFactory = require("app_logger");
var logger = loggerFactory.getLogger("ViewEngine", (appConfig.get("env:production") || appConfig.get("env:sandbox")) ? "WARN" : "DEBUG");

/**
 *
 * @param template
 * @param compileOpts
 * @returns {Function}
 */
var compile = function compile(template, compileOpts, next) {

    //return next(null, function render(context, renderOpts) {
    //    return "<h1> Hello HAPI view engine </h1>";
    //});

    //var compiled = dust.compileFn(template, compileOpts && compileOpts.name);
    //
    //process.nextTick(function() {
    //    next(null, function(context, compileOpts, callback) {
    //        compiled(context, callback);
    //    })
    //});

    return next(null, function render(context, renderOpts, callback) {
        dustArtifactCache.get(
            context.pageViewID,
            function (err, dustArtifact) {
                if (err) {
                    if (err) {
                        logger.error(err.stack);
                        callback(err, "");
                    }
                } else {
                    dust.render(
                        dustArtifact.partialID,
                        context,
                        function (err, htmlOut) {
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

};


module.exports = {
    compile: compile
};