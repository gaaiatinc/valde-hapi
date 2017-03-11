"use strict";

import React from "react";

import HeadReactScript from "resources/jsx_components/server_side/demo_template/head/HeadScriptsComponents/HeadReactScript";
import HeadReactDOMScript from "resources/jsx_components/server_side/demo_template/head/HeadScriptsComponents/HeadReactDOMScript";
import Model from "resources/jsx_components/server_side/demo_template/head/HeadScriptsComponents/Model";
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
                <Model model={this.props.model}/>
                <AppScript entityRelativePath={model.pageViewID}/>
            </head>
        )
    }
}

export default HeadScripts;
