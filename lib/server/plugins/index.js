/**
 * Created by Ali on 4/27/2015.
 */
"use strict";
let appConfig = require("../../app_config").getConfig();

let tracking_cookie_name = "vtid";

module.exports = [
    {
        "module_path": "./locale_resolver",
        "module_options": {
            default_locale: "en_US",
            tr_cookie: tracking_cookie_name
        }
    },
    {
        "module_path": "./visitor_tracking",
        "module_options": {
            password: appConfig.get("platform:visitor_tracking:vt_cookie_password"),
            tr_cookie: tracking_cookie_name,
            isSecure: true,
            domain: appConfig.get("app_url_domain"),
            ttl: 3650 * 24 * 60 * 60 * 1000 //10 years
        }
    },
    {
        "module_path": "./csrf_agent",
        "module_options": {
            password: appConfig.get("platform:csrf:csrf_header_password")
        }
    },
    {
        "module_path": "./resource_set",
        "module_options": {}
    },
    {
        "module_path": "./web_model",
        "module_options": {}
    }
];
