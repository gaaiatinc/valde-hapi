/**
 *
 */
"use strict";

/**
 * This is a demo module.  It does not perform the required verification of
 * the username and password from a persistent store, as it should.
 * 
 *
 *
 * validateFunc: (required) a user lookup and password validation function with
 *   the signature function(request, username, password, callback) where:
 *     request - is the hapi request object of the request which is being authenticated.
 *     username - the username received from the client.
 *     password - the password received from the client.
 *     callback - a callback function with the signature
 *       function(err, isValid, credentials) where:
 *         err - an internal error. If defined will replace default Boom.unauthorized error
 *         isValid - true if both the username was found and the password matched, otherwise false.
 *         credentials - a credentials object passed back to the application in
 *           request.auth.credentials. Typically, credentials are only included
 *           when isValid is true, but there are cases when the application needs
 *           to know who tried to authenticate even when it fails (e.g. with authentication mode 'try').
 */
module.exports = function(request, username, password, callback) {
    let valid_credentials = {

        "username": username,
        "password": password
    };
    callback(null, true, valid_credentials);
};
