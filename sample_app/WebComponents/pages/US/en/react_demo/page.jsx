"use strict";

import React from "react";

import ReactDOM  from "react-dom";


import HelloButton from "resources/jsx_components/demo/HelloButton";
import Greeting from "resources/jsx_components/demo/Greeting";

import ParentTemplate from "resources/jsx_components/server_side/demo_template/parent";


class PageBodyTop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {balance: props.openingBalance};
    }

    render() {
        return (<p>hello page body top!!</p>);
    }
}
let pageBodyTop = <PageBodyTop />;

class PageBodyMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {balance: props.openingBalance};
    }

    componentWillMount() {
        console.log("pageBodyMain did mount!!!");
    }

    render() {
        return (<HelloButton /> );
    }
}
let pageBodyMain = <PageBodyMain id="tttttttt"/>;


export default class DemoPage extends ParentTemplate {
    constructor(props) {
        super(props);
        //this.state = {balance: props.openingBalance};

        this.bodyTop = pageBodyTop;
        this.bodyMain = pageBodyMain;

        if (typeof document !== "undefined") {
            alert("we are almost there!");
        }
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
    //pageBodyMain.forceUpdate();
    //alert(pageBodyMain.props);
    ReactDOM.render(pageBodyMain, document.getElementById("mmmmmmmm"));
}

