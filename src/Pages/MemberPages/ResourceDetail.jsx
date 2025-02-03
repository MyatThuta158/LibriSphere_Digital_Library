import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { detail } from "../../api/resourceApi";
import Menu from "./Layouts/Menu";
import axios from "axios";
import { FaStar } from "react-icons/fa";

function ResourceDetail() {
  const { id } = useParams(); // Get resource ID from URL
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    ReviewStar: 5,
    ReviewMessage: "",
  });
  const [hoverStar, setHoverStar] = useState(null);
  const baseUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const getResource = async () => {
      try {
        const response = await detail(id);
        setResource(response.message);
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
      const response = await axios.get(`${baseUrl}/reviews/${id}`);
      setReviews(response.data.reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseUrl}Reviews/Add`, {
        resource_id: id,
        user_id: 2,
        ReviewStar: newReview.ReviewStar,
        ReviewMessage: newReview.ReviewMessage,
      });

      setReviews([...reviews, response.data.review]); // Update UI with new review
      setNewReview({ ReviewStar: 5, ReviewMessage: "" }); // Reset form
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (!resource) {
    return <div className="text-center mt-5">Resource not found</div>;
  }

  return (
    <div>
      <Menu />
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
              onClick={() => navigate(`/Customer/readResource`)}
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

        {/* Display Existing Reviews */}
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="p-3 border rounded mb-2">
              <p className="fw-bold">{review.user_name}</p>
              <div className="d-flex">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={
                      i < review.ReviewStar ? "text-warning" : "text-secondary"
                    }
                  />
                ))}
              </div>
              <p>{review.ReviewMessage}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet. Be the first to review this resource!</p>
        )}

        {/* Submit Review Form */}
        <div className="mt-4">
          <h4>Leave a Review</h4>
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
              className="form-control mt-2"
              placeholder="Write your review here..."
              value={newReview.ReviewMessage}
              onChange={(e) =>
                setNewReview({ ...newReview, ReviewMessage: e.target.value })
              }
              required
            ></textarea>

            <button type="submit" className="btn btn-primary mt-2">
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResourceDetail;
