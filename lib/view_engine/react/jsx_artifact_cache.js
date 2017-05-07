/**
 * Created by Ali Ismael on 11/24/13.
 */
"use strict";

const LRUCache = require("lru-cache-js"),
    logger_factory = require("../../app_logger"),
    app_utils = require("../../app_utils"),
    fs = require("fs"),
    Q = require("q"),
    path = require("path"),
    appConstants = require("../../app_constants"),
    jsxCompiler = require("./dyn_compiler"),
    vm = require("vm"),
    app_config = require("../../app_config").get_config();

const logger = logger_factory.getLogger("JSXLRUCache", (app_config.get("env:production") || app_config.get("env:sandbox"))
    ? "WARN"
    : "DEBUG");
let webComponentsFolder = appConstants.APP_BUNDLED_CONTENT_FOLDER;

// jsxCompiler.init(webComponentsFolder);

let posixContentFolderPath;
let componentsDependencyPatternStr;
let componentsDependencyPattern;

const lessCompiler = require("less");

/**
 *
 * @param evictedEntry
 */
const evictionNotifyCallback = (evictedEntry) => {
    /**
     * if the LRU cache starts to fill up and evict elements.
     */

    logger.info("evicting:" + evictedEntry.toString());
};
const jsxArtifactCache = new LRUCache(app_config.get("app:content:max_cache_size"), evictionNotifyCallback);

/**
 *
 */
const clear = () => {
    jsxArtifactCache.clear();
};

/**
 *
 * @param newContentFolder
 */
const pivotContentFolder = (newContentFolder) => {
    webComponentsFolder = newContentFolder || appConstants.APP_BUNDLED_CONTENT_FOLDER;

    jsxCompiler.init(webComponentsFolder);

    posixContentFolderPath = path
        .resolve(path.join(webComponentsFolder, app_config.get("app:content:root_dir")))
        .replace(/\\/g, "/");
    componentsDependencyPatternStr = "^" + posixContentFolderPath + "(/resources(/jsx_components/template-components/.+))/([a-zA-Z0-9-_]+)\\.jsx$";
    componentsDependencyPattern = new RegExp(componentsDependencyPatternStr);

    clear();
};

pivotContentFolder(webComponentsFolder);

/**
 *
 * @param jsxEntryRelativePath
 * @param next
 */
