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
 * validate: (required) an async token claims validator function with
 *   the signature function(request, jwt_token, h) where:
 *     request - is the hapi request object of the request which is being authenticated.
 *     jwt_token - the jwt token verified by the auth_bearer_jwt plugin.
 *     h: the hapi response toolkit.
 * Returns an object { isValid, credentials } where:
 *     isValid: is a boolean indicating whether the token in the request is validate
 *     credentials - an optional credentials object passed back to the application in
 *       request.auth.credentials. Typically, credentials are only included
 *       when isValid is true, but there are cases when the application needs
 *       to know who tried to authenticate even when it fails (e.g. with authentication mode 'try').
 *       If credentials is not passed to the callback, the verified jwt token will be set in
 *       request.auth.credentials.
 *     credentials
 */
module.exports = async function(request, jwt_token, h) {
    return {isValid: true, jwt_token};
};
