/**
 * Created by Ali Ismael on 11/24/13.
 */
"use strict";

let LRUCacheFactory = require("lru-cache-js"),
    loggerFactory = require("../../app_logger"),
    appUtils = require("../../app_utils"),
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

// jsxCompiler.init(webComponentsFolder);

let posixContentFolderPath;
let componentsDependencyPatternStr;
let componentsDependencyPattern;

let lessCompiler = require("less");


pivotContentFolder(webComponentsFolder);


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

    let compiledJSXFilePath = path.resolve(jsxCompiler.getStaticJsResourceFolder() + "/" + jsxEntryRelativePath + ".js");

    let dependenciesFilePath = path.join(webComponentsFolder, jsxEntryRelativePath + ".dep");

    let shouldPerformFullCreation = false;

    let jsxCacheEntry = {
        compiledSource: "",
        jsxEntryRelativePath: jsxEntryRelativePath,
        globalJsxComponentDependencies: []
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
    function __checkIfFullGenIsNeeded() {
        shouldPerformFullCreation = false;

        if ((appConfig.get("env:development") && (!appConfig.get("liveEmulation")))) {

            shouldPerformFullCreation = true;
            return Q();

        } else if (((!appConfig.get("app:content:use_git_content_repository")) && (appConfig.get("runMode") === "staging"))) {

            return Q.Promise((resolve, reject) => {
                Q.nfcall(fs.stat, compiledJSXFilePath)
                    .then(function (stats) {
                        if (stats && !stats.isFile()) {
                            shouldPerformFullCreation = true;
                            resolve();
                        } else {
                            shouldPerformFullCreation = false;
                            resolve();
                        }
                    })
                    .catch(function (err) {
                        shouldPerformFullCreation = true;
                        resolve();
                    })
                    .done();
            });

        } else {
            return Q();
        }
    }

    /**
     *
     * @returns {*}
     * @private
     */
    function __compileJSX() {
        if (shouldPerformFullCreation) {
            logger.info("Compiling JSX for: " + path.posix.dirname(jsxEntryRelativePath));
            return jsxCompiler.compileJSXEntity(path.posix.dirname(jsxEntryRelativePath), path.posix.basename(jsxEntryRelativePath, ".jsx"), server_side, webComponentsFolder);
        } else {
            return Q();
        }
    }

    /**
     *
     * @param fileDependencies
     * @returns {*}
     * @private
     */
    function __updateDependencies(fileDependencies) {
        fileDependencies = Array.isArray(fileDependencies) ? fileDependencies : [];

        return Q.Promise(function (resolve, reject) {
            if (shouldPerformFullCreation) {
                let componentsDependencies = [];

                fileDependencies.forEach(function (compEntry, idx, allArr) {
                    compEntry = compEntry.replace(/\\/g, "/");
                    componentsDependencyPattern.lastIndex = 0;
                    let matches = componentsDependencyPattern.exec(compEntry.trim());
                    if (matches) {
                        componentsDependencies.push(matches[2]);
                    }

                });

                jsxCacheEntry.globalJsxComponentDependencies = componentsDependencies;

                logger.info("Updating file dependencies for: " + jsxEntryRelativePath);

                Q.nfcall(
                        fs.writeFile,
                        dependenciesFilePath,
                        JSON.stringify(componentsDependencies, null, 4), {
                            encoding: "utf8"
                        }
                    )
                    .then(resolve, reject);
            } else {
                Q.nfcall(
                        fs.readFile,
                        dependenciesFilePath, {
                            encoding: "utf8"
                        }
                    )
                    .then(function (fileDepsArrayStr) {
                        jsxCacheEntry.globalJsxComponentDependencies = JSON.parse(fileDepsArrayStr);
                        return resolve();
                    }, reject);
            }
        });
    }

    /**
     *
     * @private
     */
    function __loadCompiledJSX() {
        return Q.nfcall(fs.readFile, compiledJSXFilePath, {
            encoding: "utf8"
        });
    }

    /**
     *
     * @param jsCode
     * @returns {*}
     * @private
     */
    function __publishCompiledJSX(jsCode) {

        jsCode = jsCode || "";

        jsxCacheEntry.resourceHashFileNameDescriptor = path.posix.join(appConfig.get("app_root"), "/res/js/", path.posix.dirname(jsxEntryRelativePath), "page.js");

        jsxCacheEntry.compiledSource = new vm.Script(jsCode);

        return Q();
    }



    function __compilePageLess() {
        let pageFolderPath = path.join(webComponentsFolder, path.dirname(jsxEntryRelativePath));
        let lessFilePath = path.join(pageFolderPath, "/resources/less/page.less");
        let cssFilePath = path.join(pageFolderPath, "/resources/css/page.css");
        let lessResolvePaths = [webComponentsFolder, pageFolderPath, "."];

        function __loadLessFile() {
            let lessCode = "";
            return Q.Promise((resolve, reject) => {
                Q.nfcall(
                        fs.readFile, lessFilePath, {
                            encoding: "utf8"
                        })
                    .then((lessCode) => {
                        return resolve(lessCode);
                    }, (err) => {
                        logger.warn(err);
                        return resolve(lessCode);
                    });
            });
        }

        function __compileLessCode(lessCode) {
            return Q.Promise((resolve, reject) => {
                if (!lessCode) {
                    return resolve();
                }

                lessCompiler.render(
                    lessCode, {
                        paths: lessResolvePaths,
                        filename: "page.less",
                        compress: true
                    },
                    function (err, renderOutput) {
                        if (err) {
                            logger.warn(err);
                            return resolve();
                        }
                        Q.nfcall(
                                fs.writeFile, cssFilePath, renderOutput.css, {
                                    encoding: "utf8"
                                })
                            .then(() => {
                                resolve();
                            }, (err) => {
                                resolve();
                                logger.warn(err);
                            });

                        return resolve();
                    });
            });
        }

        return [__loadLessFile, __compileLessCode].reduce(Q.when, Q());
    }

    /**
     *
     * @returns {*}
     * @private
     */
    function __publishPageCSS() {
        /**
         * [__getPageCSS description]
         * @return {[type]} [description]
         */
        function __getPageCSS() {
            let pageCSSFilePath = path.join(webComponentsFolder, path.dirname(jsxEntryRelativePath) + "/resources/css/page.css");
            return Q.Promise(function (resolve, reject) {
                Q.nfcall(
                        fs.readFile,
                        pageCSSFilePath, {
                            encoding: "utf8"
                        }
                    )
                    .then(resolve)
                    .catch(function (err) {
                        resolve("");
                    });
            });
        }

        /**
         * [__publishPageCSS description]

         * @param  {[type]} pageCSS [description]
         * @return {[type]}         [description]
         */
        function __publishPageCSS(pageCSS) {

            jsxCacheEntry.pageCSSHashFileNameDescriptor = path.posix.join(appConfig.get("app_root"), "/res/css", path.dirname(jsxEntryRelativePath), "page.css");

            let pageCssTargetFileName = path.join(jsxCompiler.getStaticCssResourceFolder(), path.dirname(jsxEntryRelativePath), "page.css");

            if (shouldPerformFullCreation) {
                logger.info("Publishing page CSS to resources - compiled JSX for: " + jsxEntryRelativePath);

                let __mkdirpTask = function () {
                    return appUtils.mkdirp(jsxCompiler.getStaticCssResourceFolder(), path.dirname(jsxEntryRelativePath));
                };

                let __saveResourceTask = function () {
                    return Q.nfcall(fs.writeFile, pageCssTargetFileName, pageCSS, {
                        encoding: "utf8"
                    });
                };

                return [__mkdirpTask, __saveResourceTask].reduce(Q.when, Q());

            } else {
                return Q();
            }
        }

        return [__getPageCSS, __publishPageCSS].reduce(Q.when, Q());
    }

    /**
     *
     * @returns {*}
     * @private
     */
    function __publishGlobalCSS() {

        function __getGlobalCSS() {
            let globalCSSFilePath = path.posix.join(webComponentsFolder, "/resources/css/global.css");
            return Q.Promise(function (resolve, reject) {
                Q.nfcall(
                        fs.readFile,
                        globalCSSFilePath, {
                            encoding: "utf8"
                        }
                    )
                    .then(resolve)
                    .catch(function (err) {
                        resolve("");
                    });
            });
        }

        function __publishGlobalCSS(globalCSS) {

            jsxCacheEntry.globalCSSHashFileNameDescriptor = path.posix.join(appConfig.get("app_root"), "/res/css", "global.css");
            let targetGlobalCssFn = path.join(jsxCompiler.getStaticCssResourceFolder(), "global.css");

            if (shouldPerformFullCreation) {
                logger.info("Publishing global CSS to resources - compiled JSX for: " + jsxEntryRelativePath);

                // let __mkdirpTask = function () {
                //     return appUtils.mkdirp(jsxCompiler.getStaticCssResourceFolder(), path.dirname(jsxEntryRelativePath));
                // };

                let __saveResourceTask = function () {
                    return Q.nfcall(fs.writeFile, targetGlobalCssFn, globalCSS, {
                        encoding: "utf8"
                    });
                };

                return [__saveResourceTask].reduce(Q.when, Q());

            } else {
                return Q();
            }
        }

        return [__getGlobalCSS, __publishGlobalCSS].reduce(Q.when, Q());
    }

    let allTasks = [__checkIfFullGenIsNeeded, __compileJSX, __updateDependencies, __loadCompiledJSX, __publishCompiledJSX, __compilePageLess, __publishPageCSS, __publishGlobalCSS];

    allTasks.reduce(Q.when, Q())
        .then(() => {
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
    let stringKey = stringKeyFactory.createKey(jsxRefStr);
    let retVal = jsxArtifactCache.get(stringKey);

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

    posixContentFolderPath = path.resolve(path.join(webComponentsFolder, appConfig.get("app:content:root_dir"))).replace(/\\/g, "/");
    componentsDependencyPatternStr = "^" + posixContentFolderPath + "(/resources(/jsx_components/template-components/.+))/([a-zA-Z0-9-_]+)\\.jsx$";
    componentsDependencyPattern = new RegExp(componentsDependencyPatternStr);

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
