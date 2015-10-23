/**
 * Created by aismael on 7/29/2014.
 */
"use strict";

var loggerFactory = require("../app_logger")
    , appConfig = require("../app_config").getConfig()
    , mongoClient = require("mongodb").MongoClient
    , ObjectID = require("mongodb").ObjectID
    , format = require("util").format
    , Q = require("q")
    , moment = require("moment");

var logger = loggerFactory.getLogger("APP_Database_Mgr", appConfig.get("env:production") ? "WARN" : "DEBUG");

var connectConfig = {
    db: {
        w: 1,
        wtimeout: 10000,
        fsync: false,
        j: true,
        //            readPreference: "nearest",
        native_parser: true,
        forceServerObjectId: false,
        //pkFactory: function () {
        //    return 1
        //},
        //promiseLibrary: Q.Promise, -- did not work!!
        serializeFunctions: false,
        raw: false,
        retryMiliSeconds: 1000,
        numberOfRetries: 10,
        bufferMaxEntries: 100
    },
    server: {
        poolSize: 10,
//        auto_reconnect: true,  // for version 1.4.39 of the driver
        socketOptions: {
            autoReconnect: true,
            noDelay: true,
            keepAlive: 50000,
            connectTimeoutMS: 0,
            socketTimeoutMS: 0
        },
        reconnectTries: 1000,
        reconnectInterval: 1000
    }
    //replSet: {
    //    ha: false
    //    , haInterval: 10000
    //    , replicaSet: "rs"
    //    , secondaryAcceptableLatencyMS: 100
    //    , connectWithNoPrimary: true
    //    , poolSize: 1
    //    , socketOptions: {
    //        noDelay: false
    //        , keepAlive: 100
    //        , connectTimeoutMS: 444444
    //        , socketTimeoutMS: 555555
    //    }
    //},
    //mongos: {
    //    ha: false
    //    , haInterval: 10000
    //    , secondaryAcceptableLatencyMS: 100
    //    , poolSize: 1
    //    , socketOptions: {
    //        noDelay: false
    //        , keepAlive: 100
    //        , connectTimeoutMS: 444444
    //        , socketTimeoutMS: 555555
    //    }
    //}
};


var dbInstance = null;

logger.info("APP database management module initializing ...");

var dbURL;

var dbMgr = {};


/**
 *
 * @param config
 */
dbMgr.init = function (config) {

    if (!appConfig.get("app:database")) {
        return Q.resolve();
    } else {
        dbURL = "mongodb://" + appConfig.get("app:database:login_id") +
            ":" + appConfig.get("app:database:login_password") + "@" +
            appConfig.get("app:database:host") + ":" + appConfig.get("app:database:port") +
            "/" + appConfig.get("app:database:database");

        return Q.Promise(function (resolve, reject) {
            /**
             * Connection to the database
             */
            (function dbConnect() {
                mongoClient.connect(dbURL, connectConfig, function (err, db) {
                    if (err) {
                        logger.error(err);
                        setTimeout(dbConnect, appConfig.get("app:database:connect_retry_millies"));
                    } else {
                        dbInstance = db;
                        logger.info("Successfully connected to the database.");
                        return resolve();
                    }
                });
            }());
        });
    }
};


/**
 * Insert single doc into collection. Adds a created_date field.
 * Note: it swallows duplicate key errors.
 * @param collectionName
 * @param doc
 */
dbMgr.insertOne = function (collectionName, doc) {
    return Q.Promise(function (resolve, reject) {
        var collection = dbInstance.collection(collectionName);
        collection.insertOne(
            doc,
            function (err, results) {
                if (err) {
                    logger.error(err);
                    return reject(err);
                } else {
                    return resolve(doc);
                }
            });
    });
};

/**
 * Find doc in collection according to "match"
 * @param collectionName
 * @param match
 * @param options
 */
