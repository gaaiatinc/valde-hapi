/**
 * Created on 3/13/2015.
 */

"use strict";
var app_config = require("valde-hapi").app_config.get_config();

var logger_factory = require("valde-hapi").app_logger;

var logger = logger_factory.getLogger("ViewEngine", (app_config.get("env:production")) ? "WARN" : "DEBUG");

/**
 *
 * @param server
 */
function regiterRoutes(server) {

    server.route(require("./handlers/web_page"));
    server.route(require("./handlers/static_resources"));

}


module.exports = regiterRoutes;
