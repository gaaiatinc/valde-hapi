/**
 * Created by Ali Ismael on 11/24/13.
 */
"use strict";

var LRUCacheFactory = require("lru-cache-js")
    , loggerFactory = require("../../app_logger")
    , fs = require("fs")
    , path = require("path")
    , async = require("async")
    , appConstants = require("../../app_constants")
    , stringKeyFactory = require("../../string_key_factory")
    , appConfig = require("../../app_config").getConfig();


var logger = loggerFactory.getLogger("JSXLRUCache", (appConfig.get("env:production") || appConfig.get("env:sandbox")) ? "WARN" : "DEBUG");
var jsxArtifactCache = LRUCacheFactory(appConfig.get("app:content:max_cache_size"), evictionNotifyCallback);
var webComponentsFolder = appConstants.APP_BUNDLED_CONTENT_FOLDER;

/**
 *
 * @param evictedEntry
 */
function evictionNotifyCallback(evictedEntry) {
    /**
     * if the LRU cache starts to fill up and evict elements.
     */
}

/**
 *
 * @param jsxEntryRelativePath
 * @param next
 */
function createCacheEntry(jsxEntryRelativePath, next) {
    var jsxFilePathPart = webComponentsFolder + "/" + jsxEntryRelativePath;
    var jsxFilePath = path.posix.resolve(jsxFilePathPart + ".jsx");
    var compiledJSXFilePath = path.posix.resolve(jsxFilePathPart + ".js");

    var jsxCacheEntry = {
        compiledSource: "",
        jsxEntryRelativePath: jsxEntryRelativePath
    };

    next(null, jsxCacheEntry);
}


/**
 *
 * @param jsxRefStr
 * @param next
 */
function get(jsxRefStr, next) {

    if (appConfig.get("env:development") && (!appConfig.get("liveEmulation"))) {
        clear();
    }

    var stringKey = stringKeyFactory.createKey(jsxRefStr);
    var retVal = jsxArtifactCache.get(stringKey);

    if (!retVal) {
        createCacheEntry(
            jsxRefStr,
            function (err, jsxCacheEntry) {
                if (err) {
                    logger.warn("failed to load jsx file for ID: " + jsxRefStr);
                    next(err, null);
                } else {
                    jsxArtifactCache.put(stringKey, jsxCacheEntry);
                    next(null, jsxCacheEntry);
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
    jsxArtifactCache.clear();
}

/**
 *
 * @param entries
 */
function evictEntries(entries) {
    for (var entry in entries) {
        var stringKey = stringKeyFactory.createKey(entry);
        jsxArtifactCache.remove(stringKey);
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

