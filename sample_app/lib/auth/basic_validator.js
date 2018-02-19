/**
 *
 */
"use strict";

/**
 * This is a demo module.  It does not perform the required verification of
 * the username and password from a persistent store, as it should.
 *
 * The module must export an async function(request, username, password, h) where:
 * request - is the hapi request object of the request which is being authenticated.
 * username - the username received from the client.
 * password - the password received from the client.
 * h - the response toolkit.
 *
 * Returns an object { isValid, credentials, response } where:
 * isValid - true if both the username was found and the password matched, otherwise false.
 * credentials - a credentials object passed back to the application in request.auth.credentials.
 * response - Optional. If provided will be used immediately as a takeover response.
 * Can be used to redirect the client, for example. Don't need to provide isValid or credentials if response is provided
 *
 * Throwing an error from this function will replace default Boom.unauthorized error
 * Typically, credentials are only included when isValid is true, but there are cases
 * when the application needs to know who tried to authenticate even when it fails (e.g. with authentication mode 'try').
 *
 */
module.exports = async function(request, username, password, h) {
    let valid_credentials = {
        "username": username,
        "password": password
    };

    return {isValid: true, credentials: valid_credentials};
};
