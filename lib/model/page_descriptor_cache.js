/**
 * Created by Ali on 3/13/2015.
 */
"use strict";

const LRUCache = require("lru-cache-js"),
    logger_factory = require("../app_logger"),
    fs = require("fs"),
    path = require("path"),
    appConstants = require("../app_constants"),
    Joi = require("joi"),
    app_config = require("../app_config").get_config();

const { promisify } = require("util");

/**
 *
 * @param evictedEntry
 */
const evictionNotifyCallback = (evictedEntry) => {
    logger.info(`page descriptor cache evicting: ${evictedEntry.toString()}`);
};

const logger = logger_factory.getLogger("PageDescriptorLRUCache", (app_config.get("env:production") || app_config.get("env:sandbox")) ? "WARN" : "DEBUG");
const pageDescriptorCache = new LRUCache(app_config.get("app:content:max_cache_size"), evictionNotifyCallback);
let contentFolder = appConstants.APP_BUNDLED_CONTENT_FOLDER;

////////////////////////////////////////////////////////////////////////////////
///
///

const metadata_schema = Joi
    .object({
        "page_id": Joi
            .string()
            .required(),
        "template_id": Joi
            .string()
            .required(),
        "mobile_template_id": Joi
            .string()
            .empty(""),
        "mobile_redirect_link": Joi
            .string()
            .empty(""),

        "access_conditions": Joi
            .object({
                "logged_in_only": Joi
                    .boolean()
                    .default(false),
                "visibility": Joi
                    .string()
                    .valid("INTERNAL", "WORLDWIDE")
                    .default("WORLDWIDE")
            })
            .required()
            .options({ allowUnknown: false }),
        "enabled": Joi
            .boolean()
            .default(true),
        "campaign_start_date": Joi
            .date()
            .iso()
            .required(),
        "campaign_end_date": Joi
            .date()
            .iso()
            .required(),

        "required_services": Joi
            .array()
            .items(Joi.object({}).options({ allowUnknown: true }))
            .default([]),

        "analytics_descriptor": Joi
            .object({})
            .required()
            .options({ allowUnknown: true })
    })
    .required()
    .options({ allowUnknown: false });

////////////////////////////////////////////////////////////////////////////////
///
///

/**
 *
 * @param pageID
 * @returns {*}
 */
const createCacheEntry = (pageID) => {

    return new Promise((resolve, reject) => {
        let pageFilePathPart = path
            .posix
            .normalize(contentFolder + "/pages/" + pageID);
        let pageCacheEntry = {};

        //A promise to load the metadata:
        promisify(fs.readFile)(path.join(pageFilePathPart, "/metadata.json"), { encoding: "utf8" })
            .then((metadata_str) => {
                let rawPageMetadataObj = JSON.parse(metadata_str);

                let results = metadata_schema.validate(rawPageMetadataObj);
                if (results.error) {
                    logger.info(`Page Metadata is invalid: ${path.posix.normalize(pageFilePathPart + "/metadata.json")},  ${results.error}`);
                    return reject(results.error);
                }
                let pageMetadataObj = results.value;

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
                return promisify(fs.readFile)(path.join(pageFilePathPart, "/resources/content.json"), { encoding: "utf8" });
            }, (err) => {
                logger.info(`Page Metadata not found: ${path.posix.normalize(pageFilePathPart)}/metadata.json`);
                return reject(err);
            })
            .then((content) => {
                pageCacheEntry.content = JSON.parse(content);
                pageCacheEntry.pageViewID = path
                    .posix
                    .normalize(pageID + "/page");

                //return a promise which identifies the page type (react or dust)
                return promisify(fs.readdir)(path.resolve(pageFilePathPart));
            })
            .then((files) => {
                if (files && Array.isArray(files)) {
                    if (files.indexOf("page.jsx") > -1) {
                        pageCacheEntry.pageViewTemplate = "react/index.jsx";
                        return resolve(pageCacheEntry);
                    } else if (files.indexOf("page.dust") > -1) {
                        pageCacheEntry.pageViewTemplate = "dust/index.dust";
                        return resolve(pageCacheEntry);
                    } else {
                        return reject(new Error("Couldn't find page.jsx nor page.dust! "));
                    }
                } else {
                    return reject(new Error("Couldn't find page.jsx nor page.dust! "));
                }
            })
            .catch((err) => {
                logger.info(`Failed to create a page descriptor for: ${path.posix.normalize(pageFilePathPart)}`);
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
            pageDescriptorCache.remove(entry);
        });
    }
};

/**
 *
 * @param pageID
 */
const get = (pageID) => {
    return new Promise((resolve, reject) => {
        if (app_config.get("env:development") && (!app_config.get("liveEmulation"))) {
            evictEntries([pageID]);
        }

        let pageCacheEntry = pageDescriptorCache.get(pageID);

        if (!pageCacheEntry) {
            createCacheEntry(pageID)
                .then((pageCacheEntry) => {
                    pageDescriptorCache.put(pageID, pageCacheEntry);
                    return resolve(pageCacheEntry);
                }, reject);
        } else {
            return resolve(pageCacheEntry);
        }

    });

};

/**
 *
 */
const clear = () => {
    pageDescriptorCache.clear();
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
    get: get,
    clear,
    evictEntries,
    pivotContentFolder
};
