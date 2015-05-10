/**
 * Created by aismael on 1/5/14.
 */
"use strict";


/**
 *
 * @param keyObj
 * @constructor
 */
var StringKey = function (keyObj) {
    this.keyObj = keyObj;
};

/**
 *
 * @returns {string}
 */
StringKey.prototype.hashCode = function () {
    return "APPStringKey:" + this.keyObj.toString();
};

/**
 *
 * @param anotherKey
 * @returns {boolean}
 */
StringKey.prototype.equals = function (anotherKey) {
    if (anotherKey && (typeof anotherKey.hashCode == "function")) {
        return this.hashCode() == anotherKey.hashCode();
    } else {
        return false;
    }
};

/**
 *
 * @param stringValue
 * @returns {StringKey}
 */
function createKey(stringValue) {
    return new StringKey(stringValue);
}

module.exports = {
    createKey: createKey
};