dbMgr.find = function (collectionName, match, options) {
    return Q.Promise(function (resolve, reject) {
        var collection = dbInstance.collection(collectionName);
        collection.find(match, options || {}).toArray(function (err, docs) {
            if (err) {
                logger.error(err);
                return reject(err);
            } else {
                return resolve(docs);
            }
        });
    });
};


/**
 *
 * @param collectionName
 * @param match
 * @param options
 * @returns {*}
 */
dbMgr.findOne = function (collectionName, match, options) {

    return Q.Promise(function (resolve, reject) {
        var collection = dbInstance.collection(collectionName);
        collection.findOne(match, options || {}, function (err, docs) {
            if (err) {
                logger.error(err);
                return reject(err);
            } else {
                if (!docs) {
                    reject(new Error("No documents found!"));
                } else {
                    resolve(docs);
                }
            }
        });
    });
};


/**
 *
 * @param collectionName
 * @param match
 * @param updateSpecs
 * @param options
 * @returns {*}
 */
dbMgr.updateOne = function (collectionName, match, updateSpecs, options) {

    return Q.Promise(function (resolve, reject) {
        var collection = dbInstance.collection(collectionName);

        collection.updateOne(match, updateSpecs, options || {upsert: false},
            function (err, results) {
                if (err) {
                    logger.error(err);
                    return reject(err);
                } else {
                    resolve(results);
                }
            });
    });
};


/**
 * Get all docs in collection
 * @param collectionName
 * @returns {*}
 */
dbMgr.getAll = function (collectionName) {
    return dbMgr.find(collectionName, {});
};

/**
 * Get docs in collection by date range.
 * @param collectionName
 * @param startDateString
 * @param endDateString
 */
dbMgr.findByDateRange = function (collectionName, startDateString, endDateString) {
    var startDate = moment(startDateString);
    var endDate = moment(endDateString).add(1, "days");

    if (startDate.isValid() == false || endDate.isValid() == false) {
        return Q.defer().reject(new Error("Invalid start or end date specified."));
    }

    return dbMgr.find(collectionName, {
        "created_date": {
            "$gte": startDate.toDate(),
            "$lte": endDate.toDate()
        }
    });
};


///**
// * Create a TTL index on the created_date field
// * @param collectionName
// * @param expireAfterDays
// */
//dbMgr.ensureTtl = function (collectionName, expireAfterDays) {
//
//    return Q.Promise(function (resolve, reject) {
//        var expireAfterSeconds = expireAfterDays * 86400;
//        dbInstance.ensureIndex(collectionName, "created_date", {"expireAfterSeconds": expireAfterSeconds}, function (err) {
//            if (err) {
//                logger.error(err);
//                reject(err);
//            } else {
//                resolve();
//            }
//        });
//    });
//};


/**
 * Remove document from collection
 * @param collectionName
 * @param options
 */
dbMgr.deleteMany = function (collectionName, match, options) {
    return Q.Promise(function (resolve, reject) {
        var collection = dbInstance.collection(collectionName);
        collection.deleteMany(match, options || {}, function (err, result) {
            if (err) {
                logger.error(err);
                return reject(err);
            } else {
                return resolve();
            }
        });
    });
};


//dbMgr.collectionExists = function (collectionName, callback) {
//    try {
//        var collection = dbInstance.collection("system.namespaces");
//        collection.find({name: "inspiredb" + "." + collectionName}).toArray(
//            function (err, docs) {
//                if (err) {
//                    logger.error(err);
//                    return callback(err);
//                }
//                callback(err, docs.length > 0);
//            });
//    } finally {
//        //db.close();
//    }
//};


//dbMgr.upsert = function (collection_name, doc) {
//    try {
//        var collection = dbInstance.collection(collection_name);
//        collection.updateOne(
//            {transactionId: doc.transactionId},
//            doc,
//            {upsert: true},
//            function (err, docs) {
//                if (err) {
//                    logger.error(err);
//                }
//
//                next(err, docs);
//            });
//    } finally {
//        //db.close();
//    }
//};

module.exports = dbMgr;

logger.info("APP database management module initialized.");
