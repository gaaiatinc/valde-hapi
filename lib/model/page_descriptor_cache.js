/**
 * Created by Ali on 3/13/2015.
 */
"use strict";

var LRUCacheFactory = require("lru-cache-js")
    , loggerFactory = require("app_logger")
    , fs = require("fs")
    , async = require("async")
    , path = require("path")
    , stringKeyFactory = require("string_key_factory")
    , appConstants = require("app_constants")
    , Q = require("q")
    , appConfig = require("app_config").getConfig();


var logger = loggerFactory.getLogger("PageDescriptorLRUCache", (appConfig.get("env:production") || appConfig.get("env:sandbox")) ? "WARN" : "DEBUG");
var pageDescriptorCache = LRUCacheFactory(appConfig.get("app:content:max_cache_size"), evictionNotifyCallback);
var contentFolder = appConstants.APP_BUNDLED_CONTENT_FOLDER;

/**
 *
 * @param evictedEntry
 */
function evictionNotifyCallback(evictedEntry) {

}

/**
 *
 * @param resourceFileNames
 */
function createCacheEntry(pageID) {

    return Q.Promise(function (resolve, reject) {
        var pageFilePathPart = path.posix.normalize(contentFolder + "/pages/" + pageID);
        var pageCacheEntry = {};


        //A promise to load the metadata:
        Q.nfcall(fs.readFile, path.resolve(pageFilePathPart + "/metadata.json"), {encoding: "utf8"})
            .then(function (metaDataStr) {

                //TODO: use JOI to validate the metadata and populae the default values insted:

                var pageMetadataObj = JSON.parse(metaDataStr);

                if (pageMetadataObj.loggedInOnly == undefined) {
                    pageMetadataObj.loggedInOnly = false;
                }
                if (pageMetadataObj.enabled == undefined) {
                    pageMetadataObj.enabled = true;
                }
                if (pageMetadataObj.showCountryList == undefined) {
                    pageMetadataObj.showCountryList = true;
                }
                if (pageMetadataObj.redirectInfo == undefined) {
                    pageMetadataObj.redirectInfo = {
                        redirectType: 0,
                        preserveQSP: false
                    };
                } else {
                    if (pageMetadataObj.redirectInfo.redirectType == undefined) {
                        pageMetadataObj.redirectInfo.redirectType = 0;
                    }

                    if (pageMetadataObj.redirectInfo.preserveQSP == undefined) {
                        pageMetadataObj.redirectInfo.preserveQSP = false;
                    }
                }

                if (pageMetadataObj.analyticsDescriptor == undefined) {
                    pageMetadataObj.analyticsDescriptor = {}
                }

                pageCacheEntry.pageMetadata = pageMetadataObj;

                //Return a promise to load the page content file:
                return Q.nfcall(fs.readFile, path.resolve(pageFilePathPart + "/resources/content.json"), {encoding: "utf8"});
            }, function (err) {
                logger.info("Page Metadata not found: " + path.posix.normalize(pageFilePathPart + "/metadata.json"));
                reject(err);
            })
            .then(function (content) {
                pageCacheEntry.content = JSON.parse(content);
                pageCacheEntry.pageViewID = path.posix.normalize(pageID + "/page");
                resolve(pageCacheEntry);
            }, reject)
            .catch(function (err) {
                console.log(err);
                logger.info("Failed to create a page descriptor for: " + path.posix.normalize(pageFilePathPart));
                reject(err);
            })
            .done();
    });
}


/**
 *
 * @param pageID
 */
function get(pageID) {

    return Q.Promise(function (resolve, reject) {
        if (appConfig.get("env:development") && (!appConfig.get("liveEmulation"))) {
            clear();
        }

        var stringKey = stringKeyFactory.createKey(pageID);
        var pageCacheEntry = pageDescriptorCache.get(stringKey);

        if (!pageCacheEntry) {
            createCacheEntry(pageID)
                .then(function (pageCacheEntry) {
                    pageDescriptorCache.put(stringKey, pageCacheEntry);
                    resolve(pageCacheEntry);
                }, reject)
                .done();
        } else {
            resolve(pageCacheEntry);
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
    pageDescriptorCache.clear();
}


/**
 *
 * @param entries
 */
function evictEntries(entries) {
    for (var entry in entries) {
        var stringKey = stringKeyFactory.createKey(entry);
        pageDescriptorCache.remove(stringKey);
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

