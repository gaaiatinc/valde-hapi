/**
 * Created by Ali on 4/27/2015.
 */
"use strict";
const app_config = require("../../app_config").get_config();

const tracking_cookie_name = "vtid";

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
            password: app_config.get("platform:visitor_tracking:vt_cookie_password"),
            tr_cookie: tracking_cookie_name,
            isSecure: true,
            domain: app_config.get("app_url_domain"),
            ttl: 3650 * 24 * 60 * 60 * 1000 //10 years
        }
    },
    {
        "module_path": "./csrf_agent",
        "module_options": {
            password: app_config.get("platform:csrf:csrf_header_password")
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
