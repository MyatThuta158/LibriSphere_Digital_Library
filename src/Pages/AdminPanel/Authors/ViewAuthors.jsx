import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthors, deleteAuthors } from "../../../api/authorsApi";
import _, { set } from "lodash";

function ViewAuthors() {
  const [initialAuthors, setInitialAuthors] = useState([]);
  const [authors, setAuthors] = useState([]); //-----This is to store author---//
  const [message, setMessage] = useState(""); //-----This is to set message----//
  const navigate = useNavigate(); //----This call use navigate for page navigation---//
  const [deleteId, setDeleteId] = useState(null); //---This is to make delete process---//
  const [status, setStatus] = useState(false); //---This is to set delete status for showing delete modal box---//
  const [changeState, setChangeState] = useState(false); //---This is to change state---//
  const [searchValue, setSearchvalue] = useState(); //----This is for search value----//

  //---This is the function to get all data from database---//
  const getAlldata = async () => {
    const dataResult = await getAuthors();
    const data = dataResult.data;
    return data;
  };

  useEffect(() => {
    //-----This fetch data from database----//
    const fetchData = async () => {
      //-----This fetch data from database----//
      try {
        //---This is to fetch data from function-----//
        const authorData = await getAlldata();
        const data = _.sortBy(authorData, ["name"]);
        setAuthors(data);
        setInitialAuthors(data);
        console.log(authors);
      } catch (err) {
        setMessage(err);
      }
    };

    fetchData();
  }, [changeState]);

  //-----This is the search process function---//

  ///-------This is for search process----//
  useEffect(() => {
    //------This is the search process---//
    if (searchValue) {
      let searchResult = authors.filter((author) =>
        author.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setAuthors(searchResult);
    } else {
      setAuthors(initialAuthors);
    }
  }, [searchValue]);

  //------This is to delete author---//
  const deleteAuthor = async () => {
    try {
      //-----This is the delete process---//
      const result = await deleteAuthors(deleteId);
      setMessage(result.data);

     // console.log(message);
      if (result.status === 200) {
        //-----This is to update the author list after deletion---//
        setAuthors(authors.filter((author) => author.id !== deleteId));
        setDeleteId(null); //---This set null to delete id---//
        setChangeState(!changeState); //---This is to change state---//
      }
    } catch (err) {
      setMessage(err);
    }
  };

  return (
    <div>
      <div className="container-fluid h-100">
        <h1 className="text-center fs-2 text-bolder">All Authors</h1>

        {/* This is for Search form */}
        <div className="d-flex w-100 justify-content-center my-3">
          <input
            type="text"
            placeholder="Search Authors...."
            className="w-50 p-3"
            onChange={(e) => {
              setSearchvalue(e.target.value);
            }}
            style={{ borderRadius: "8px 0px 0px 8px" }}
          />
          <button
            className=" btn-primary px-3 p-3"
            style={{ borderRadius: "0px 8px 8px 0px" }}
          >
            Search
          </button>
        </div>

        {authors && authors.length > 0 ? (
          <div
            className="table-responsive"
            style={{
              scrollable: true,
              overflowY: "auto",
              height: "60vh",
            }}
          >
            <table className="table table-striped  table-bordered">
              <thead
                className="thead-dark"
                style={{ position: "sticky", top: "0" }}
              >
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {authors.map((author) => (
                  <tr key={author.id}>
                    <td>{author.id}</td>
                    <td>{author.name}</td>
                    <td>
                      <button
                        className="btn btn-primary mx-2"
                        style={{ borderRadius: "8px" }}
                        onClick={() => {
                          navigate(`/Admin/UpdateAuthors/${author.id}`, {
                            state: { name: author.name },
                          });
                        }}
                      >
                        Update
                      </button>
                      <button
                        className="btn btn-danger mx-2"
                        style={{ borderRadius: "8px" }}
                        onClick={() => {
                          setDeleteId(author.id);
                          setStatus(true);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <h1 className="text-center fs-2 text-bolder">No Authors Data</h1>
        )}
      </div>

      {status && (
        <div className="modal" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setStatus(false);
                    setDeleteId(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this author?</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setStatus(false);
                    setDeleteId(null);
                  }}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-danger"
                  onClick={() => {
                    setStatus(false);
                    //----This is to delete author---//
                    deleteAuthor();
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewAuthors;
