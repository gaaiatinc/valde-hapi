/**
 * Created by Ali on 3/13/2015.
 */


"use strict";
var path = require("path"),
    page_descriptor_cache = require("./page_descriptor_cache"),
    dbMgr = require("../database"),
    appConfig = require("../app_config").getConfig(),
    page_resolver = require("./page_resolver"),
    Q = require("q"),
    ObjectId = require("mongodb").ObjectID,
    locale_resolver = require("../locale_resolver");


var modelFactory = {};

/**
 *
 * @param request
 * @param reply
 * @returns {*}
 */
modelFactory.create_model_for_web_request = function (request, reply) {


    //return {
    //    country: tempObj[0].region, //two letter country code
    //    language: tempObj[0].language  //two letter language code
    //}


    return Q.Promise(function (resolve, reject) {
        var requestLocaleObj = locale_resolver.get_request_locale(request, reply);
        var reqLocaleAsPathStr = locale_resolver.as_path_string(requestLocaleObj);

        page_resolver.resolve_page(request, reply)
            .then(function (pageDescriptor) {
                var model = {
                    pageViewID: path.posix.normalize("/pages/" + pageDescriptor.pageViewID),
                    runMode: appConfig.get("runMode"),
                    deployMode: appConfig.get("deployMode"),
                    content: pageDescriptor.content,
                    metaData: pageDescriptor.pageMetadata,
                    requestInfo: {
                        headers: {
                            "accept-language": request.headers["accept-language"],
                            host: request.headers["host"],
                            "user-agent": request.headers["user-agent"],
                            "x-real-ip": request.headers["x-real-ip"]
                        },
                        query: request.query
                    }
                };

                if (request.auth.isAuthenticated) {
                    //add the user account data to the model
                    var collectionName = "sl_customer_accounts";
                    if (request.auth.credentials.account_type === "AGENT") {
                        collectionName = "sl_agent_accounts";
                    }
                    dbMgr.findOne(collectionName,
                        {"_id": new ObjectId(request.auth.credentials.account_id)})
                        .then(function (accountData) {
                            model.account_type = request.auth.credentials.account_type;
                            model.account_data = accountData;
                            resolve(model);
                        },
                        function () {
                            model.account_data = {};
                            resolve(model);
                        })
                        .catch()
                        .done();
                } else {
                    resolve(model);
                }
            }, reject)
            .catch(reject)
            .done();
    });
};

module.exports = modelFactory;


