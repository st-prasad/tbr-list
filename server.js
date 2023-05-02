// In NodeJS, require() is a built-in function to include external modules that exist in separate files. require() statement basically reads a JavaScript file, executes it, and then proceeds to return the export object.

const {MongoClient, ObjectId} = require("mongodb")
const express = require("express");
const multer = require("multer")
const upload = multer()
const sanitizeHTML = require("sanitize-html")
const fse = require("fs-extra")
const sharp = require("sharp")
let mernDB;
const path = require("path")
const React = require("react")
const ReactDOMServer = require("react-dom/server")
const BookCard = require("./src/components/BookCard").default



// check public/uploaded-photos exists
fse.ensureDirSync(path.join("public", "uploaded-photos"))


const app = express();
app.set("view engine", "ejs")
app.set("views", "./views")
app.use(express.static("public"))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// todo- add a better authentication
function passwordAuth(req, res, next) {
    res.set("WWW-Authenticate", "Basic realm='MERN App'")
    // pass, name- user
    if (req.headers.authorization == "Basic dXNlcjp1c2Vy") {
    // if (req.headers.authorization == "Basic cm9vdDpyb290") {
      next()
    } else {
      console.log(req.headers.authorization)
      res.status(401).send(" wrong password, Try again")
    }
  }

//request and responce are given by express server
// app.get() is a function that tells the server what to do when a get request at the given route is called. It has a callback function (req, res) that listen to the incoming request req object and respond accordingly using res response object.
app.get("/", async(req, res) => {
    const allBooks = await mernDB.collection("books").find().toArray();

    const generatedHTML = ReactDOMServer.renderToString(
        <div className="container">
          {!allBooks.length && <p>no books yet, add now.</p>}
          <div className="book-grid mb-3">
            {allBooks.map(book => (
              <BookCard key={book._id} name={book.name} author={book.author} photo={book.photo} id={book._id} readOnly={true} />
            ))}
          </div>
          <p>
            <a href="/admin">Login / manage the books.</a>
          </p>
        </div>
      )

    res.render("home", {generatedHTML })
})
app.get("/admin",passwordAuth, (req, res) => {
    res.render("admin")
});

// custom manualy created api
app.get("/api/books", async(req, res) => {
    const allBooks = await mernDB.collection("books").find().toArray();
    res.json(allBooks);
})


// check for missing fields
// if (!req.cleanData.name || !req.cleanData.author || !req.file) {
//   return res.status(401).send({ error: "Name, author, and photo are required fields." });
// }
app.post("/create-book", upload.single("photo"), ourCleanup, async (req, res) => {
  
    if (req.file) {
        const photofilename = `${Date.now()}.jpg`;
        await sharp(req.file.buffer).resize(20, 20).jpeg({ quality: 60 }).toFile(path.join("public", "uploaded-photos", photofilename));
        req.cleanData.photo = photofilename
      }

    console.log(req.body)
    // const info = await db.collection("books").insertOne(req.cleanData)
    // const newBook = await db.collection("books").findOne({_id: new ObjectId(info.insertedId)})
    const info = await mernDB.collection("books").insertOne(req.cleanData)
    const newBook = await mernDB.collection("books").findOne({_id: new ObjectId(info.insertedId)})
    res.send(newBook);
  })

  app.delete("/book/:id", async (req, res) => {
    if (typeof req.params.id != "string") req.params.id = ""
    const doc = await mernDB.collection("books").findOne({ _id: new ObjectId(req.params.id) })
    if (doc.photo) {
      fse.remove(path.join("public", "uploaded-photos", doc.photo))
    }
    mernDB.collection("books").deleteOne({ _id: new ObjectId(req.params.id) })
    res.send("done")
  })

  app.post("/update-book", upload.single("photo"), ourCleanup, async (req, res) => {
    if (req.file) {
      // if they are uploading a new photo
      const photofilename = `${Date.now()}.jpg`;
      await sharp(req.file.buffer).resize({fit: sharp.fit.contain, width: 800}).jpeg({ quality: 60 }).toFile(path.join("public", "uploaded-photos", photofilename));
      req.cleanData.photo = photofilename;
    
      const info = await mernDB.collection("books").findOneAndUpdate({ _id: new ObjectId(req.body._id) }, { $set: req.cleanData })
      if (info.value.photo) {
        fse.remove(path.join("public", "uploaded-photos", info.value.photo))
      }
      res.send(photofilename)
    } else {
      // if not uploading a new photo
      db.collection("books").findOneAndUpdate({ _id: new ObjectId(req.body._id) }, { $set: req.cleanData })
      res.send(false)
    }
  })
  

//   app.post("/create-animal", upload.single("photo"), ourCleanup, async (req, res) => {
//     if (req.file) {
//     //   const photofilename = `${Date.now()}.jpg`
//       await sharp(req.file.buffer).resize(844, 456).jpeg({ quality: 60 }).toFile(path.join("public", "uploaded-photos", photofilename))
//       req.cleanData.photo = photofilename
//     }
  
//     console.log(req.body)
//     const info = await db.collection("animals").insertOne(req.cleanData)
//     const newAnimal = await db.collection("animals").findOne({ _id: new ObjectId(info.insertedId) })
//     res.send(newAnimal)
//   })

// middleware function
function ourCleanup(req, res, next) {
    if (typeof req.body.name != "string") req.body.name = ""
    if (typeof req.body.author != "string") req.body.author = ""
    if (typeof req.body._id != "string") req.body._id = ""
  
    req.cleanData = {
      name: sanitizeHTML(req.body.name.trim(), { allowedTags: [], allowedAttributes: {} }),
      author: sanitizeHTML(req.body.author.trim(), { allowedTags: [], allowedAttributes: {} })
    }
  
    next()
  }

async function start() {
    // below string is commonly used in MongoDB connection strings to specify the authentication database. The authSource parameter is used to indicate the database where the authentication credentials are stored. When the authSource is set to admin, it tells MongoDB to look for the credentials in the admin database.
    const client = new MongoClient("mongodb+srv://root:root@cluster0.e6m3qhx.mongodb.net/?retryWrites=true&w=majority");
    await client.connect();
    mernDB = client.db("MernApp")
    app.listen(3000);
}
start()
