// In NodeJS, require() is a built-in function to include external modules that exist in separate files. require() statement basically reads a JavaScript file, executes it, and then proceeds to return the export object.

const express = require("express");
const app = express();

//request and responce are given by express server
// app.get() is a function that tells the server what to do when a get request at the given route is called. It has a callback function (req, res) that listen to the incoming request req object and respond accordingly using res response object.

app.get("/", (req, res) => {
    res.send("welcome homepage")
})
app.get("/admin", (req, res) => {
    res.send("admin")
});

app.listen(3000);