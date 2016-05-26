/**
 * Created by Ali on 3/13/2015.
 */

"use strict";
let path = require("path"),
    dbMgr = require("../database"),
    appConfig = require("../app_config").getConfig(),
    page_resolver = require("./page_resolver"),
    localized_resources_cache = require("./localized_resources_cache"),
    Q = require("q");

let modelFactory = {};

let locale_regexp = /([a-z][a-z])_([A-Z][A-Z])/;

/**
 *
 * @param locale_iso_str
 * @returns {{country: *, language: *, iso_string: *, path: string}}
 */
modelFactory.create_locale_object = function (locale_iso_str) {
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
        return {
            country: "US",
            language: "en",
            iso_string: "en_US",
            path: "/US/en/"
        };
    }
};

/**
 *
 * @param request
 * @param reply
 * @returns {*}
 */
modelFactory.create_model_for_web_request = function (request, reply) {

    //return {
    //    country: tempObj[0].region, //two letter country code
    //    language: tempObj[0].language  //two letter language code
    //}

    return Q.Promise((resolve, reject) => {
        page_resolver.resolve_page(request, reply)
            .then((pageDescriptor) => {
                let model = {
                    pageViewID: path.posix.normalize("/pages/" + pageDescriptor.pageViewID),
                    pageViewTemplate: pageDescriptor.pageViewTemplate,
                    runMode: appConfig.get("runMode"),
                    deployMode: appConfig.get("deployMode"),
                    content: pageDescriptor.content,
                    metaData: pageDescriptor.pageMetadata,
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
            }, reject)
            .catch(reject)
            .done();
    });
};

/**
 *
 * @param request
 * @param reply
 */
modelFactory.create_model_for_rest_request = function (request, reply) {
    return Q.Promise((resolve, reject) => {
        let resource_set = {
            runMode: appConfig.get("runMode"),
            deployMode: appConfig.get("deployMode")
        };
        localized_resources_cache.getLocaleResourceSet(request.__valde.locale.path)
            .then((localeResourceSet) => {
                resource_set.localeResourceSet = localeResourceSet;
                resolve(resource_set);
            }, reject)
            .done();
    });
};

module.exports = modelFactory;
