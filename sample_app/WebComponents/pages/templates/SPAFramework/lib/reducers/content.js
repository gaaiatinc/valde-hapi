"use strict";

function content(state = {}, action) {
    switch (action.type) {
        case "SET_CONTENT":
            {
                let temp = Object.assign({}, state, action.content);
                return temp;
            }

        default:
            return state;
    }
}

export default content;
