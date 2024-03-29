/**
 * Created by Ali on 3/10/2015.
 */
"use strict";

const Hapi = require("@hapi/hapi"),
    path = require("path"),
    fs = require("fs"),
    logger_factory = require("../app_logger"),
    Joi = require("joi"),
    _isEmpty = require("lodash/isEmpty"),
    app_config = require("../app_config").get_config();

const { promiseSequencer } = require("../app_utils");
const { promisify } = require("util");

const logger = logger_factory.getLogger(
    "APP_Server", app_config.get("env:production")
    ? "WARN"
    : "DEBUG");
const port = app_config.get("PORT") || 8000;
const server = Hapi.Server({
    host: "localhost",
    port: port,
    load: {
        sampleInterval: 0,
        concurrent: 0
    }
});

/**
 * Register cookie based auth scheme:
 */
const register_hapi_cookie_plugin = async () => {

    if (!(app_config.get("platform:plugins:hapi_cookie"))) {
        logger.info("No cookie session auth plugin is provisioned in configuration.");
        return Promise.resolve();
    } else {

        logger.info("registering hapi_cookie_plugin ...")
        let app_session_cookie_validator = null;
        let temp_module_path;
        try {
            temp_module_path = app_config.get("platform:plugins:hapi_cookie:session_cookie_validation_module");

            if (temp_module_path) {
                temp_module_path = path.join(app_config.get("application_root_folder"), temp_module_path);

                app_session_cookie_validator = require(require.resolve(temp_module_path));
            }
        } catch (err) {
            logger.error(err.message);
            return Promise.reject(err);
        }

        return new Promise(async (resolve, reject) => {
            //verify all hapi-auth-cookie params are provided
            let session_config_schema = Joi.object(
                {
                    cookie: Joi.object(
                        {
                            name: Joi
                                .string()
                                .required(),
                            password: Joi
                                .string()
                                .required(),
                            ttl: Joi
                                .number()
                                .positive()
                                .required(),
                            domain: Joi
                                .string()
                                .required(),
                            //path defaults to "/"
                            clearInvalid: Joi.boolean(),
                            // keepAlive: Joi.boolean(),
                            isSecure: Joi.boolean(),
                            isHttpOnly: Joi.boolean(),
                            // redirectOnTry: Joi.boolean(),
                        }
                    ),
                    validate: Joi
                        .func()
                        .arity(2)
                        .error(new Error("Module identified in configuration (platform:plugins:hapi_cookie:session_cookie_validation_module) must export an async function: function(request, session)!")),

                    //         appendNext: Joi
                    // .string()
                    // .required(),
                    // redirectOnTry: Joi.boolean
                    //                 }
                    //             ),

                    redirectTo: Joi
                        .string()
                        .required(),

                }
            );

            let session_config_params = {
                cookie: {
                    name: app_config.get("platform:plugins:hapi_cookie:cookie_name"),

                    // Don't forget to change it to your own secret password!
                    password: app_config.get("platform:plugins:hapi_cookie:session_cookie_password"),
                    // For working via HTTP in localhost
                    // isSecure: false

                    ttl: app_config.get("platform:plugins:hapi_cookie:session_cookie_ttl"),
                    domain: app_config.get("app_url_domain"),
                    //path defaults to "/"
                    clearInvalid: true,
                    // keepAlive: true,
                    isSecure: true,
                    isHttpOnly: true,
                    //validateFunc: app_session_cookie_validator if not null,
                    // appendNext: app_config.get("platform:plugins:hapi_cookie:appendNext") || "redirect_uri",
                    // redirectOnTry: true
                },

                redirectTo: app_config.get("platform:plugins:hapi_cookie:on_auth_failure_redirect_to"),


                // validate: async (request, session) => {

                //     const account = internals.users.find((user) => (user.id === session.id));

                //     if (!account) {
                //         // Must return { isValid: false } for invalid cookies
                //         return { isValid: false };
                //     }

                //     return { isValid: true, credentials: account };
                // }
            };



            // cookie: app_config.get("platform:plugins:hapi_cookie:cookie_name"),


            // password: app_config.get("platform:plugins:hapi_cookie:session_cookie_password"),
            // ttl: app_config.get("platform:plugins:hapi_cookie:session_cookie_ttl"),
            // domain: app_config.get("app_url_domain"),
            // //path defaults to "/"
            // clearInvalid: true,
            // keepAlive: true,
            // isSecure: true,
            // isHttpOnly: true,
            // //validateFunc: app_session_cookie_validator if not null,
            // redirectTo: app_config.get("platform:plugins:hapi_cookie:on_auth_failure_redirect_to"),
            // appendNext: app_config.get("platform:plugins:hapi_cookie:appendNext") || "redirect_uri",
            // redirectOnTry: true
            // };

            if (app_session_cookie_validator) {
                session_config_params.validate = app_session_cookie_validator;
            }

            session_config_schema
            let validation_result = session_config_schema.validate(session_config_params);
            // let validation_result = Joi.validate(session_config_params, session_config_schema);

            if (validation_result.error) {
                return reject(validation_result.error);
            }

            try {
                const hapiAuthCookie = require("@hapi/cookie");
                await server.register(hapiAuthCookie);
                server
                    .auth
                    .strategy("session", "cookie", session_config_params);

                logger.info("registering hapi_cookie_plugin completed.")

                return resolve();
            } catch (err) {
                return reject(err);
            }
        });
    }
};

