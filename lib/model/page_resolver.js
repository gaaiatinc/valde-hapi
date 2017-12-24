/**
 * Created by aismael on 11/24/13.
 */
"use strict";

const logger_factory = require("../app_logger"),
    path = require("path"),
    pageDescriptorCache = require("./page_descriptor_cache"),
    IP = require("ip"),
    moment = require("moment"),
    app_config = require("../app_config").get_config(),
    locale_resolver = require("../locale_resolver");

const logger = logger_factory.getLogger("PageResolver", (app_config.get("env:production") || app_config.get("env:sandbox"))
    ? "WARN"
    : "DEBUG");

/**
 *  This function must handle all the logic for:
 *      1- campaign duration and redirects
 *      2- whether the page is visible to logged in session
 *      3- all the fall-back logic
 *      4- ...
 *
 */
const resolve_page = (request, h) => {
    let request_locale_obj = locale_resolver.get_request_locale(request, h);

    /**
     *
     * @param  {[type]}  page_descriptor [description]
     * @return {Boolean}                 [description]
     */
    const __page_is_unavailable = (page_descriptor) => {

        if (!page_descriptor.pageMetadata.enabled) {
            logger.warn("The requested page: " + page_descriptor.pageMetadata.page_id + " is disabled");
            return true;
        }
        // example: "x-forwarded-for": "73.158.252.206, 172.31.27.18, 172.31.18.6, 172.31.28.247",
        //
        let all_forwarded_for_str = request.headers["x-forwarded-for"] || "";
        let ip_regex = /\s*,\s*/;
        let all_forwarded_for_array = all_forwarded_for_str.split(ip_regex);

        let is_ip_private = true;
        try {
            is_ip_private = IP.isPrivate(request.info.remoteAddress);
        } catch (err) {
            //
        }

        is_ip_private = all_forwarded_for_array.reduce((previous, current) => {
            try {
                if (!(current.trim())) {
                    return previous;
                } else {
                    return previous && IP.isPrivate(current.trim());
                }
            } catch (err) {
                return true;
            }
        }, is_ip_private);

        if ((!is_ip_private) && (page_descriptor.pageMetadata.access_conditions.visibility === "INTERNAL")) {
            logger.warn("The requested page: " + page_descriptor.pageMetadata.page_id + " is for INTERNAL visibility only");
            return true;
        }

        let nowDate = moment();

        if (nowDate.isBefore(page_descriptor.pageMetadata.campaign_start_date) || nowDate.isAfter(page_descriptor.pageMetadata.campaign_end_date)) {
            logger.warn("The campain duration for the requested page: " + page_descriptor.pageMetadata.page_id + " has expired");
            return true;
        } else {
            return false;
        }
    };

    return new Promise((resolve, reject) => {

        /**
         *
         * @returns {*}
         */
        const get_global_error_page = () => {
            let global_locale_obj = {
                country: "US", //two letter country code
                language: "en" //two letter language code
            };
            let req_locale_as_path_str = locale_resolver.as_path_string(global_locale_obj);

            return pageDescriptorCache.get(path.posix.normalize(req_locale_as_path_str + "/error")).then((page_descriptor) => {
                return resolve(page_descriptor);
            }, (err) => {
                logger.info(err);
                return reject(err);
            }).catch((err) => {
                logger.info(err);
                return reject(err);
            });
        };

        /**
         *
         * @returns {*}
         */
        const get_error_page = () => {
            let req_locale_as_path_str = locale_resolver.as_path_string(request_locale_obj);

            return pageDescriptorCache.get(path.posix.normalize(req_locale_as_path_str + "/error")).then((page_descriptor) => {
                if (__page_is_unavailable(page_descriptor)) {
                    return get_global_error_page();
                }
                return resolve(page_descriptor);
            }, (err) => {
                logger.info(err);
                return get_global_error_page();
            }).catch((err) => {
                logger.info(err);
                return reject(err);
            });
        };

        /**
         *
         * @returns {*}
         */
        const get_page_for_global_locale = () => {
            let global_locale_obj = {
                country: "US", //two letter country code
                language: "en" //two letter language code
            };
            let global_locale_as_path_str = locale_resolver.as_path_string(global_locale_obj);

            return pageDescriptorCache.get(path.posix.normalize(global_locale_as_path_str + "/" + request.params.pageID)).then((page_descriptor) => {
                if (__page_is_unavailable(page_descriptor)) {
                    return get_error_page();
                }
                return resolve(page_descriptor);
            }, (err) => {
                logger.info(err);
                return get_error_page();
            }).catch((err) => {
                logger.info(err);
                return get_error_page();
            });
        };

        /**
         *
         * @returns {*}
         */
        const get_page_for_default_locale = () => {
            let default_locale_obj = locale_resolver.get_default_locale_for_country(request_locale_obj.country);
            let default_locale_as_path_str = locale_resolver.as_path_string(default_locale_obj);

            return pageDescriptorCache.get(path.posix.normalize(default_locale_as_path_str + "/" + request.params.pageID)).then((page_descriptor) => {
                if (__page_is_unavailable(page_descriptor)) {
                    return get_page_for_global_locale();
                }
                return resolve(page_descriptor);
            }, (err) => {
                logger.info(err);
                return get_page_for_global_locale();
            }).catch((err) => {
                logger.info(err);
                return get_error_page();
            });
        };

        /**
         *
         * @returns {*}
         */
        const get_page_for_request_locale = () => {
            let req_locale_as_path_str = locale_resolver.as_path_string(request_locale_obj);

            return pageDescriptorCache.get(path.posix.normalize(req_locale_as_path_str + "/" + request.params.pageID)).then((page_descriptor) => {
                if (__page_is_unavailable(page_descriptor)) {
                    return get_page_for_default_locale();
                }
                return resolve(page_descriptor);
            }, (err) => {
                logger.info(err);
                return get_page_for_default_locale();
            }).catch((err) => {
                logger.info(err);
                return get_error_page();
            });
        };

        return get_page_for_request_locale();
    });
};

module.exports = {
    resolve_page
};
