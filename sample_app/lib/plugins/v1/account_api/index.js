"use strict";

let path = require("path"),
    app_config = require("valde-hapi").app_config.get_config(),
    crypto = require("crypto"),
    moment = require("moment"),

    Joi = require("joi");

var USER_NAME = "Email address for SAMPLEAPP",
    PASSWORD_DESCR = "Account password for SAMPLEAPP accounts";

/**
 *
 * @param request
 * @param reply
 * @returns {*}
 */
function signout_handler(request, reply) {
    try {
        request.cookieAuth.clear();
    } catch (err) {}

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

    if (!request.auth.isAuthenticated) {
        var shasum = crypto.createHash("sha1");
        shasum.update(String(request.payload.username));
        shasum.update(String(request.headers["accept-language"]));
        shasum.update(String(request.headers["user-agent"]));
        var device_fingerprint = "29af01" + shasum.digest("hex").substr(5);

        var expire_on = moment().add(6, "months");
        var session = {
            device_fingerprint: device_fingerprint,
            username: request.payload.username,
            expire_on: expire_on.format()
        };
        request.cookieAuth.set(session);
    }

    if (request.query["redirect_uri"]) {
        return reply.redirect(request.query["redirect_uri"]);
    } else {
        return reply({
            success: true,
            message: "This method is just a dummy for demo purposes",
            "sl-decorator": "",
            redirect: app_config.get("app_root") + "/home"
        }).type("application/json");
    }
}

module.exports.register = function(server, options, next) {
    server.route({
        method: "POST",
        path: app_config.get("app_root") + "/api/v1/account/signin",
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
                    username: Joi.string().required().description(USER_NAME),
                    password: Joi.string().required().description(PASSWORD_DESCR)
                },
                query: {
                    redirect_uri: Joi.string().description("An optional URI to redirect to upon successful login")
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
        path: app_config.get("app_root") + "/api/v1/account/signout",
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
