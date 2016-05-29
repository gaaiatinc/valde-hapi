/**
 * Created by Ali on 3/10/2015.
 */
"use strict";

let Q = require("q"),
    Hapi = require("hapi"),
    path = require("path"),
    loggerFactory = require("../app_logger"),
    appConfig = require("../app_config").getConfig();

let logger = loggerFactory.getLogger("APP_Server", appConfig.get("env:production") ? "WARN" : "DEBUG");
let dbMgr = require("../database");
let server = new Hapi.Server();
let port = appConfig.get("PORT") || 8000;

/**
 * Register cookie based auth scheme:
 */
function registerHapiSessionCookiePlugin() {
    return Q.Promise((resolve, reject) => {
        server.register(require("hapi-auth-cookie"), (err) => {
            if (err) {
                return reject(err);
            } else {
                server.auth.strategy("session", "cookie", {
                    cookie: appConfig.get("platform:auth:cookie_name"),
                    password: appConfig.get("platform:auth:session_cookie_password"),
                    ttl: appConfig.get("platform:auth:session_cookie_ttl"),
                    domain: appConfig.get("app_url_domain"),
                    //path defaults to "/"
                    clearInvalid: true,
                    keepAlive: true,
                    isSecure: true,
                    isHttpOnly: true,
                    redirectTo: appConfig.get("app_root") + "/" + appConfig.get("platform:auth:on_auth_failure_redirect_to"),
                    appendNext: true,
                    redirectOnTry: true,
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
function registerVisionPlugin() {
    return Q.Promise((resolve, reject) => {
        server.register(require("vision"), (err) => {
            if (err) {
                return reject(err);
            } else {
                return resolve();
            }
        });

    });
}

/**
 *
 * @returns {*}
 */
function registerInertPlugin() {
    return Q.Promise((resolve, reject) => {
        server.register(require("inert"), (err) => {
            if (err) {
                return reject(err);
            } else {
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

    let pluginRegistrations = [];

    let plugins = require("./plugins");
    if (plugins.length > 0) {
        plugins.forEach((plugin) => {
            let module_id = "";
            if (plugin.module_name) {
                module_id = plugin.module_name;
            } else if (plugin.module_path) {
                module_id = "./" + path.posix.normalize("./plugins/" + plugin.module_path);
            } else {
                throw new Error("Plugin configuration error, check config.json for plugins.");
            }
            pluginRegistrations.push(() => {
                return Q.Promise(
                    (resolve, reject) => {
                        server.register({
                            register: require(module_id),
                            options: plugin.module_options
                        }, (err) => {
                            if (err) {
                                logger.error("Failed to load plugin: " + module_id, err);
                                return reject(err);
                            } else {
                                return resolve();
                            }
                        });
                    });
            });
        });
    }

    return pluginRegistrations.reduce(Q.when, Q());
}

/**
 *
 * @returns {*}
 */
function registerAppPlugins() {
    let pluginRegistrations = [];
    let plugins = appConfig.get("plugins");
    if (plugins.length > 0) {
        plugins.forEach((plugin) => {
            let module_id = "";
            if (plugin.module_name) {
                module_id = plugin.module_name;
            } else if (plugin.module_path) {
                module_id = path.join(path.dirname(require.main.filename), plugin.module_path);
            } else {
                throw new Error("Plugin configuration error, check config.json for plugins.");
            }
            pluginRegistrations.push(() => {
                return Q.Promise((resolve, reject) => {
                    server.register({
                        register: require(module_id),
                        options: plugin.module_options
                    }, (err) => {
                        if (err) {
                            logger.error("Failed to load plugin: " + module_id, err);
                            return reject(err);
                        } else {
                            return resolve();
                        }
                    });
                });
            });
        });
    }

    return pluginRegistrations.reduce(Q.when, Q());
}

/**
 *
 */
function configureHapiServer() {
    return Q.fcall(() => {
        /**
         * Configuring the view engines:
         */
        let view_engines = {
            "jsx": {
                "module": {
                    "name": "../view_engine/react",
                    "params": {}
                }
            },
            "dust": {
                "module": {
                    "name": "../view_engine/dust",
                    "params": {}
                }
            }
            //,
            //"js": {
            //    "module": {
            //        "name": "../view_engine",
            //        "params": {}
            //    }
            //}
        };

        let viewEngineConfig = {
            engines: {},
            path: __dirname + "/../view_engine/",
            layoutKeyword: "valde_content",
            compileMode: "async"
        };

        let viewEngineKeys = Object.keys(view_engines);
        viewEngineKeys.forEach((engineKey) => {
            viewEngineConfig.engines[engineKey] = {
                module: require(view_engines[engineKey].module.name),
                compileMode: "async" // engine specific
            };
        });

        server.views(viewEngineConfig);

        /**
         * Configuring the routes:
         */
        let routerModuleName = appConfig.get("router:module:name");
        //let routerModuleParams = appConfig.get("router:module:params");

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

    server.connection({
        host: "localhost",
        port: port
    });

    dbMgr.init(appConfig)
        .then(registerHapiSessionCookiePlugin)
        .then(registerVisionPlugin)
        .then(registerInertPlugin)
        .then(registerPlatformPlugins)
        .then(registerAppPlugins)
        .then(configureHapiServer)
        .then(() => {
            next(null, server);
        })
        .catch((err) => {
            logger.error(err);
            throw err;
        })
        .done();

    /**
     * Register the extensions:
     */
    server.ext("onRequest", (request, reply) => {

        //console.log("onRequest extension is executed ...");

        return reply.continue();
    }, {
        //before: [""]
    });
}

module.exports = init;
