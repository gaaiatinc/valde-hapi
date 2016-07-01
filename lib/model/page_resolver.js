/**
 * Created by aismael on 11/24/13.
 */
"use strict";

let logger_factory = require("../app_logger"),
    path = require("path"),
    pageDescriptorCache = require("./page_descriptor_cache"),
    Q = require("q"),
    app_config = require("../app_config").get_config(),
    locale_resolver = require("../locale_resolver");

let logger = logger_factory.getLogger("PageResolver", (app_config.get("env:production") || app_config.get("env:sandbox")) ? "WARN" : "DEBUG");
let page_resolver = {};

/**
 *  This function must handle all the logic for:
 *      1- campaign duration and redirects
 *      2- whether the page is visible to logged in session
 *      3- all the fall-back logic
 *      4- ...
 *
 */
page_resolver.resolve_page = function resolve_page(request, reply) {
    let request_locale_obj = locale_resolver.get_request_locale(request, reply);

    return Q.Promise((resolve, reject) => {

        get_page_for_request_locale();

        /**
         *
         * @returns {*}
         */
        function get_page_for_request_locale() {
            let req_locale_as_path_str = locale_resolver.as_path_string(request_locale_obj);

            return pageDescriptorCache.get(path.posix.normalize(req_locale_as_path_str + "/" + request.params.pageID))
                .then((page_descriptor) => {
                    return resolve(page_descriptor);
                }, (err) => {
                    return get_page_for_default_locale();
                })
                .catch((err) => {
                    return get_error_page();
                })
                .done();
        }

        /**
         *
         * @returns {*}
         */
        function get_page_for_default_locale() {
            let default_locale_obj = locale_resolver.get_default_locale_for_country(request_locale_obj.country);
            let default_locale_as_path_str = locale_resolver.as_path_string(default_locale_obj);

            return pageDescriptorCache.get(path.posix.normalize(default_locale_as_path_str + "/" + request.params.pageID))
                .then((page_descriptor) => {
                    return resolve(page_descriptor);
                }, (err) => {
                    return get_page_for_global_locale();
                })
                .catch((err) => {
                    return get_error_page();
                })
                .done();
        }

        /**
         *
         * @returns {*}
         */
        function get_page_for_global_locale() {
            let global_locale_obj = {
                country: "US", //two letter country code
                language: "en" //two letter language code
            };
            let global_locale_as_path_str = locale_resolver.as_path_string(global_locale_obj);

            return pageDescriptorCache.get(path.posix.normalize(global_locale_as_path_str + "/" + request.params.pageID))
                .then((page_descriptor) => {
                    return resolve(page_descriptor);
                }, (err) => {
                    return get_error_page();
                })
                .catch((err) => {
                    return get_error_page();
                })
                .done();

        }

        /**
         *
         * @returns {*}
         */
        function get_error_page() {
            let req_locale_as_path_str = locale_resolver.as_path_string(request_locale_obj);

            return pageDescriptorCache.get(path.posix.normalize(req_locale_as_path_str + "/error"))
                .then((page_descriptor) => {
                    return resolve(page_descriptor);
                }, (err) => {
                    return get_global_error_page();
                })
                .catch((err) => {
                    return reject(err);
                })
                .done();
        }

        /**
         *
         * @returns {*}
         */
        function get_global_error_page() {
            let global_locale_obj = {
                country: "US", //two letter country code
                language: "en" //two letter language code
            };
            let req_locale_as_path_str = locale_resolver.as_path_string(global_locale_obj);

            return pageDescriptorCache.get(path.posix.normalize(req_locale_as_path_str + "/error"))
                .then((page_descriptor) => {
                    return resolve(page_descriptor);
                }, (err) => {
                    return reject(err);
                })
                .catch((err) => {
                    return reject(err);
                })
                .done();
        }

    });
};

module.exports = page_resolver;
