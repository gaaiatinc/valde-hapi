/**
 * Created by Ali on 4/08/2015.
 */
"use strict";


var path = require("path"),
    Hoek = require("hoek"),
    Joi = require("joi"),
    uuid = require("uuid"),
    model_factory = require("../../../model"),
    appConfig = require("../../../app_config").getConfig();


var options_schema = Joi.object({
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

    var resource_set_settings = results.value;

    server.ext("onPreHandler", function (request, reply) {

        var enabled_op = resource_set_settings.enabled;

        if (request.route.settings.plugins["resource_set"] &&
            request.route.settings.plugins["resource_set"].enabled === true) {

            enabled_op = request.route.settings.plugins["resource_set"].enabled;
        }

        if (enabled_op) {
            model_factory.create_model_for_rest_request(request, reply)
                .then(function (resource_set) {
                    request.__valde.resource_set = resource_set;
                    return reply.continue();
                }, function (err) {
                    //TODO: should log the error
                    request.__valde.resource_set = {};
                    return reply.continue();
                })
                .catch(function (err) {
                    //TODO: should log the error
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


