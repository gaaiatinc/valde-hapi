/**
 * Created by Ali on 3/10/2015.
 */
"use strict";

let Q = require("q"),
    Hapi = require("hapi"),
    path = require("path"),
    fs = require("fs"),
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
function register_hapi_auth_cookie_plugin() {

    if (!(app_config.get("platform:auth"))) {
        logger.info("No cookie session auth plugin is provisioned in configuration.");
        return Q();
    } else {

        let app_session_cookie_validator = null;
        let temp_module_path;
        try {
            temp_module_path = app_config.get("platform:auth:cookie:session_cookie_validation_module");

            if (temp_module_path) {
                temp_module_path = path.join(path.dirname(require.main.filename), temp_module_path);

                app_session_cookie_validator = require(require.resolve(temp_module_path));
            }
        } catch (err) {
            logger.error(err.message);
            return Q.reject(err);
        }

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
                validateFunc: (temp_module_path) ? Joi.func().arity(3).error(new Error("Module identified in configuration (platform:auth:cookie:session_cookie_validation_module) must export a function: function(request, session, callback)!")) : null,
                redirectTo: Joi.string().required(),
                appendNext: Joi.string().required(),
                redirectOnTry: true
            };

            let session_config_params = {
                cookie: app_config.get("platform:auth:cookie:cookie_name"),
                password: app_config.get("platform:auth:cookie:session_cookie_password"),
                ttl: app_config.get("platform:auth:cookie:session_cookie_ttl"),
                domain: app_config.get("app_url_domain"),
                //path defaults to "/"
                clearInvalid: true,
                keepAlive: true,
                isSecure: true,
                isHttpOnly: true,
                //validateFunc: app_session_cookie_validator if not null,
                redirectTo: app_config.get("platform:auth:cookie:on_auth_failure_redirect_to"),
                appendNext: app_config.get("platform:auth:cookie:appendNext") || "redirect_uri",
                redirectOnTry: true
            };

            if (app_session_cookie_validator) {
                session_config_params.validateFunc = app_session_cookie_validator;
            }

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
}

/**
 * Register cookie based auth scheme:
 */
function register_hapi_auth_basic_plugin() {
    let app_auth_basic_validator = null;
    let temp_module_path = app_config.get("platform:auth:basic:basic_auth_validation_module");
    if (temp_module_path) {
        try {
            temp_module_path = path.join(path.dirname(require.main.filename), temp_module_path);

            app_auth_basic_validator = require(require.resolve(temp_module_path));
        } catch (err) {
            logger.error(err.message);
            return Q.reject(err);
        }

        return Q.Promise((resolve, reject) => {
            //verify all hapi-auth-cookie params are provided
            let auth_basic_schema = {
                validateFunc: Joi.func().arity(4).required().error(new Error("Module identified in configuration (platform:auth:basic:basic_auth_validation_module) must export a function: function(request, username, password, callback)!"))
            };

            let auth_basic_params = {
                validateFunc: app_auth_basic_validator
            };

            let validation_result = Joi.validate(auth_basic_params, auth_basic_schema);

            if (validation_result.error) {
                return reject(validation_result.error);
            }

            auth_basic_params.allowEmptyUsername = false;

            let unauthorized_response_attributes = app_config.get("platform:auth:basic:unauthorized_response_attributes");

            if (unauthorized_response_attributes) {
                auth_basic_params.unauthorizedAttributes = unauthorized_response_attributes;
            }

            server.register(require("hapi-auth-basic"), (err) => {
                if (err) {
                    return reject(err);
                } else {

                    server.auth.strategy("simple", "basic", auth_basic_params);
                    return resolve();
                }
            });

        });
    } else {
        logger.info("No basic auth plugin is provisioned in configuration.");
        return Q();
    }
}

/**
 *
 * @returns {*}
 */
function register_vision_plugin() {
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
function register_inert_plugin() {
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
function register_platform_plugins() {

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
function register_app_plugins() {
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
function configure_hapi_server() {
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
 *
 */
function write_process_pid() {
    let pid_file_path = app_config.get("PID_FILE_PATH");
    if (pid_file_path) {
        return Q.nfcall(fs.writeFile, pid_file_path, process.pid, {
            encoding: "utf8"
        });
    } else {
        return Q();
    }

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
        .then(register_hapi_auth_cookie_plugin)
        .then(register_hapi_auth_basic_plugin)
        .then(register_vision_plugin)
        .then(register_inert_plugin)
        .then(register_platform_plugins)
        .then(register_app_plugins)
        .then(configure_hapi_server)
        .then(write_process_pid)
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
