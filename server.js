// In NodeJS, require() is a built-in function to include external modules that exist in separate files. require() statement basically reads a JavaScript file, executes it, and then proceeds to return the export object.

const {MongoClient} = require("mongodb")
const express = require("express");
let mernDB;
const app = express();

//request and responce are given by express server
// app.get() is a function that tells the server what to do when a get request at the given route is called. It has a callback function (req, res) that listen to the incoming request req object and respond accordingly using res response object.

app.get("/", async(req, res) => {
    const allBooks = await mernDB.collection("books").find().toArray();
    console.log(allBooks);
    res.send("welcome homepage");
})
app.get("/admin", (req, res) => {
    res.send("admin")
});

async function start() {
    // below string is commonly used in MongoDB connection strings to specify the authentication database. The authSource parameter is used to indicate the database where the authentication credentials are stored. When the authSource is set to admin, it tells MongoDB to look for the credentials in the admin database.
    const client = new MongoClient("mongodb+srv://root:root@cluster0.e6m3qhx.mongodb.net/?retryWrites=true&w=majority");
    await client.connect();
    mernDB = client.db("MernApp")
    app.listen(3000);
}
start()
