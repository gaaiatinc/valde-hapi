/**
 * Created by Ali on 4/08/2015.
 */
"use strict";


var path = require("path"),
    Hoek = require("hoek"),
    Joi = require("joi"),
    uuid = require("uuid"),
    appConfig = require("../../../app_config").getConfig();


var options_schema = Joi.object({
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

    var results = Joi.validate(options, options_schema);
    Hoek.assert(!results.error, results.error);

    var csrf_agent_settings = results.value;

    server.ext("onPostAuth", function (request, reply) {

        var enabled_op = csrf_agent_settings.enabled;

        if (request.route.settings.plugins['csrf_agent'] &&
            request.route.settings.plugins['csrf_agent'].enabled !== undefined) {

            enabled_op = request.route.settings.plugins['csrf_agent'].enabled;
        }

        if (enabled_op) {
            if (request.auth.isAuthenticated) {
                //console.log(JSON.stringify(request.auth.artifacts, null, 4));
                var csrf_header_decorator = request.headers[appConfig.get("platform:csrf:csrf_header_name")] || "";

                //if passed, continue:
                if (request.auth.artifacts[appConfig.get("platform:csrf:csrf_header_name")] == csrf_header_decorator) {
                    return reply.continue();
                } else {
                    return reply({message: "CSRF Authorization failed!"}).code(401);
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


