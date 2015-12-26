"use strict";

import React from "react";

import ReactDOMServer  from "react-dom/server";
import ReactDOM  from "react-dom";
import TemplateHead from "resources/jsx_components/server_side/demo_template/head/TemplateHead";
import TemplateBody from "resources/jsx_components/server_side/demo_template/body/TemplateBody";


//var Application = require("../app/Application");

//var styleCollector = require("./style-collector");

function __renderTemplate(entityRelativePath, modelData) {

    // var html = "";
    // var css = styleCollector.collect(function() {
    //     html = React.renderComponentToString(<Application url={req.url}/>);
    // });
    // <style id="server-side-style" dangerouslySetInnerHTML={{__html: ""}} />

    return ReactDOMServer.renderToString(
        <html>
        <TemplateHead entityRelativePath={entityRelativePath} modelData={modelData}/>
        <TemplateBody />
        </html>
    );
}

export  {__renderTemplate as renderTemplate};

