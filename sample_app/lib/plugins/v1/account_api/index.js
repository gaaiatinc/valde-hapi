"use strict";

var path = require("path"),
    app_config = require("valde-hapi").app_config.get_config(),
    Joi = require("joi");


var SIGNIN_WITH_DESCR = "SAMPLEAPP",
    USER_ID_DESCR = "Email address for SAMPLEAPP",
    ACCESS_TOKEN_DESCR = "Account password for SAMPLEAPP accounts";


/**
 *
 * @param request
 * @param reply
 * @returns {*}
 */
function signout_handler(request, reply) {
    try {
        request.auth.session.clear();
    } catch (err) {
    }

    return reply({
        success: true,
        message: "Your session is signed out.",
        "sl-decorator": "",
        redirect: app_config.get("app_root") + "/home"
    }).type("application/json");
}


/**
 *
 * @param request
 * @param reply
 * @returns {*}
 */
function signin_handler(request, reply) {
    return reply({
        success: true,
        message: "This method is just a dummy for demo purposes",
        "sl-decorator": "",
        redirect: app_config.get("app_root") + "/home"
    }).type("application/json");
}

module.exports.register = function (server, options, next) {
    server.route({
        method: "POST",
        path: "/rest/v1/account/signin",
        config: {
            handler: signin_handler,
            tags: ["api"],
            description: "signin",
            notes: "A demo API method implementing account sign in.",
            auth: {
                mode: "try",
                strategy: "session"
            },
            plugins: {
                "hapi-auth-cookie": {
                    redirectTo: false
                },
                "resource_set": {
                    /**
                     * If enabled, the localized resource sets will be added to the  request:
                     *      request.__valde.resource_set
                     *  An example of the localized resource sets is in the folder WebComponents.
                     */
                    enabled: true
                }
            },
            validate: {
                payload: {
                    signin_with: Joi.string().valid(["SAMPLEAPP"]).required().description(SIGNIN_WITH_DESCR),
                    user_id: Joi.string().when("signin_with", {
                        is: "SAMPLEAPP",
                        then: Joi.string().email()
                    }).required().description(USER_ID_DESCR),
                    access_token: Joi.string().required().description(ACCESS_TOKEN_DESCR)
                },
                headers: Joi.object({
                    "accept-language": Joi.string().required(),
                    "user-agent": Joi.string().required()
                }).options({
                    allowUnknown: true
                })
            }
        }
    });


    /**
     *
     */
    server.route({
        method: "GET",
        path: "/rest/v1/account/signout",
        config: {
            handler: signout_handler,
            description: "signout",
            notes: "Just a demo rest endpoint.",
            tags: ["api"]
        }
    });


    next();
};


module.exports.register.attributes = {
    pkg: require("./package.json")
};