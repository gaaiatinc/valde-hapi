/**
 * Created by Ali Ismael on 11/24/13.
 */
"use strict";

const LRUCache = require("lru-cache-js"),
    logger_factory = require("../../app_logger"),
    fs = require("fs"),
    path = require("path"),
    dust = require("dustjs-linkedin"),
    app_utils = require("../../app_utils"),
    appConstants = require("../../app_constants"),
    app_config = require("../../app_config").get_config();

const {promiseSequencer} = require("../../app_utils");
const {promisify} = require("util");

// Load helpers
dust.helpers = require("dustjs-helpers").helpers;

//valde-helpers
Object.assign(dust.helpers, require("./valde-helpers"));

dust.optimizers.format = function(ctx, node) {
    return node;
};

const logger = logger_factory.getLogger( "DustLRUCache", (app_config.get("env:production") || app_config.get("env:sandbox"))? "WARN" : "DEBUG");

let webComponentsFolder = appConstants.APP_BUNDLED_CONTENT_FOLDER;

/**
 *
 * @param evictedEntry
 */
const evictionNotifyCallback = (evictedEntry) => {
    /**
     * if the LRU cache starts to fill up and evict elements,
     * we will clear the entire cache of dust!  This is sub-optimal, and we
     * will optimize it later.
     *
     * @type {{}}
     */
    logger.info("Evicting: " + evictedEntry.partialID);
    dust.cache = {};
};
const dustArtifactCache = new LRUCache(app_config.get("app:content:max_cache_size"), evictionNotifyCallback);

let staticResourcesRootFolder = app_config.get("platform:static_resources_path") || appConstants.APP_DEFAULT_STATIC_RESOURCES_PATH;
let staticJsResourcesFolder = path.resolve(path.posix.join(staticResourcesRootFolder, "/js"));

let staticCssResourcesFolder = path.resolve(path.posix.join(staticResourcesRootFolder, "/css"));

/**
 *
 * @param partialID
 * @param next
 */
const createCacheEntry = (partialID, next) => {
    let partialFilePathPart = webComponentsFolder + "/" + partialID;
    let partialFilePath = path.resolve(partialFilePathPart + ".dust");

    let compiledPartialFilePath = path.join(staticJsResourcesFolder, partialID + ".js");

    let dustPartialCacheEntry = {
        compiledSource: "",
        referencedPartials: [],
        partialID: partialID
    };

    /**
     * [__createStaticResourceFolder description]
     * @return {[type]} [description]
     */
    const __createStaticResourceFolder = () => {
        if (app_config.get("run_mode") == "development") {
            return app_utils.mkdirp(staticJsResourcesFolder, path.dirname(partialID));
        } else {
            return Promise.resolve();
        }
    };

    /**
     * [__read_dust_partial_code description]
     * @return {[type]} [description]
     */
    const __readDustPartialCode = () => {
        return promisify(fs.readFile)(partialFilePath, {encoding: "utf8"});
    };

    /**
     * [__identifyReferencedPartials description]
     * @param  {[type]} partialSource [description]
     * @return {[type]}               [description]
     */
    const __identifyReferencedPartials = (partialSource) => {
        return new Promise((resolve) => {
            //"(\\{\\>(\\S+?)((:|\\s+?).*?)*?/\\})";
            let partialRegExp = /(\{>(\S+?)((:|\s+?).*?)*?\/\})/gi;
            let partialStrArr;
            while ((partialStrArr = partialRegExp.exec(partialSource))) {
                let aPartialRef = partialStrArr[2]
                    .replace(/"/g, "")
                    .trim();
                if (dustPartialCacheEntry.referencedPartials.indexOf(aPartialRef) == -1) {
                    dustPartialCacheEntry
                        .referencedPartials
                        .push(aPartialRef);
                }
            }

            resolve(partialSource);
            logger.info("Identified referenced partials for dust template: " + partialID);
        });
    };

    /**
     * [__compileDustPartial description]
     * @param  {[type]} partialSource [description]
     * @return {[type]}               [description]
     */
    const __compileDustPartial = (partialSource) => {
        if (app_config.get("run_mode") == "development") {
            partialSource = partialSource && partialSource.replace(/\r\n/g, "\n");

            //the dust partial will be compiled and saved when APP is run in development mode:
            dustPartialCacheEntry.compiledSource = dust.compile(partialSource, partialID);
            return promisify(fs.writeFile)(compiledPartialFilePath, dustPartialCacheEntry.compiledSource);
        } else {
            return Promise.resolve();
        }
    };

    /**
     * [__loadCompiledDust description]
     * @return {[type]} [description]
     */
    const __loadCompiledDust = () => {
        if (app_config.get("run_mode") == "development") {
            return Promise.resolve();
        } else {
            return new Promise((resolve, reject) => {
                promisify(fs.readFile)(compiledPartialFilePath, {encoding: "utf8"})
                    .then((preCompiledSource) => {
                        dustPartialCacheEntry.compiledSource = preCompiledSource;
                        return resolve();
                    })
                    .catch((err) => {
                        return reject(err);
                    });
            });
        }
    };

    let dustPartialCreationTasks = [__createStaticResourceFolder, __readDustPartialCode, __identifyReferencedPartials, __compileDustPartial, __loadCompiledDust];
    promiseSequencer(dustPartialCreationTasks)
        .then(() => {
            next(null, dustPartialCacheEntry);
        })
        .catch((err) => {
            logger.warn("Failed to load dust template for ID: " + partialID);
            next(err, dustPartialCacheEntry);
        });

};

/**
 *
 * @param partialRefStr
 * @param next
 */
const get = (partialRefStr, next) => {
    let retVal = dustArtifactCache.get(partialRefStr);

    if (!retVal) {
        createCacheEntry(partialRefStr, (err, dustCacheEntry) => {
            if (err) {
                logger.warn("failed to load dust partials for ID: " + partialRefStr);
                next(err, null);
            } else {
                let partialLoadPromises = [];
                dustCacheEntry
                    .referencedPartials
                    .forEach((refItem) => {
                        partialLoadPromises.push(promisify(get)(refItem));
                    });

                dustArtifactCache.put(partialRefStr, dustCacheEntry);
                Promise.all(partialLoadPromises)
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
};

/**
 *
 */
const clear = () => {
    dustArtifactCache.clear();
    dust.cache = {};
};

/**
 *
 * @param newContentFolder
 */
const pivotContentFolder = (newContentFolder) => {
    webComponentsFolder = newContentFolder || appConstants.APP_BUNDLED_CONTENT_FOLDER;

    clear();
};

/**
 *
 * @param entries
 */
const evictEntries = (entries) => {
    for (let entry in entries) {
        dustArtifactCache.remove(entry);
        delete dust.cache[entry];
    }
};

/**
 *
 * @type {Object.prototype}
 */
module.exports = {
    get: get,
    clear,
    evictEntries,
    pivotContentFolder
};
