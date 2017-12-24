/**
 * Created by Ali on 3/13/2015.
 */

"use strict";

var db_mgr = require("valde-hapi").database,
    _set = require("lodash/set"),
    _get = require("lodash/get"),
    app_config = require("valde-hapi").app_config;

function handler(request, h) {

    if (request.auth.isAuthenticated) {
        //add the user account data to the model
        var collectionName = "sa_customer_accounts";
        db_mgr
            .find(collectionName, {"_id": request.auth.credentials.account_id})
            .then((accountData) => {
                _set(request, "plugins.valde_web_model.account_type", _get(request, "auth.credentials.account_type"));
                _set(request, "plugins.valde_web_model.account_data", accountData);
                return h.view(_get(request, "plugins.valde_web_model.pageViewTemplate"), _get(request, "plugins.valde_web_model"));
            }, () => {
                return h.view(_get(request, "plugins.valde_web_model.pageViewTemplate"), _get(request, "plugins.valde_web_model"));
            })
            .catch(() => {
                return h.view(_get(request, "plugins.valde_web_model.pageViewTemplate"), _get(request, "plugins.valde_web_model"));
            });
    } else {
        return h.view(_get(request, "plugins.valde_web_model.pageViewTemplate"), _get(request, "plugins.valde_web_model"));
    }
}

module.exports = {
    method: "GET",
    path: app_config.get("app_root") + "/{pageID*}",
    options: {
        handler: handler,
        // auth: {
        //     mode: "try",
        //     strategy: "session"
        // },
        plugins: {
            // "hapi-auth-cookie": {
            //     redirectTo: false
            // },
            "resource_set": {
                enabled: true
            },
            "web_model": {
                enabled: true
            }
        }
    }
};
