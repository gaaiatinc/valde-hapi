/**
 * Created by Ali on 3/13/2015.
 */

"use strict";
const path = require("path"),
    app_config = require("../app_config").get_config(),
    page_resolver = require("./page_resolver"),
    encodeurl = require("encodeurl"),
    localized_resources_cache = require("./localized_resources_cache"),
    xss_filters = require("xss-filters");

const locale_regexp = /([a-z][a-z])_([A-Z][A-Z])/;

/**
 *
 * @param locale_iso_str
 * @returns {{country: *, language: *, iso_string: *, path: string}}
 */
const create_locale_object = (locale_iso_str) => {
    locale_regexp.lastIndex = 0;
    let matches = locale_regexp.exec(locale_iso_str);
    if (matches) {
        return {
            country: matches[2],
            language: matches[1],
            iso_string: locale_iso_str,
            path: "/" + matches[2] + "/" + matches[1] + "/"
        };
    } else {
        return {country: "US", language: "en", iso_string: "en_US", path: "/US/en/"};
    }
};

/**
 *
 * @param request
 * @param h
 * @returns {*}
 */
const create_model_for_web_request = (request, h) => {
    return new Promise((resolve, reject) => {
        page_resolver
            .resolve_page(request, h)
            .then((pageDescriptor) => {
                let sanitized_query = {};
                for (let aqstrparam of Object.getOwnPropertyNames(request.query)) {

                    let tempVal = request.query[aqstrparam];
                    if (Array.isArray(tempVal)) {
                        tempVal = tempVal.map((xssthrval) => {
                            let sanitized_xssthrval = encodeurl(xssthrval);
                            sanitized_xssthrval = decodeURIComponent(sanitized_xssthrval);
                            sanitized_xssthrval = encodeURIComponent(sanitized_xssthrval);
                            return sanitized_xssthrval;
                        });
                    } else {
                        let sanitized_tempVall = encodeurl(tempVal);
                        sanitized_tempVall = decodeURIComponent(sanitized_tempVall);
                        tempVal = encodeURIComponent(sanitized_tempVall);
                    }

                    sanitized_query[aqstrparam] = tempVal;
                }
                let model = {
                    pageViewID: path
                        .posix
                        .normalize("/pages/" + pageDescriptor.pageViewID),
                    pageViewTemplate: pageDescriptor.pageViewTemplate,
                    run_mode: app_config.get("run_mode"),
                    deploy_mode: app_config.get("deploy_mode"),
                    resolvedLocale: request.plugins.valde_locale_resolver.locale,
                    pageID: request.params.pageID,
                    content: pageDescriptor.content,
                    metadata: pageDescriptor.pageMetadata,
                    app_root: app_config.get("app_root"),
                    requestInfo: {
                        headers: {
                            "accept-language": xss_filters.inHTMLData(request.headers["accept-language"]),
                            host: xss_filters.inHTMLData(request.headers["host"]),
                            "user-agent": xss_filters.inHTMLData(request.headers["user-agent"]),
                            "x-real-ip": xss_filters.inHTMLData(request.headers["x-real-ip"])
                        },
                        query: sanitized_query,
                        serverTime: (new Date()).toUTCString()
                    }
                };

                return resolve(model);
            }, reject)
            .catch(reject);
    });
};

/**
 *
 * @param request
 */
const create_model_for_rest_request = (request) => {
    return new Promise((resolve, reject) => {
        let resource_set = {
            run_mode: app_config.get("run_mode"),
            deploy_mode: app_config.get("deploy_mode")
        };
        localized_resources_cache.getLocaleResourceSet(request.plugins.valde_locale_resolver.locale.path)
            .then((localeResourceSet) => {
                resource_set.localeResourceSet = localeResourceSet;
                return resolve(resource_set);
            }, reject);

    });
};

module.exports = {
    create_locale_object,
    create_model_for_web_request,
    create_model_for_rest_request
};
