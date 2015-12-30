"use strict";

import React from "react";
import ReactDOM  from "react-dom";
import ReactDOMServer from "react-dom/server";
import ReactDOMServer from "react-dom/server";
import TemplateHead from "resources/jsx_components/server_side/demo_template/head/TemplateHead";
import AppScript from "resources/jsx_components/server_side/demo_template/body/AppScript";


/**
 *
 */
class AppMount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (<p>hello!!</p>);
    }
}


export default class ParentTemplate extends React.Component {
    constructor(props) {
        super(props);
        //this.state = {balance: props.openingBalance};
        this.state = {};

        this.bodyTop = <AppMount />;
        this.bodyMain = <AppMount />;
        this.bodyBottom = <AppMount />;

        console.log(">>>>>>>  parentTmplate constr!");

    }

    attachComponentsInBrowser() {
        console.log("attachComponentsInBrowser");

        //let bodyTopMount = React.createElement(this.bodyTop);


        //let bodyMainMount = React.createElement(this.bodyMain);
        ReactDOM.render(this.bodyMain, document.getElementById("mmmmmmmm"));

        //let bodyBottomMount = React.createElement(this.bodyBottom);
    }


    componentDidMount() {

        console.log(">>>>>>>  parentTmplate did mount!");
        /**
         * The following is for client side rendering:
         */
        if (typeof document !== "undefined") {
            alert("foooo");

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

            <div id="mmmmmmmm" dangerouslySetInnerHTML={{__html: ReactDOMServer.renderToString(this.bodyMain)}}/>

            <div id="body_top_mount_point">
                {this.bodyTop}
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
ParentTemplate.propTypes = {modelData: React.PropTypes.object};
ParentTemplate.defaultProps = {};


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

