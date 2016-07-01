/**
 * Created by Ali Ismael on 11/24/13.
 */
"use strict";

let LRUCacheFactory = require("lru-cache-js"),
    logger_factory = require("../../app_logger"),
    fs = require("fs"),
    path = require("path"),
    dust = require("dustjs-linkedin"),
    app_utils = require("../../app_utils"),
    Q = require("q"),
    appConstants = require("../../app_constants"),
    stringKeyFactory = require("../../string_key_factory"),
    app_config = require("../../app_config").get_config();

// Load helpers
dust.helpers = require("dustjs-helpers").helpers;

dust.optimizers.format = function (ctx, node) {
    return node;
};

let logger = logger_factory.getLogger("DustLRUCache", (app_config.get("env:production") || app_config.get("env:sandbox")) ? "WARN" : "DEBUG");
let dustArtifactCache = LRUCacheFactory(app_config.get("app:content:max_cache_size"), evictionNotifyCallback);
let webComponentsFolder = appConstants.APP_BUNDLED_CONTENT_FOLDER;

let staticResourcesRootFolder = app_config.get("platform:static_resources_path") || appConstants.APP_DEFAULT_STATIC_RESOURCES_PATH;
let staticJsResourcesFolder = path.resolve(path.posix.join(staticResourcesRootFolder, "/js"));
let staticCssResourcesFolder = path.resolve(path.posix.join(staticResourcesRootFolder, "/css"));


/**
 *
 * @param evictedEntry
 */
function evictionNotifyCallback(evictedEntry) {
    /**
     * if the LRU cache starts to fill up and evict elements,
     * we will clear the entire cache of dust!  This is sub-optimal, and we
     * will optimize it later.
     *
     * @type {{}}
     */
    dust.cache = {};
}

/**
 *
 * @param partialID
 * @param next
 */
function createCacheEntry(partialID, next) {
    let partialFilePathPart = webComponentsFolder + "/" + partialID;
    let partialFilePath = path.resolve(partialFilePathPart + ".dust");

    let compiledPartialFilePath = path.join(staticJsResourcesFolder, partialID + ".js");

    let dustPartialCacheEntry = {
        compiledSource: "",
        referencedPartials: [],
        partialID: partialID
    };

    let dustPartialCreationTasks = [__createStaticResourceFolder, __readDustPartialCode, __identifyReferencedPartials, __compileDustPartial, __loadCompiledDust];
    dustPartialCreationTasks.reduce(Q.when, Q())
        .then(() => {
            next(null, dustPartialCacheEntry);
        })
        .catch((err) => {
            logger.warn("Failed to load dust template for ID: " + partialID);
            next(err, dustPartialCacheEntry);
        });


    /**
     * [__createStaticResourceFolder description]
     * @return {[type]} [description]
     */
    function __createStaticResourceFolder() {
        if (app_config.get("run_mode") == "development") {
            return app_utils.mkdirp(staticJsResourcesFolder, path.dirname(partialID));
        } else {
            return Q();
        }
    }



    /**
     * [__read_dust_partial_code description]
     * @return {[type]} [description]
     */
    function __readDustPartialCode() {
        return Q.nfcall(fs.readFile, partialFilePath, {
            encoding: "utf8"
        });
    }

    /**
     * [__identifyReferencedPartials description]
     * @param  {[type]} partialSource [description]
     * @return {[type]}               [description]
     */
    function __identifyReferencedPartials(partialSource) {
        return Q.Promise((resolve, reject) => {
            //"(\\{\\>(\\S+?)((:|\\s+?).*?)*?/\\})";
            let partialRegExp = /(\{\>(\S+?)((:|\s+?).*?)*?\/\})/gi;
            let partialStrArr;
            while ((partialStrArr = partialRegExp.exec(partialSource))) {
                let aPartialRef = partialStrArr[2].replace(/"/g, "").trim();
                if (dustPartialCacheEntry.referencedPartials.indexOf(aPartialRef) == -1) {
                    dustPartialCacheEntry.referencedPartials.push(aPartialRef);
                }
            }

            resolve(partialSource);
            logger.info("Identified referenced partials for dust template: " + partialID);
        });
    }

    /**
     * [__compileDustPartial description]
     * @param  {[type]} partialSource [description]
     * @return {[type]}               [description]
     */
    function __compileDustPartial(partialSource) {
        if (app_config.get("run_mode") == "development") {
            partialSource = partialSource && partialSource.replace(/\r\n/g, "\n");

            //the dust partial will be compiled and saved when APP is run in development mode:
            dustPartialCacheEntry.compiledSource = dust.compile(partialSource, partialID);
            return Q.nfcall(fs.writeFile, compiledPartialFilePath, dustPartialCacheEntry.compiledSource);
        } else {
            return Q();
        }
    }

    /**
     * [__loadCompiledDust description]
     * @return {[type]} [description]
     */
    function __loadCompiledDust() {
        if (app_config.get("run_mode") == "development") {
            return Q();
        } else {
            return Q.Promise(
                (resolve, reject) => {
                    Q.nfcall(
                            fs.readFile, compiledPartialFilePath, {
                                encoding: "utf8"
                            })
                        .then((preCompiledSource) => {
                            dustPartialCacheEntry.compiledSource = preCompiledSource;
                            return resolve();
                        })
                        .catch((err) => {
                            return reject(err);
                        });
                });
        }
    }
}

/**
 *
 * @param partialRefStr
 * @param next
 */
function get(partialRefStr, next) {

    let stringKey = stringKeyFactory.createKey(partialRefStr);
    let retVal = dustArtifactCache.get(stringKey);

    if (!retVal) {
        createCacheEntry(
            partialRefStr,
            (err, dustCacheEntry) => {
                if (err) {
                    logger.warn("failed to load dust partials for ID: " + partialRefStr);
                    next(err, null);
                } else {

                    let partialLoadPromises = [];
                    dustCacheEntry.referencedPartials.forEach((refItem, idx, allArr) => {
                        partialLoadPromises.push(Q.nfcall(get, refItem));
                    });

                    dustArtifactCache.put(stringKey, dustCacheEntry);

                    Q.all(partialLoadPromises)
                        .then(() => {
                            next(null, dustCacheEntry);
                        })
                        .catch((err) => {
                            logger.warn("failed to load at least one of the referenced partials!" + err.message);
                            next(err);
                        });

                }
            });
    } else {
        next(null, retVal);
    }
}

/**
 *
 * @param newContentFolder
 */
function pivotContentFolder(newContentFolder) {
    webComponentsFolder = newContentFolder || appConstants.APP_BUNDLED_CONTENT_FOLDER;

    clear();
}

/**
 *
 */
function clear() {
    dustArtifactCache.clear();
    dust.cache = {};
}

/**
 *
 * @param entries
 */
function evictEntries(entries) {
    for (let entry in entries) {
        let stringKey = stringKeyFactory.createKey(entry);
        dustArtifactCache.remove(stringKey);
        delete dust.cache[entry];
    }
}

/**
 *
 * @type {Object.prototype}
 */
module.exports = {
    get: get,
    clear: clear,
    evictEntries: evictEntries,
    pivotContentFolder: pivotContentFolder
};
