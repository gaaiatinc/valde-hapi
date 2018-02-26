"use strict";
import {getAction, apiGet, apiPost, runningInBrowser} from "./actions/rest_actions";
import {SPATemplate} from "./SPATemplate";

import {
    setContent,
    setMetadata,
    setRunMode,
    setDeployMode,
    setPageViewID,
    setRequestInfo,
    setAppMountPoint,
    setPageID,
    setResolvedLocale
} from "./actions/model_actions";

const SPATemplateActions = {
    setContent,
    setMetadata,
    setRunMode,
    setDeployMode,
    setPageViewID,
    setRequestInfo,
    setAppMountPoint,
    setPageID,
    setResolvedLocale
};

export {
    SPATemplate,
    getAction,
    SPATemplateActions,
    apiGet,
    apiPost,
    runningInBrowser
};
