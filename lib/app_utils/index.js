/**
 * Created by Ali Ismael on 5/19/2014.
 */

"use strict";


var selectn = require("selectn");

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
 * @type {{deepFreeze: freezeObject}}
 */
module.exports = {
    freeze: freezeObject
};



