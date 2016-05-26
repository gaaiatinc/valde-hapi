/**
 * Created by aismael on 11/20/13.
 */

"use strict";

let winston = require("winston"),
    nconf = require("nconf"),
    moment = require("moment"),
    fs = require("fs"),
    path = require("path");

let loggersMap = {};
let appRoot = path.resolve(".");
//    let appRoot = path.dirname(require.main.filename);
let runMode = nconf.get("NODE_ENV") || "development";

let loggerConfigFile = path.join(path.dirname(require.main.filename), "config/logger_config.json");
let winstonConfig = winston.config.npm;

winston.setLevels(winstonConfig.levels);
winston.addColors(winstonConfig.colors);

let loggerContainer = new(winston.Container)();

let loggerConfig = {
    "logFile": "logs/app.log",
    "maxLogFileSize": 20480000,
    "backups": 3,
    "globalLogLevel": "info",
    "configurationRefreshPeriodMinutes": 1,
    "loggers": []
};

let appLogFactory = Object.create(Object.prototype, {
    getLogger: {
        enumerable: false,
        configurable: false,
        value: (loggerName, logLevel) => {

            let logger;
            if (loggersMap[loggerName]) {
                logger = loggersMap[loggerName];
            } else {
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
                        timestamp: () => {
                            //TODO: implement check on config file for dynamic config capability by piggy-back on timestamp
                            //console.log("timestamp func called");
                            return new moment().format();
                        },
                        prettyPrint: true,
                        showLevel: true,
                        colorize: "all"
                    },
                    file: {
                        filename: "./logs/app.log",
                        timestamp: () => {
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
    let loggerConfFileStats = fs.statSync(loggerConfigFile);

    if (!loggerConfFileStats.isFile()) {
        console.warn(">>> loger configuration file: " + loggerConfigFile + " not found!");
    }

    //configure the container
    let logConfigStr = fs.readFileSync(loggerConfigFile, {
        encoding: "utf8"
    });

    loggerConfig = JSON.parse(logConfigStr);
    loggerConfig.globalLogLevel = loggerConfig.globalLogLevel.toLowerCase();
    if (!winstonConfig.levels[loggerConfig.globalLogLevel]) {
        loggerConfig.globalLogLevel = "info";
    }

    let tempLogger;
    loggerConfig.loggers.forEach((entry, idx, arr) => {
        tempLogger = appLogFactory.getLogger(entry.loggerName, entry.logLevel);
    });

} catch (err) {
    console.warn(">>> loger configuration file: " + loggerConfigFile + " not found, or corrupted!", err.message);
}

module.exports = appLogFactory;
