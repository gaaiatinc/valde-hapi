/**
 * Created by Ali on 3/10/2015.
 */
"use strict";

let platform = require("valde-hapi");
let path = require("path");

platform.init(path.dirname(require.main.filename));

const pilot = async () => {
    try {
        const server = await platform.launch();

        let app_config = platform.app_config;

        let loggerFactory = platform.app_logger;

        let logger = loggerFactory.getLogger( "SampleApp", (app_config.get("env:production")) ? "WARN" : "DEBUG");

        logger.info("Server running at:", server.info.uri);
    } catch (err) {
        console.log(err);
    }
};

pilot();
