/**
 * Created by Ali Ismael on 11/24/13.
 */
"use strict";

let LRUCacheFactory = require("lru-cache-js")
    , loggerFactory = require("../../app_logger")
    , fs = require("fs")
    , path = require("path")
    , dust = require("dustjs-linkedin")
    , Q = require("q")
//    , async = require("async")
    , appConstants = require("../../app_constants")
    , stringKeyFactory = require("../../string_key_factory")
    , appConfig = require("../../app_config").getConfig();


// Load helpers
dust.helpers = require("dustjs-helpers").helpers;

dust.optimizers.format = function (ctx, node) {
    return node
};

let logger = loggerFactory.getLogger("DustLRUCache", (appConfig.get("env:production") || appConfig.get("env:sandbox")) ? "WARN" : "DEBUG");
let dustArtifactCache = LRUCacheFactory(appConfig.get("app:content:max_cache_size"), evictionNotifyCallback);
let webComponentsFolder = appConstants.APP_BUNDLED_CONTENT_FOLDER;

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
    let compiledPartialFilePath = path.resolve(partialFilePathPart + ".js");


    let dustPartialCacheEntry = {
        compiledSource: "",
        referencedPartials: [],
        partialID: partialID
    };

    identifyReferencedPartials(next);


    /**
     *
     * @param next
     */
    function identifyReferencedPartials(next) {
        fs.readFile(
            partialFilePath,
            {encoding: "utf8"},
            (err, partialSource) => {
                if (err) {
                    logger.warn("Failed to load dust template for ID: " + partialID);
                    next(err, dustPartialCacheEntry);
                } else {
                    //"(\\{\\>(\\S+?)((:|\\s+?).*?)*?/\\})";
                    let partialRegExp = /(\{\>(\S+?)((:|\s+?).*?)*?\/\})/gi;
                    let partialStrArr;
                    while (partialStrArr = partialRegExp.exec(partialSource)) {
                        let aPartialRef = partialStrArr[2].replace(/"/g, "").trim();
                        if (dustPartialCacheEntry.referencedPartials.indexOf(aPartialRef) == -1) {
                            dustPartialCacheEntry.referencedPartials.push(aPartialRef);
                        }
                    }

                    logger.info("Loaded dust template for ID: " + partialID);

                    if (appConfig.get("runMode") == "development") {
                        partialSource = partialSource && partialSource.replace(/\r\n/g, "\n");

                        //the dust partial will be compiled and saved when APP is run in development mode:
                        dustPartialCacheEntry.compiledSource = dust.compile(partialSource, partialID);
                        fs.writeFile(
                            compiledPartialFilePath,
                            dustPartialCacheEntry.compiledSource,
                            (err) => {
                                next(err, dustPartialCacheEntry);
                            });
                    } else {
                        fs.readFile(
                            compiledPartialFilePath,
                            {encoding: "utf8"},
                            (err, preCompiledSource) => {
                                dustPartialCacheEntry.compiledSource = preCompiledSource;
                                next(err, dustPartialCacheEntry);
                            });
                    }

                }
            }
        );
    }
}


/**
 *
 * @param partialRefStr
 * @param next
 */
function get(partialRefStr, next) {

    if (appConfig.get("env:development") && (!appConfig.get("liveEmulation"))) {
        clear();
    }

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


                    // dustArtifactCache.put(stringKey, dustCacheEntry);
                    //
                    // async.each(
                    //     dustCacheEntry.referencedPartials,
                    //     (refItem, foreachNext) => {
                    //         get(refItem, foreachNext);
                    //     },
                    //     (err) => {
                    //         if (err) {
                    //             logger.warn("failed to load at least one of the referenced partials!");
                    //             next(err);
                    //         } else {
                    //             next(null, dustCacheEntry);
                    //         }
                    //     });
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

