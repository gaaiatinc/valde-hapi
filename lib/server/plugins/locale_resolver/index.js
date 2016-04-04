/**
 * Created by Ali on 4/08/2015.
 */
"use strict";


let path = require("path"),
    Hoek = require("hoek"),
    Joi = require("joi"),
    appConfig = require("../../../app_config").getConfig(),
    locale_resolver = require("../../../locale_resolver");


let options_schema = Joi.object({
    default_locale: Joi.string().required(),
    tr_cookie: Joi.string().default("vtid")
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

    let locale_resolver_settings = results.value;

    server.ext("onPostAuth", (request, reply) => {
        if (!(request.__valde)) {
            request.__valde = {};
        }

        request.__valde.locale = {};

        if ((request.auth) && (request.auth.isAuthenticated) && (request.auth.artifacts.locale)) {
            request.__valde.locale = request.auth.artifacts.locale;
        } else if ((request.state[locale_resolver_settings.tr_cookie]) && (request.state[locale_resolver_settings.tr_cookie].locale)) {
            request.__valde.locale = request.state[locale_resolver_settings.tr_cookie].locale;
        } else {
            let tempLocaleObj = locale_resolver.get_request_locale(request, reply);
            request.__valde.locale.country = tempLocaleObj.country;
            request.__valde.locale.language = tempLocaleObj.language;
            request.__valde.locale.iso_string = locale_resolver.as_iso_string(tempLocaleObj);
            request.__valde.locale.path = locale_resolver.as_path_string(tempLocaleObj);
        }

        return reply.continue();
    });

    next();
};


module.exports.register.attributes = {
    pkg: require("./package.json")
};


