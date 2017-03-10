"use strict";

function deploy_mode(state = "", action) {
    switch (action.type) {
        case "SET_DEPLOYMODE":
            {
                if (state !== action.deploy_mode) {
                    return action.deploy_mode;
                } else {
                    return state;
                }
            }

        default:
            return state;
    }
}

export default deploy_mode;
