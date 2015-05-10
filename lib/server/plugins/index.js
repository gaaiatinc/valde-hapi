/**
 * Created by Ali on 4/27/2015.
 */
"use strict";

module.exports =
    [
        {
            "module_path": "./visitor_tracking",
            "module_options": {
                password: "r729bpssf4a4U3D7B67F9x1pss",
                cookie: "vtid",
                isSecure: true,
                domain: "shiploop.com",
                ttl: 3650 * 24 * 60 * 60 * 1000 //10 years
            }
        },
        {
            "module_path": "./csrf_agent",
            "module_options": {
                password: "r729bpssf4a4U3D7B67F9x1pss"
            }
        }
    ];