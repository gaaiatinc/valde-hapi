/**
 * Created by aismael on 2/21/14.
 */
"use strict";

const logger_factory = require("../app_logger"),
    app_config = require("nconf"),
    path = require("path"),
    os = require("os");

let logger;

/**
 * initialization
 */
let config_initialized = false;

/**
 * [init description]
 * @param  {[type]} config_directory [description]
 * @return {[type]}                  [description]
 */
const init = (application_root_folder) => {
    application_root_folder = path.resolve(application_root_folder || path.dirname(require.main.filename));

    let config_folder_path = path.join(application_root_folder, "config");

    app_config
        .env()
        .argv();
    let run_mode = app_config.get("NODE_ENV") || "development";
    let deploy_mode = app_config.get("DEPLOY_MODE") || "development";

    //app_config.defaults({env: {"development": "development", "env": "development"}, NODE_ENV: "development"});

    if (run_mode === "development") {
        app_config.file("development", path.join(config_folder_path, "/development.json"));
        app_config.set("env:development", "development");
        app_config.set("env:env", "development");
    } else if (run_mode === "production") {
        if (deploy_mode === "staging") {
            app_config.file("staging", path.join(config_folder_path, "staging.json"));
            app_config.set("env:staging", "staging");
            app_config.set("env:env", "staging");
        } else {
            deploy_mode = "production";
            app_config.set("env:production", "production");
            app_config.set("env:env", "production");
        }

        app_config.set("env:development", null);
    }

    app_config.file("live", path.join(config_folder_path, "config.json"));

    /**
     *
     */

    logger = logger_factory.getLogger(
        "APPConfig", run_mode === "production"
        ? "WARN"
        : "DEBUG");

    logger.info("APP configuration init in progress ....");

    let liveEmulation = app_config.get("LIVE_EMULATION") || "";
    liveEmulation = (liveEmulation == "true");
    app_config.set("liveEmulation", liveEmulation);

    logger.info(`APP run_mode is: ${run_mode}, APP deploy_mode is: ${deploy_mode}`);
    app_config.set("run_mode", run_mode);
    app_config.set("env:" + run_mode, run_mode);
    app_config.set("deploy_mode", deploy_mode);
    app_config.set("env:" + deploy_mode, deploy_mode);

    app_config.set("hostname", os.hostname());
    app_config.set("application_root_folder", application_root_folder);

    if (app_config.get("env:development")) {
        logger.info(`Backing stage hostname: ${app_config.get("topos:host")}`);
        let backingStage = app_config.get("topos:host") || ";";
        app_config.set("backing-stage", backingStage);
    }

    config_initialized = true;
    logger.info("APP configuration init completed.");

};

/**
 *
 * @returns {{}}
 */
const get_config = () => {
    if (!config_initialized) {
        throw new Error("APPConfig is not yet initialized!");
    } else {
        return app_config;
    }
};

/**
 *
 * @type {Object.prototype}
 */
module.exports = {
    init,
    get_config
};
