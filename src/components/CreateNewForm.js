import Axios from "axios"
import React, { useRef, useState } from "react"

function CreateNewForm(props) {
  const [name, setName] = useState("")
  const [author, setAuthor] = useState("")
  const [file, setFile] = useState("")
  const [error, setError] = useState("")
  const CreatePhotoField = useRef()

  async function submitHandler(e) {
    e.preventDefault()
    setError("")
    // if (!file || !name || !author) {
    if (!name || !author) {
      setError("All fields are required")
      return
    }
    const data = new FormData()
    data.append("photo", file)
    data.append("name", name)
    data.append("author", author)
    setName("")
    setAuthor("")
    setFile("")
    CreatePhotoField.current.value = ""
    const newPhoto = await Axios.post("/create-book", data, { headers: { "Content-Type": "multipart/form-data" } })
    props.setBooks(prev => prev.concat([newPhoto.data]))
  }

  return (
    <form className="p-3 bg-success bg-opacity-25 mb-5" onSubmit={submitHandler}>
      {error && <div className="mb-2 text-danger">{error}</div>}
      <div className="mb-2">
        <input ref={CreatePhotoField} onChange={e => setFile(e.target.files[0])} type="file" className="form-control" />
      </div>
      <div className="mb-2">
        <input onChange={e => setName(e.target.value)} value={name} type="text" className="form-control" placeholder="Book name" />
      </div>
      <div className="mb-2">
        <input onChange={e => setAuthor(e.target.value)} value={author} type="text" className="form-control" placeholder="author" />
      </div>

      <button className="btn btn-success">Create New Book!</button>
    </form>
  )
}

export default CreateNewForm
