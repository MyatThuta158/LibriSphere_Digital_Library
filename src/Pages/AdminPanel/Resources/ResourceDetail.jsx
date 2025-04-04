import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { detail } from "../../../api/resourceApi";

import axios from "axios";
import { FaStar, FaTrash } from "react-icons/fa";
import { resourceReviews, deleteReview } from "../../../api/reviewApi";

function ResourceDetail() {
  const { id } = useParams(); // Get resource ID from URL
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [role, setRole] = useState(null);
  const [userid, setUserid] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success"); // "success" or "error"
  const baseUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  // Retrieve the logged in user's id and role from local storage once
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserid(parsedUser.id);
      setRole(parsedUser.role);
    }
  }, []);

  useEffect(() => {
    const getResource = async () => {
      try {
        const response = await detail(id);
        setResource(response.data);
        //console.log(response.data);
        fetchReviews(); // Fetch existing reviews
      } catch (error) {
        console.error("Error fetching resource:", error);
      } finally {
        setLoading(false);
      }
    };

    getResource();
  }, [id]);

  const fetchReviews = async () => {
    try {
      const resourceReview = await resourceReviews(id);
      setReviews(resourceReview.reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  // Delete review when user clicks the delete icon
  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      setReviews((prevReviews) =>
        prevReviews.filter((review) => review.id !== reviewId)
      );
      setModalMessage("Review deleted successfully!");
      setModalType("success");
      setShowModal(true);
    } catch (error) {
      console.error("Error deleting review:", error);
      setModalMessage("Failed to delete review. Please try again.");
      setModalType("error");
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (!resource) {
    return <div className="text-center mt-5">Resource not found</div>;
  }

  return (
    <div>
      <div className="container" style={{ marginTop: "0%" }}>
        <div className="row">
          {/* Resource Cover */}
          <div className="col-md-4">
            <img
              src={`${baseUrl}storage/${resource.cover_photo}`}
              className="img-fluid rounded shadow"
              alt={resource.name}
              style={{ height: "450px", objectFit: "cover" }}
            />
          </div>

          {/* Resource Details */}
          <div className="col-md-8">
            <h2 className="fw-bold">{resource.name}</h2>
            <p className="text-muted">By Author: {resource.author.name}</p>
            <div className="d-flex align-items-center mb-3">
              <span className="badge bg-success">5.0 / 5.0</span>
              <span className="ms-2 text-primary">
                {reviews.length} Review(s)
              </span>
            </div>
            <p className="w-50 text-justify">{resource.Description}</p>
            <p className="fw-bold">Publish Date: {resource.publish_date}</p>
            {/* Download/Read Button */}
            <div className="d-flex gap-3 mt-3">
              {/* Update icon */}
              <div
                className="btn btn-warning"
                onClick={() => navigate(`/Admin/updateResource/${id}`)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-pencil-square"
                  viewBox="0 0 16 16"
                >
                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                  <path
                    fillRule="evenodd"
                    d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                  />
                </svg>
              </div>
              {/* Delete icon */}
              <div className="btn btn-danger">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-trash"
                  viewBox="0 0 16 16"
                >
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                </svg>
              </div>
            </div>

            <button
              className="mt-3 btn btn-primary  text-white p-3"
              style={{ borderRadius: "10px" }}
              onClick={() => navigate(`/Admin/ReadResource/${id}`)}
            >
              View Resource
            </button>
          </div>
        </div>
      </div>

      <hr />

      {/* Reviews Section */}
      <div className="container">
        <h3>User Reviews</h3>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div
              key={index}
              className="p-3 border rounded mb-2 d-flex align-items-start"
            >
              <div>
                <img
                  src={
                    review.profile_pic
                      ? `${baseUrl}storage/${review.profile_pic}`
                      : "/Customer/pic.jpg"
                  }
                  alt={review.user_name}
                  className="rounded-circle"
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div className="ms-3 flex-grow-1">
                <div className="d-flex align-items-center">
                  <p className="fw-bold mb-0">{review.user_name}</p>
                  <div className="ms-auto">
                    <FaTrash
                      className="cursor-pointer"
                      onClick={() => handleDeleteReview(review.id)}
                    />
                  </div>
                </div>
                <div className="d-flex">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={
                        i < review.ReviewStar
                          ? "text-warning"
                          : "text-secondary"
                      }
                    />
                  ))}
                </div>
                <p>{review.ReviewMessage}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>

      {/* Modal for Success/Error Messages */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div
                className={`modal-header ${
                  modalType === "success" ? "bg-success" : "bg-danger"
                } text-white`}
              >
                <h5 className="modal-title">
                  {modalType === "success" ? "Success" : "Error"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <p>{modalMessage}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResourceDetail;
