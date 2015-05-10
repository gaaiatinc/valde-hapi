/**
 * Created by Ali on 4/08/2015.
 */
"use strict";


var path = require("path"),
    Hoek = require("hoek"),
    locale_resolver = require("locale_resolver"),
    Joi = require("joi"),
    uuid = require("uuid"),
    appConfig = require("app_config").getConfig();


var cookie_schema = Joi.object({
    cookie: Joi.string().default("vtid"),
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

    server.state(cookie_settings.cookie, cookieOptions);

    server.ext("onPreHandler", function (request, reply) {

        var visitor_tracking_cookie;

        if ((!request.state) || !(request.state[cookie_settings.cookie])) {
            visitor_tracking_cookie = generate_visitor_tracking_cookie(request, reply);
            request.state[cookie_settings.cookie] = visitor_tracking_cookie;
        } else {
            visitor_tracking_cookie = request.state[cookie_settings.cookie];
        }

        return reply.continue();
    });



    server.ext("onPostHandler", function (request, reply) {

        var visitor_tracking_cookie;

        if ((!request.state) || !(request.state[cookie_settings.cookie])) {
            visitor_tracking_cookie = generate_visitor_tracking_cookie(request, reply);
        } else {
            visitor_tracking_cookie = request.state[cookie_settings.cookie];
        }

        reply.state(cookie_settings.cookie, visitor_tracking_cookie);

        return reply.continue();
    });

    next();
};


/**
 *
 * @param request
 * @param reply
 */
function generate_visitor_tracking_cookie(request, reply) {
    var visitor_tr_cookie = {};

    visitor_tr_cookie.locale = locale_resolver.get_request_locale(request, reply);
    visitor_tr_cookie.fptid = uuid.v4();

    return visitor_tr_cookie;
}

module.exports.register.attributes = {
    pkg: require("./package.json")
};


