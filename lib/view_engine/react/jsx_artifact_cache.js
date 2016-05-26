/**
 * Created by Ali Ismael on 11/24/13.
 */
"use strict";

let LRUCacheFactory = require("lru-cache-js"),
    loggerFactory = require("../../app_logger"),
    fs = require("fs"),
    Q = require("q"),
    path = require("path"),
    appConstants = require("../../app_constants"),
    stringKeyFactory = require("../../string_key_factory"),
    jsxCompiler = require("./dyn_compiler"),
    vm = require("vm"),
    appConfig = require("../../app_config").getConfig();

let logger = loggerFactory.getLogger("JSXLRUCache", (appConfig.get("env:production") || appConfig.get("env:sandbox")) ? "WARN" : "DEBUG");
let jsxArtifactCache = LRUCacheFactory(appConfig.get("app:content:max_cache_size"), evictionNotifyCallback);
let webComponentsFolder = appConstants.APP_BUNDLED_CONTENT_FOLDER;

jsxCompiler.init(webComponentsFolder);

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
    let jsxFilePathPart = webComponentsFolder + "/" + jsxEntryRelativePath;

    let compiledJSXFilePath = path.resolve(jsxCompiler.getStaticResourceFolder() + "/" + jsxEntryRelativePath + ".js");

    let jsxCacheEntry = {
        compiledSource: "",
        jsxEntryRelativePath: jsxEntryRelativePath
    };

    let server_side = false;
    //if (jsxEntryRelativePath.indexOf("server_side") > -1) {
    //    server_side = true;
    //}

    /**
     *
     * @returns {*}
     * @private
     */
    function __compileJSX() {
        if (appConfig.get("env:development") && (!appConfig.get("liveEmulation"))) {
            logger.info("Compiling JSX for: " + path.posix.dirname(jsxEntryRelativePath));
            return jsxCompiler.compileJSXEntity(path.posix.dirname(jsxEntryRelativePath), path.posix.basename(jsxEntryRelativePath, ".jsx"), server_side, webComponentsFolder);
        } else {
            return Q();
        }
    }

    /**
     *
     * @private
     */
    function __loadCompiledJSX() {
        return Q.nfcall(fs.readFile, compiledJSXFilePath, {
            encoding: "utf8"
        });
        //if(server_side) {
        //    return Q.nfcall(fs.readFile, compiledJSXFilePath, {encoding: "utf8"});
        //} else {
        //    return Q();
        //}
    }

    let allTasks = [__compileJSX, __loadCompiledJSX];

    allTasks.reduce(Q.when, Q())
        .then((jsCode) => {
            jsCode = jsCode || "";
            jsxCacheEntry.compiledSource = new vm.Script(jsCode);
            next(null, jsxCacheEntry);
        })
        .catch((err) => {
            next(err, null);
        })
        .finally();
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

    let stringKey = stringKeyFactory.createKey(jsxRefStr);
    let retVal = jsxArtifactCache.get(stringKey);

    if (!retVal) {
        createCacheEntry(
            jsxRefStr,
            (err, jsxCacheEntry) => {
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

    jsxCompiler.init(webComponentsFolder);

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
    for (let entry in entries) {
        let stringKey = stringKeyFactory.createKey(entry);
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
