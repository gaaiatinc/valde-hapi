/**
 * Created by Ali on 4/9/2015.
 */

"use strict";

/**
 *
 */
class ValdeHapiPlatform {

    constructor() {}

    /**
     *
     * @param  {[type]} application_root_folder [description]
     * @return {[type]}          [description]
     */
    init(application_root_folder) {
        this.application_root_folder = application_root_folder;
        let app_config_module = require("./app_config");
        app_config_module.init(application_root_folder);
        this.app_config = app_config_module.get_config();
        this.app_logger = require("./app_logger");
    }

    /**
     *
     * @param  {Function} next [description]
     * @return {[type]}        [description]
     */
    launch(next) {
        this.app_constants = require("./app_constants");
        this.database = require("./database");
        this.model = require("./model");
        this.server = require("./server");
        return this.server(next);
    }

}

/**
 *
 * @type {Object}
 */
module.exports = new ValdeHapiPlatform();
