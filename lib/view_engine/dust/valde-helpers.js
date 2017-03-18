"use strict";

var xss_filters = require("xss-filters");
var encodeUrl = require("encodeurl");

const secureDecodeURIComponent = function(chunk, context, bodies, params) {

    var arg = params.arg;
    var tempArg = encodeUrl(arg);
    tempArg = decodeURIComponent(tempArg);

    tempArg = xss_filters.inHTMLData(tempArg);
    chunk.write(tempArg);
    return chunk;
};

const secureDecodeURI = function(chunk, context, bodies, params) {
    var arg = params.arg;
    var tempArg = encodeUrl(arg);
    tempArg = decodeURI(tempArg);

    tempArg = xss_filters.inHTMLData(tempArg);
    chunk.write(tempArg);
    return chunk;
};

/**
 *
 * @type {Object}
 */
module.exports = {
    secureDecodeURIComponent,
    secureDecodeURI
};
