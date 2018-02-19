/**
 *
 */
"use strict";

/**
 *
 * This is a demo module.  It does not perform the required verification of
 * the session, as it should.
 *
 *
 * The module must export an async function: a session validation function used to validate the content
 * of the session cookie on each request. Used to verify that the internal session
 * state is still valid (e.g. user account still exists). The function has the
 * signature function(request, session) where:
 * request - is the Hapi request object of the request which is being authenticated.
 * session - is the session object set via request.cookieAuth.set().
 *
 * Must return an object that contains:
 * valid - true if the content of the session is valid, otherwise false.
 * credentials - a credentials object passed back to the application in
 * request.auth.credentials. If value is null or undefined, defaults to session.
 * If set, will override the current cookie as if request.cookieAuth.set() was called.
 *
 *
 */
module.exports = async function(request, session) {
    return {valid: true};
};
