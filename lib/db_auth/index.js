/**
 * Created by Ali on 3/14/2015.
 */

"use strict";

let path = require("path"),
    app_config = require("../app_config").get_config(),
    moment = require("moment"),
    dbMgr = require("../database");

/**
 * The exported function is used by he hapi-session-cookie auth scheme:
 *
 * A session validation function used to validate the content of the session cookie on each request. Used to verify
 * that the internal session state is still valid (e.g. user account still exists). The function has the signature
 * function(request, session, callback) where:
 *
 * @param request - is the Hapi request object of the request which is being authenticated.
 * @param session - is the session object set via request.auth.session.set().
 * @param callback - a callback function with the signature function(err, isValid, credentials) where:
 *   err - an internal error.
 *   isValid - true if the content of the session is valid, otherwise false.
 *   credentials - a credentials object passed back to the application in request.auth.credentials. If value is null
 *       or undefined, defaults to session. If set, will override the current cookie as if request.auth.session.set()
 *       was called.
 */
module.exports = function (request, session, callback) {

    //TODO: you should use the db record of the matching account to verify validity of the session.
    // for now we are implementing the time based attr manually

    //    console.log("session: " + JSON.stringify(session, null, 4));
    callback(null, true, null);

};
