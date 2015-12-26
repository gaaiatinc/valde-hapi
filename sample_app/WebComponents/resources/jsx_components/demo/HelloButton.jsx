
"use strict";

import React from "react";



class HelloButton extends React.Component {

    handleClick() {
        alert("Hello ...");
    };

    render() {
        return  (
            <button type="button"   onClick={this.handleClick}>Click Me! </button>
        );
    }
}

export default HelloButton;