/**
 * Register cookie based auth scheme:
 */
const register_hapi_auth_basic_plugin = async () => {
    let app_auth_basic_validator = null;
    let temp_module_path = app_config.get("platform:plugins:hapi_auth_basic:basic_auth_validation_module");
    if (temp_module_path) {
        try {
            temp_module_path = path.join(app_config.get("application_root_folder"), temp_module_path);

            app_auth_basic_validator = require(require.resolve(temp_module_path));
        } catch (err) {
            logger.error(err.message);
            return Promise.reject(err);
        }

        return new Promise(async (resolve, reject) => {
            //verify all hapi-auth-cookie params are provided
            let auth_basic_schema = Joi.object(
                {
                    validate: Joi
                        .func()
                        .arity(4)
                        .required()
                        .error(new Error("Module identified in configuration (platform:plugins:hapi_auth_basic:basic_auth_validation_module) must export an async function: function(request, username, password, h)!"))
                }
            );

            let auth_basic_params = {
                validate: app_auth_basic_validator
            };

            let validation_result = auth_basic_schema.validate(auth_basic_params);

            if (validation_result.error) {
                return reject(validation_result.error);
            }

            auth_basic_params.allowEmptyUsername = false;

            let unauthorized_response_attributes = app_config.get("platform:plugins:hapi_auth_basic:unauthorized_response_attributes");

            if (unauthorized_response_attributes) {
                auth_basic_params.unauthorizedAttributes = unauthorized_response_attributes;
            }

            try {
                await server.register(require("@hapi/basic"));
                server
                    .auth
                    .strategy("simple", "basic", auth_basic_params);

                return resolve();
            } catch (err) {
                return reject(err);
            }
        });
    } else {
        logger.info("No basic auth plugin is provisioned in configuration.");
        return Promise.resolve();
    }
};

/**
 * Register bearer_jwt auth scheme:
 */
const register_hapi_auth_bearer_jwt_plugin = async () => {

    let bearer_jwt_options = app_config.get("platform:plugins:valde_auth_bearer_jwt");

    if (_isEmpty(bearer_jwt_options)) {
        logger.info("No bearer_jwt auth plugin is provisioned in configuration.");
        return Promise.resolve();
    }

    let bearer_jwt_validate = null;
    if (typeof bearer_jwt_options.bearer_jwt_validation_module === "string") {
        try {
            let temp_module_path = path.join(app_config.get("application_root_folder"), bearer_jwt_options.bearer_jwt_validation_module);

            bearer_jwt_validate = require(require.resolve(temp_module_path));
        } catch (err) {
            logger.error(err.message);
            return Promise.reject(err);
        }
    }

    return new Promise(async (resolve, reject) => {
        //verify all bearer_jwt config params are provided
        const bearer_jwt_schema = Joi
            .object({
                verification_key: Joi
                    .string()
                    .required(),
                validateFunc: (bearer_jwt_validate)
                    ? Joi
                        .func()
                        .arity(3)
                        .error(new Error("Module identified in configuration (bearer_jwt_validation_module) must export an async function: async function(request, jwt_token, h)!"))
                    : null,
                bearer_jwt_validation_module: Joi.string(),
                verify_attributes: Joi
                    .object()
                    .keys({
                        algorithms: Joi
                            .array()
                            .items(Joi.string())
                            .min(1)
                            .required(),
                        audience: Joi.string(),
                        issuer: Joi.string(),
                        subject: Joi.string()
                    })
                    .required()
            })
            .required();

        let validation_result = bearer_jwt_schema.validate(bearer_jwt_options);

        if (validation_result.error) {
            return reject(validation_result.error);
        }

        if (bearer_jwt_validate) {
            bearer_jwt_options.validate = bearer_jwt_validate;
        }

        try {
            await server.register(require("./plugins/auth/bearer_jwt"));
            server
                .auth
                .strategy("bearer", "jwt", bearer_jwt_options);
            return resolve();
        } catch (err) {
            return reject(err);
        }

    });
};

