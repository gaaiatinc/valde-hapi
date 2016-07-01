/**
 * Created by Ali on 3/10/2015.
 */
"use strict";

let Q = require("q"),
    Hapi = require("hapi"),
    path = require("path"),
    logger_factory = require("../app_logger"),
    Joi = require("joi"),
    app_config = require("../app_config").get_config();

let logger = logger_factory.getLogger("APP_Server", app_config.get("env:production") ? "WARN" : "DEBUG");
let dbMgr = require("../database");
let server = new Hapi.Server();
let port = app_config.get("PORT") || 8000;

/**
 * Register cookie based auth scheme:
 */
function registerHapiSessionCookiePlugin() {

    return Q.Promise((resolve, reject) => {
        //verify all hapi-auth-cookie params are provided
        let session_config_schema = {
            cookie: Joi.string().required(),
            password: Joi.string().required(),
            ttl: Joi.number().positive().required(),
            domain: Joi.string().required(),
            //path defaults to "/"
            clearInvalid: true,
            keepAlive: true,
            isSecure: true,
            isHttpOnly: true,
            //validateFunc: require("../db_auth")
            redirectTo: Joi.string().required(),
            appendNext: Joi.string().required(),
            redirectOnTry: true
        };

        let session_config_params = {
            cookie: app_config.get("platform:auth:cookie_name"),
            password: app_config.get("platform:auth:session_cookie_password"),
            ttl: app_config.get("platform:auth:session_cookie_ttl"),
            domain: app_config.get("app_url_domain"),
            //path defaults to "/"
            clearInvalid: true,
            keepAlive: true,
            isSecure: true,
            isHttpOnly: true,
            //validateFunc: require("../db_auth")
            redirectTo: app_config.get("platform:auth:on_auth_failure_redirect_to"),
            appendNext: app_config.get("platform:auth:appendNext") || "redirect_uri",
            redirectOnTry: true
        };

        let validation_result = Joi.validate(session_config_params, session_config_schema);

        if (validation_result.error) {
            return reject(validation_result.error);
        }
        server.register(require("hapi-auth-cookie"), (err) => {
            if (err) {
                return reject(err);
            } else {
                server.auth.strategy("session", "cookie", session_config_params);

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
    let plugins = app_config.get("plugins");
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
        let routerModuleName = app_config.get("router:module:name");
        //let routerModuleParams = app_config.get("router:module:params");

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

    dbMgr.init(app_config)
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
