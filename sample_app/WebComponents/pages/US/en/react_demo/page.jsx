"use strict";

import React from "react";

import ReactDOM  from "react-dom";


import HelloButton from "resources/jsx_components/demo/HelloButton";
import Greeting from "resources/jsx_components/demo/Greeting";

import ParentTemplate from "resources/jsx_components/server_side/demo_template/parent";


class PageBodyTop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (<p>hello page body top!!, testing 123</p>);
    }
}

class PageBodyMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
        console.log("pageBodyMain will  mount!!!");
    }

    render() {
        return (<HelloButton /> );
    }
}


export default class DemoPage extends ParentTemplate {
    constructor(props) {
        super(props);
        //this.state = {balance: props.openingBalance};

        this.bodyTop = <PageBodyTop />;
        this.bodyMain = <PageBodyMain id="tttttttt"/>;

        //if (typeof document !== "undefined") {
        //    alert("we are almost there!");
        //}
    }

    //render() {
    //    return (
    //        <html>
    //        <TemplateHead entityRelativePath={entityRelativePath} modelData={modelData}/>
    //        <TemplateBody />
    //        </html>
    //    );
    //}
}
//DemoPage.propTypes = { openingBalance: React.PropTypes.number };
//DemoPage.defaultProps = { openingBalance: 0 };


//let fullApp = React.createElement(DemoPage);
if (typeof document !== "undefined") {
    var demoPageInstance = new DemoPage(window.modelData);
    demoPageInstance.attachComponentsInBrowser();
}

