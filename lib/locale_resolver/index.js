/**
 * Created by Ali on 3/23/2015.
 */

"use strict";

let app_config = require("../app_config").get_config(),
    world_locals = require("./world_locales"),
    _get = require("lodash/get"),
    accept_language = require("./accept_language");

// let supported_locals = [];

accept_language.languages(app_config.get("platform:plugins:valde_locale_resolver:supported_locales"));

/**
 *
 * @param request
 */
const get_request_locale = (request) => {
    let x_literal_url_cc_header = _get(request, ["headers", "x-literal-url-cc"], "");
    let cc_regex = /^([a-zA-Z]){2}$/;
    if (!cc_regex.test(x_literal_url_cc_header.trim())) {
        x_literal_url_cc_header = "";
    }

    let accept_language_header = _get(request, ["headers", "accept-language"], "");
    let acclang_regex = /^((([a-zA-Z]){1,8}(-([a-zA-Z]){1,8})*|\*)(;q=([0-9](\.[0-9]+)?))?\s*,\s*)*(([a-zA-Z]){1,8}(-([a-zA-Z]){1,8})*|\*)(;q=([0-9](\.[0-9]+)?))?$/;
    if (!acclang_regex.test(accept_language_header.trim())) {
        accept_language_header = "";
    }

    if (x_literal_url_cc_header) {
        let url_country = x_literal_url_cc_header.toUpperCase();
        let url_language;
        let default_lang;
        if (world_locals[url_country]) {
            default_lang = world_locals[url_country].default_language;

            let tempRE = /(.+)-\S\S/;
            let tempMtchs = default_lang.match(tempRE);
            if (tempMtchs) {
                url_language = tempMtchs[1];
                return {
                    country: url_country, //two letter country code
                    language: url_language //two letter language code
                };
            }
        }

        /**
         * As the default, the en-US is returned if no URL  country support is found:
         */
        return {
            country: "US", //two letter country code
            language: "en" //two letter language code
        };
    } else if (accept_language_header) {
        let tempObj = accept_language.parse(accept_language_header);

        return {
            country: tempObj[0].region, //two letter country code
            language: tempObj[0].language //two letter language code
        };
    } else {
        return {
            country: "US", //two letter country code
            language: "en" //two letter language code
        };
    }
};

/**
 *
 * @param country_2C
 */
const get_default_locale_for_country = (country_2C) => {
    if (world_locals[country_2C]) {
        let temp_str = world_locals[country_2C] && world_locals[country_2C].default_language;
        let temp_str_arr = (temp_str || "en-US").split("-");

        return {
            country: temp_str_arr[1], //two letter country code
            language: temp_str_arr[0] //two letter language code
        };
    } else {
        return {
            country: "US", //two letter country code
            language: "en" //two letter language code
        };
    }
};

/**
 *
 * @param resolvedLocaleObj
 * @returns {string}
 */
const as_path_string = (resolvedLocaleObj) => {
    resolvedLocaleObj = resolvedLocaleObj || {
        country: "US", //two letter country code
        language: "en" //two letter language code
    };

    return "/" + resolvedLocaleObj.country + "/" + resolvedLocaleObj.language + "/";
};

/**
 *
 * @param resolvedLocaleObj
 * @returns {string}
 */
const as_iso_string = (resolvedLocaleObj) => {
    resolvedLocaleObj = resolvedLocaleObj || {
        country: "US", //two letter country code
        language: "en" //two letter language code
    };

    return resolvedLocaleObj.language + "_" + resolvedLocaleObj.country;
};


/**
 *
 * @type {{}}
 */
module.exports = {
    get_request_locale,
    get_default_locale_for_country,
    as_path_string,
    as_iso_string
};
