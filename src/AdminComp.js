import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import BookCard from './BookCard';

function adminComp() {

    const [books, setBooks] = useState([])

    useEffect(() => {
        async function start() {
            const response = await Axios.get("/api/books")
            setBooks(response.data)

        }
        start()
    }, [])

    useEffect(() => {
        books[0] ? console.log(books[0]._id) : console.log("empty array")
    }, [books])
    
    

  return (
    <div>
        {
        (books !==0) && books.map(elem => <BookCard key={elem._id} name={elem.name} author={elem.author} />)
        }

    </div>
  )
}

export default adminComp