/**
 * Created by Ali on 4/08/2015.
 */
"use strict";

let path = require("path"),
    Hoek = require("hoek"),
    Joi = require("joi"),
    model_factory = require("../../../model"),
    app_config = require("../../../app_config").get_config();

let options_schema = Joi.object({
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

    let resource_set_settings = results.value;

    server.ext("onPreHandler", (request, reply) => {

        let enabled_op = resource_set_settings.enabled;

        if (request.route.settings.plugins["resource_set"] &&
            request.route.settings.plugins["resource_set"].enabled === true) {

            enabled_op = request.route.settings.plugins["resource_set"].enabled;
        }

        if (enabled_op) {
            model_factory.create_model_for_rest_request(request, reply)
                .then((resource_set) => {
                    request.__valde.resource_set = resource_set;
                    return reply.continue();
                })
                .catch((err) => {
                    //TODO: should it be logged as an error??
                    request.__valde.resource_set = {};
                    return reply.continue();
                })
                .done();
        } else {
            request.__valde.resource_set = {};
            return reply.continue();
        }
    });

    next();
};

module.exports.register.attributes = {
    pkg: require("./package.json")
};
