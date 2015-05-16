/**
 * Created by Ali on 4/27/2015.
 */
"use strict";
var appConfig = require("../../app_config").getConfig();

module.exports =
    [
        {
            "module_path": "./visitor_tracking",
            "module_options": {
                password: appConfig.get("platform:visitor_tracking:vt_cookie_password"),
                cookie: "vtid",
                isSecure: true,
                domain: appConfig.get("app_url_domain"),
                ttl: 3650 * 24 * 60 * 60 * 1000 //10 years
            }
        },
        {
            "module_path": "./csrf_agent",
            "module_options": {
                password: appConfig.get("platform:csrf:csrf_header_password"),
            }
        }
    ];