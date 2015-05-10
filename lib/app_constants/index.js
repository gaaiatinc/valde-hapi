/**
 * Created by nong on 4/10/14.
 *
 * Intended to be required like:
 *      var constants = require("../lib/util/constants").constants
 */
"use strict";

var appUtils = require("app_utils");

//Set constants here, these should only 1 level deep (name: value) pairs.
var constants = {
    CAL_APP: "APP",
    SHARE_SITE_ROOT_FOLDER: "shared",

    //WURFL constants
    IS_MOBILE: "is_wireless_device",
    IS_TABLET: "is_tablet",
    CLIENT_OS_TYPE: {
        ANDROID: "Android",
        IPHONE: "iPhone",
        IPAD: "iPad"
    },
    //APP Bundled folder constants
    APP_BUNDLED_CONTENT_FOLDER: "./WebComponents",
    APP_BUNDLED_RESOURCES_FOLDER: "./WebComponents/APPResources"


};

constants = appUtils.freeze(constants);
module.exports = constants;
