/**
 * @author Ali Ismael
 */
"use strict";

const Boom = require("@hapi/boom"),
    _isEmpty = require("lodash/isEmpty"),
    _get = require("lodash/get"),
    jwt = require("jsonwebtoken");

/**
 *
 * @param  {[type]} server  [description]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
const bearer_jwt_scheme = (server, options) => {

    let scheme = {
        authenticate: function(request, h) {
            const bearer_jwt_options = options;

            let authorization_header_value = _get(request, "raw.req.headers.authorization");
            if (!authorization_header_value) {
                throw Boom.unauthorized("Bearer");
            }

            authorization_header_value = authorization_header_value.trim();

            let authorization_header_value_elements = authorization_header_value.split(/\s+/);

            if (authorization_header_value_elements.length !== 2) {
                throw Boom.badRequest("Bad HTTP authentication header format, Bearer");
            }

            if (authorization_header_value_elements[0].toUpperCase() !== "BEARER") {
                throw Boom.unauthorized("Bearer");
            }

            if (authorization_header_value_elements[1].split(".").length !== 3) {
                throw Boom.badRequest("Bad HTTP authentication header format, Bearer");
            }

            let jwt_token = authorization_header_value_elements[1];

            jwt.verify(jwt_token, bearer_jwt_options.verification_key, bearer_jwt_options.verify_attributes, function(err, decoded_token) {
                if (err && err.message === "jwt expired") {
                    throw Boom.unauthorized("Expired token received for JSON Web Token validation, Bearer");
                } else if (err) {
                    throw Boom.unauthorized("Invalid signature received for JSON Web Token validation, Bearer");
                }

                if (!bearer_jwt_options.validate) {
                    return h.authenticated({credentials: decoded_token});
                }

                bearer_jwt_options.validate(request, decoded_token, function(err, isValid, credentials) {

                    if (err) {
                        throw Boom.unauthorized(err);
                    }

                    if (!isValid) {
                        throw Boom.unauthorized("Invalid token, Bearer");
                    }

                    // if (_isEmpty(credentials)) {
                    //     credentials = decoded_token;
                    // }

                    if (_isEmpty(credentials) || typeof credentials !== "object") {
                        throw Boom.badImplementation("Bad credentials object received for jwt auth validation");
                    }

                    // jwt authorization succeeded
                    return h.authenticated({credentials: credentials});
                });
            });
        }
    };

    return scheme;
};

/**
 *
 * @type {Object}
 */
module.exports.plugin = {
    pkg: require("./package.json"),
    register: (server) => {
        server
            .auth
            .scheme("jwt", bearer_jwt_scheme);
    }
};
