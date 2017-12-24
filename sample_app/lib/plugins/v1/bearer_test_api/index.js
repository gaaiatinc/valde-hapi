"use strict";

var path = require("path"),
    app_config = require("valde-hapi").app_config,
    Joi = require("joi");

function process_jwt_request(request, reply) {
    return reply({
        success: true,
        message: "This method is just a dummy for demo purposes",
        "sl-decorator": "",
        redirect: app_config.get("app_root") + "/home"
    }).type("application/json");
}

/**
 *
 * @param server
 * @param options
 * @param next
 */
const bearer_test_api_module = async (server, options, next) => {

    /**
     *
     */
    server.route({
        method: "GET",
        path: app_config.get("app_root") + "/api/v1/bearer_test_api/process_jwt_request",
        config: {
            handler: process_jwt_request,
            tags: ["api"],
            description: "process_jwt_request",
            notes: "An API method to test the bearer_jwt plugin",
            auth: "bearer",
            plugins: {
                "csrf_agent": {
                    enabled: false
                },
                "resource_set": {
                    enabled: true
                }
            },
            validate: {
                headers: Joi.object({
                    "authorization": Joi.string().required(),
                    "accept-language": Joi.string().required(),
                    "user-agent": Joi.string().required()
                }).options({
                    allowUnknown: true
                })
            }
        }
    });
};

module.exports.plugin = {
    pkg: require("./package.json"),
    register: bearer_test_api_module
};
