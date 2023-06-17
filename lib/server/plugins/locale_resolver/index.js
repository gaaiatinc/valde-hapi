/**
 * Created by Ali on 4/08/2015.
 */
"use strict";

const Hoek = require("hoek"),
    Joi = require("joi"),
    _get = require("lodash/get"),
    locale_resolver = require("../../../locale_resolver");

let options_schema = Joi
    .object({
        default_locale: Joi
            .string()
            .required(),
        tr_cookie: Joi
            .string()
            .default("vtid")
    })
    .required();

/**
 *
 * @param server
 * @param options
 * @param next
 */
const locale_resolver_plugin = async (server, options) => {
    return new Promise(async (resolve, reject) => {
        let results = options_schema.validate(options);
        try {
            Hoek.assert(!results.error, results.error);
        } catch (err) {
            return reject(err);
        }

        let locale_resolver_settings = results.value;

        server.ext("onPostAuth", async (request, h) => {
            request.plugins.valde_locale_resolver = _get(request, "plugins.valde_locale_resolver" , {});
            request.plugins.valde_locale_resolver.locale = {};

            if (_get(request, "auth.isAuthenticated") && _get(request, "auth.artifacts.locale")) {
                request.plugins.valde_locale_resolver.locale = _get(request, "auth.artifacts.locale");
            } else if (_get(request, ["state", locale_resolver_settings.tr_cookie, "locale"])) {
                request.plugins.valde_locale_resolver.locale = _get(request, ["state", locale_resolver_settings.tr_cookie, "locale"]);
            } else {
                let tempLocaleObj = locale_resolver.get_request_locale(request);
                request.plugins.valde_locale_resolver.locale.country = tempLocaleObj.country;
                request.plugins.valde_locale_resolver.locale.language = tempLocaleObj.language;
                request.plugins.valde_locale_resolver.locale.iso_string = locale_resolver.as_iso_string(tempLocaleObj);
                request.plugins.valde_locale_resolver.locale.path = locale_resolver.as_path_string(tempLocaleObj);
            }

            return h.continue;
        });
        return resolve();
    });

};

module.exports.plugin = {
    register: locale_resolver_plugin,
    pkg: require("./package.json")
};
