/**
 * Created by Ali on 4/08/2015.
 */
"use strict";


let path = require("path"),
    Hoek = require("hoek"),
    Joi = require("joi"),
    uuid = require("uuid"),
    model_factory = require("../../../model"),
    appConfig = require("../../../app_config").getConfig();


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

    let web_model_settings = results.value;

    server.ext("onPreHandler", (request, reply) => {

        let enabled_op = web_model_settings.enabled;

        if (request.route.settings.plugins["web_model"] &&
            request.route.settings.plugins["web_model"].enabled === true) {

            enabled_op = request.route.settings.plugins["web_model"].enabled;
        }

        if (enabled_op) {
            model_factory.create_model_for_web_request(request, reply)
                .then((model) => {
                    request.__valde.web_model = model;
                    return reply.continue();
                })
                .catch((err) => {
                    //TODO: should it be logged as an error??
                    request.__valde.web_model = {};
                    return reply.continue();
                })
                .done();
        } else {
            return reply.continue();
        }
    });

    next();
};


module.exports.register.attributes = {
    pkg: require("./package.json")
};


