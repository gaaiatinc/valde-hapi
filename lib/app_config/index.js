/**
 * Created by aismael on 2/21/14.
 */
"use strict";

let loggerFactory = require("../app_logger"),
    fs = require("fs"),
    appConfig = require("nconf"),
    path = require("path"),
    os = require("os");

let logger;

/**
 * initialization
 */

appConfig.env()
    .argv();
let runMode = appConfig.get("NODE_ENV") || "development";
let deployMode = appConfig.get("DEPLOY_MODE") || "development";

//appConfig.defaults({env: {"development": "development", "env": "development"}, NODE_ENV: "development"});

if (runMode === "development") {
    appConfig.file("development", path.join(path.dirname(require.main.filename), "config/development.json"));
    appConfig.set("env:development", "development");
    appConfig.set("env:env", "development");
} else if (runMode === "production") {
    if (deployMode === "staging") {
        appConfig.file("staging", path.join(path.dirname(require.main.filename), "config/staging.json"));
        appConfig.set("env:staging", "staging");
        appConfig.set("env:env", "staging");
    } else {
        deployMode = "production";
        appConfig.set("env:production", "production");
        appConfig.set("env:env", "production");
    }

    appConfig.set("env:development", null);
}

appConfig.file("live", path.join(path.dirname(require.main.filename), "config/config.json"));

/**
 *
 */

logger = loggerFactory.getLogger("APPConfig", runMode === "production" ? "WARN" : "DEBUG");

logger.info("APP configuration init in progress ....");

let liveEmulation = appConfig.get("LIVE_EMULATION") || "";
liveEmulation = (liveEmulation == "true");
appConfig.set("liveEmulation", liveEmulation);

logger.info("APP runMode is: " + runMode + " APP deployMode is: " + deployMode);
appConfig.set("runMode", runMode);
appConfig.set("env:" + runMode, runMode);
appConfig.set("deployMode", deployMode);
appConfig.set("env:" + deployMode, deployMode);

appConfig.set("hostname", os.hostname());

if (appConfig.get("env:development")) {
    logger.info("Backing stage hostname: ", appConfig.get("topos:host"));
    let backingStage = appConfig.get("topos:host") || ";";
    appConfig.set("backing-stage", backingStage);
}

logger.info("APP configuration init completed.");

/**
 *
 * @returns {{}}
 */
function getConfig() {
    if (!appConfig) {
        throw new Error("APPConfig is not yet initialized!");
    } else {
        return appConfig;
    }
}

/**
 *
 * @type {Object.prototype}
 */
module.exports = {
    getConfig: getConfig
};
