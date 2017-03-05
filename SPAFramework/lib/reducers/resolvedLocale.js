"use strict";

function resolvedLocale(state = {}, action) {
    switch (action.type) {
        case "SET_RESOLVEDLOCALE":
            {
                let temp = Object.assign({}, state, action.resolvedLocale);
                return temp;
            }

        default:
            return state;
    }
}

export default resolvedLocale;
