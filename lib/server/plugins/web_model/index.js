/**
 * Created by Ali on 4/08/2015.
 */
"use strict";

const Hoek = require("hoek"),
    Boom = require("boom"),
    Joi = require("joi"),
    model_factory = require("../../../model"),
    encodeurl = require("encodeurl"),
    _get = require("lodash/get"),
    _set = require("lodash/set"),
    app_config = require("../../../app_config").get_config();

// const util = require("util");
let options_schema = Joi
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
const web_model_plugin = async (server, options) => {

    return new Promise(async (resolve, reject) => {
        try {
            let results = Joi.validate(options, options_schema);
            Hoek.assert(!results.error, results.error);

            let web_model_settings = results.value;
            server.ext("onPreHandler", async (request, h) => {

                let routeEnabled = _get(request, "route.settings.plugins.web_model.enabled", web_model_settings.enabled || false);

                if (routeEnabled === true) {
                    try {
                        let model = await model_factory.create_model_for_web_request(request, h);
                        let redirect_to_signin = false;
                        try {
                            redirect_to_signin = (!request.auth.isAuthenticated && (model.metadata.access_conditions.logged_in_only));

                            if (redirect_to_signin) {
                                let append_next_phrase = app_config.get("platform:auth:cookie:appendNext") || "redirect_uri";
                                let redirect_uri = (
                                    app_config.get("external_server_url")
                                    ? app_config.get("external_server_url")
                                    : "") + request.url.href;

                                let sanitized_redirct_url = encodeurl(redirect_uri);
                                sanitized_redirct_url = decodeURIComponent(sanitized_redirct_url);
                                sanitized_redirct_url = encodeURIComponent(sanitized_redirct_url);

                                let redirect_str = app_config.get("platform:auth:cookie:on_auth_failure_redirect_to") + "?" + append_next_phrase + "=" + sanitized_redirct_url;
                                return h.redirect(redirect_str);
                            } else {
                                _set(request, "plugins.valde_web_model", model);
                                return h.continue;
                            }
                        } catch (err) {
                            _set(request, "plugins.valde_web_model", {});
                            return h.continue;
                        }
                    } catch (err) {
                        throw Boom.badImplementation(err);
                    }
                } else {
                    return h.continue;
                }
            });

            return resolve();
        } catch (err) {
            return reject(err);
        }
    });
};

module.exports.plugin = {
    register: web_model_plugin,
    pkg: require("./package.json")
};
