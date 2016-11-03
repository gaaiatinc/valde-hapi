/**
 *
 */
"use strict";

/**
 * This is a demo module.  It does not perform the required verification of
 * the claims in the jwt token from a persistent store, as it should.
 *
 *
 *
 * validateFunc: (required) a token claims validator function with
 *   the signature function(request, jwt_token, callback) where:
 *     request - is the hapi request object of the request which is being authenticated.
 *     jwt_token - the jwt token verified by the auth_bearer_jwt plugin.
 *     callback - a callback function with the signature
 *       function(err, isValid, credentials) where:
 *         err - an internal error. If defined will replace default Boom.unauthorized error
 *         isValid - true if claims in the jwt token are validated by the application, otherwise false.
 *         credentials - an optional credentials object passed back to the application in
 *           request.auth.credentials. Typically, credentials are only included
 *           when isValid is true, but there are cases when the application needs
 *           to know who tried to authenticate even when it fails (e.g. with authentication mode 'try').
 *           If credentials is not passed to the callback, the verified jwt token will be set in
 *           request.auth.credentials.
 */
module.exports = function(request, jwt_token, callback) {
    callback(null, true, jwt_token);
};