/**
 *
 * @returns {*}
 */
const register_vision_plugin = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            await server.register(require("@hapi/vision"));
            return resolve();
        } catch (err) {
            return reject(err);
        }
    });
};

/**
 *
 * @returns {*}
 */
const register_inert_plugin = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            await server.register(require("@hapi/inert"));
            return resolve();
        } catch (err) {
            return reject(err);
        }
    });
};

/**
 *
 * @returns {*}
 */
const register_platform_plugins = async () => {

    const pluginRegistrations = [];

    const plugins = require("./plugins");
    if (plugins.length > 0) {
        plugins.forEach((plugin) => {
            let module_id = "";
            if (plugin.module_name) {
                module_id = plugin.module_name;
            } else if (plugin.module_path) {
                module_id = "./" + path
                    .posix
                    .normalize("./plugins/" + plugin.module_path);
            } else {
                throw new Error("Plugin configuration error, check config.json for plugins.");
            }
            pluginRegistrations.push(() => {
                return new Promise(async (resolve, reject) => {
                    try {
                        await server.register({ plugin: require(module_id), options: plugin.module_options });
                        return resolve();
                    } catch (err) {
                        logger.error(`Failed to load plugin: ${module_id}, ${err}`);
                        return reject(err);
                    }
                });
            });
        });
    }

    return promiseSequencer(pluginRegistrations);
};

/**
 *
 * @returns {*}
 */
const register_app_plugins = async () => {
    const pluginRegistrations = [];
    const app_plugins = app_config.get("app:plugins");
    Object
        .keys(app_plugins)
        .forEach((app_plugin_name) => {
            const plugin = app_plugins[app_plugin_name];
            let module_id = "";
            if (plugin.module_name) {
                module_id = plugin.module_name;
            } else if (plugin.module_path) {
                module_id = path.join(app_config.get("application_root_folder"), plugin.module_path);
            } else {
                throw new Error("Plugin configuration error, check config.json for plugins.");
            }
            pluginRegistrations.push(async () => {
                return new Promise(async (resolve, reject) => {
                    try {
                        await server.register({ plugin: require(module_id), options: plugin.module_options });
                        return resolve();
                    } catch (err) {
                        logger.error(`Failed to load plugin: ${module_id}, ${err}`);
                        return reject(err);
                    }
                });
            });
        });

    return promiseSequencer(pluginRegistrations);
};

/**
 *
 */
const configure_hapi_server = async () => {
    return new Promise(async (resolve) => {
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
            routerModuleName = path.join(app_config.get("application_root_folder"), routerModuleName);
        }

        require(routerModuleName)(server);
        return resolve();
    });
};

/**
 *
 *
 */
const write_process_pid = async () => {
    let pid_file_path = app_config.get("PID_FILE_PATH");
    if (pid_file_path) {
        return promisify(fs.writeFile)(pid_file_path, process.pid.toString(), { encoding: "utf8" });
    } else {
        return Promise.resolve();
    }

};

/**
 *
 */
const init = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            await register_hapi_cookie_plugin();
            await register_hapi_auth_basic_plugin();
            await register_hapi_auth_bearer_jwt_plugin();
            await register_vision_plugin();
            await register_inert_plugin();
            await register_platform_plugins();
            await register_app_plugins();
            await configure_hapi_server();
            await write_process_pid();

            logger.info("\nAll server plugins registered.\n")

            resolve(server);
        } catch (err) {
            logger.error(err);
            reject(err);
        }
    });

    /**
     * Register the extensions:
     */
    // server.ext("onRequest", (request, reply) => {
    //
    //     return reply.continue();
    // }, {
    //     before: [""]
    // });
};

module.exports = init();
