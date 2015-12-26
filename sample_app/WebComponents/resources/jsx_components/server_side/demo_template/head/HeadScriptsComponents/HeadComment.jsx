"use strict";

import React from "react";

var comments = `<!--[if lte IE 8]> <script src="/js/html5shim.js"></script> <![endif]-->`;

class HeadComment extends React.Component {

    render() {
        return (
            <head dangerouslySetInnerHTML={{__html: comments}}/>
        );
    }
}

export default HeadComment;
