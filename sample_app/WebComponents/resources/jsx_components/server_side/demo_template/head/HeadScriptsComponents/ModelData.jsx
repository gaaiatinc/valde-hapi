"use strict";

import React from "react";

class ModelData extends React.Component {

    render() {
        return (
            <script
                dangerouslySetInnerHTML={{__html:  "var modelData = " +JSON.stringify(this.props.modelData) + ";" }}/>
        );
    }
}

export default ModelData;
