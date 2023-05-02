import Axios from "axios"
import React, { useState } from "react"

function BookCard(props) {
  const [isEditing, setIsEditing] = useState(false)
  const [draftName, setDraftName] = useState("")
  const [file, setFile] = useState()
//   const [draftAuthor, setDraftAuthor] = useState("")
  const [draftAuthor, setDraftAuthor] = useState("")

  async function submitHandler(e) {
    e.preventDefault()
    setIsEditing(false)
    props.setBooks(prev =>
      prev.map(function (elem) {
        if (elem._id == props.id) {
          return { ...elem, name: draftName, author: draftAuthor }
        }
        return elem
      })
    )
    const data = new FormData()
    if (file) {
      data.append("photo", file)
    }
    data.append("_id", props.id)
    data.append("name", draftName)
    data.append("author", draftAuthor)
    const newPhoto = await Axios.post("/update-book", data, { headers: { "Content-Type": "multipart/form-data" } })
    if (newPhoto.data) {
      props.setBooks(prev => {
        return prev.map(function (elem) {
          if (elem._id == props.id) {
            return { ...elem, photo: newPhoto.data }
          }
          return elem
        })
      })
    }
  }

  return (
    <div className="card">
      <div className="our-card-top">
        {isEditing && (
          <div className="our-custom-input">
            <div className="our-custom-input-interior">
              <input onChange={e => setFile(e.target.files[0])} className="form-control form-control-sm" type="file" />
            </div>
          </div>
        )}
        <img src={props.photo ? `/uploaded-photos/${props.photo}` : "/fallback.png"} className="card-img-top" alt={`${props.author} named ${props.name}`} />
      </div>
      <div className="card-body">
        {!isEditing && (
          <>
            <h4>{props.name}</h4>
            <p className="text-muted small">{props.author}</p>
            {!props.readOnly && (
              <>
                <button
                  onClick={() => {
                    setIsEditing(true)
                    setDraftName(props.name)
                    setDraftAuthor(props.author)
                    setFile("")
                  }}
                  className="btn btn-sm btn-primary"
                >
                  Edit
                </button>{" "}
                <button
                  onClick={async () => {
                    const test = Axios.delete(`/book/${props.id}`)
                    props.setBooks(prev => {
                      return prev.filter(book => {
                        return book._id != props.id
                      })
                    })
                  }}
                  className="btn btn-sm btn-outline-danger"
                >
                  Delete
                </button>
              </>
            )}
          </>
        )}
        {isEditing && (
          <form onSubmit={submitHandler}>
            <div className="mb-1">
              <input autoFocus onChange={e => setDraftName(e.target.value)} type="text" className="form-control form-control-sm" value={draftName} />
            </div>
            <div className="mb-2">
              <input onChange={e => setDraftAuthor(e.target.value)} type="text" className="form-control form-control-sm" value={draftAuthor} />
            </div>
            <button className="btn btn-sm btn-success">Save</button>{" "}
            <button onClick={() => setIsEditing(false)} className="btn btn-sm btn-outline-secondary">
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default BookCard