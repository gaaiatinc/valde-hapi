/**
 * Created by Ali on 3/23/2015.
 */

"use strict";


var Q = require("q"),
    loggerFactory = require("app_logger"),
    fs = require("fs"),
    path = require("path"),
    appConstants = require("app_constants"),
    appConfig = require("app_config").getConfig(),
    world_locals = require("./world_locales"),
    accept_language = require("./accept_language");


var locale_resolver = {};
var supported_locals = [];


accept_language.languages(appConfig.get("platform:supported_locales"));

/**
 *
 * @param request
 * @param reply
 */
locale_resolver.get_request_locale = function (request, reply) {
    if (request.headers && request.headers["x-literal-url-cc"]) {
        var url_country = request.headers["x-literal-url-cc"].toUpperCase();
        var url_language;
        var default_lang;
        if (world_locals[url_country]) {
            default_lang = world_locals[url_country].default_language;

            var tempRE = /(.+)-\S\S/;
            var tempMtchs = default_lang.match(tempRE);
            if (tempMtchs) {
                url_language = tempMtchs[1];
                return {
                    country: url_country, //two letter country code
                    language: url_language  //two letter language code
                }
            }
        }

        /**
         * As the default, the en-US is returned if no URL  country support is found:
         */
        return {
            country: "US", //two letter country code
            language: "en"  //two letter language code
        }
    } else if (request.headers && request.headers["accept-language"]) {
        var tempObj = accept_language.parse(request.headers["accept-language"]);

        return {
            country: tempObj[0].region, //two letter country code
            language: tempObj[0].language  //two letter language code
        }
    } else {
        return {
            country: "US", //two letter country code
            language: "en"  //two letter language code
        }
    }
};


/**
 *
 * @param country_2C
 */
locale_resolver.get_default_locale_for_country = function (country_2C) {
    if (world_locals[country_2C]) {
        var temp_str = world_locals[country_2C] && world_locals[country_2C].default_language;
        var temp_str_arr = (temp_str || "en-US").split("-");

        return {
            country: temp_str_arr[1], //two letter country code
            language: temp_str_arr[0]  //two letter language code
        };
    } else {
        return {
            country: "US", //two letter country code
            language: "en"  //two letter language code
        }
    }
};


/**
 *
 * @param resolvedLocaleObj
 * @returns {string}
 */
locale_resolver.as_path_string = function (resolvedLocaleObj) {
    resolvedLocaleObj = resolvedLocaleObj || {
            country: "US", //two letter country code
            language: "en"  //two letter language code
        };

    return "/" + resolvedLocaleObj.country + "/" + resolvedLocaleObj.language + "/";
};


/**
 *
 * @param resolvedLocaleObj
 * @returns {string}
 */
locale_resolver.as_iso_string = function (resolvedLocaleObj) {
    resolvedLocaleObj = resolvedLocaleObj || {
            country: "US", //two letter country code
            language: "en"  //two letter language code
        };

    return resolvedLocaleObj.language + "_" + resolvedLocaleObj.country;
};

/**
 *
 * @returns {*}
 */
locale_resolver.init = function () {
    return Q.Promise(function (resolve, reject) {
        Q.nfcall(fs.readdir, path.posix.normalize(appConstants.APP_BUNDLED_CONTENT_FOLDER + "/pages/"))
            .then(function (dirNames) {
                var supportedCountries = dirNames.filter(function (dirNm, idx, arr) {
                    if (dirNm.length === 2) {
                        return true;
                    } else {
                        return false;
                    }
                });

                var numCountries = supportedCountries.length;
                supportedCountries.forEach(function (cntryNm, idx, arr) {
                    Q.nfcall(fs.readdir, path.posix.normalize(appConstants.APP_BUNDLED_CONTENT_FOLDER + "/pages/" + cntryNm))
                        .then(function (lngNms) {
                            var supportedLanguages = lngNms.filter(function (langNm, idx, arr) {
                                if (langNm.length === 2) {
                                    return true;
                                } else {
                                    return false;
                                }
                            });
                            supportedLanguages.forEach(function (lnnm, idx, arr) {
                                supported_locals.push(lnnm + "-" + cntryNm);
                            });

                        }, function (err) {
                            throw new Error(err);
                        })
                        .finally(function () {
                            if (--numCountries == 0) {
                                accept_language.languages(supported_locals);
                                console.log(">>>>>>>>>>>>>>>>>>>>>>" + supported_locals);
                                //accept_language.defaultLanguageTag("en-US");
                                resolve(supported_locals);
                            }
                        })
                        .done();
                });
            }, function (err) {
                console.log(err);
                resolve(["en-US"]);
            }).done();
    });

};


/**
 *
 * @type {{}}
 */
module.exports = locale_resolver;

