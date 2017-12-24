/**
 * Created by Ali on 3/13/2015.
 */
"use strict";

let logger_factory = require("../app_logger"),
    fs = require("fs"),
    path = require("path"),
    appConstants = require("../app_constants"),
    app_config = require("../app_config").get_config();

const {promisify} = require("util");

let logger = logger_factory.getLogger("ConfigCache", (app_config.get("env:production") || app_config.get("env:sandbox"))
    ? "WARN"
    : "DEBUG");
let localeConfigCache = {};
let folderConfigCache = {};
let contentFolder = appConstants.APP_BUNDLED_CONTENT_FOLDER;
let globalConfig;

/**
 *
 * @param localeID
 */
const createLocaleConfigCacheEntry = (localeID) => {

    return new Promise((resolve, reject) => {
        let configFilePathPart = path.posix.normalize(contentFolder + "/pages/" + localeID);

        promisify(fs.readFile)(path.join(configFilePathPart, "/config.json"), {encoding: "utf8"}).then((localeConfig) => {
            localeConfigCache[localeID] = JSON.parse(localeConfig);
            resolve(localeConfig);
        }, (err) => {
            reject(err);
        }).catch((err) => {
            logger.error(err);
            reject(err);
        });
    });
};

/**
 *
 * @param folderID
 */
const createFolderConfigCacheEntry = (folderID) => {

    return new Promise((resolve, reject) => {
        let configFilePathPart = path.posix.normalize(contentFolder + "/pages" + folderID);

        promisify(fs.readFile)(path.join(configFilePathPart, "/config.json"), {encoding: "utf8"}).then((folderConfig) => {
            folderConfigCache[folderID] = JSON.parse(folderConfig);
            resolve(folderConfig);
        }, (err) => {
            reject(err);
        }).catch((err) => {
            reject(err);
        });
    });
};

/**
 *
 * @param localeID
 */
const getLocaleConfig = (localeID) => {

    return new Promise((resolve, reject) => {
        if (app_config.get("env:development") && (!app_config.get("liveEmulation"))) {
            localeConfigCache = {};
        }

        let retVal = localeConfigCache[localeID];

        if (!retVal) {
            createLocaleConfigCacheEntry(localeID).then(resolve, reject)();
        } else {
            resolve(retVal);
        }
    });
};

/**
 *
 * @param folderID
 */
const getFolderConfig = (folderID) => {

    return new Promise((resolve, reject) => {
        if (app_config.get("env:development") && (!app_config.get("liveEmulation"))) {
            folderConfigCache = {};
        }

        let retVal = folderConfigCache[folderID];

        if (!retVal) {
            createFolderConfigCacheEntry(folderID).then(resolve, reject)();
        } else {
            resolve(retVal);
        }
    });
};

/**
 *
 */
const getGlobalConfig = () => {

    return new Promise((resolve, reject) => {
        if (app_config.get("env:development") && (!app_config.get("liveEmulation"))) {
            globalConfig = null;
        }

        if (!globalConfig) {
            let configFilePath = path.posix.normalize(contentFolder + "/resources/config.json");

            promisify(fs.readFile)(path.resolve(configFilePath), {encoding: "utf8"}).then((theGlobalConfig) => {
                globalConfig = JSON.parse(theGlobalConfig);
                resolve(globalConfig);
            }, (err) => {
                reject(err);
            }).catch((err) => {
                logger.error(err);
            });
        } else {
            resolve(globalConfig);
        }
    });
};

/**
 *
 */
const clear = () => {
    localeConfigCache = {};
    folderConfigCache = {};
    globalConfig = null;
};

/**
 *
 * @param newContentFolder
 */
const pivotContentFolder = (newContentFolder) => {
    contentFolder = newContentFolder || appConstants.APP_BUNDLED_CONTENT_FOLDER;

    clear();
};

/**
 *
 * @param entries
 */
const evictEntries = (entries) => {
    for (let entry in entries) {
        if (entries.hasOwnProperty(entry)) {
            delete localeConfigCache[entry];
            delete folderConfigCache[entry];
        }
    }
    globalConfig = null;
};

/**
 *
 * @type {Object.prototype}
 */
module.exports = {
    getLocaleConfig,
    getFolderConfig,
    getGlobalConfig,
    clear,
    evictEntries,
    pivotContentFolder
};
