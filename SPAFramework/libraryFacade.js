"use strict";
import {apiGet, apiPost, runningInBrowser} from "spa-framework";
import {getAction} from "./lib/actions/rest_actions";
import {SPATemplate} from "./lib/SPATemplate";

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
} from "./lib/actions/model_actions";

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
