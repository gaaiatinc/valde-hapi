"use strict";

import React from "react";

import AppScript from "resources/jsx_components/server_side/demo_template/body/AppScript";

class TemplateBody extends React.Component {
    render() {
        return (
            <body>
            <div  id="app_mount_point"></div>

            <AppScript />
            </body>
        )
    }
}

export default TemplateBody;
