/**
 * Created by Ali Ismael on 5/19/2014.
 */

"use strict";

const path = require("path"),
    fs = require("fs"),
    Q = require("q");

//returns the Object Class name
const get_obj_class = (variable) => {
    return Object.prototype.toString.call(variable).slice(8, -1);
};

//Given an array or object, freeze all properties referenced arrays/objects
const deep_freeze = (anObject) => {
    Object.freeze(anObject);
    Object.keys(anObject).forEach((key) => {
        let objClass = get_obj_class(anObject[key]);
        if (objClass === "Array" || objClass === "Object") {
            deep_freeze(anObject[key]);
        }
    });
};

//Loops over the constants object, and creates a new Object with all properties only enumerable
const freeze = (obj) => {
    deep_freeze(obj);
    return obj;
};

/**
 *
 * @param new_folder_path
 * @returns {*}
 * @private
 */
const __mkdirPromisified = (new_folder_path) => {
    return () => {
        new_folder_path = path.normalize(new_folder_path);

        return Q.Promise((resolve, reject) => {
            Q.nfcall(fs.stat, new_folder_path).then((stats) => {
                if (!stats.isDirectory()) {
                    reject(new Error("Path:", new_folder_path, " exists, and it is not a directory!!"));
                } else {
                    resolve();
                }
            }, () => {
                Q.nfcall(fs.mkdir, new_folder_path).then(() => {
                    Q.nfcall(fs.stat, new_folder_path).then((stats) => {
                        if (stats.isDirectory()) {
                            resolve();
                        } else {
                            reject(new Error("Path:", new_folder_path, " exists, and it is not a directory!!"));
                        }
                    }, reject);
                });
            }).catch((err) => {
                // console.log(err);
                reject(err);
            }).done();
        });
    };
};

/**
 *
 * @param parentDir
 * @param dirPath
 * @returns {*}
 * @private
 */
const mkdirp = (parentDir, dirPath) => {
    dirPath = path.normalize(dirPath) || "";
    let localParentDir = path.normalize(parentDir || "");

    let dirPathElements = path.normalize(dirPath).split(path.sep);
    dirPathElements = dirPathElements.map((entry) => {
        localParentDir = localParentDir + path.sep + entry;
        return __mkdirPromisified(localParentDir);
    });

    return dirPathElements.reduce(Q.when, Q());
};

/**
 *
 */
module.exports = {
    mkdirp,
    freeze
};
