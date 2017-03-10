"use strict";

function run_mode(state = "", action) {
    switch (action.type) {
        case "SET_RUNMODE":
            {
                if (state !== action.run_mode) {
                    return action.run_mode;
                } else {
                    return state;
                }
            }

        default:
            return state;
    }
}

export default run_mode;
