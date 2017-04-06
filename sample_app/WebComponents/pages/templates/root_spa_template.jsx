/**
 * @author Ali Ismael <ali@gaaiat.com>
 */
"use strict";

import headMetaTags from "pages/templates/template_components/HeadMetaTags";

// import {BaseSPATemplate} from "valde-hapi/SPAFramework";
import {SPATemplate} from "valde-hapi/SPAFramework";
// import {get as _get} from "lodash";

/**
 *
 * @param  {Object} [state={}] [description]
 * @param  {[type]} action     [description]
 * @return {[type]}            [description]
 */
function account_data(state = {}, action) {
    switch (action.type) {
        case "SET_ACCOUNT_DATA":
            {
                let temp = Object.assign({}, state, action.account_data);
                return temp;
            }

        default:
            return state;
    }
}

/**
 * An example of how to extend the parent template, and replace the elements that the
 * parent template allows for overriding.
 */
export default class RootSPATemplate extends SPATemplate {
    constructor(props) {
        super(props);

//         let isomorphic_descriptor = _get(props, "isomorphic_descriptor");
//
// console.log(JSON.stringify(isomorphic_descriptor, null, 4));
//
//         if (isomorphic_descriptor) {
//             isomorphic_descriptor.age= 23555;
//         }
    }

    genInitialStateData(props) {
        let initState = Object.assign({}, {
            account_data: props.model.account_data
        }, super.genInitialStateData(props));

        return initState;
    }

    /**
     *
     */
    getHeaderTags(model) {
        return headMetaTags(model);
    }

    /**
     *
     */
    filterModel(model) {
        if (model && model.account_data && model.account_data.password) {
            model.account_data.password = "******";
        }
        return model;
    }

    /**
     *
     */
    getAppStateReducer() {
        return Object.assign({}, {
            account_data
        }, super.getAppStateReducer());
    }

}
