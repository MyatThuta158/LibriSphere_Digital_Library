import React, { useEffect, useState } from "react";
import { allRequest } from "../../../api/requestresourceApi";
import { Link, useNavigate } from "react-router-dom";

function ViewRequest() {
  const [requestData, setRequestData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const getAll = async (page = 1) => {
    try {
      const response = await allRequest(page);
      setRequestData(response.data.data);
      setTotalPages(response.data.last_page);
    } catch (error) {
      console.error("Error fetching request resources:", error);
      setRequestData([]);
    }
  };

  useEffect(() => {
    getAll(currentPage);
  }, [currentPage]);

  return (
    <div>
      <h2 className="text-center mb-2">Customer Request</h2>
      {requestData.length > 0 ? (
        requestData.map((request) => (
          <div
            key={request.id}
            className="d-flex bg-primary m-3 text-white p-3 mx-auto rounded-lg shadow-lg align-items-center"
            style={{ width: "60%" }}
          >
            <img
              src={`http://127.0.0.1:8000/storage/${request.Resource_Photo}`}
              alt="Book Cover"
              className="rounded-lg shadow-lg"
              style={{ width: "20%", height: "15vh", objectFit: "contain" }}
            />
            <div className="ml-4 flex flex-column justify-content-between w-100">
              <div className="container d-flex justify-content-between">
                <div>
                  <h2 className="text-lg text-white font-semibold mb-1">
                    <span className="text-gray-400">Title:</span>{" "}
                    {request.Title}
                  </h2>
                  <p className="text-sm text-gray-400">
                    Language:{" "}
                    <span className="text-white">{request.Language}</span>
                  </p>
                </div>

                <div className="d-flex">
                  <span className="text-right text-white me-2">Date:</span>
                  <span className="text-right d-block text-white">
                    {request.created_at.split("T")[0]}
                  </span>
                </div>
              </div>
              <div
                className="d-flex justify-content-between float-end"
                style={{ width: "100%" }}
              >
                <div className="ms-3">
                  <button
                    onClick={() =>
                      navigate(`/Admin/DetailResourceRequest/${request.id}`)
                    }
                    className="btn px-5 btn-warning"
                  >
                    Detail
                  </button>
                </div>
                <div className="float-end d-flex">
                  <span className="text-right text-white me-2">
                    Requested by:
                  </span>
                  <span className="text-right d-block text-white">
                    {request.user?.name || "Unknown"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-white">No requests found.</p>
      )}

      {/* Pagination Buttons */}
      <div className="d-flex justify-content-center my-3">
        <button
          className="btn btn-primary me-2"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </button>
        <span className="text-black my-3 mx-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-primary"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ViewRequest;
