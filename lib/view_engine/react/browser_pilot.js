/**
 * The following is for client side rendering:
 * The following code is what replaces the "replaceable" elements in the browser
 */
"use strict";

let browserBanner = "if (typeof document !== \"undefined\") {" +
    "    $(function () {" +
    "        if ((typeof window.PageBundle !== \"undefined\") && (typeof window.PageBundle.default === \"function\")) {" +
    "            var appMainPage = new window.PageBundle.default(window.modelData);" +
    "            appMainPage.attachComponentsInBrowser();" +
    "        }" +
    "    });" +
    "}";


module.exports = browserBanner;


