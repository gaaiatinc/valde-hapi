/**
 * @author Ali Ismael <ali@gaaiat.com>
 */
"use strict";

import React from "react";
import ReactDOM from "react-dom";

import HelloButton from "./resources/jsx_components/demo/HelloButton";
import Greeting from "./resources/jsx_components/demo/Greeting";

import MyGraph from "./resources/jsx_components/MyGraph/my_graph";
import MyGraphRefresher from "./resources/jsx_components/MyGraph/my_graph_refresher";

import RootTemplate from "pages/templates/root_react_template";

/**
 * An example of an element to override the body top element in the parent template.
 */
class PageBodyTop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <p>hello page body top!!, testing 123</p>
        );
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

    componentWillMount() {}

    setNewGraphData(newGraphData) {
        this.__newGraphRef.plotNewGraphData(newGraphData);
    }

    render() {
        return (<MyGraph {...this.props} ref={(newGraphRef) => {
            this.__newGraphRef = newGraphRef;
        }}/>);
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

    componentWillMount() {}

    render() {
        return (<MyGraphRefresher {...this.props}/>);
    }
}

/**
 * An example of how to extend the parent template, and replace the elements that the
 * parent template allows for overriding.
 */
export default class AppMainPage extends RootTemplate {
    constructor(props) {
        super(props);

        this.bodyTop = <PageBodyTop/>;
        this.bodyMain = <PageBodyMain id="t24" ref={(bdyMnRef) => {
            this.__bodyMainRef = bdyMnRef;
        }}/>;
        this.bodyBottom = <PageBodyBottom id="q122" onClick={() => {
            this.__bodyMainRef.setNewGraphData({age: Math.random()});
        }}/>;
    }

    /**
     * [handleClick description]
     * @return {[type]} [description]
     */
    handleClick() {
        this.__bodyMainRef.setState({age: Math.random()});
    }

    /**
     * You should never override the render method of the parent template!
     */
    createBody() {
        return (
            <div>
                {/*<h1>Hello</h1>*/}
                {this.bodyTop}
                {this.bodyMain}
                {this.bodyBottom}
            </div>
        );

    }
}
