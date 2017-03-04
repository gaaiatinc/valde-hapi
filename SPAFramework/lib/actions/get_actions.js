/**
 *
 */
"use strict";
import axios from "axios";
import {get as _get, set as _set, unset as _unset} from "lodash";
import encodeUrl from "encodeurl";

import {
    setContent,
    setMetadata,
    setRunMode,
    setDeployMode,
    setPageViewID,
    setRequestInfo
} from "./model_data_actions";

let axios_config = {
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

const process_release_name = _get(process,)

const running_in_browser = () => {
    if (typeof process !== "undefined") {
        let process_name = _get(process, "release.name", null);
        if ((typeof process_name === "string") && (process_name.search(/node|io.js/i) !== -1)) {
            return false;
        }
    }

    return true;
}(typeof process === "undefined") || (typeof process.release === "undefined") || (typeof process.release.name === "undefined") || (process.release.name.search(/node|io.js/i) !== -1)

const build_request_url = (page_uri, query_string_params) => {
    let page_url = "/" + page_uri;

    let query_string = "?";
    let query_string_valid = false;

    for (let qp_name of Object.getOwnPropertyNames(query_string_params)) {
        if (!query_string_valid) {
            query_string_valid = true;
            query_string += qp_name + "=" + query_string_params[qp_name];
        } else {
            query_string += "&" + qp_name + "=" + query_string_params[qp_name];
        }
        query_string_valid = true;
    }
    if (query_string_valid) {
        page_url += query_string;

        page_url = encodeUrl(page_url);
        // console.log("page_url", page_url);
    }
    return page_url;
};

/**
 *
 * @param  {[type]} page_uri             [description]
 * @param  {[type]} query_string_params [description]
 * @return {[type]}                     [description]
 */
const submit_get_with_query = (page_uri, query_string_params) => {
    let op_config = Object.assign({}, axios_config);
    let page_url = build_request_url(page_uri, query_string_params);

    // console.log("requiest uri", page_url);
    return axios.get(page_url, op_config);
};

/**
 *
 * @param  {[type]} query_string_params [description]
 * @return {[type]}                     [description]
 */
export const get_action = (query_string_params) => {
    query_string_params = query_string_params || {};

    return function(dispatch, getState) {
        const {appData} = getState();
        if (running_in_browser) {
            submit_get_with_query(appData.page_uri, query_string_params).then((response) => {

                let model = response.data;

                dispatch((setContent));
                dispatch((setMetadata));
                dispatch((setRunMode));
                dispatch((setDeployMode));
                dispatch((setPageViewID));
                dispatch((setRequestInfo));
            }).catch((error) => {
                // console.log(error);
            });
        }
    };
};
