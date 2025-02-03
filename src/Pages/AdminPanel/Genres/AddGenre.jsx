import React, { useState } from "react";
import { createGenre } from "../../../api/genresAPI";

function AddGenre() {
  const initial = {
    genre_name: "",
  };

  const [message, setMessage] = useState("");
  const [Genre, setGenre] = useState(initial);

  const handleInputChange = (e) => {
    const { name, value } = e.target; // Fixed here
    setGenre({ ...Genre, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!Genre.genre_name.trim()) {
      setMessage("Genre name cannot be empty.");
      return;
    }

    try {
      let result = await createGenre(Genre);
      console.log(result.message);

      if (result.status == 200) {
        setMessage(result.message);
        setGenre(initial);
      } else {
        setMessage("Failed to add genre.");
      }
    } catch (err) {
      console.error(err);
      setMessage("An error occurred while adding the genre.");
    }
  };

  return (
    <div>
      <h1 className="text-center">Add Genres</h1>

      <div className="container d-flex justify-content-center">
        <form className="form-group w-50" onSubmit={handleSubmit}>
          <input
            type="text"
            name="genre_name"
            value={Genre.genre_name}
            className="form-control w-100"
            onChange={handleInputChange}
          />
          <button type="submit" className="btn btn-primary mx-auto mt-2">
            Add Genre
          </button>
        </form>

        {/* Modal for displaying messages */}
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
                  <h1 className="modal-title fs-5" id="messageModalLabel">
                    Notification
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={() => setMessage("")}
                  ></button>
                </div>
                <div className="modal-body">{message}</div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    onClick={() => setMessage("")}
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
