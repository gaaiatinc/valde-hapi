/**
 * Created by aismael on 11/20/13.
 */

"use strict";

var winston = require('winston'),
    nconf = require("nconf"),
    path = require("path");


var loggersMap = {};
var logSize = 20480000;
var numBackups = 3;
var appRoot = path.resolve(".");
//    var appRoot = path.dirname(require.main.filename);
var runMode = nconf.get("NODE_ENV") || "development";

//TODO:
//log4js.configure(appRoot + "/config/logger_config.json", {});
winston.loggers.options.transports = [
    //// Setup your shared transports here
    //new (winston.transports.Console)({
    //    timestamp: function() {return new Date().toString()},
    //    prettyPrint: true,
    //    showLevel: true,
    //    level: 'silly',
    //    colorize: true
    //}),
    //new (winston.transports.File)({
    //    filename: './logs/app.log',
    //    timestamp: function() {return new Date().toString()},
    //    prettyPrint: true,
    //    showLevel: true,
    //    level: 'silly',
    //    colorize: true,
    //    zippedArchive: true,
    //    maxFiles: 4,
    //    maxsize: 2000000
    //})
];

if (runMode == "development") {
    //console appender is added only for development mode for performance reasons
    //TODO:
//    log4js.addAppender(log4js.appenders.console());
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
                    logLevel = logLevel || "warn";
                    logLevel = logLevel.toLowerCase();

                    loggerName = loggerName || "APP_WebApp";

                    //TODO:
                    //log4js.addAppender(log4js.appenders.file("logs/app.log"), loggerName, logSize, numBackups);

                    //TODO:
                    //logger = log4js.getLogger(loggerName);
                    //logger.setLevel(logLevel);
                    logger = winston.loggers.add(loggerName, {
                        console: {
                            level: logLevel,
                            label: loggerName,
                            timestamp: function () {
                                return new Date().toString()
                            },
                            prettyPrint: true,
                            showLevel: true,
                            colorize: true
                        },
                        file: {
                            filename: './logs/app.log',
                            timestamp: function () {
                                return new Date().toString()
                            },
                            prettyPrint: true,
                            showLevel: true,
                            level: 'silly',
                            label: loggerName,
                            colorize: true,
                            json: false,
                            zippedArchive: true,
                            maxFiles: 4,
                            maxsize: 2000000
                        }
                    });

                    loggersMap[loggerName] = logger;
                }
                return logger;
            }
        }
    })
    ;

module.exports = appLogFactory;

