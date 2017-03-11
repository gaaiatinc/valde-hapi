/**
 *
 */
"use strict";


export const setContent = (model) => {
    return {type: "SET_CONTENT", content: model.content};
};

export const setMetadata = (model) => {
    return {type: "SET_METADATA", metadata: model.metadata};
};

export const setRunMode = (model) => {
    return {type: "SET_RUNMODE", run_mode: model.run_mode};
};

export const setDeployMode = (model) => {
    return {type: "SET_DEPLOYMODE", deploy_mode: model.deploy_mode};
};

export const setPageViewID = (model) => {
    return {type: "SET_PAGEVIEWID", pageViewID: model.pageViewID};
};

export const setRequestInfo = (model) => {
    return {type: "SET_REQUESTINFO", pageViewID: model.requestInfo};
};

export const setResolvedLocale = (model) => {
    return {type: "SET_RESOLVEDLOCALE", resolvedLocale: model.resolvedLocale};
};

export const setPageID = (model) => {
    return {type: "SET_PAGEID", pageID: model.pageID};
};

export const setAppMountPoint = (model) => {
    return {type: "SET_APPMOUNTPOINT", appMountPoint: model.appMountPoint};
};
