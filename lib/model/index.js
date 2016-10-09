/**
 * Created by Ali on 3/13/2015.
 */

"use strict";
const path = require("path"),
    app_config = require("../app_config").get_config(),
    page_resolver = require("./page_resolver"),
    localized_resources_cache = require("./localized_resources_cache"),
    Q = require("q");

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
 * @param reply
 * @returns {*}
 */
const create_model_for_web_request = (request, reply) => {

    return Q.Promise((resolve, reject) => {
        page_resolver.resolve_page(request, reply).then((pageDescriptor) => {
            let model = {
                pageViewID: path.posix.normalize("/pages/" + pageDescriptor.pageViewID),
                pageViewTemplate: pageDescriptor.pageViewTemplate,
                run_mode: app_config.get("run_mode"),
                deploy_mode: app_config.get("deploy_mode"),
                content: pageDescriptor.content,
                metadata: pageDescriptor.pageMetadata,
                requestInfo: {
                    headers: {
                        "accept-language": request.headers["accept-language"],
                        host: request.headers["host"],
                        "user-agent": request.headers["user-agent"],
                        "x-real-ip": request.headers["x-real-ip"]
                    },
                    query: request.query
                }
            };

            resolve(model);
        }, reject).catch(reject).done();
    });
};

/**
 *
 * @param request
 * @param reply
 */
const create_model_for_rest_request = (request) => {
    return Q.Promise((resolve, reject) => {
        let resource_set = {
            run_mode: app_config.get("run_mode"),
            deploy_mode: app_config.get("deploy_mode")
        };
        localized_resources_cache.getLocaleResourceSet(request.__valde.locale.path).then((localeResourceSet) => {
            resource_set.localeResourceSet = localeResourceSet;
            resolve(resource_set);
        }, reject).done();
    });
};

module.exports = {
    create_locale_object,
    create_model_for_web_request,
    create_model_for_rest_request
};
