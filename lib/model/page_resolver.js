/**
 * Created by aismael on 11/24/13.
 */
"use strict";

var loggerFactory = require("app_logger"),
    path = require("path"),
    pageDescriptorCache = require("./page_descriptor_cache"),
    pageCache = require("./page_descriptor_cache"),
    Q = require("q"),
    appConfig = require("app_config").getConfig(),
    locale_resolver = require("locale_resolver");


var logger = loggerFactory.getLogger("PageResolver", (appConfig.get("env:production") || appConfig.get("env:sandbox")) ? "WARN" : "DEBUG");
var page_resolver = {};

/**
 *  This function must handle all the logic for:
 *      1- campaign duration and redirects
 *      2- whether the page is visible to logged in session
 *      3- all the fall-back logic
 *      4- ...
 *
 */
page_resolver.resolve_page = function resolve_page(request, reply) {
    var request_locale_obj = locale_resolver.get_request_locale(request, reply);

    return Q.Promise(function (resolve, reject) {

        get_page_for_request_locale();


        /**
         *
         * @returns {*}
         */
        function get_page_for_request_locale() {
            var req_locale_as_path_str = locale_resolver.as_path_string(request_locale_obj);

            return pageDescriptorCache.get(path.posix.normalize(req_locale_as_path_str + "/" + request.params.pageID))
                .then(function (page_descriptor) {
                    if (!request.auth.isAuthenticated && (page_descriptor.pageMetadata.access_conditions.logged_in_only)) {
                        return get_sign_in_page(req_locale_as_path_str);
                    } else {
                        return resolve(page_descriptor);
                    }
                }, function (err) {
                    return get_page_for_default_locale();
                })
                .catch(function (err) {
                    return get_error_page();
                })
                .done();
        }


        /**
         *
         * @returns {*}
         */
        function get_page_for_default_locale() {
            var default_locale_obj = locale_resolver.get_default_locale_for_country(request_locale_obj.country);
            var default_locale_as_path_str = locale_resolver.as_path_string(default_locale_obj);

            return pageDescriptorCache.get(path.posix.normalize(default_locale_as_path_str + "/" + request.params.pageID))
                .then(function (page_descriptor) {
                    if (!request.auth.isAuthenticated && (page_descriptor.pageMetadata.access_conditions.logged_in_only)) {
                        return get_sign_in_page(default_locale_as_path_str);
                    } else {
                        return resolve(page_descriptor);
                    }
                }, function (err) {
                    return get_page_for_global_locale();
                })
                .catch(function (err) {
                    return get_error_page();
                })
                .done();
        }

        /**
         *
         * @returns {*}
         */
        function get_page_for_global_locale() {
            var global_locale_obj = {
                country: "US", //two letter country code
                language: "en"  //two letter language code
            };
            var global_locale_as_path_str = locale_resolver.as_path_string(global_locale_obj);

            return pageDescriptorCache.get(path.posix.normalize(global_locale_as_path_str + "/" + request.params.pageID))
                .then(function (page_descriptor) {
                    if (!request.auth.isAuthenticated && (page_descriptor.pageMetadata.access_conditions.logged_in_only)) {
                        return get_sign_in_page(global_locale_as_path_str);
                    } else {
                        return resolve(page_descriptor);
                    }
                }, function (err) {
                    return get_error_page();
                })
                .catch(function (err) {
                    return get_error_page();
                })
                .done();

        }

        /**
         *
         * @returns {*}
         */
        function get_error_page() {
            var req_locale_as_path_str = locale_resolver.as_path_string(request_locale_obj);

            return pageDescriptorCache.get(path.posix.normalize(req_locale_as_path_str + "/error"))
                .then(function (page_descriptor) {
                    return resolve(page_descriptor);
                }, function (err) {
                    return get_global_error_page();
                })
                .catch(function (err) {
                    return reject(err);
                })
                .done();
        }

        /**
         *
         * @returns {*}
         */
        function get_global_error_page() {
            var global_locale_obj = {
                country: "US", //two letter country code
                language: "en"  //two letter language code
            };
            var req_locale_as_path_str = locale_resolver.as_path_string(global_locale_obj);

            return pageDescriptorCache.get(path.posix.normalize(req_locale_as_path_str + "/error"))
                .then(function (page_descriptor) {
                    return resolve(page_descriptor);
                }, function (err) {
                    return reject(err);
                })
                .catch(function (err) {
                    return reject(err);
                })
                .done();
        }


        /**
         *
         * @returns {*}
         */
        function get_sign_in_page(locale_as_path_str) {
            return pageDescriptorCache.get(path.posix.normalize(locale_as_path_str + "/signin"))
                .then(function (page_descriptor) {
                    return resolve(page_descriptor);
                }, function (err) {
                    return get_error_page();
                })
                .catch(function (err) {
                    return get_error_page();
                })
                .done();
        }

    });
};

module.exports = page_resolver;

