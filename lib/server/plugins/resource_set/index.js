/**
 * Created by Ali on 4/08/2015.
 */
"use strict";

const Hoek = require("hoek"),
    Joi = require("joi"),
    _get = require("lodash/get"),
    _set = require("lodash/set"),
    model_factory = require("../../../model");

const options_schema = Joi
    .object({
        enabled: Joi
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
const resource_set_plugin = async (server, options) => {

    return new Promise(async (resolve, reject) => {
        let results = options_schema.validate(options);
        try {
            Hoek.assert(!results.error, results.error);
        } catch (err) {
            return reject(err);
        }

        let resource_set_settings = results.value;

        server.ext("onPreHandler", async (request, h) => {

            let routeEnabled = _get(request, "route.settings.plugins.resource_set.enabled", resource_set_settings.enabled || false);

            request.plugins.valde_resource_set = {};
            if (routeEnabled === true) {
                try {
                    let resource_set = await model_factory.create_model_for_rest_request(request, h);
                    _set(request, "plugins.valde_resource_set", resource_set);
                    return h.continue;
                } catch (err) {
                    _set(request, "plugins.valde_resource_set", {});
                    return h.continue;
                }
            } else {
                return h.continue;
            }
        });

        return resolve();
    });
};

module.exports.plugin = {
    register: resource_set_plugin,
    pkg: require("./package.json")
};
