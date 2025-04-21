import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { detail, incrementView } from "../../api/resourceApi";
import Menu from "../Layouts/Menu";
import axios from "axios";
import { FaStar, FaEdit, FaTrash } from "react-icons/fa";
import {
  resourceReviews,
  updateReview,
  deleteReview,
} from "../../api/reviewApi"; // Import deleteReview

import { AbilityContext } from "../../Authentication/PermissionForUser";

function ResourceDetail() {
  const { id } = useParams(); // Get resource ID from URL
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [role, setRole] = useState(null);
  const [userid, setUserid] = useState(0);
  const [newReview, setNewReview] = useState({
    ReviewStar: 0,
    ReviewMessage: "",
  });
  const [hoverStar, setHoverStar] = useState(null);
  const [editingReviewId, setEditingReviewId] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success"); // "success" or "error"
  const baseUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  //-----This is for permission define---//
  const ability = useContext(AbilityContext);
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
      console.log(resourceReview);
      setReviews(resourceReview.reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  // When the edit icon is clicked, initialize the input with the review's current values
  const handleEditReview = (review) => {
    setNewReview({
      ReviewStar: review.ReviewStar,
      ReviewMessage: review.ReviewMessage,
    });
    setEditingReviewId(review.id);
    setErrorMessage("");
  };

  // Cancel editing mode
  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setNewReview({ ReviewStar: 0, ReviewMessage: "" });
    setErrorMessage("");
  };

  //----This increment the count----//

  const incrementViewCount = async (id) => {
    const res = await incrementView(id);

    console.log("count".res);
  };
  // Delete review when user clicks the delete icon
  const handleDeleteReview = async (reviewId) => {
    try {
      // Use the provided deleteReview function
      await deleteReview(reviewId);
      // Remove the deleted review from the state
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear any previous error message
    setErrorMessage("");

    // Validate only the review message is entered.
    if (newReview.ReviewMessage.trim() === "") {
      setErrorMessage("Please enter review");
      return;
    }

    if (editingReviewId) {
      // Update existing review
      try {
        const updatedData = {
          reviewid: editingReviewId,
          resource_id: id,
          user_id: userid,
          ReviewStar: newReview.ReviewStar,
          ReviewMessage: newReview.ReviewMessage,
        };
        const response = await updateReview(editingReviewId, updatedData);
        const updatedReviews = reviews.map((review) =>
          review.id === editingReviewId ? response.review : review
        );
        setReviews(updatedReviews);
        setEditingReviewId(null);
        setNewReview({ ReviewStar: 0, ReviewMessage: "" });
        setModalMessage("Review updated successfully!");
        setModalType("success");
        setShowModal(true);
      } catch (error) {
        console.error("Error updating review:", error);
        setModalMessage("Failed to update review. Please try again.");
        setModalType("error");
        setShowModal(true);
      }
    } else {
      // Add new review
      try {
        const response = await axios.post(`${baseUrl}Reviews/Add`, {
          resource_id: id,
          user_id: userid,
          ReviewStar: newReview.ReviewStar,
          ReviewMessage: newReview.ReviewMessage,
        });
        setReviews([...reviews, response.data.review]);
        setNewReview({ ReviewStar: 0, ReviewMessage: "" });
        setModalMessage("Review added successfully!");
        setModalType("success");
        setShowModal(true);
      } catch (error) {
        console.error("Error submitting review:", error);
        setModalMessage("Failed to add review. Please try again.");
        setModalType("error");
        setShowModal(true);
      }
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
      {/* <Menu /> */}
      <div className="container" style={{ marginTop: "10%" }}>
        <div className="row">
          {/* Book Cover */}
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
            <p className="text-muted">By Author ID: {resource.author_id}</p>
            <div className="d-flex align-items-center mb-3">
              <span className="badge bg-success">5.0 / 5.0</span>
              <span className="ms-2 text-primary">
                {reviews.length} Review(s)
              </span>
            </div>
            <p className="w-50 text-justify">{resource.Description}</p>
            <p className="fw-bold">Publish Date: {resource.publish_date}</p>
            {/* Download Button */}
            <div
              onClick={() => {
                navigate(`/library/ReadResource/${id}`);
                incrementViewCount(id);
              }}
              className="btn btn-dark mt-3"
            >
              Read Resource
            </div>
          </div>
        </div>
      </div>

      <hr />

      {/* Reviews Section */}
      <div className="container">
        <h3>User Reviews</h3>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="p-3 border rounded mb-2 d-flex">
              <div>
                <img
                  src={
                    review.profile_pic
                      ? `http://127.0.0.1:8000/storage/${review.profile_pic}`
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
                  {/* If the review was uploaded by the logged-in user and the user is not a manager or librarian, show both edit and delete */}
                  {review.user_id === userid &&
                    role !== "manager" &&
                    role !== "librarian" && (
                      <div className="ms-auto d-flex">
                        <FaEdit
                          className="cursor-pointer me-2"
                          onClick={() => handleEditReview(review)}
                        />
                        <FaTrash
                          className="cursor-pointer"
                          onClick={() => handleDeleteReview(review.id)}
                        />
                      </div>
                    )}
                  {/* If the logged-in user is a manager or librarian, show only the delete icon */}
                  {(role === "manager" || role === "librarian") && (
                    <div className="ms-auto d-flex">
                      <FaTrash
                        className="cursor-pointer"
                        onClick={() => handleDeleteReview(review.id)}
                      />
                    </div>
                  )}
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
                <small className="text-muted">
                  Created on: {new Date(review.created_at).toLocaleString()}
                </small>
              </div>
            </div>
          ))
        ) : (
          <p>No reviews yet. Be the first to review this resource!</p>
        )}

        {/* Submit Review Form */}
        {ability.can("add", "review") && (
          <div className="mt-4">
            <h4>{editingReviewId ? "Edit Your Review" : "Leave a Review"}</h4>
            <form onSubmit={handleSubmit}>
              <div className="d-flex">
                {[...Array(5)].map((_, i) => {
                  const starValue = i + 1;
                  return (
                    <FaStar
                      key={i}
                      className={`cursor-pointer ${
                        starValue <= (hoverStar || newReview.ReviewStar)
                          ? "text-warning"
                          : "text-secondary"
                      }`}
                      onClick={() =>
                        setNewReview({ ...newReview, ReviewStar: starValue })
                      }
                      onMouseEnter={() => setHoverStar(starValue)}
                      onMouseLeave={() => setHoverStar(null)}
                    />
                  );
                })}
              </div>
              <textarea
                className="form-control mt-2 mb-2"
                placeholder="Write your review here..."
                style={{ height: "20vh" }}
                value={newReview.ReviewMessage}
                onChange={(e) =>
                  setNewReview({ ...newReview, ReviewMessage: e.target.value })
                }
              ></textarea>
              {/* Inline error sentence with red text for review message */}
              {errorMessage && (
                <p className="text-danger mt-2">{errorMessage}</p>
              )}
              <div className="d-flex">
                <button type="submit" className="btn btn-primary">
                  {editingReviewId ? "Update Review" : "Submit Review"}
                </button>
                {editingReviewId && (
                  <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
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
                  modalType === "success" ? "bg-primary" : "bg-danger"
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
