"use strict";

import React from "react";
import PropTypes from "prop-types";

import ReactDOM from "react-dom";
import TemplateHead from "resources/jsx_components/server_side/demo_template/head/TemplateHead";
//import {AppMainPage} from "AppMainPage";

/**
 *
 */
class AppMount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <p>hello!!</p>
        );
    }
}

/**
 *
 */
export default class ParentTemplate extends React.Component {
    /**
     *
     * @param props
     */
    constructor(props) {
        super(props);
        //this.state = {balance: props.openingBalance};
        this.state = {};

        /**
         * The following eelements are replaceable by pages which extend this template:
         */
        this.bodyTop = <AppMount/>;
        this.bodyMain = <AppMount/>;
        this.bodyBottom = <AppMount/>;
    }

    /**
     * This method will replace/re-mount the page-specific elements in the browser:
     */
    attachComponentsInBrowser() {
        $("#body_top_mount_point").replaceWith("<div id='body_top_mount_point'></div>");
        ReactDOM.render(this.bodyTop, document.getElementById("body_top_mount_point"));

        $("#body_main_mount_point").replaceWith("<div id='body_main_mount_point'></div>");
        ReactDOM.render(this.bodyMain, document.getElementById("body_main_mount_point"));

        $("#body_bottom_mount_point").replaceWith("<div id='body_bottom_mount_point'></div>");
        ReactDOM.render(this.bodyBottom, document.getElementById("body_bottom_mount_point"));
    }

    /**
     * This method is for server-side rendering only!
     * @returns {XML}
     */
    render() {

        return (
            <html>
                <TemplateHead entityRelativePath={model.pageViewID} model={model}/>

                <body id="document-body">

                    <div id="body_top_mount_point">
                        {this.bodyTop}
                    </div>

                    <div id="body_main_mount_point">
                        {this.bodyMain}
                    </div>

                    <div id="body_bottom_mount_point">
                        {this.bodyBottom}
                    </div>

                </body>
            </html >
        );
    }
}
ParentTemplate.propTypes = {
    model: PropTypes.object
};
ParentTemplate.defaultProps = {};
