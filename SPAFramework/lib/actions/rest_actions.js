/**
 *
 */
"use strict";
import axios from "axios";
import {get as _get} from "lodash";
import isURL from "validator/lib/isURL";

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
} from "./model_actions";

let axiosConfig = {
    baseURL: "/",
    headers: {
        "Content-Type": "application/json",
        "accept-language": "en-US"
    },
    timeout: 60000,
    responseType: "json",
    withCredentials: true,
    // credentials: "same-origin",
    // cache: "no-cache",
    maxRedirects: 2
};

let urlOptions = {
    protocols: ["https"],
    require_tld: true,
    require_protocol: true,
    require_host: true,
    require_valid_protocol: true,
    allow_underscores: true,
    host_whitelist: false,
    host_blacklist: false,
    allow_trailing_dot: false,
    allow_protocol_relative_urls: false
};

/**
 *
 * @return {[type]} [description]
 */
export const runningInBrowser = () => {
    if (typeof process !== "undefined") {
        let processName = _get(process, "release.name", null);
        if ((typeof processName === "string") && (processName.search(/node|io.js/i) !== -1)) {
            return false;
        }
    }

    return true;
};
/**
 *
 * @param  {[type]}   targetUrl          [description]
 * @param  {[type]}   queryStringParams [description]
 * @param  {Function} callback            [description]
 * @return {[type]}                       [description]
 */
export const apiGet = (targetUrl, queryStringParams, headers) => {
    if (runningInBrowser()) {
        if (!isURL(targetUrl, urlOptions)) {
            return Promise.reject(new Error("Invlaid target URL!"));
        }

        let opConfig = Object.assign({}, axiosConfig);

        if (typeof queryStringParams === "object") {
            opConfig.params = queryStringParams;
        }

        if (typeof headers === "object") {
            opConfig.headers = headers;
        }

        return axios.get(targetUrl, opConfig);
    } else {
        //This will simply resolve with an empty object when run outside of a browser
        return Promise.resolve({});
    }
};

/**
 *
 * @param  {[type]} targetUrl         [description]
 * @param  {[type]} queryStringParams [description]
 * @param  {[type]} payload           [description]
 * @return {[type]}                   [description]
 */
export const apiPost = (targetUrl, queryStringParams, headers, payload) => {
    if (runningInBrowser()) {
        if (!isURL(targetUrl, urlOptions)) {
            return Promise.reject(new Error("Invlaid target URL!"));
        }

        let opConfig = Object.assign({}, axiosConfig);

        if (typeof queryStringParams === "object") {
            opConfig.params = queryStringParams;
        }

        if (typeof headers === "object") {
            opConfig.headers = headers;
        }

        return axios.post(targetUrl, payload, opConfig);
    } else {
        //This will simply resolve with an empty object when run outside of a browser
        return Promise.resolve({});
    }
};

/**
 *
 * @param  {[type]} queryStringParams [description]
 * @return {[type]}                     [description]
 */
export const getAction = (queryStringParams, headers) => {

    return function(dispatch, getState) {

        if (runningInBrowser) {
            const {requestInfo, appMountPoint, pageID} = getState();

            let targetUrl = "https://" + requestInfo.headers.host + "/" + appMountPoint + "/" + pageID;
            if (!isURL(targetUrl, urlOptions)) {
                return;
            }

            let opConfig = Object.assign({}, axiosConfig);
            if (typeof queryStringParams === "object") {
                opConfig.params = queryStringParams;
            }

            if (typeof headers === "object") {
                opConfig.headers = headers;
            }

            axios
                .get(targetUrl, opConfig)
                .then((response) => {

                    let model = response.data;

                    dispatch(setContent(model));
                    dispatch(setMetadata(model));
                    dispatch(setRunMode(model));
                    dispatch(setDeployMode(model));
                    dispatch(setPageViewID(model));
                    dispatch(setRequestInfo(model));
                    dispatch(setResolvedLocale(model));
                    dispatch(setPageID(model));
                    dispatch(setAppMountPoint(model));
                })
                .catch((error) => {
                    // console.log(error);
                });
        }
    };
};
