/**
 * Created by Ali on 3/13/2015.
 */


"use strict";

var path = require("path"),
    dbMgr = require("valde-hapi").database,
    ObjectId = require("mongodb").ObjectID,
    appConfig = require("valde-hapi").app_config.getConfig();

function handler(request, reply) {

    if (!(request.__valde.web_model)) {
        request.__valde.web_model = {};
    }


    if (request.auth.isAuthenticated) {
        //add the user account data to the model
        var collectionName = "sa_customer_accounts";
        dbMgr.findOne(collectionName,
            {"_id": new ObjectId(request.auth.credentials.account_id)})
            .then(function (accountData) {
                request.__valde.web_model.account_type = request.auth.credentials.account_type;
                request.__valde.web_model.account_data = accountData;
            },
            function (err) {
            })
            .catch(function (err) {
            })
            .finally(function () {
                reply.view("index.js", request.__valde.web_model);
            });
    } else {
        //check if the model construction is redirecting to signin page:
        var resolvedPageRe = /\/pages\/..\/..\/(.*)\/page/;
        var matches = resolvedPageRe.exec(request.__valde.web_model.pageViewID);

        if (matches && (matches.length > 0) && (matches[1] == "signin") && (matches[1] != request.params.pageID)) {
            // the requested page requires signin:
            return reply.redirect(appConfig.get("app_root") + "/signin?next=" +
                encodeURIComponent(appConfig.get("app_root") + "/" + request.params.pageID));
        } else {
            reply.view("index.js", request.__valde.web_model);
        }
    }
}


module.exports = {
    method: "GET",
    path: appConfig.get("app_root") + "/{pageID*}",
    config: {
        handler: handler,
        auth: {
            mode: 'try',
            strategy: 'session'
        },
        plugins: {
            "hapi-auth-cookie": {
                redirectTo: false
            },
            "resource_set": {
                enabled: true
            },
            "web_model": {
                enabled: true
            }
        }
    }
};

