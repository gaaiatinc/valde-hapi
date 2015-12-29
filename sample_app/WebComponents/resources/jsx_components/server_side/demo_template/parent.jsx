"use strict";

import React from "react";
import ReactDOM  from "react-dom";
import TemplateHead from "resources/jsx_components/server_side/demo_template/head/TemplateHead";
import AppScript from "resources/jsx_components/server_side/demo_template/body/AppScript";


/**
 *
 */
class AppMount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {balance: props.openingBalance};
    }

    render() {
        return (<p>hello!!</p>);
    }
}


export default class ParentTemplate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {balance: props.openingBalance};

        this.bodyTop = <AppMount />;
        this.bodyMain = <AppMount id="qqqq"/>;
        this.bodyBottom = <AppMount />;
    }

    componentDidMount() {

        console.log(">>>>>>>  parentTmplate did mount!");
        /**
         * The following is for client side rendering:
         */
        if (typeof document !== "undefined") {
            alert("foooo")
            ReactDOM.render(this.bodyMain, document.getElementById("mmmmmmmm"));
            //ReactDOM.render(this.renderBodyTop(), document.getElementById("body_top_mount_point"));
            //ReactDOM.render(this.renderBodyMain(), document.getElementById("body_main_mount_point"));
            //ReactDOM.render(this.renderBodyBottom(), document.getElementById("body_bottom_mount_point"));
        }
    }

    render() {
        return (
            <html>
            <TemplateHead entityRelativePath={entityRelativePath} modelData={modelData}/>

            <body>

            <div id="body_top_mount_point">
                {this.bodyTop}
            </div>

            <div id="mmmmmmmm">
                {this.bodyMain}
            </div>

            <div id="body_bottom_mount_point">
                {this.bodyBottom}
            </div>


            <AppScript />
            </body>
            </html >
        );
    }
}
ParentTemplate.propTypes = {openingBalance: React.PropTypes.number};
ParentTemplate.defaultProps = {openingBalance: 0};


let fullApp = React.createElement(ParentTemplate);

/**
 * The following is for client side rendering:
 */
if (typeof document !== "undefined") {
    //alert("we are almost there!");
    //ReactDOM.render(fullApp, document.documentElement);
    //ReactDOM.render(fullApp, document.getElementById("body_main_mount_point"));
    //ReactDOM.render(ParentTemplate.renderBodyMain(), document.getElementById("body_main_mount_point"));
    //ReactDOM.render(ParentTemplate.renderBodyBottom(), document.getElementById("body_bottom_mount_point"));
}

