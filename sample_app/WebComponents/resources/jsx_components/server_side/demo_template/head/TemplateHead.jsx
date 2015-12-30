"use strict";

import React from "react";

import HeadReactScript from "resources/jsx_components/server_side/demo_template/head/HeadScriptsComponents/HeadReactScript";
import HeadReactDOMScript from "resources/jsx_components/server_side/demo_template/head/HeadScriptsComponents/HeadReactDOMScript";
import ModelData from "resources/jsx_components/server_side/demo_template/head/HeadScriptsComponents/ModelData";
import Title from "resources/jsx_components/server_side/demo_template/head/Title";
import MetaCharSet from "resources/jsx_components/server_side/demo_template/head/MetaCharSet";
import HeadJQueryScript from "resources/jsx_components/server_side/demo_template/head/HeadScriptsComponents/HeadJQueryScript"
import AppScript from "resources/jsx_components/server_side/demo_template/body/AppScript";



class HeadScripts extends React.Component {
    render() {
        return (
            <head>
                <MetaCharSet />
                <Title />
                <HeadReactScript />
                <HeadReactDOMScript />
                <HeadJQueryScript />
                <ModelData modelData={this.props.modelData}/>
                <AppScript entityRelativePath={modelData.pageViewID}/>
            </head>
        )
    }
}

export default HeadScripts;
