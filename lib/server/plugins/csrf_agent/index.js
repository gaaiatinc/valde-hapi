/**
 * Created by Ali on 4/08/2015.
 */
"use strict";

const Boom = require("boom"),
    Hoek = require("hoek"),
    Joi = require("joi"),
    app_config = require("../../../app_config").get_config();

const options_schema = Joi
    .object({
        password: Joi
            .string()
            .required(),
        enabled_by_default: Joi
            .boolean()
            .default(false)
    })
    .required();

/**
 *
 * @param server
 * @param options
 * @param next
 */
const csrf_agent_module = async (server, options) => {

    return new Promise(async (resolve, reject) => {
        try {
            let results = options_schema.validate(options);
            Hoek.assert(!results.error, results.error);

            let csrf_agent_settings = results.value;

            server.ext("onPostAuth", async (request, h) => {

                let enabled_op = csrf_agent_settings.enabled_by_default;

                if (request.route.settings.plugins["valde_csrf_agent"] && request.route.settings.plugins["valde_csrf_agent"].enabled !== undefined) {
                    enabled_op = request
                        .route
                        .settings
                        .plugins["valde_csrf_agent"]
                        .enabled;
                }

                if (enabled_op) {
                    if (request.auth.isAuthenticated) {
                        const csrf_header_decorator_name = app_config.get("platform:plugins:valde_csrf_agent:csrf_header_name");
                        let csrf_header_decorator = request.headers[csrf_header_decorator_name] || "";

                        //if passed, continue:
                        if (request.auth.artifacts[csrf_header_decorator_name] == csrf_header_decorator) {
                            return h.continue;
                        } else {
                            throw Boom.unauthorized({message: "CSRF Authorization failed!"});
                        }
                    } else {
                        throw Boom.unauthorized({message: "CSRF Authorization failed!"});
                    }
                } else {
                    return h.continue;
                }
            });

            return resolve();
        } catch (err) {
            return reject(err);
        }
    });
};

/**
 *
 * @type {Object}
 */
module.exports.plugin = {
    register: csrf_agent_module,
    pkg: require("./package.json")
};