const createCacheEntry = (jsxEntryRelativePath, next) => {
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
    const __checkIfFullGenIsNeeded = () => {
        shouldPerformFullCreation = false;

        if ((app_config.get("env:development") && (!app_config.get("liveEmulation")))) {

            shouldPerformFullCreation = true;
            return Q();

        } else if (((!app_config.get("app:content:use_git_content_repository")) && (app_config.get("run_mode") === "staging"))) {

            return Q.Promise((resolve) => {
                Q
                    .nfcall(fs.stat, compiledJSXFilePath)
                    .then((stats) => {
                        if (stats && !stats.isFile()) {
                            shouldPerformFullCreation = true;
                            resolve();
                        } else {
                            shouldPerformFullCreation = false;
                            resolve();
                        }
                    })
                    .catch(() => {
                        shouldPerformFullCreation = true;
                        resolve();
                    })
                    .done();
            });

        } else {
            return Q();
        }
    };

    /**
     *
     * @returns {*}
     * @private
     */
    const __compileJSX = () => {
        if (shouldPerformFullCreation) {
            logger.info("Compiling JSX for: " + path.posix.dirname(jsxEntryRelativePath));
            return jsxCompiler.compileJSXEntity(path.posix.dirname(jsxEntryRelativePath), path.posix.basename(jsxEntryRelativePath, ".jsx"), server_side, webComponentsFolder);
        } else {
            return Q();
        }
    };

    /**
     *
     * @param fileDependencies
     * @returns {*}
     * @private
     */
    const __updateDependencies = (fileDependencies) => {
        fileDependencies = Array.isArray(fileDependencies)
            ? fileDependencies
            : [];

        return Q.Promise((resolve, reject) => {
            if (shouldPerformFullCreation) {
                let componentsDependencies = [];
                let componentsDependenciesSet = new Set();

                fileDependencies.forEach((compEntry) => {
                    compEntry = compEntry.replace(/\\/g, "/");
                    componentsDependencyPattern.lastIndex = 0;
                    let matches = componentsDependencyPattern.exec(compEntry.trim());
                    if (matches) {
                        componentsDependenciesSet.add(matches[2]);
                    }
                });
                componentsDependencies = Array.from(componentsDependenciesSet);

                jsxCacheEntry.globalJsxComponentDependencies = componentsDependencies;

                logger.info("Updating file dependencies for: " + jsxEntryRelativePath);

                Q.nfcall(fs.writeFile, dependenciesFilePath, JSON.stringify(componentsDependencies, null, 4), {encoding: "utf8"}).then(resolve, reject);
            } else {
                Q
                    .nfcall(fs.readFile, dependenciesFilePath, {encoding: "utf8"})
                    .then((fileDepsArrayStr) => {
                        jsxCacheEntry.globalJsxComponentDependencies = JSON.parse(fileDepsArrayStr);
                        return resolve();
                    }, reject);
            }
        });
    };

    /**
     *
     * @private
     */
    const __loadCompiledJSX = () => {
        return Q.nfcall(fs.readFile, compiledJSXFilePath, {encoding: "utf8"});
    };

    /**
     *
     * @param jsCode
     * @returns {*}
     * @private
     */
    const __publishCompiledJSX = (jsCode) => {

        jsCode = jsCode || "";

        jsxCacheEntry.resourceHashFileNameDescriptor = path
            .posix
            .join(app_config.get("app_root"), "/res/js/", path.posix.dirname(jsxEntryRelativePath), "page.js");

        jsxCacheEntry.compiledSource = new vm.Script(jsCode);

        return Q();
    };

    /**
     *
     * @return {[type]} [description]
     */
    const __compilePageLess = () => {

        let pageFolderPath = path.join(webComponentsFolder, path.dirname(jsxEntryRelativePath));
        let lessFilePath = path.join(pageFolderPath, "/resources/less/page.less");
        let cssFilePath = path.join(pageFolderPath, "/resources/css/page.css");
        let lessResolvePaths = [webComponentsFolder, pageFolderPath, "."];

        const __loadLessFile = () => {
            let lessCode = "";
            return Q.Promise((resolve) => {
                Q
                    .nfcall(fs.readFile, lessFilePath, {encoding: "utf8"})
                    .then((lessCode) => {
                        return resolve(lessCode);
                    }, (err) => {
                        logger.warn(err);
                        return resolve(lessCode);
                    });
            });
        };

        const __compileLessCode = (lessCode) => {
            return Q.Promise((resolve) => {
                if (!lessCode) {
                    return resolve();
                }

                lessCompiler.render(lessCode, {
                    paths: lessResolvePaths,
                    filename: "page.less",
                    compress: true
                }, (err, renderOutput) => {
                    if (err) {
                        logger.warn(err);
                        return resolve();
                    }
                    logger.info("Compiled less resource for: " + jsxEntryRelativePath);
                    Q
                        .nfcall(fs.writeFile, cssFilePath, renderOutput.css, {encoding: "utf8"})
                        .then(() => {
                            resolve();
                        }, (err) => {
                            resolve();
                            logger.warn(err);
                        })
                        .catch((err) => {
                            logger.warn(err);
                            return resolve();
                        });
                });
            });
        };

        if (shouldPerformFullCreation) {
            return [__loadLessFile, __compileLessCode].reduce(Q.when, Q());
        } else {
            return Q();
        }
    };

    /**
     *
     * @returns {*}
     * @private
     */
    const __publishPageCSS = () => {
        /**
         * [__getPageCSS description]
         * @return {[type]} [description]
         */
        const __getPageCSS = () => {
            let pageCSSFilePath = path.join(webComponentsFolder, path.dirname(jsxEntryRelativePath) + "/resources/css/page.css");
            return Q.Promise((resolve) => {
                Q
                    .nfcall(fs.readFile, pageCSSFilePath, {encoding: "utf8"})
                    .then(resolve)
                    .catch(() => {
                        resolve("");
                    });
            });
        };

        /**
         * [__publishPageCSS description]

         * @param  {[type]} pageCSS [description]
         * @return {[type]}         [description]
         */
        const __innerPublishPageCSS = (pageCSS) => {

            jsxCacheEntry.pageCSSHashFileNameDescriptor = path
                .posix
                .join(app_config.get("app_root"), "/res/css", path.dirname(jsxEntryRelativePath), "page.css");

            let pageCssTargetFileName = path.join(jsxCompiler.getStaticCssResourceFolder(), path.dirname(jsxEntryRelativePath), "page.css");

            if (shouldPerformFullCreation) {
                logger.info("Publishing page CSS to resources - compiled JSX for: " + jsxEntryRelativePath);

                const __mkdirpTask = () => {
                    return app_utils.mkdirp(jsxCompiler.getStaticCssResourceFolder(), path.dirname(jsxEntryRelativePath));
                };

                const __saveResourceTask = () => {
                    return Q.nfcall(fs.writeFile, pageCssTargetFileName, pageCSS, {encoding: "utf8"});
                };

                return [__mkdirpTask, __saveResourceTask].reduce(Q.when, Q());

            } else {
                return Q();
            }
        };

        return [__getPageCSS, __innerPublishPageCSS].reduce(Q.when, Q());
    };

    /**
     *
     * @returns {*}
     * @private
     */
    const __publishGlobalCSS = () => {

        const __getGlobalCSS = () => {
            let globalCSSFilePath = path
                .posix
                .join(webComponentsFolder, "/resources/css/global.css");
            return Q.Promise((resolve) => {
                Q
                    .nfcall(fs.readFile, globalCSSFilePath, {encoding: "utf8"})
                    .then(resolve)
                    .catch(() => {
                        resolve("");
                    });
            });
        };

        const __innerPpublishGlobalCSS = (globalCSS) => {

            jsxCacheEntry.globalCSSHashFileNameDescriptor = path
                .posix
                .join(app_config.get("app_root"), "/res/css", "global.css");
            let targetGlobalCssFn = path.join(jsxCompiler.getStaticCssResourceFolder(), "global.css");

            if (shouldPerformFullCreation) {
                logger.info("Publishing global CSS to resources - compiled JSX for: " + jsxEntryRelativePath);

                // let __mkdirpTask =  () => {
                //     return app_utils.mkdirp(jsxCompiler.getStaticCssResourceFolder(), path.dirname(jsxEntryRelativePath));
                // };

                let __saveResourceTask = () => {
                    return Q.nfcall(fs.writeFile, targetGlobalCssFn, globalCSS, {encoding: "utf8"});
                };

                return [__saveResourceTask].reduce(Q.when, Q());

            } else {
                return Q();
            }
        };

        return [__getGlobalCSS, __innerPpublishGlobalCSS].reduce(Q.when, Q());
    };

    let allTasks = [
        __checkIfFullGenIsNeeded,
        __compileJSX,
        __updateDependencies,
        __loadCompiledJSX,
        __publishCompiledJSX,
        __compilePageLess,
        __publishPageCSS,
        __publishGlobalCSS
    ];

    allTasks
        .reduce(Q.when, Q())
        .then(() => {
            next(null, jsxCacheEntry);
        })
        .catch((err) => {
            next(err, null);
        });
};

/**
 *
 * @param jsxRefStr
 * @param next
 */
const get = (jsxRefStr, next) => {
    let retVal = jsxArtifactCache.get(jsxRefStr);

    if (!retVal) {
        createCacheEntry(jsxRefStr, (err, jsxCacheEntry) => {
            if (err) {
                logger.warn("failed to load jsx file for ID: " + jsxRefStr);
                next(err, null);
            } else {
                jsxArtifactCache.put(jsxRefStr, jsxCacheEntry);
                next(null, jsxCacheEntry);
            }
        });
    } else {
        next(null, retVal);
    }
};

/**
 *
 * @param entries
 */
const evictEntries = (entries) => {
    for (let entry in entries) {
        jsxArtifactCache.remove(entry);
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
