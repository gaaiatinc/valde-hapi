/**
 * Created by Ali on 4/9/2015.
 */

"use strict";

var app_logger = require("app_logger"),
    app_config = require("app_config"),
    app_constants = require("app_constants"),
    database = require("database"),
    locale_resolver = require("locale_resolver"),
    model = require("model"),
    server = require("server"),
    string_key_factory = require("string_key_factory");

module.exports = {
    app_config: app_config,
    app_constants: app_constants,
    app_logger: app_logger,
    database: database,
    locale_resolver: locale_resolver,
    model: model,
    init: server,
    string_key_factory: string_key_factory
};

