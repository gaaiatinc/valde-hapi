/**
 * Created by Ali on 3/13/2015.
 */
"use strict";

const logger_factory = require("../app_logger"),
    fs = require("fs"),
    path = require("path"),
    appConstants = require("../app_constants"),
    app_config = require("../app_config").get_config();

const {promisify} = require("util");

const logger = logger_factory.getLogger("LocaleResourceSetCache", (app_config.get("env:production") || app_config.get("env:sandbox"))
    ? "WARN"
    : "DEBUG");
let localeResourcesCache = {};
let contentFolder = appConstants.APP_BUNDLED_CONTENT_FOLDER;

/**
 *
 * @param localeID
 */
const createLocaleResourceSetCacheEntry = (localeID) => {

    return new Promise((resolve, reject) => {
        let localeResourceSetFilePathPart = path.posix.normalize(contentFolder + "/resource_sets/" + localeID);

        promisify(fs.readFile)(path.join(localeResourceSetFilePathPart, "/resource_set.json"), {encoding: "utf8"}).then((localeResourceSetStr) => {
            localeResourcesCache[localeID] = JSON.parse(localeResourceSetStr);
            return resolve(localeResourcesCache[localeID]);
        }).catch((err) => {
            logger.error(err);
            return reject(err);
        });
    });
};

/**
 *
 * @param entries
 */
const evictEntries = (entries) => {
    if (Array.isArray(entries)) {
        entries.forEach((entry) => {
            delete localeResourcesCache[entry];
        });
    }
};

/**
 *
 * @param localeID
 */
const getLocaleResourceSet = (localeID) => {

    return new Promise((resolve, reject) => {
        if (app_config.get("env:development") && (!app_config.get("liveEmulation"))) {
            evictEntries([localeID]);
        }

        let retVal = localeResourcesCache[localeID];

        if (!retVal) {
            return createLocaleResourceSetCacheEntry(localeID).then(resolve, reject);
        } else {
            return resolve(retVal);
        }
    });
};

/**
 *
 */
const clear = () => {
    localeResourcesCache = {};
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
 * @type {Object.prototype}
 */
module.exports = {
    getLocaleResourceSet,
    clear,
    evictEntries,
    pivotContentFolder
};
