"use strict";

let platform = require("../lib");

let app_config;

// let loggerFactory = platform.app_logger;
//
// let logger = loggerFactory.getLogger("SampleApp", (app_config.get("env:production")) ? "WARN" : "DEBUG");

describe("temp tests", () => {

    before(() => {
        // runs before all tests in this block
        //
        platform.init("./");
        app_config = platform.app_config;

        return;
    });

    after(function() {
        // runs after all tests in this block
    });

    beforeEach(function() {
        // runs before each test in this block
    });

    afterEach(function() {
        // runs after each test in this block
    });

    // test cases

    describe("app_get", () => {
        it("should be able to get the application_root_folder from app_config", function() {
            //console.log("done it!", app_config.get("application_root_folder"));
        });
    });

});
