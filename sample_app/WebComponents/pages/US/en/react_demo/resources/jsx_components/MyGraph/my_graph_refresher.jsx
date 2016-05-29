/**
 * Created by Ali on 1/3/2016.
 */
"use strict";
import React from "react";
import ReactDOM from "react-dom";

import * as MyCanvas from "./lib/graph_impl";

/**
 * An example of an element to override the body top element in the parent template.
 */
class MyGraphRefresher extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {}

    render() {
        return (
            <button type="button" {...this.props}>Refresh Index</button>
        );
    }
}
MyGraphRefresher.propTypes = {
    modelData: React.PropTypes.object
};
MyGraphRefresher.defaultProps = {};

export default MyGraphRefresher;
