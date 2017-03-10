"use strict";

function appMountPoint(state = "", action) {
    switch (action.type) {
        case "SET_APPMOUNTPOINT":
            {
                if (state !== action.appMountPoint) {
                    return action.appMountPoint;
                } else {
                    return state;
                }
            }

        default:
            return state;
    }
}

export default appMountPoint;
