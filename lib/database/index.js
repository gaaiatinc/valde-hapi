/**
 * Created by Ali on 7/29/2014.
 */
"use strict";

let loggerFactory = require("../app_logger")
    , mongoClient = require("mongodb").MongoClient
    , Q = require("q");


let logger;

let dbMgr = {};
let dbURL;
let dbName = null;
let dbInstance = null;
let arrayFetchLimit = 1000;

let connectConfig = {
    // mongodb client is to use Q.Promise as the promise library:
    promiseLibrary: Q.Promise,

    db: {
        w: 1,
        wtimeout: 10000,
        fsync: false,
        j: true,
        //            readPreference: "nearest",
        native_parser: true,
        forceServerObjectId: true,
        //pkFactory: function () {
        //    return 1
        //},
        serializeFunctions: false,
        raw: false,
        retryMiliSeconds: 1000,
        numberOfRetries: 10,
        bufferMaxEntries: 100
    },
    server: {
        poolSize: 10,
        //auto_reconnect: true,  // for version 1.4.39 of the driver
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

/**
 *
 * @param appConfig
 */
dbMgr.init = function (appConfig) {

    if (!appConfig.get("app:database")) {
        return Q.resolve();
    } else {

        logger = loggerFactory.getLogger("APP_Database_Mgr", appConfig.get("env:production") ? "WARN" : "DEBUG");
        arrayFetchLimit = appConfig.get("app:database:array_fetch_limit") || 1000;

        dbName = appConfig.get("app:database:database");

        logger.info("APP database management module initializing ...");

        dbURL = "mongodb://" + appConfig.get("app:database:login_id") +
            ":" + appConfig.get("app:database:login_password") +
            "@" + appConfig.get("app:database:host_seed") +
            "/" + appConfig.get("app:database:database");

        logger.info("APP database URL: " + dbURL);

        //if the db appConfig has replSet specified, then connect with replSet
        if (appConfig.get("app:database:replSet")) {
            connectConfig.replSet = {
                ha: true,
                haInterval: 10000,
                replicaSet: appConfig.get("app:database:replSet"),
                secondaryAcceptableLatencyMS: 100,
                connectWithNoPrimary: false,
                poolSize: 10,
                socketOptions: {
                    noDelay: true,
                    keepAlive: 50000,
                    connectTimeoutMS: 0,
                    socketTimeoutMS: 0
                }
            };
        }

        return Q.Promise((resolve, reject) => {
            /**
             * Connection to the database
             */
            (function dbConnect() {
                mongoClient.connect(dbURL, connectConfig, (err, db) => {
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
 * Insert single doc into collection.
 * Note: it swallows duplicate key errors.
 * @param collectionName
 * @param doc
 * @param options
 */
dbMgr.insertOne = function (collectionName, doc, options) {
    return Q.Promise((resolve, reject) => {
        let collection;

        doc.date_last_updated = new Date();
        collection = dbInstance.collection(collectionName);
        collection.insertOne(doc, options)
            .then(resolve)
            .catch((err) => {
                if (err && err.code !== 11000) { // swallow duplicate key errors
                    logger.error(err);
                }
                return reject(err);
            });
    });
};

/**
 *
 * @param collectionName
 * @param docs
 * @param options
 * @returns {*}
 */
dbMgr.insertMany = function (collectionName, docs, options) {
    if (!Array.isArray(docs)) {
        return Q.reject(new Error("docs must be an array!"));
    }
    return Q.Promise((resolve, reject) => {
        let collection;

        let now_date = new Date();
        docs.forEach((entry, idx, fullArray) => {
            entry.date_last_updated = now_date;
        });

        collection = dbInstance.collection(collectionName);
        collection.insertMany(docs, options)
            .then(resolve)
            .catch((err) => {
                if (err && err.code !== 11000) { // swallow duplicate key errors
                    logger.error(err);
                }
                return reject(err);
            });
    });
};


/**
 * Find doc in collection according to "match"
 * @param collectionName
 * @param query
 * @param options
 */
dbMgr.find = function (collectionName, query, options) {

    options = options || {};
    options.limit = options.limit || arrayFetchLimit;

    return Q.Promise((resolve, reject) => {
        let collection = dbInstance.collection(collectionName);
        __idStringToObjectID(query);

        let cursor = collection.find(query).limit(options.limit);

        if (options.sort && Array.isArray(options.sort)) {
            cursor = cursor.sort(options.sort);
        }

        if (options.skip) {
            cursor = cursor.skip(options.skip);
        }

        if (options.project) {
            cursor = cursor.project(options.project);
        }

        cursor.toArray()
            .then(resolve)
            .catch((err) => {
                logger.error(err);
                return reject(err);
            });
    });
};


/**
 *
 * @param collectionName
 * @param query
 * @param options
 * @returns {*}
 */
dbMgr.count = function (collectionName, query, options) {

    options = options || {};
    options.limit = options.limit || arrayFetchLimit;  //should be externalized and set in the config object

    return Q.Promise((resolve, reject) => {
        let collection = dbInstance.collection(collectionName);

        __idStringToObjectID(query);

        let cursor = collection.find(query).limit(options.limit);

        if (options.sort && Array.isArray(options.sort)) {
            cursor = cursor.sort(options.sort);
        }

        if (options.skip) {
            cursor = cursor.skip(options.skip);
        }

        if (options.project) {
            cursor = cursor.project(options.project);
        }

        cursor.count()
            .then(resolve)
            .catch((err) => {
                logger.error(err);
                return reject(err);
            });
    });
};


/**
 *
 * @param collectionName
 * @param query
 * @param options
 * @param iteratorCallback
 * @returns {*}
 */
dbMgr.forEach = function (collectionName, query, options, iteratorCallback) {

    options = options || {};

    if (typeof iteratorCallback !== "function") {
        return Q.reject(new Error("iteratorCallback function is required!"));
    }

    return Q.Promise((resolve, reject) => {
        let collection = dbInstance.collection(collectionName);
        __idStringToObjectID(query);

        let cursor = collection.find(query);

        if (options.sort && Array.isArray(options.sort)) {
            cursor = cursor.sort(options.sort);
        }

        if (options.skip) {
            cursor = cursor.skip(options.skip);
        }

        if (options.project) {
            cursor = cursor.project(options.project);
        }

        cursor.forEach(iteratorCallback,
            (err) => {
                if (err) {
                    logger.error(err);
                    return reject(err);
                } else {
                    resolve();
                }
            });
    });
};


/**
 *
 * @param collectionName
 * @param key
 * @param query
 * @param options
 * @returns {*}
 */
dbMgr.findDistinct = function (collectionName, key, query, options) {
    return Q.Promise((resolve, reject) => {
        let collection = dbInstance.collection(collectionName);
        collection.distinct(key, query, options || {})
            .then(resolve)
            .catch((err) => {
                logger.error(err);
                return reject(err);

            });
    });
};


/**
 * Create a unique index ona field. If it's already created, does nothing.
 * @param collectionName
 * @param fieldSpec
 * @param options
 */
dbMgr.createIndex = function (collectionName, fieldSpec, options) {
    return Q.Promise((resolve, reject) => {
        dbInstance.createIndex(collectionName, fieldSpec, options)
            .then(resolve)
            .catch((err) => {
                logger.error(err);
                return reject(err);
            });
    });
};


/**
 * Drop collection by name
 * @param collectionName
 */
dbMgr.drop = function (collectionName) {
    return Q.Promise((resolve, reject) => {
        let collection = dbInstance.collection(collectionName);
        collection.drop()
            .then(resolve)
            .catch((err) => {
                logger.error(err);
                return reject(err);
            });
    });
};


/**
 *
 * @param collectionName
 * @returns {*}
 */
dbMgr.indexes = function (collectionName) {
    return Q.Promise((resolve, reject) => {
        let collection = dbInstance.collection(collectionName);
        collection.indexes()
            .then(resolve)
            .catch((err) => {
                logger.error(err);
                return reject(err);
            })
    });
};

/**
 *
 * @param collectionName
 * @param indexName
 * @param options
 * @returns {*}
 */
dbMgr.dropIndex = function (collectionName, indexName, options) {
    return Q.Promise((resolve, reject) => {
        let collection = dbInstance.collection(collectionName);
        collection.dropIndex(indexName, options)
            .then(resolve)
            .catch((err) => {
                logger.error(err);
                reject(err);
            });
    });
};


/**
 *
 * @param collectionName
 * @param query
 * @param options
 * @returns {*}
 */
dbMgr.deleteOne = function (collectionName, query, options) {
    return Q.Promise((resolve, reject) => {
        let collection = dbInstance.collection(collectionName);
        __idStringToObjectID(query);
        collection.deleteOne(query, options)
            .then(resolve)
            .catch((err) => {
                logger.error(err);
                return reject(err);
            });
    });
};

/**
 * Remove document(s) from collection
 * @param collectionName
 * @param query
 * @param options
 */
dbMgr.deleteMany = function (collectionName, query, options) {
    return Q.Promise((resolve, reject) => {
        let collection = dbInstance.collection(collectionName);
        collection.deleteMany(query, options || {})
            .then(resolve)
            .catch((err) => {
                logger.error(err);
                return reject(err);
            });
    });
};


/**
 * Check if a collection exists
 * @param collectionName
 */
dbMgr.collectionExists = function (collectionName) {
    return Q.Promise((resolve, reject) => {
        let collection = dbInstance.collection("system.namespaces");
        collection.find({name: dbName + "." + collectionName}).count()
            .then((count) => {
                resolve(count > 0);
            })
            .catch((err) => {
                logger.error(err);
                return reject(err);
            });
    });
};

/**
 * Update one document
 *
 * @param collectionName
 * @param query
 * @param doc
 * @param options
 * @returns {*}
 */
dbMgr.updateOne = function (collectionName, query, doc, options) {
    return Q.Promise((resolve, reject) => {
        let collection;

        doc = doc || {};

        __idStringToObjectID(query);

        if (doc._id) {
            try {
                delete doc._id;
            } catch (err) {
                reject(err);
            }
        }

        doc.$currentDate = {date_last_updated: true};

        collection = dbInstance.collection(collectionName);
        collection.updateOne(query, doc, options)
            .then(resolve)
            .catch((err) => {
                logger.error(err);
                return reject(err);
            });
    });
};


/**
 *
 * @param collectionName
 * @param query
 * @param doc
 * @param options
 * @returns {*}
 */
dbMgr.updateMany = function (collectionName, query, doc, options) {
    return Q.Promise((resolve, reject) => {
        let collection;

        doc = doc || {};

        __idStringToObjectID(query);

        if (doc._id) {
            try {
                delete doc._id;
            } catch (err) {
                reject(err);
            }
        }

        doc.$currentDate = {date_last_updated: true};

        collection = dbInstance.collection(collectionName);
        collection.updateMany(query, doc, options)
            .then(resolve)
            .catch((err) => {
                logger.error(err);
                return reject(err);
            });
    });
};


/**
 *
 * @param collectionName
 * @param operations
 * @param options
 * @returns {*}
 */
dbMgr.bulkWrite = function (collectionName, operations, options) {
    return Q.Promise((resolve, reject) => {
        let collection = dbInstance.collection(collectionName);
        collection.bulkWrite(operations, options || {})
            .then(resolve)
            .catch((err, result) => {
                if (err) {
                    logger.info("bulkWrite", err);
                    return reject(err);
                } else {
                    return resolve(result);
                }
            })
    });
};

/**
 * Get collections
 * @returns {*}
 */
dbMgr.getCollections = function () {
    return Q.Promise((resolve, reject) => {
        dbInstance.collections()
            .then((docs) => {
                let cache = [];
                let result = JSON.stringify(docs, (key, value) => {

                    if (key === "url" || key === "password" || key === "credentials") {
                        // Do not send password info
                        return "[hidden]";
                    }

                    if (typeof value === "object" && value !== null) {
                        if (cache.indexOf(value) !== -1) {
                            // Circular reference found, discard key
                            return;
                        }
                        // Store value in our collection
                        cache.push(value);
                    }
                    return value;
                });
                cache = null; // garbage collection
                return resolve(result);

            })
            .catch((err) => {
                logger.error(err);
                return reject(err);
            });
    });
};

/**
 * Lists collection names in the database
 *
 * @param filter
 * @param options
 * @returns {*}
 */
dbMgr.listCollections = function (filter, options) {
    return Q.Promise((resolve, reject) => {
        dbInstance.listCollections(filter || {}, options || {})
            .toArray()
            .then(resolve)
            .catch((err) => {
                logger.error(err);
                return reject(err);
            })
    });
};


/**
 * Replace Mongo DB ID string by ObjectID
 * @param match
 */
function __idStringToObjectID(match) {
    if ((typeof match === "object") && match.hasOwnProperty("_id") && (match._id) && (typeof match._id === "string")) {
        try {
            match._id = new mongoClient.ObjectID(match._id);
        }
        catch (ex) {
            match._id = null;
        }
    }
}

module.exports = dbMgr;
