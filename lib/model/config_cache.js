/**
 * Created by Ali on 3/13/2015.
 */
"use strict";

var loggerFactory = require("app_logger")
    , fs = require("fs")
    , path = require("path")
    , appConstants = require("app_constants")
    , Q = require("q")
    , appConfig = require("app_config").getConfig();


var logger = loggerFactory.getLogger("ConfigLRUCache", (appConfig.get("env:production") || appConfig.get("env:sandbox")) ? "WARN" : "DEBUG");
var localeConfigCache = {};
var folderConfigCache = {};
var contentFolder = appConstants.APP_BUNDLED_CONTENT_FOLDER;
var globalConfig;


/**
 *
 * @param localeID
 */
function createLocaleConfigCacheEntry(localeID) {

    return Q.Promise(
        function (resolve, reject) {
            var configFilePathPart = path.posix.normalize(contentFolder + "/pages/" + localeID);

            Q.nfcall(fs.readFile, path.resolve(configFilePathPart + "/config.json"), {encoding: "utf8"})
                .then(function (localeConfig) {
                    localeConfigCache[localeID] = JSON.parse(localeConfig);
                    resolve(localeConfig);
                }, function (err) {
                    reject(err);
                })
                .catch(function (err) {
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

    return Q.Promise(function (resolve, reject) {
        var configFilePathPart = path.posix.normalize(contentFolder + "/pages" + folderID);

        Q.nfcall(fs.readFile, path.resolve(configFilePathPart + "/config.json"), {encoding: "utf8"})
            .then(function (folderConfig) {
                folderConfigCache[folderID] = JSON.parse(folderConfig);
                resolve(folderConfig);
            }, function (err) {
                reject(err);
            })
            .catch(function (err) {
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

    return Q.Promise(function (resolve, reject) {
        if (appConfig.get("env:development") && (!appConfig.get("liveEmulation"))) {
            localeConfigCache = {};
        }

        var retVal = localeConfigCache[localeID];

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

    return Q.Promise(function (resolve, reject) {
        if (appConfig.get("env:development") && (!appConfig.get("liveEmulation"))) {
            folderConfigCache = {};
        }

        var retVal = folderConfigCache[folderID];

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

    return Q.Promise(function (resolve, reject) {
        if (appConfig.get("env:development") && (!appConfig.get("liveEmulation"))) {
            globalConfig = null;
        }

        if (!globalConfig) {
            var configFilePath = path.posix.normalize(contentFolder + "/resources/config.json");

            Q.nfcall(fs.readFile, path.resolve(configFilePath), {encoding: "utf8"})
                .then(function (theGlobalConfig) {
                    globalConfig = JSON.parse(theGlobalConfig);
                    resolve(globalConfig);
                }, function (err) {
                    reject(err);
                })
                .catch(function (err) {

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
    for (var entry in entries) {
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

