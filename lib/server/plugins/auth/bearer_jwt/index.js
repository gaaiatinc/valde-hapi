/**
 * @author Ali Ismael
 */
"use strict";

const Boom = require("boom"),
    _isEmpty = require("lodash/isEmpty"),
    _get = require("lodash/get"),
    jwt = require("jsonwebtoken");

let bearer_jwt_options;

/**
 *
 * @param  {[type]} server  [description]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
const bearer_jwt_scheme = (server, options) => {
    bearer_jwt_options = options;

    let scheme = {
        authenticate: function(request, reply) {

            let authorization_header_value = _get(request, "raw.req.headers.authorization");
            if (!authorization_header_value) {
                return reply(Boom.unauthorized(null, "Bearer"));
            }

            authorization_header_value = authorization_header_value.trim();

            let authorization_header_value_elements = authorization_header_value.split(/\s+/);

            if (authorization_header_value_elements.length !== 2) {
                return reply(Boom.badRequest("Bad HTTP authentication header format", "Bearer"));
            }

            if (authorization_header_value_elements[0].toUpperCase() !== "BEARER") {
                return reply(Boom.unauthorized(null, "Bearer"));
            }

            if (authorization_header_value_elements[1].split(".").length !== 3) {
                return reply(Boom.badRequest("Bad HTTP authentication header format", "Bearer"));
            }

            let jwt_token = authorization_header_value_elements[1];

            jwt.verify(jwt_token, bearer_jwt_options.verification_key, bearer_jwt_options.verify_attributes, function(err, decoded_token) {
                if (err && err.message === "jwt expired") {
                    return reply(Boom.unauthorized("Expired token received for JSON Web Token validation", "Bearer"));
                } else if (err) {
                    return reply(Boom.unauthorized("Invalid signature received for JSON Web Token validation", "Bearer"));
                }

                if (!bearer_jwt_options.validate_func) {
                    return reply.continue({credentials: decoded_token});
                }

                bearer_jwt_options.validate_func(request, decoded_token, function(err, isValid, credentials) {

                    if (err) {
                        return reply(err, null, {credentials: credentials});
                    }

                    if (!isValid) {
                        return reply(Boom.unauthorized("Invalid token", "Bearer"), null, {credentials: credentials});
                    }

                    // if (_isEmpty(credentials)) {
                    //     credentials = decoded_token;
                    // }

                    if (_isEmpty(credentials) || typeof credentials !== "object") {

                        return reply(Boom.badImplementation("Bad credentials object received for jwt auth validation"), null, {
                            log: {
                                tags: "credentials"
                            }
                        });
                    }

                    // jwt authorization succeeded
                    return reply.continue({credentials: credentials});
                });
            });
        }
    };

    return scheme;
};

/**
 *
 * @param  {[type]}   server  [description]
 * @param  {[type]}   options [description]
 * @param  {Function} next    [description]
 * @return {[type]}           [description]
 */
module.exports.register = (server, options, next) => {
    server.auth.scheme("jwt", bearer_jwt_scheme);
    return next();
};

/**
 *
 * @type {Object}
 */
module.exports.register.attributes = {
    pkg: require("./package.json")
};
