"use strict";
import {apiGet, apiPost, runningInBrowser} from "spa-framework";
import {getAction} from "./SPAFramework/lib/actions/rest_actions";
import {SPATemplate} from "./SPAFramework/lib/SPATemplate";

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
} from "./SPAFramework/lib/actions/model_data_actions";

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
