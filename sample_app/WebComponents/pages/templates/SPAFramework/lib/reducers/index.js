"use strict";

import content from "./content";
import deploy_mode from "./deploy_mode";
import metadata from "./metadata";
import pageViewID from "./pageViewID";
import requestInfo from "./requestInfo";
import run_mode from "./run_mode";
import pageID from "./pageID";
import resolvedLocale from "./resolvedLocale";
import appMountPoint from "./appMountPoint";

const SPAppReducers = {
    content,
    deploy_mode,
    metadata,
    pageViewID,
    requestInfo,
    run_mode,
    resolvedLocale,
    appMountPoint,
    pageID
};

export default SPAppReducers;
