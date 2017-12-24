/**
 * Created by Ali on 4/27/2015.
 */
"use strict";
const app_config = require("../../app_config").get_config();

const tracking_cookie_name = "vtid";

module.exports = [
    {
        "module_path": "./locale_resolver",
        "once": true,
        "module_options": {
            default_locale: "en_US",
            tr_cookie: app_config.get("platform:plugins:valde_visitor_tracking:tracking_cookie_name") || tracking_cookie_name
        }
    }, {
        "module_path": "./visitor_tracking",
        "module_options": {
            password: app_config.get("platform:plugins:valde_visitor_tracking:vt_cookie_password"),
            tr_cookie: app_config.get("platform:plugins:valde_visitor_tracking:tracking_cookie_name") || tracking_cookie_name,
            isSecure: true,
            domain: app_config.get("app_url_domain"),
            ttl: (app_config.get("platform:plugins:valde_visitor_tracking:ttl") || (3650 * 24 * 60 * 60)) * 1000 // default 10 years
        }
    }, {
        "module_path": "./csrf_agent",
        "module_options": {
            password: app_config.get("platform:plugins:valde_csrf_agent:csrf_header_password"),
            "enabled_by_default": app_config.get("platform:plugins:valde_csrf_agent:enabled_by_default")
        }
    }, {
        "module_path": "./resource_set",
        "module_options": {}
    }, {
        "module_path": "./web_model",
        "module_options": {}
    }
];
