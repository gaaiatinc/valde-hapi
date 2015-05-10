/**
 * Created by aismael on 11/20/13.
 */

"use strict";

var log4js = require("log4js"),
    nconf = require("nconf"),
    path = require("path");


var loggersMap = {};
var logSize = 20480000;
var numBackups = 3;
var appRoot = path.resolve(".");
//    var appRoot = path.dirname(require.main.filename);
var runMode = nconf.get("NODE_ENV") || "development";

log4js.configure(appRoot + "/config/logger_config.json", {});

if (runMode == "development") {
    //console appender is added only for development mode for performance reasons
    log4js.addAppender(log4js.appenders.console());
}

var appLogFactory = Object.create(Object.prototype, {
        getLogger: {
            enumerable: false,
            configurable: false,
            value: function (loggerName, logLevel) {
                var logger;
                if (loggersMap[loggerName]) {
                    logger = loggersMap[loggerName];
                } else {
                    logLevel = logLevel || "WARN";
                    loggerName = loggerName || "APP_WebApp";
                    log4js.addAppender(log4js.appenders.file("logs/app.log"), loggerName, logSize, numBackups);

                    logger = log4js.getLogger(loggerName);
                    logger.setLevel(logLevel);
                    loggersMap[loggerName] = logger;
                }
                return logger;
            }
        }
    })
    ;

module.exports = appLogFactory;

