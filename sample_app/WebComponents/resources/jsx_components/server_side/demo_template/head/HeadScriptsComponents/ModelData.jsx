"use strict";

import React from "react";

class Model extends React.Component {

    render() {
        return (
            <script
                dangerouslySetInnerHTML={{__html:  "var model = " +JSON.stringify(this.props.model) + ";" }}/>
        );
    }
}

export default Model;
