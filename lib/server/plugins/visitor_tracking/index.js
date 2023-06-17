/**
 * Created by Ali on 4/08/2015.
 */
"use strict";

const Hoek = require("@hapi/hoek"),
    Joi = require("joi"),
    _get = require("lodash/get"),
    _set = require("lodash/set"),
    app_config = require("../../../app_config").get_config(),
    uuid = require("uuid");

const cookie_schema = Joi
    .object({
        tr_cookie: Joi
            .string()
            .default("vtid"),
        password: Joi
            .string()
            .required(),
        ttl: Joi
            .number()
            .integer()
            .min(0)
            .when("keepAlive", {
                is: true,
                then: Joi.required()
            }),
        domain: Joi.string(),
        path: Joi
            .string()
            .default("/"),
        clearInvalid: Joi
            .boolean()
            .default(true),
        keepAlive: Joi
            .boolean()
            .default(true),
        isSecure: Joi
            .boolean()
            .default(true),
        isHttpOnly: Joi
            .boolean()
            .default(true)
    })
    .required();

/**
 *
 * @param server
 * @param options
 * @param next
 */
const visitor_tracking_module = async (server, options) => {

    return new Promise(async (resolve, reject) => {
        try {
            _set(options, "domain", app_config.get("app_url_domain"));
            let results = cookie_schema.validate(options);
            Hoek.assert(!results.error, results.error);

            let cookie_settings = results.value;

            let cookieOptions = {
                encoding: "iron",
                password: cookie_settings.password,
                isSecure: cookie_settings.isSecure, // Defaults to true
                path: cookie_settings.path,
                isHttpOnly: cookie_settings.isHttpOnly, // Defaults to true
                clearInvalid: cookie_settings.clearInvalid,
                ttl: cookie_settings.ttl,
                domain: cookie_settings.domain,
                ignoreErrors: true
            };

            server.state(cookie_settings.tr_cookie, cookieOptions);

            server.ext("onPreHandler", async (request, h) => {

                let temp_fptid = _get(request, ["state", cookie_settings.tr_cookie, "fptid"]);
                if (temp_fptid) {
                    _set(request, "plugins.valde_visitor_tracking.fptid", temp_fptid);
                } else {
                    _set(request, "plugins.valde_visitor_tracking.fptid", uuid.v4());
                }

                return h.continue;
            });

            server.ext("onPostHandler", async (request, h) => {

                let visitor_tracking_cookie = {};

                visitor_tracking_cookie.locale = _get(request, "plugins.valde_locale_resolver.locale");

                visitor_tracking_cookie.fptid = _get(request, "plugins.valde_visitor_tracking.fptid");

                h.state(cookie_settings.tr_cookie, visitor_tracking_cookie);

                return h.continue;
            });

            return resolve();
        } catch (err) {
            return reject(err);
        }
    });
};

/**
 *
 * @type {{pkg: *}}
 */
module.exports.plugin = {
    register: visitor_tracking_module,
    pkg: require("./package.json")
};
