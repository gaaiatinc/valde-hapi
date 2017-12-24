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
module.exports = async function(request, username, password, h) {
    let valid_credentials = {
        "username": username,
        "password": password
    };
    return {isValid: true, valid_credentials};


    // if (username === 'help') {
    //     return { response: h.redirect('https://hapijs.com/help') };     // custom response
    // }
    //
    // const user = users[username];
    // if (!user) {
    //     return { credentials: null, isValid: false };
    // }
    //
    // const isValid = await Bcrypt.compare(password, user.password);
    // const credentials = { id: user.id, name: user.name };
    //
    // return { isValid, credentials };

};
