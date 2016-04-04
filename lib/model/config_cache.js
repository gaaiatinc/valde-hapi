/**
 * Created by Ali on 3/13/2015.
 */
"use strict";

let loggerFactory = require("../app_logger")
    , fs = require("fs")
    , path = require("path")
    , appConstants = require("../app_constants")
    , Q = require("q")
    , appConfig = require("../app_config").getConfig();


let logger = loggerFactory.getLogger("ConfigLRUCache", (appConfig.get("env:production") || appConfig.get("env:sandbox")) ? "WARN" : "DEBUG");
let localeConfigCache = {};
let folderConfigCache = {};
let contentFolder = appConstants.APP_BUNDLED_CONTENT_FOLDER;
let globalConfig;


/**
 *
 * @param localeID
 */
function createLocaleConfigCacheEntry(localeID) {

    return Q.Promise((resolve, reject) => {
            let configFilePathPart = path.posix.normalize(contentFolder + "/pages/" + localeID);

            Q.nfcall(fs.readFile, path.join(configFilePathPart, "/config.json"), {encoding: "utf8"})
                .then((localeConfig) => {
                    localeConfigCache[localeID] = JSON.parse(localeConfig);
                    resolve(localeConfig);
                }, (err) => {
                    reject(err);
                })
                .catch((err) => {
                    reject(err);
                })
                .done();
        }
    );
}

/**
 *
 * @param folderID
 */
function createFolderConfigCacheEntry(folderID) {

    return Q.Promise((resolve, reject) => {
        let configFilePathPart = path.posix.normalize(contentFolder + "/pages" + folderID);

        Q.nfcall(fs.readFile, path.join(configFilePathPart, "/config.json"), {encoding: "utf8"})
            .then((folderConfig) => {
                folderConfigCache[folderID] = JSON.parse(folderConfig);
                resolve(folderConfig);
            }, (err) => {
                reject(err);
            })
            .catch((err) => {
                reject(err);
            })
            .done();
    });
}


/**
 *
 * @param localeID
 */
function getLocaleConfig(localeID) {

    return Q.Promise((resolve, reject) => {
        if (appConfig.get("env:development") && (!appConfig.get("liveEmulation"))) {
            localeConfigCache = {};
        }

        let retVal = localeConfigCache[localeID];

        if (!retVal) {
            createLocaleConfigCacheEntry(localeID).then(resolve, reject).done();
        } else {
            resolve(retVal);
        }
    });
}

/**
 *
 * @param folderID
 */
function getFolderConfig(folderID) {

    return Q.Promise((resolve, reject) => {
        if (appConfig.get("env:development") && (!appConfig.get("liveEmulation"))) {
            folderConfigCache = {};
        }

        let retVal = folderConfigCache[folderID];

        if (!retVal) {
            createFolderConfigCacheEntry(folderID).then(resolve, reject).done();
        } else {
            resolve(retVal);
        }
    });

}

/**
 *
 */
function getGlobalConfig() {

    return Q.Promise((resolve, reject) => {
        if (appConfig.get("env:development") && (!appConfig.get("liveEmulation"))) {
            globalConfig = null;
        }

        if (!globalConfig) {
            let configFilePath = path.posix.normalize(contentFolder + "/resources/config.json");

            Q.nfcall(fs.readFile, path.resolve(configFilePath), {encoding: "utf8"})
                .then((theGlobalConfig) => {
                    globalConfig = JSON.parse(theGlobalConfig);
                    resolve(globalConfig);
                }, (err) => {
                    reject(err);
                })
                .catch((err) => {

                })
                .done();
        } else {
            resolve(globalConfig);
        }
    });
}

/**
 *
 * @param newContentFolder
 */
function pivotContentFolder(newContentFolder) {
    contentFolder = newContentFolder || appConstants.APP_BUNDLED_CONTENT_FOLDER;

    clear();
}

/**
 *
 */
function clear() {
    localeConfigCache = {};
    folderConfigCache = {};
    globalConfig = null;
}


/**
 *
 * @param entries
 */
function evictEntries(entries) {
    for (let entry in entries) {
        if (entries.hasOwnProperty(entry)) {
            delete localeConfigCache[entry];
            delete folderConfigCache[entry];
        }
    }
    globalConfig = null;
}

/**
 *
 * @type {Object.prototype}
 */
module.exports = {
    getLocaleConfig: getLocaleConfig,
    getFolderConfig: getFolderConfig,
    getGlobalConfig: getGlobalConfig,
    clear: clear,
    evictEntries: evictEntries,
    pivotContentFolder: pivotContentFolder
};

