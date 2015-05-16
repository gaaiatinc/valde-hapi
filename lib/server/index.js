/**
 * Created by Ali on 3/10/2015.
 */
"use strict";

var Q = require("q")
    , Hapi = require("hapi")
    , path = require("path")
    , locale_resolver = require("../locale_resolver")
    , loggerFactory = require("../app_logger")
    , appConfig = require("../app_config").getConfig();


var logger = loggerFactory.getLogger("APP_Server", appConfig.get("env:production") ? "WARN" : "DEBUG");
var dbMgr = require("../database");
var server = new Hapi.Server();
var port = appConfig.get("PORT") || 8000;

var dbMgrInit = dbMgr.init(appConfig);


/**
 * Register cookie based auth scheme:
 */
function registerHapiSessionCookiePlugin() {
    return Q.Promise(function (resolve, reject) {
        server.register(require("hapi-auth-cookie"), function (err) {
            if (err) {
                return reject(err);
            } else {
                server.auth.strategy("session", "cookie", {
                    password: appConfig.get("platform:auth:session_cookie_password"),
                    cookie: appConfig.get("platform:auth:cookie_name"),
                    redirectTo: appConfig.get("app_root") + "/" + appConfig.get("platform:auth:on_auth_failure_redirect_to"),
                    ttl: appConfig.get("platform:auth:session_cookie_ttl"),
                    keepAlive: true,
                    isSecure: true,
                    domain: appConfig.get("app_url_domain"),
                    appendNext: true,
                    validateFunc: require("../db_auth")
                });

                return resolve();
            }
        });

    });
}


/**
 *
 * @returns {*}
 */
function registerPlatformPlugins() {

    var pluginRegistrations = [];

    var plugins = require("./plugins");
    if (plugins.length > 0) {
        plugins.forEach(function (plugin) {
            var module_id = "";
            if (plugin.module_name) {
                module_id = plugin.module_name
            } else if (plugin.module_path) {
                module_id = "./" + path.posix.normalize("./plugins/" + plugin.module_path);
            } else {
                throw new Error("Plugin configuration error, check config.json for plugins.");
            }
            pluginRegistrations.push(
                function () {
                    return Q.Promise(function (resolve, reject) {
                        server.register({
                                register: require(module_id),
                                options: plugin.module_options
                            },
                            function (err) {
                                if (err) {
                                    logger.error("Failed to load plugin: " + module_id, err);
                                    return reject(err);
                                } else {
                                    return resolve();
                                }
                            });
                    });
                }
            );
        })
    }

    return pluginRegistrations.reduce(Q.when, Q());
}


/**
 *
 * @returns {*}
 */
function registerAppPlugins() {
    var pluginRegistrations = [];
    var plugins = appConfig.get("plugins");
    if (plugins.length > 0) {
        plugins.forEach(function (plugin) {
            var module_id = "";
            if (plugin.module_name) {
                module_id = plugin.module_name
            } else if (plugin.module_path) {
                module_id = path.join(path.dirname(require.main.filename), plugin.module_path);
            } else {
                throw new Error("Plugin configuration error, check config.json for plugins.");
            }
            pluginRegistrations.push(
                function () {
                    return Q.Promise(function (resolve, reject) {
                        server.register({
                                register: require(module_id),
                                options: plugin.module_options
                            },
                            function (err) {
                                if (err) {
                                    logger.error("Failed to load plugin: " + module_id, err);
                                    return reject(err);
                                } else {
                                    return resolve();
                                }
                            });
                    });
                }
            );
        })
    }

    return pluginRegistrations.reduce(Q.when, Q());
}


/**
 *
 */
function configureHapiServer() {
    return Q.fcall(function () {
        /**
         * Configuring the view engines:
         */
        var view_engines = {
            "dust": {
                "module": {
                    "name": "../view_engine",
                    "params": {}
                }
            },
            "js": {
                "module": {
                    "name": "../view_engine",
                    "params": {}
                }
            }
        };

        var viewEngineConfig = {
            engines: {},
            path: __dirname,
            compileMode: "async"
        };

        var viewEngineKeys = Object.keys(view_engines);
        for (var engineKey in viewEngineKeys) {
            viewEngineConfig.engines[viewEngineKeys[engineKey]] = {
                module: require(view_engines[viewEngineKeys[engineKey]].module.name),
                compileMode: "async" // engine specific
            };
        }

        server.views(viewEngineConfig);

        /**
         * Configuring the routes:
         */
        var routerModuleName = appConfig.get("router:module:name");
        //var routerModuleParams = appConfig.get("router:module:params");

        if (routerModuleName.indexOf("/") == 0) {
            routerModuleName = path.join(path.dirname(require.main.filename), routerModuleName);
        }

        require(routerModuleName)(server);
    });
}


/**
 *
 * @param next
 */
function init(next) {

    server.connection({port: port});

    dbMgrInit
        .then(registerHapiSessionCookiePlugin)
        .then(registerPlatformPlugins)
        .then(registerAppPlugins)
        .then(configureHapiServer)
        .then(function () {
            next(null, server);
        })
        .catch(function (err) {
            logger.error(err);
            throw err;
        })
        .done();

    /**
     * Register the extensions:
     */
    server.ext("onRequest", function (request, reply) {

            //console.log("onRequest extension is executed ...");

            return reply.continue();
        },
        {
            before: [""]
        }
    );
}

module.exports = init;
