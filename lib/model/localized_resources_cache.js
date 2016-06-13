/**
 * Created by Ali on 3/13/2015.
 */
"use strict";

let loggerFactory = require("../app_logger"),
    fs = require("fs"),
    path = require("path"),
    appConstants = require("../app_constants"),
    Q = require("q"),
    appConfig = require("../app_config").getConfig();

let logger = loggerFactory.getLogger("LocaleResourceSetLRUCache", (appConfig.get("env:production") || appConfig.get("env:sandbox")) ? "WARN" : "DEBUG");
let localeResourcesCache = {};
let contentFolder = appConstants.APP_BUNDLED_CONTENT_FOLDER;

/**
 *
 * @param localeID
 */
function createLocaleResourceSetCacheEntry(localeID) {

    return Q.Promise((resolve, reject) => {
        let localeResourceSetFilePathPart = path.posix.normalize(contentFolder + "/resource_sets/" + localeID);

        Q.nfcall(
                fs.readFile, path.join(localeResourceSetFilePathPart, "/resource_set.json"), {
                    encoding: "utf8"
                })
            .then((localeResourceSetStr) => {
                localeResourcesCache[localeID] = JSON.parse(localeResourceSetStr);
                resolve(localeResourcesCache[localeID]);
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
function getLocaleResourceSet(localeID) {

    return Q.Promise((resolve, reject) => {
        if (appConfig.get("env:development") && (!appConfig.get("liveEmulation"))) {
            evictEntries([localeID]);
        }

        let retVal = localeResourcesCache[localeID];

        if (!retVal) {
            createLocaleResourceSetCacheEntry(localeID)
                .then(resolve, reject)
                .done();
        } else {
            resolve(retVal);
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
    localeResourcesCache = {};
}

/**
 *
 * @param entries
 */
function evictEntries(entries) {
    if (Array.isArray(entries)) {
        entries.forEach((entry, idx, arr) => {
            delete localeResourcesCache[entry];
        });
    }
}

/**
 *
 * @type {Object.prototype}
 */
module.exports = {
    getLocaleResourceSet: getLocaleResourceSet,
    clear: clear,
    evictEntries: evictEntries,
    pivotContentFolder: pivotContentFolder
};
