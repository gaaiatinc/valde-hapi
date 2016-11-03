"use strict";
let jwt = require("jsonwebtoken");

let raw_token = {
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 600,
    nbf: Math.floor(Date.now() / 1000),
    aud: "12345",
    sub: "sample_corp",
    iss: "sample_corp.com"
};

let options = { algorithm: "HS256"};

let token = jwt.sign(raw_token, "some strong token password  123456789012345678901234567890", options);

console.log("\n\n\ntoken: ", token);

console.log("\n\n\n");
