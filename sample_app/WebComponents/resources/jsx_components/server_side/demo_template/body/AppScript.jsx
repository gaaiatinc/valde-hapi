"use strict";

import React from "react";

class AppScript extends React.Component {


    render() {
        let appScriptPath = "/res/js" + model.pageViewID + ".js";

        return (
            <script src={appScriptPath}></script>
        )
    }
}

export default AppScript;
