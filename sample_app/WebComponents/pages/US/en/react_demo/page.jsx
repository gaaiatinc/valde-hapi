"use strict";

import React from "react";
import ReactDOM  from "react-dom";


import ParentTemplate from "resources/jsx_components/server_side/demo_template/parent";

import HelloButton from "resources/jsx_components/demo/HelloButton";
import Greeting from "resources/jsx_components/demo/Greeting";


/**
 * An example of an element to override the body top element in the parent template.
 */
class PageBodyTop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (<p>hello page body top!!, testing 123</p>);
    }
}

/**
 * An example of an element to override the body main element in the parent template.
 */
class PageBodyMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
    }

    render() {
        return (<Greeting /> );
    }
}


/**
 * An example of an element to override the body bottom element in the parent template.
 */
class PageBodyBottom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
    }

    render() {
        return (<HelloButton /> );
    }
}


/**
 * An example of how to extend the parent template, and replace the elements that the
 * parent template allows for overriding.
 */
export default class AppMainPage extends ParentTemplate {
    constructor(props) {
        super(props);
        //this.state = {balance: props.openingBalance};

        this.bodyTop = <PageBodyTop />;
        this.bodyMain = <PageBodyMain id="t24"/>;
        this.bodyMain = <PageBodyBottom id="q122"/>;
    }

    /**
     * You should never override the render method of the parent template!
     */
};


