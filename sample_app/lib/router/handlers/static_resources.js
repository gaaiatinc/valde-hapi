/**
 * Created by Ali on 3/13/2015.
 */

"use strict";

var path = require ("path");


module.exports = {
    method: "GET",
    path: "/res/{resID*}",
    handler: {
        directory: {
            path: "public"
        }
    }
};

