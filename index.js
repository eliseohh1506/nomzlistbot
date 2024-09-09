//import .env file 
require("dotenv").config();

//import express
const express = require("express");
const { handler } = require("./controller/index");
const {initialiseFirebaseApp} = require("./controller/lib/firebase");

//defines port 
const PORT = process.env.PORT || 4040;

//start express server
const app = express();
app.use(express.json());
initialiseFirebaseApp();
//respond to post req
app.post("*", async (req, res) => {
    //console.log(req.body);
    res.send(await handler(req, "POST"));
});

//respond to get req
app.get("*", async (req, res) => {
    //console.log(req);
    res.send(await handler(req, "GET"));
});

// listen to app on port 
app.listen(PORT, function (err) {
    if (err) console.log(err);
    console.log("Server is listening on PORT ", PORT);
});