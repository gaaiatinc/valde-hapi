/**
 * Created by Ali Ismael on 11/24/13.
 */
"use strict";

var LRUCacheFactory = require("lru-cache-js"),
    loggerFactory = require("../../app_logger"),
    fs = require("fs"),
    Q = require("q"),
    path = require("path"),
    async = require("async"),
    appConstants = require("../../app_constants"),
    stringKeyFactory = require("../../string_key_factory"),
    jsxCompiler = require("./dyn_compiler"),
    vm = require("vm"),
    appConfig = require("../../app_config").getConfig();


var logger = loggerFactory.getLogger("JSXLRUCache", (appConfig.get("env:production") || appConfig.get("env:sandbox")) ? "WARN" : "DEBUG");
var jsxArtifactCache = LRUCacheFactory(appConfig.get("app:content:max_cache_size"), evictionNotifyCallback);
var webComponentsFolder = appConstants.APP_BUNDLED_CONTENT_FOLDER;


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
    var jsxFilePathPart = webComponentsFolder + "/" + jsxEntryRelativePath;
    var jsxFilePath = path.posix.resolve(jsxFilePathPart + ".jsx");
    var compiledJSXFilePath = path.posix.resolve(jsxFilePathPart + ".js");

    var jsxCacheEntry = {
        compiledSource: "",
        jsxEntryRelativePath: jsxEntryRelativePath
    };


    let server_side = false;
    if (jsxEntryRelativePath.indexOf("server_side") > -1) {
        server_side = true;
    }

    /**
     *
     * @returns {*}
     * @private
     */
    function __compileJSX() {
        if (appConfig.get("env:development") && (!appConfig.get("liveEmulation"))) {
            logger.info("Compiling JSX for: " + path.basename(jsxFilePath, ".jsx") + " in " + path.dirname(jsxFilePath));
            return jsxCompiler.compileJSXEntity(path.dirname(jsxFilePath), path.basename(jsxFilePath, ".jsx"), server_side, webComponentsFolder);
        } else {
            return Q();
        }
    }

    function __loadCompiledJSX() {
        return Q.nfcall(fs.readFile, compiledJSXFilePath, {encoding: "utf8"});
    }

    let allTasks = [__compileJSX, __loadCompiledJSX];

    allTasks.reduce(Q.when, Q())
        .then(function (jsCode) {
            jsxCacheEntry.compiledSource = new vm.Script(jsCode);
            next(null, jsxCacheEntry);
        })
        .catch(function (err) {
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

