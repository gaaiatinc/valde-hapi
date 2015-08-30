/**
 * Created by aismael on 11/20/13.
 */

"use strict";

var winston = require('winston'),
    nconf = require("nconf"),
    moment = require("moment"),
    fs = require("fs"),
    path = require("path");


var loggersMap = {};
var appRoot = path.resolve(".");
//    var appRoot = path.dirname(require.main.filename);
var runMode = nconf.get("NODE_ENV") || "development";


var loggerConfigFile = path.join(path.dirname(require.main.filename), "config/logger_config.json");
var winstonConfig = winston.config.npm;

winston.setLevels(winstonConfig.levels);
winston.addColors(winstonConfig.colors);

var loggerContainer = new (winston.Container)();

var loggerConfig = {
    "logFile": "logs/app.log",
    "maxLogFileSize": 20480000,
    "backups": 3,
    "globalLogLevel": "info",
    "configurationRefreshPeriodMinutes": 1,
    "loggers": []
}


var appLogFactory = Object.create(Object.prototype, {
    getLogger: {
        enumerable: false,
        configurable: false,
        value: function (loggerName, logLevel) {

            var logger;
            if (loggersMap[loggerName]) {
                logger = loggersMap[loggerName];
                console.log("logger found:", loggerName);
            } else {
                console.log("logger being created:", loggerName);
                logLevel = logLevel || "warn";
                logLevel = logLevel.toLowerCase();


                if (winstonConfig.levels[logLevel] < winstonConfig.levels[loggerConfig.globalLogLevel]) {
                    logLevel = loggerConfig.globalLogLevel;
                }

                loggerName = loggerName || "APP_WebApp";

                logger = loggerContainer.add(loggerName, {
                    console: {
                        level: logLevel,
                        silent: !(runMode === "development"),
                        label: loggerName,
                        timestamp: function () {
                            //TODO: implement check on config file for dynamic config capability by piggy-back on timestamp
                            //console.log("timestamp func called");
                            return new moment().format();
                        },
                        prettyPrint: true,
                        showLevel: true,
                        colorize: "all"
                    },
                    file: {
                        filename: './logs/app.log',
                        timestamp: function () {
                            return new moment().format();
                        },
                        prettyPrint: true,
                        showLevel: true,
                        level: logLevel,
                        label: loggerName,
                        colorize: false,
                        json: false,
                        zippedArchive: true,
                        maxFiles: loggerConfig.backups,
                        maxsize: loggerConfig.maxLogFileSize
                    }
                });

                logger.setLevels(winstonConfig.levels);
                loggersMap[loggerName] = logger;
            }
            return logger;
        }
    }
});


try {
    var loggerConfFileStats = fs.statSync(loggerConfigFile);

    if (!loggerConfFileStats.isFile()) {
        console.log(">>> loger configuration file: " + loggerConfigFile + " not found!");
    }

    //configure the container
    var logConfigStr = fs.readFileSync(loggerConfigFile, {encoding: "utf8"});

    loggerConfig = JSON.parse(logConfigStr);
    loggerConfig.globalLogLevel = loggerConfig.globalLogLevel.toLowerCase();
    if (!winstonConfig.levels[loggerConfig.globalLogLevel]) {
        loggerConfig.globalLogLevel = "info";
    }

    var tempLogger;
    loggerConfig.loggers.forEach(function (entry, idx, arr) {
        tempLogger = appLogFactory.getLogger(entry.loggerName, entry.logLevel);
    })

} catch
    (err) {
    console.log(">>> loger configuration file: " + loggerConfigFile + " not found, or corrupted!", err.message);
}


module.exports = appLogFactory;

