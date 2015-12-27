/**
 * Created by Ali Ismael on 5/19/2014.
 */

"use strict";


var selectn = require("selectn"),
    path = require("path"),
    fs = require("fs"),
    Q = require("q");

//Loops over the constants object, and creates a new Object with all properties only enumerable
function freezeObject(obj) {
    deepFreeze(obj);
    return obj;
}

//Given an array or object, freeze all properties referenced arrays/objects
function deepFreeze(anObject) {
    Object.freeze(anObject);
    Object.keys(anObject).forEach(function (key) {
        var objClass = getObjClass(anObject[key]);
        if (objClass === "Array" || objClass === "Object") {
            deepFreeze(anObject[key]);
        }
    })
}

//returns the Object Class name
function getObjClass(variable) {
    return Object.prototype.toString.call(variable).slice(8, -1);
}


/**
 *
 * @param new_folder_path
 * @returns {*}
 * @private
 */
function __mkdirPromisified(new_folder_path) {
    return function () {
        new_folder_path = path.normalize(new_folder_path);

        return Q.Promise(function (resolve, reject) {
            Q.nfcall(fs.stat, new_folder_path)
                .then(function (stats) {
                    if (!stats.isDirectory()) {
                        reject(new Error("Path:", new_folder_path, " exists, and it is not a directory!!"));
                    } else {
                        resolve();
                    }
                }, function (err) {
                    Q.nfcall(fs.mkdir, new_folder_path)
                        .then(function () {
                            Q.nfcall(fs.stat, new_folder_path)
                                .then(function (stats) {
                                    if (stats.isDirectory()) {
                                        resolve();
                                    } else {
                                        reject(new Error("Path:", new_folder_path, " exists, and it is not a directory!!"));
                                    }
                                }, reject);
                        });
                })
                .catch(function (err) {
                    console.log(err);
                    reject(err);
                })
                .done();
        });
    };
}


/**
 *
 * @param parentDir
 * @param dirPath
 * @returns {*}
 * @private
 */
function __mkdirp(parentDir, dirPath) {
    dirPath = path.normalize(dirPath) || "";
    let localParentDir = path.normalize(parentDir || "");

    var dirPathElements = path.normalize(dirPath).split(path.sep);
    dirPathElements = dirPathElements.map(function (entry, idx, arr) {
        localParentDir = localParentDir + path.sep + entry;
        return __mkdirPromisified(localParentDir);
    });


    return dirPathElements.reduce(Q.when, Q());
}


/**
 *
 * @type {{deepFreeze: freezeObject}}
 */
module.exports = {
    mkdirp: __mkdirp,
    freeze: freezeObject
};



