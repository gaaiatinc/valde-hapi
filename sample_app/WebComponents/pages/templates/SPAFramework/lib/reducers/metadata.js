"use strict";

function metadata(state = {}, action) {
    switch (action.type) {
        case "SET_METADATA":
            {
                let temp = Object.assign({}, state, action.metadata);
                return temp;
            }

        default:
            return state;
    }
}

export default metadata;
