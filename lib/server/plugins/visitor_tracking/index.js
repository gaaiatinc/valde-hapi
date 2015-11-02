/**
 * Created by Ali on 4/08/2015.
 */
"use strict";


var path = require("path"),
    Hoek = require("hoek"),
    Joi = require("joi"),
    uuid = require("uuid"),
    appConfig = require("../../../app_config").getConfig();


var cookie_schema = Joi.object({
    tr_cookie: Joi.string().default("vtid"),
    password: Joi.string().required(),
    ttl: Joi.number().integer().min(0).when("keepAlive", {is: true, then: Joi.required()}),
    domain: Joi.string(),
    path: Joi.string().default("/"),
    clearInvalid: Joi.boolean().default(true),
    keepAlive: Joi.boolean().default(true),
    isSecure: Joi.boolean().default(true),
    isHttpOnly: Joi.boolean().default(true)
}).required();


/**
 *
 * @param server
 * @param options
 * @param next
 */
module.exports.register = function (server, options, next) {

    var results = Joi.validate(options, cookie_schema);
    Hoek.assert(!results.error, results.error);

    var cookie_settings = results.value;

    var cookieOptions = {
        encoding: "iron",
        password: cookie_settings.password,
        isSecure: cookie_settings.isSecure,                  // Defaults to true
        path: cookie_settings.path,
        isHttpOnly: cookie_settings.isHttpOnly,              // Defaults to true
        clearInvalid: cookie_settings.clearInvalid,
        ignoreErrors: true
    };

    if (cookie_settings.ttl) {
        cookieOptions.ttl = cookie_settings.ttl;
    }

    if (cookie_settings.domain) {
        cookieOptions.domain = cookie_settings.domain;
    }

    server.state(cookie_settings.tr_cookie, cookieOptions);

    server.ext("onPreHandler", function (request, reply) {
        if (!(request.__valde)) {
            request.__valde = {};
        }

        if ((!request.state) || !(request.state[cookie_settings.tr_cookie])) {
            request.__valde.fptid = uuid.v4();
        } else {
            request.__valde.fptid = request.state[cookie_settings.tr_cookie].fptid || uuid.v4();
        }

        return reply.continue();
    });


    server.ext("onPostHandler", function (request, reply) {

        var visitor_tracking_cookie = {};

        visitor_tracking_cookie.locale = request.__valde.locale;

        visitor_tracking_cookie.fptid = request.__valde.fptid;
        reply.state(cookie_settings.tr_cookie, visitor_tracking_cookie);

        return reply.continue();
    });

    next();
};

/**
 *
 * @type {{pkg: *}}
 */
module.exports.register.attributes = {
    pkg: require("./package.json")
};


