import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { showGenre, updateGenre } from "../../../api/genresAPI";

function UpdateGenre() {
  const { id } = useParams();

  const navigate = useNavigate();
  const location = useLocation();

  let { name } = location.state || {};

  //------This set initial value for Genres---//
  const initialValue = {
    name: "",
  };
  const [Genre, setGenre] = useState(initialValue);
  const [message, setMessage] = useState("");

  //----This is to set initial value for Genre----//
  useEffect(() => {
    if (name) {
      setGenre((prev) => ({ ...prev, name }));
    }
  }, [name]);

  //----This fetch data based on Id----//
  useEffect(() => {
    const fetchData = async () => {
      try {
        //----This is fetch data from backend based on id---//
        const response = await showGenre(id);
        setGenre(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [id]);

  //------This is the function to handle input changes----//
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGenre((prevGenre) => ({
      ...prevGenre,
      [name]: value,
    }));
  };

  //---------This is the function for handle submit----//
  const handleSubmit = async (e) => {
    e.preventDefault();

    //----This is to update Genre----//
    try {
      const response = await updateGenre(id, Genre);
      setMessage(response.message);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <h1 className="text-center">Update Genres</h1>

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

                      ///-----This back to view Genres page----//
                      navigate("/Admin/ViewGenre");
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

export default UpdateGenre;
