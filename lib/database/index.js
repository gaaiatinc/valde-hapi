/**
 * Created by Ali on 7/29/2014.
 */
"use strict";
let mongo = require("mongodb");
let mongo_client = mongo.MongoClient;
let Q = require("q");
let app_config = require("../app_config")
    .get_config();

let dbMgr = {};
let dbURL;
let dbName = null;
let dbInstance = null;
let array_fetch_limit = 1000;
let logger_factory = require("../app_logger");

let logger;

let connect_config = {
    // mongodb client is to use Q.Promise as the promise library:
    promiseLibrary: Q.Promise,

    db: {
        w: 1,
        wtimeout: 10000,
        fsync: false,
        j: true,
        //readPreference: "nearest",
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
 * @param config
 */
dbMgr.init = function(config) {
    if (!app_config.get("app:database")) {
        return Q.resolve();
    } else {
        logger = logger_factory.getLogger("APP_Database_Mgr", app_config.get("env:production") ? "WARN" : "DEBUG");
        array_fetch_limit = app_config.get("app:database:array_fetch_limit") || 1000;

        dbName = app_config.get("app:database:database");

        logger.info("APP database management module initializing ...");

        dbURL = "mongodb://" + app_config.get("app:database:login_id") +
            ":" + app_config.get("app:database:login_password") +
            "@" + app_config.get("app:database:host_seed") +
            "/" + app_config.get("app:database:database");

        logger.info("APP database URL: " + dbURL);

        //if the db app_config has replSet specified, then connect with replSet
        if (app_config.get("app:database:replSet")) {
            connect_config.replSet = {
                ha: true,
                haInterval: 10000,
                replicaSet: app_config.get("app:database:replSet"),
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
                mongo_client.connect(dbURL, connect_config, (err, db) => {
                    if (err) {
                        logger.error(err);
                        setTimeout(dbConnect, app_config.get("app:database:connect_retry_millies"));
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
 * @param options
 */
dbMgr.insertOne = function(collectionName, doc, options) {
    return Q.Promise((resolve, reject) => {
        let collection,
            datestamp = new Date();

        __removeAttribute(doc, "_id");

        doc.created_date = doc.created_date || datestamp;
        doc.date_last_updated = doc.date_last_updated || datestamp;
        collection = dbInstance.collection(collectionName);
        collection.insertOne(doc, options, (err, data) => {
            if (err) {
                logger.error(err);
                return reject(err);
            } else {
                return resolve(data);
            }
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
dbMgr.insertMany = function(collectionName, docs, options) {
    if (!Array.isArray(docs)) {
        return Q.reject(new Error("docs must be an array!"));
    }
    return Q.Promise((resolve, reject) => {
        let collection,
            datestamp = new Date(),
            updateDocs = docs.map(doc => {
                __removeAttribute(doc, "_id");
                doc.created_date = doc.created_date || datestamp;
                doc.date_last_updated = doc.date_last_updated || datestamp;
                return doc;
            });

        collection = dbInstance.collection(collectionName);
        collection.insertMany(updateDocs, options, (err, data) => {
            if (err) {
                logger.error(err);
                return reject(err);
            } else {
                return resolve(data);
            }
        });
    });
};

/**
 * Find doc in collection according to "match"
 * @param collectionName
 * @param query
 * @param options
 */
dbMgr.find = function(collectionName, query, options) {

    options = options || {};
    options.limit = options.limit || array_fetch_limit;

    return Q.Promise((resolve, reject) => {
        let collection = dbInstance.collection(collectionName);
        __replaceId(query);

        let cursor = collection.find(query)
            .limit(options.limit);

        if (options.sort && Array.isArray(options.sort)) {
            cursor = cursor.sort(options.sort);
        }

        if (options.skip) {
            cursor = cursor.skip(options.skip);
        }

        if (options.project) {
            cursor = cursor.project(options.project);
        }

        cursor.toArray((err, data) => {
            if (err) {
                logger.error(err);
                return reject(err);
            } else {
                return resolve(data);
            }
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
dbMgr.count = function(collectionName, query, options) {

    options = options || {};
    options.limit = options.limit || array_fetch_limit; //should be externalized and set in the config object

    return Q.Promise((resolve, reject) => {
        let collection = dbInstance.collection(collectionName);

        __replaceId(query);

        let cursor = collection.find(query)
            .limit(options.limit);

        if (options.sort && Array.isArray(options.sort)) {
            cursor = cursor.sort(options.sort);
        }

        if (options.skip) {
            cursor = cursor.skip(options.skip);
        }

        if (options.project) {
            cursor = cursor.project(options.project);
        }

        cursor.count((err, data) => {
            if (err) {
                logger.error(err);
                return reject(err);
            } else {
                return resolve(data);
            }
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
dbMgr.forEach = function(collectionName, query, options, iteratorCallback) {

    options = options || {};

    if (typeof iteratorCallback !== "function") {
        return Q.reject(new Error("iteratorCallback function is required!"));
    }

    return Q.Promise((resolve, reject) => {
        let collection = dbInstance.collection(collectionName);
        __replaceId(query);

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
                    reject(err);
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
dbMgr.findDistinct = function(collectionName, key, query, options) {
    return Q.Promise((resolve, reject) => {
        let collection = dbInstance.collection(collectionName);
        collection.distinct(key, query, options || {}, (err, data) => {
            if (err) {
                logger.error(err);
                return reject(err);
            } else {
                return resolve(data);
            }
        });
    });
};

/**
 * Create a unique index ona field. If it's already created, does nothing.
 * @param collectionName
 * @param fieldSpec
 * @param options
 */
dbMgr.createIndex = function(collectionName, fieldSpec, options) {
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
dbMgr.drop = function(collectionName) {
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
dbMgr.indexes = function(collectionName) {
    return Q.Promise((resolve, reject) => {
        let collection = dbInstance.collection(collectionName);
        collection.indexes()
            .then(resolve)
            .catch((err) => {
                logger.error(err);
                return reject(err);
            });
    });
};

/**
 * Drop index by name
 * @param indexName
 * @param options
 */
dbMgr.dropIndex = function(collectionName, indexName, options) {
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
dbMgr.deleteOne = function(collectionName, query, options) {
    return Q.Promise((resolve, reject) => {
        let collection = dbInstance.collection(collectionName);
        __replaceId(query);
        collection.deleteOne(query, options || {}, (err, data) => {
            if (err) {
                logger.error(err);
                return reject(err);
            } else {
                return resolve(data);
            }
        });
    });
};

/**
 * Remove document(s) from collection
 * @param collectionName
 * @param query
 * @param options
 */
dbMgr.deleteMany = function(collectionName, query, options) {
    return Q.Promise((resolve, reject) => {
        let collection = dbInstance.collection(collectionName);
        __replaceId(query);
        collection.deleteMany(query, options || {}, (err, data) => {
            if (err) {
                logger.error(err);
                return reject(err);
            } else {
                return resolve(data);
            }
        });
    });
};

/**
 * Check if a collection exists
 * @param collectionName
 */
dbMgr.collectionExists = function(collectionName) {
    return Q.Promise((resolve, reject) => {
        let collection = dbInstance.collection("system.namespaces");
        let collectionNameMatch = {
            name: dbName + "." + collectionName
        };
        collection.find(collectionNameMatch)
            .count()
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
dbMgr.updateOne = function(collectionName, query, doc, options) {
    return Q.Promise((resolve, reject) => {

        doc = doc || {};

        __replaceId(query);

        __removeAttribute(doc, "_id");
        __removeAttribute(doc, "date_last_updated");

        doc.$currentDate = {
            date_last_updated: true
        };

        let collection = dbInstance.collection(collectionName);
        collection.updateOne(query, doc, options, (err, data) => {
            if (err) {
                logger.error(err);
                return reject(err);
            } else {
                return resolve(data);
            }
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
dbMgr.updateMany = function(collectionName, query, doc, options) {
    return Q.Promise((resolve, reject) => {

        doc = doc || {};

        __replaceId(query);
        __removeAttribute(doc, "_id");
        __removeAttribute(doc, "date_last_updated");

        doc.$currentDate = {
            date_last_updated: true
        };

        let collection = dbInstance.collection(collectionName);
        collection.updateMany(query, doc, options, (err, data) => {
            if (err) {
                logger.error(err);
                return reject(err);
            } else {
                return resolve(data);
            }
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
dbMgr.bulkWrite = function(collectionName, operations, options) {
    return Q.Promise((resolve, reject) => {
        let collection = dbInstance.collection(collectionName);
        collection.bulkWrite(operations, options || {}, (err, data) => {
            if (err) {
                logger.error(err);
                return reject(err);
            } else {
                return resolve(data);
            }
        });
    });
};

/**
 * Get collections
 * @returns {*}
 */
dbMgr.getCollections = function() {
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
 */
dbMgr.listCollections = function(filter, options) {
    return Q.Promise(function(resolve, reject) {
        dbInstance.listCollections(filter || {}, options || {})
            .toArray((err, data) => {
                if (err) {
                    logger.error(err);
                    return reject(err);
                } else {
                    return resolve(data);
                }
            });
    });
};

/**
 * Replace Mongo DB ID string by an equivalent ObjectID
 * @param match
 */
function __replaceId(match) {
    if ((typeof match === "object") && match.hasOwnProperty("_id")) {
        try {
            if ((match._id) && (typeof match._id === "string")) {
                match._id = new mongo.ObjectID(match._id);
            } else if ((match._id) && (typeof match._id === "object")) {
                if (match._id["$eq"]) {
                    match._id["$eq"] = new mongo.ObjectID(match._id["$eq"]);
                }
            }
        } catch (ex) {
            match._id = null;
        }
    }
}

/**
 * Remove a named attribute (string as the name of the attribute) from doc.
 *
 * @param  {[type]} doc      [description]
 * @param  {[type]} attrName [description]
 * @return {[type]}          [description]
 */
function __removeAttribute(doc, attrName) {
    if ((typeof doc === "object") && doc.hasOwnProperty(attrName)) {
        try {
            delete doc[attrName];
        } catch (err) {
            logger.warn(err);
            doc[attrName] = null;
        }
    } else if (doc.hasOwnProperty("$set") && (doc["$set"][attrName])) {
        try {
            delete doc["$set"][attrName];
        } catch (err) {
            logger.warn(err);
            doc["$set"][attrName] = null;
        }
    }
}

module.exports = dbMgr;
