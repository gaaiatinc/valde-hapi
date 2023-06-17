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
    async launch() {
        return new Promise(async (resolve, reject) => {
            try {
                this.app_constants = require("./app_constants");
                this.model = require("./model");
                this.server = await require("./server");
                await this.server.initialize();
                await this.server.start();
                return resolve(this.server);
            } catch (err) {
                return reject(err);
            }
        });
    }

}

/**
 *
 * @type {Object}
 */
module.exports = new ValdeHapiPlatform();
