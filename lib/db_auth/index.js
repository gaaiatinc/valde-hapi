/**
 * Created by Ali on 3/14/2015.
 */

"use strict";

var path = require("path")
    , locale_resolver = require("../locale_resolver")
    , appConfig = require("../app_config").getConfig()
    , moment = require("moment")
    , dbMgr = require("../database");

/**
 * The exported function is used by he hapi-session-cookie auth scheme:
 *
 * A session validation function used to validate the content of the session cookie on each request. Used to verify
 * that the internal session state is still valid (e.g. user account still exists).
 *
 * @param session
 * @param callback  a callback function with the signature function(err, isValid, credentials) where:
 *      err - an internal error.
 *      isValid - true if the content of the session is valid, otherwise false.
 *      credentials - a credentials object passed back to the application in request.auth.credentials. If value is
 *              null or undefined, defaults to session. If set, will override the current cookie as if
 *              request.auth.session.set() was called.
 */
module.exports = function (session, callback) {


    //var sl_session = {
    //    token: "",
    //    token_valid_duration: appConfig.get("app:session:session_duration"),
    //    account_id: account._id,
    //    account_type: request.payload.account_type, //agent or customer
    //    login_with: "ShipLoop",
    //    expire_on: expireOn.format(),
    //    date_last_updated: nowDate.format()
    //};
    //
    //
    //
    //
    //var account_collection_name = "sl_customer_accounts";
    //if (request.payload.account_type === "AGENT") {
    //    account_collection_name = "sl_agent_accounts";
    //}
    //
    //
    //var matchCrit = {
    //    email_address: request.payload.email_address,
    //    password: request.payload.password
    //};
    //dbMgr.findOne(account_collection_name, matchCrit, updateLoginSessionOrFail);
    //

    //TODO: we should use the db record of the matching account to verify validity of the session.
    // for now we are implementing the time based attr manually

//    console.log("session: " + JSON.stringify(session, null, 4));
    callback(null, true, null);

};