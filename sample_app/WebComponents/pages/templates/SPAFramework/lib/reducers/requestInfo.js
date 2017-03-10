"use strict";

function requestInfo(state = {}, action) {
    switch (action.type) {
        case "SET_REQUESTINFO":
            {
                let temp = Object.assign({}, state, action.requestInfo);
                return temp;
            }

        default:
            return state;
    }
}

export default requestInfo;
