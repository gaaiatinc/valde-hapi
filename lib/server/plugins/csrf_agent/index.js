/**
 * Created by Ali on 4/08/2015.
 */
"use strict";

let path = require("path"),
    Hoek = require("hoek"),
    Joi = require("joi"),
    app_config = require("../../../app_config").get_config();

let options_schema = Joi.object({
    password: Joi.string().required(),
    enabled: Joi.boolean().default(false)
}).required();

/**
 *
 * @param server
 * @param options
 * @param next
 */
module.exports.register = function (server, options, next) {

    let results = Joi.validate(options, options_schema);
    Hoek.assert(!results.error, results.error);

    let csrf_agent_settings = results.value;

    server.ext("onPostAuth", (request, reply) => {

        let enabled_op = csrf_agent_settings.enabled;

        if (request.route.settings.plugins["csrf_agent"] &&
            request.route.settings.plugins["csrf_agent"].enabled !== undefined) {

            enabled_op = request.route.settings.plugins["csrf_agent"].enabled;
        }

        if (enabled_op) {
            if (request.auth.isAuthenticated) {
                //console.log(JSON.stringify(request.auth.artifacts, null, 4));
                let csrf_header_decorator = request.headers[app_config.get("platform:csrf:csrf_header_name")] || "";

                //if passed, continue:
                if (request.auth.artifacts[app_config.get("platform:csrf:csrf_header_name")] == csrf_header_decorator) {
                    return reply.continue();
                } else {
                    return reply({
                        message: "CSRF Authorization failed!"
                    }).code(401);
                }
            } else {
                return reply("CSRF Authorization failed!");
            }
        } else {
            return reply.continue();
        }
    });

    next();
};

module.exports.register.attributes = {
    pkg: require("./package.json")
};
