/**
 * Created by Ali on 3/13/2015.
 */
"use strict";

let logger_factory = require("../app_logger"),
    fs = require("fs"),
    path = require("path"),
    appConstants = require("../app_constants"),
    Q = require("q"),
    app_config = require("../app_config").get_config();

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

    return Q.Promise((resolve, reject) => {
        let configFilePathPart = path.posix.normalize(contentFolder + "/pages/" + localeID);

        Q.nfcall(fs.readFile, path.join(configFilePathPart, "/config.json"), {encoding: "utf8"}).then((localeConfig) => {
            localeConfigCache[localeID] = JSON.parse(localeConfig);
            resolve(localeConfig);
        }, (err) => {
            reject(err);
        }).catch((err) => {
            logger.error(err);
            reject(err);
        }).done();
    });
};

/**
 *
 * @param folderID
 */
const createFolderConfigCacheEntry = (folderID) => {

    return Q.Promise((resolve, reject) => {
        let configFilePathPart = path.posix.normalize(contentFolder + "/pages" + folderID);

        Q.nfcall(fs.readFile, path.join(configFilePathPart, "/config.json"), {encoding: "utf8"}).then((folderConfig) => {
            folderConfigCache[folderID] = JSON.parse(folderConfig);
            resolve(folderConfig);
        }, (err) => {
            reject(err);
        }).catch((err) => {
            reject(err);
        }).done();
    });
};

/**
 *
 * @param localeID
 */
const getLocaleConfig = (localeID) => {

    return Q.Promise((resolve, reject) => {
        if (app_config.get("env:development") && (!app_config.get("liveEmulation"))) {
            localeConfigCache = {};
        }

        let retVal = localeConfigCache[localeID];

        if (!retVal) {
            createLocaleConfigCacheEntry(localeID).then(resolve, reject).done();
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

    return Q.Promise((resolve, reject) => {
        if (app_config.get("env:development") && (!app_config.get("liveEmulation"))) {
            folderConfigCache = {};
        }

        let retVal = folderConfigCache[folderID];

        if (!retVal) {
            createFolderConfigCacheEntry(folderID).then(resolve, reject).done();
        } else {
            resolve(retVal);
        }
    });
};

/**
 *
 */
const getGlobalConfig = () => {

    return Q.Promise((resolve, reject) => {
        if (app_config.get("env:development") && (!app_config.get("liveEmulation"))) {
            globalConfig = null;
        }

        if (!globalConfig) {
            let configFilePath = path.posix.normalize(contentFolder + "/resources/config.json");

            Q.nfcall(fs.readFile, path.resolve(configFilePath), {encoding: "utf8"}).then((theGlobalConfig) => {
                globalConfig = JSON.parse(theGlobalConfig);
                resolve(globalConfig);
            }, (err) => {
                reject(err);
            }).catch((err) => {
                logger.error(err);
            }).done();
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
