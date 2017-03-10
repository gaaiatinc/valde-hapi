"use strict";

function pageViewID(state = "", action) {
    switch (action.type) {
        case "SET_PAGEVIEWID":
            {
                if (state !== action.pageViewID) {
                    return action.pageViewID;
                } else {
                    return state;
                }
            }

        default:
            return state;
    }
}

export default pageViewID;
