/**
 * @author Ali Ismael <ali@gaaiat.com>
 */
"use strict";

import headMetaTags from "pages/templates/template_components/HeadMetaTags";

// import {BaseSPATemplate} from "valde-hapi/SPAFramework";
import {SPATemplate} from "valde-hapi/SPAFramework";
// import {get as _get} from "lodash";

import "bootstrap/dist/css/bootstrap.min.css";

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

        // this.getExternalAssetsDescriptor = this
        //     .getExternalAssetsDescriptor
        //     .bind(this);

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
     * [getExternalAssetsDescriptor description]
     * @param  {[type]} model [description]
     * @return {[type]}       [description]
     */
    getExternalAssetsDescriptor(model) {

        let superAssets = super.getExternalAssetsDescriptor(model);

        let additionalJavascriptAsseets = [
            "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js",
            "https://cdnjs.cloudflare.com/ajax/libs/react-transition-group/2.3.1/react-transition-group.min.js",
            "https://cdnjs.cloudflare.com/ajax/libs/reactstrap/6.0.1/reactstrap.min.js"
        ];

        let externalAssets = {
            javascript: superAssets
                .javascript
                .concat(additionalJavascriptAsseets),
            styles: superAssets.styles
        };

        return externalAssets;
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
