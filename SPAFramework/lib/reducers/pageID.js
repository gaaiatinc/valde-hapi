"use strict";

function pageID(state = "", action) {
    switch (action.type) {
        case "SET_PAGEID":
            {
                if (state !== action.pageID) {
                    return action.pageID;
                } else {
                    return state;
                }
            }

        default:
            return state;
    }
}

export default pageID;
