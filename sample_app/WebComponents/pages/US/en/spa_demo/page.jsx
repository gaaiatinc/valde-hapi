/**
 * @author Ali Ismael <ali@gaaiat.com>
 */
"use strict";

import React from "react";
import ReactDOM from "react-dom";


import RootSPATemplate from "pages/templates/root_spa_template";



/**
 * An example of how to extend the parent template, and replace the elements that the
 * parent template allows for overriding.
 */
export default class AppMainPage extends RootSPATemplate {
    constructor(props) {
        super(props);

        // this.createAppContainer = this.createAppContainer.bind(this);
        // this.getAppStateReducer = this.getAppStateReducer.bind(this);
    }


    /**
     *
     */
    createAppContainer() {
        // //console.log(">>>>>>>\n\n\n\n", RootTemplate);
        return super.createAppContainer();
    }

    /**
     *
     */
    getAppStateReducer() {
        // //console.log(">>>>>>>\n\n\n\n", RootTemplate);
        return super.getAppStateReducer();
    }
}
