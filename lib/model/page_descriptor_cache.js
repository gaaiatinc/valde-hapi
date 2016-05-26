/**
 * Created by Ali on 3/13/2015.
 */
"use strict";

let LRUCacheFactory = require("lru-cache-js"),
    loggerFactory = require("../app_logger"),
    fs = require("fs"),
    path = require("path"),
    stringKeyFactory = require("../string_key_factory"),
    appConstants = require("../app_constants"),
    Q = require("q"),
    appConfig = require("../app_config").getConfig();

let logger = loggerFactory.getLogger("PageDescriptorLRUCache", (appConfig.get("env:production") || appConfig.get("env:sandbox")) ? "WARN" : "DEBUG");
let pageDescriptorCache = LRUCacheFactory(appConfig.get("app:content:max_cache_size"), evictionNotifyCallback);
let contentFolder = appConstants.APP_BUNDLED_CONTENT_FOLDER;

/**
 *
 * @param evictedEntry
 */
function evictionNotifyCallback(evictedEntry) {

}

/**
 *
 * @param pageID
 * @returns {*}
 */
function createCacheEntry(pageID) {

    return Q.Promise((resolve, reject) => {
        let pageFilePathPart = path.posix.normalize(contentFolder + "/pages/" + pageID);
        let pageCacheEntry = {};

        //A promise to load the metadata:
        Q.nfcall(fs.readFile, path.join(pageFilePathPart, "/metadata.json"), {
                encoding: "utf8"
            })
            .then((metaDataStr) => {

                //TODO: use JOI to validate the metadata and populate the default values instead:

                let pageMetadataObj = JSON.parse(metaDataStr);

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
                    pageMetadataObj.analyticsDescriptor = {};
                }

                pageCacheEntry.pageMetadata = pageMetadataObj;

                //Return a promise to load the page content file:
                return Q.nfcall(fs.readFile, path.join(pageFilePathPart, "/resources/content.json"), {
                    encoding: "utf8"
                });
            }, (err) => {
                logger.info("Page Metadata not found: " + path.posix.normalize(pageFilePathPart + "/metadata.json"));
                reject(err);
            })
            .then((content) => {
                pageCacheEntry.content = JSON.parse(content);
                pageCacheEntry.pageViewID = path.posix.normalize(pageID + "/page");

                //return a promise which identifies the page type (react or dust)
                return Q.nfcall(fs.readdir, path.resolve(pageFilePathPart));
            })
            .then((files) => {
                if (files && Array.isArray(files)) {
                    if (files.indexOf("page.jsx") > -1) {
                        pageCacheEntry.pageViewTemplate = "react/index.jsx";
                        resolve(pageCacheEntry);
                    } else if (files.indexOf("page.dust") > -1) {
                        pageCacheEntry.pageViewTemplate = "dust/index.dust";
                        resolve(pageCacheEntry);
                    } else {
                        reject(new Error("Couldn't find page.jsx nor page.dust! "));
                    }
                } else {
                    reject(new Error("Couldn't find page.jsx nor page.dust! "));
                }
            })
            .catch((err) => {
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

    return Q.Promise((resolve, reject) => {
        if (appConfig.get("env:development") && (!appConfig.get("liveEmulation"))) {
            evictEntries([pageID]);
        }

        let stringKey = stringKeyFactory.createKey(pageID);
        let pageCacheEntry = pageDescriptorCache.get(stringKey);

        if (!pageCacheEntry) {
            createCacheEntry(pageID)
                .then((pageCacheEntry) => {
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
    if (Array.isArray(entries)) {
        entries.forEach((entry, idx, arr) => {
            let stringKey = stringKeyFactory.createKey(entry);
            pageDescriptorCache.remove(stringKey);
        });
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
