import React, { useState } from "react";
import { createGenre } from "../../../api/genresAPI";

function AddGenre() {
  //-------This is the initial state of the Genre data----//
  const initial = {
    name: "",
  };
  //------This is for message----//
  const [message, setMessage] = useState("");

  //------This store the Genre data---//
  const [Genre, setGenre] = useState(initial);

  const handleInputChange = (e) => {
    const { name } = e.target;

    setGenre({ ...Genre, [name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let result = await createGenre(Genre);
      setMessage(result.message);

      //const updateGenres=await getGenres();
      setGenre(initial);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <h1 className="text-center">Add Genres</h1>

      <div className="container d-flex justify-content-center">
        <form className="form-group w-50" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={Genre.name}
            className="form-control w-100"
            onChange={handleInputChange}
          />
          <button type="submit" className="btn btn-primary mx-auto mt-2">
            Add Genre
          </button>
        </form>
        {/* This is for message box */}

        {message && (
          <div
            className="modal fade show"
            style={{ display: "block" }}
            tabIndex="-1"
            aria-labelledby="messageModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1
                    className="modal-title fs-5"
                    id="staticBackdropLabel"
                  ></h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">...</div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    onClick={() => {
                      setMessage(null);
                    }}
                  >
                    Close
                  </button>
                  <button type="button" className="btn btn-primary">
                    Understood
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddGenre;
