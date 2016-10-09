/**
 * Created by Ali on 3/23/2015.
 */

"use strict";

let app_config = require("../app_config").get_config(),
    world_locals = require("./world_locales"),
    accept_language = require("./accept_language");

// let supported_locals = [];

accept_language.languages(app_config.get("platform:supported_locales"));

/**
 *
 * @param request
 * @param reply
 */
const get_request_locale = (request) => {
    if (request.headers && request.headers["x-literal-url-cc"]) {
        let url_country = request.headers["x-literal-url-cc"].toUpperCase();
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
    } else if (request.headers && request.headers["accept-language"]) {
        let tempObj = accept_language.parse(request.headers["accept-language"]);

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
 * @returns {*}
 */
//locale_resolver.init = function () {
//    return Q.Promise(function (resolve, reject) {
//        Q.nfcall(fs.readdir, path.posix.normalize(appConstants.APP_BUNDLED_CONTENT_FOLDER + "/pages/"))
//            .then(function (dirNames) {
//                let supportedCountries = dirNames.filter(function (dirNm, idx, arr) {
//                    return dirNm.length === 2;
//                });
//
//                let numCountries = supportedCountries.length;
//                supportedCountries.forEach(function (cntryNm, idx, arr) {
//                    Q.nfcall(fs.readdir, path.posix.normalize(appConstants.APP_BUNDLED_CONTENT_FOLDER + "/pages/" + cntryNm))
//                        .then(function (lngNms) {
//                            let supportedLanguages = lngNms.filter(function (langNm, idx, arr) {
//                                return langNm.length === 2;
//                            });
//                            supportedLanguages.forEach(function (lnnm, idx, arr) {
//                                supported_locals.push(lnnm + "-" + cntryNm);
//                            });
//
//                        }, function (err) {
//                            throw new Error(err);
//                        })
//                        .finally(function () {
//                            if (--numCountries == 0) {
//                                accept_language.languages(supported_locals);
//                                console.log(">>>>>>>>>>>>>>>>>>>>>>" + supported_locals);
//                                //accept_language.defaultLanguageTag("en-US");
//                                resolve(supported_locals);
//                            }
//                        })
//                        .done();
//                });
//            }, function (err) {
//                console.log(err);
//                resolve(["en-US"]);
//            }).done();
//    });
//
//};

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
