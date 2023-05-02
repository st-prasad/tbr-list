import Axios from "axios";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
// import AdminComp from "./components/AdminComp";
// import CreateNewForm from "./components/CreateNewForm";
// import AnimalCard from "./components/BookCard";
// import AnimalCard from "./components/AnimalCard";
import BookCard from "./components/BookCard";
import CreateNewForm from "./components/CreateNewForm";

function App() {
    const [books, setBooks] = useState([])
    // const [error, setError] = useState(null); // Added error state
  
    // const handleSubmit = async (event, name, author) => {
    //     event.preventDefault();
    //     if (!name || !author) {
    //       setError("Name and author are required fields");
    //       console.log(error.message)
    //       return;
    //     }
    //     setError(null);
    // };


    // useEffect(() => {
    //   async function start() {
    //     try {const response = await Axios.get("/api/books")
    //     setBooks(response.data)
    //     books[0] ? console.log(books[0]._id) : console.log("empty array")}
    //     catch (e) {
    //         setError(e.response.data.error); // set error message
    //       }
    //   }
    //   start()
    // }, [])


    useEffect(() => {
        async function start() {
          try {
            const response = await Axios.get("/api/books");
            setBooks(response.data);
            // console.log(11)
          } catch (error) {
            console.log(error); 
            // Setting error message on catch
          }
        }
        start();
      }, []);

      useEffect(() => {
        books[0] ? console.log(books[0]._id) : console.log("empty array");
        // error ? console.log("err msg") : console.log("no err");
        // console.log("error-"+ e.response.data.error)
    }, [books])
  
    return (
      <div className="container">
        <p>
          <a href="/">&laquo; Back to public homepage</a>
        </p>
        <CreateNewForm setBooks={setBooks} />
        {/* {error && <div className="error">{error}</div>} */}
        <div className="book-grid">
          {books.map(function (elem) {
            return <BookCard key={elem._id} name={elem.name} author={elem.author} photo={elem.photo} id={elem._id} setBooks={setBooks} />
          })}
        </div>
      </div>
    )
  }

const root = createRoot(document.querySelector("#app"))
root.render(<App/>)

