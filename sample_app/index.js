/**
 * Created by Ali on 3/10/2015.
 */
"use strict";

let platform = require("valde-hapi");

platform.init((err, server) => {
    server.start(function () {
        console.log("Server running at:", server.info.uri);
    });
});
