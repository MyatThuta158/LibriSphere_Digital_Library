import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { getSinglePosts } from "../../api/forumpostApi";
import {
  uploadDiscussion,
  showAlldiscussions,
  updateComments,
  deleteDiscussion,
} from "../../api/discussionApi";
import {
  postVote,
  viewVote,
  updateVote,
  getVoters,
  deleteVote,
} from "../../api/voteApi";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Slider from "react-slick";
import VoterLists from "./Layout/VoterLists";
import { Modal, Button } from "react-bootstrap";
import { Can } from "@casl/react";
import { AbilityContext } from "../../Authentication/PermissionForUser";

// Custom arrow components for the slider.
const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        right: "10px",
        zIndex: 2,
        width: "30px",
        height: "30px",
        background: "rgba(0,0,0,0.5)",
        borderRadius: "50%",
        padding: "5px",
      }}
      onClick={onClick}
    />
  );
};

const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        left: "10px",
        zIndex: 2,
        width: "30px",
        height: "30px",
        background: "rgba(0,0,0,0.5)",
        borderRadius: "50%",
        padding: "5px",
      }}
      onClick={onClick}
    />
  );
};

// Helper component to display an image with fallback in case of error.
function ImageWithFallback({ src, alt, style, ...props }) {
  const [error, setError] = useState(false);
  if (error || !src) return null;
  return (
    <img
      src={src}
      alt={alt}
      style={style}
      onError={() => setError(true)}
      {...props}
    />
  );
}

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [flag, setFlag] = useState(false);

  // Vote states
  const [userVote, setUserVote] = useState(null);
  const [voteCounts, setVoteCounts] = useState({ upvotes: 0, downvotes: 0 });
  const [voters, setVoters] = useState([]);
  const [showVoterPopup, setShowVoterPopup] = useState(false);

  // States for editing comments
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");

  // New states for delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  // Retrieve stored user (for demonstration, from localStorage)
  const storedUser = JSON.parse(localStorage.getItem("user"));

  // Get ability from CASL context
  const ability = useContext(AbilityContext);

  // Fetch post data.
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await getSinglePosts(id);
        setPost(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  // Fetch discussions (comments) for the post.
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await showAlldiscussions(id);
        setComments(res.discussions || []);
      } catch (err) {
        console.error("Error fetching discussions:", err);
      }
    };
    fetchComments();
  }, [id, flag]);

  // Fetch vote counts.
  const updateVoteCounts = async () => {
    try {
      const data = await viewVote(id);
      setVoteCounts(data);
    } catch (err) {
      console.error("Error fetching vote counts:", err);
    }
  };

  // Fetch all votes and set both the voters list and the current user's vote.
  const updateVotes = async () => {
    try {
      const votersData = await getVoters(id);
      const votesArray = votersData.voters;
      setVoters(votesArray);
      if (storedUser) {
        const currentUserVote = votesArray.find(
          (vote) => vote.user.id === storedUser.id
        );
        setUserVote(currentUserVote || null);
      }
    } catch (err) {
      console.error("Error fetching votes:", err);
    }
  };

  useEffect(() => {
    updateVoteCounts();
    updateVotes();
  }, [id]);

  // Handle discussion (comment) submission.
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return;
    try {
      const data = {
        ForumPostId: id,
        Content: newComment,
        UserId: storedUser.id,
      };
      await uploadDiscussion(data);
      setFlag((prev) => !prev);
      setNewComment("");
    } catch (err) {
      console.error("Error uploading discussion:", err);
    }
  };

  // Handle vote actions.
  const handleVote = async (voteTypeId) => {
    if (!storedUser) return;
    if (userVote) {
      if (userVote.vote_type_id === voteTypeId) {
        try {
          await deleteVote({ user_id: storedUser.id, ForumPostId: id });
          setUserVote(null);
          updateVoteCounts();
          updateVotes();
        } catch (err) {
          console.error("Error removing vote:", err);
        }
        return;
      } else {
        try {
          const response = await updateVote({
            user_id: storedUser.id,
            ForumPostId: id,
            vote_type_id: voteTypeId,
          });
          setUserVote(response.vote);
          await updateVoteCounts();
          await updateVotes();
        } catch (err) {
          console.error("Error updating vote:", err);
        }
      }
    } else {
      try {
        const response = await postVote({
          user_id: storedUser.id,
          ForumPostId: id,
          vote_type_id: voteTypeId,
        });
        setUserVote(response.vote);
        await updateVoteCounts();
        await updateVotes();
      } catch (err) {
        console.error("Error posting vote:", err);
      }
    }
  };

  // Handle editing a comment.
  const handleEditClick = (comment) => {
    if (storedUser && comment.user.id === storedUser.id) {
      setEditingCommentId(comment.id);
      setEditingCommentContent(comment.Content);
    }
  };

  const handleUpdateComment = async () => {
    if (editingCommentContent.trim() === "") return;
    try {
      const data = { Content: editingCommentContent };
      await updateComments(data, editingCommentId);
      setFlag((prev) => !prev);
      setEditingCommentId(null);
      setEditingCommentContent("");
    } catch (err) {
      console.error("Error updating comment:", err);
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingCommentContent("");
  };

  // Open delete modal and store the comment to delete.
  const openDeleteModal = (comment) => {
    setCommentToDelete(comment);
    setShowDeleteModal(true);
  };

  // Confirm deletion in the modal.
  const confirmDelete = async () => {
    try {
      await deleteDiscussion(commentToDelete.id);
      setFlag((prev) => !prev);
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
    setShowDeleteModal(false);
    setCommentToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCommentToDelete(null);
  };

  if (loading) return <div>Loading post...</div>;
  if (error) return <div>Error loading post: {error.message}</div>;

  // Collect photos if available.
  const photos = [];
  if (post.Photo1) photos.push(post.Photo1);
  if (post.Photo2) photos.push(post.Photo2);
  if (post.Photo3) photos.push(post.Photo3);

  const formattedDate = new Date(post.created_at).toLocaleDateString();

  // Slider settings: include custom arrows.
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  // Click handler to open the image in a new tab (or page).
  const handleImageClick = (photo) => {
    window.open(`http://127.0.0.1:8000/storage/${photo}`, "_blank");
  };

  return (
    <HelmetProvider>
      <Helmet>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
        />
        {/* Bootstrap CSS */}
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
        />
      </Helmet>

      <div className="container-fluid bg-light min-vh-100 post-detail-page">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 p-3">
            <div
              className="card my-3"
              style={{
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              }}
            >
              {photos.length > 0 && (
                <div className="overflow-hidden" style={{ maxHeight: "400px" }}>
                  <Slider {...sliderSettings}>
                    {photos.map((photo, index) => (
                      <div
                        key={index}
                        onClick={() => handleImageClick(photo)}
                        style={{ cursor: "pointer" }}
                      >
                        <ImageWithFallback
                          className="w-100 img-fluid"
                          style={{
                            maxHeight: "400px",
                            objectFit: "contain",
                          }}
                          src={`http://127.0.0.1:8000/storage/${photo}`}
                          alt={`${post.Title} - Slide ${index + 1}`}
                        />
                      </div>
                    ))}
                  </Slider>
                </div>
              )}

              <div className="d-flex align-items-center p-3 border-bottom">
                <ImageWithFallback
                  className="rounded-circle mr-3"
                  style={{ width: "50px", height: "50px" }}
                  src={
                    post.user?.ProfilePic
                      ? `http://127.0.0.1:8000/storage/${post.user.ProfilePic}`
                      : "/Customer/pic.jpg"
                  }
                  alt="User Avatar"
                />
                <div className="ml-2">
                  <div className="font-weight-bold h5 mb-0">
                    {post.user?.name || "Unknown"}
                  </div>
                  <div className="text-muted" style={{ fontSize: "14px" }}>
                    {formattedDate}
                  </div>
                </div>
              </div>

              <div className="p-3 border-bottom">
                <h2 className="h4 mb-0">{post.Title}</h2>
              </div>

              <div className="p-3">
                <p
                  className="mb-0"
                  style={{
                    lineHeight: "1.6",
                    fontSize: "16px",
                    color: "#333",
                  }}
                >
                  {post.Description}
                </p>
              </div>

              <div className="d-flex flex-column align-items-center p-3 border-top">
                {ability.can("vote", "votes") && (
                  <div className="d-flex justify-content-around w-100 mb-2">
                    <button
                      style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        fontSize: "16px",
                        color:
                          userVote && userVote.vote_type_id === 1
                            ? "blue"
                            : "#555",
                      }}
                      onClick={() => handleVote(1)}
                    >
                      <i className="fas fa-arrow-up"></i> Upvote (
                      {voteCounts.upvotes})
                    </button>
                    <button
                      style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        fontSize: "16px",
                        color:
                          userVote && userVote.vote_type_id === 2
                            ? "red"
                            : "#555",
                      }}
                      onClick={() => handleVote(2)}
                    >
                      <i className="fas fa-arrow-down"></i> Downvote (
                      {voteCounts.downvotes})
                    </button>
                  </div>
                )}
                <div
                  className="text-secondary"
                  style={{ fontSize: "14px", cursor: "pointer" }}
                  onClick={() => setShowVoterPopup(true)}
                  title="Click to view voter list"
                >
                  Voters:{" "}
                  {voters && voters.length > 0
                    ? voters.map((vote) => vote.user.name).join(", ")
                    : "No voters yet."}
                </div>
              </div>

              <div className="p-3 border-top">
                <div className="h5 font-weight-bold mb-3">Discussions</div>
                <div
                  className="h-100"
                  style={{ maxHeight: "300px", overflowY: "auto" }}
                >
                  {comments && comments.length > 0 ? (
                    comments.map((comment, index) => (
                      <div
                        key={index}
                        className="d-flex align-items-center mb-3"
                      >
                        <ImageWithFallback
                          className="rounded-circle mr-2"
                          style={{ width: "40px", height: "40px" }}
                          src={
                            comment.user?.ProfilePic
                              ? `http://127.0.0.1:8000/storage/${comment.user.ProfilePic}`
                              : "http://127.0.0.1:8000/storage/default-avatar.png"
                          }
                          alt="Comment User Avatar"
                        />
                        <div className="flex-grow-1">
                          <div
                            className="font-weight-bold"
                            style={{ fontSize: "16px" }}
                          >
                            {comment.user?.name || "Unknown"}
                          </div>
                          {editingCommentId === comment.id ? (
                            <div className="d-flex flex-column mt-2">
                              <textarea
                                value={editingCommentContent}
                                onChange={(e) =>
                                  setEditingCommentContent(e.target.value)
                                }
                                className="form-control"
                              />
                              <div className="mt-2">
                                <button
                                  onClick={handleUpdateComment}
                                  className="btn btn-success btn-sm mr-2"
                                >
                                  Update
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="btn btn-danger btn-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div
                                style={{
                                  fontSize: "14px",
                                  color: "#555",
                                }}
                              >
                                {comment.Content}
                              </div>
                              <div
                                style={{
                                  fontSize: "12px",
                                  color: "#888",
                                }}
                              >
                                {new Date(comment.created_at).toLocaleString()}
                              </div>
                            </>
                          )}
                        </div>
                        {storedUser && editingCommentId !== comment.id && (
                          <div className="d-flex">
                            {comment.user?.id === storedUser.id &&
                              ability.can("update", "discussion") && (
                                <button
                                  onClick={() => handleEditClick(comment)}
                                  style={{
                                    border: "none",
                                    background: "none",
                                    cursor: "pointer",
                                    fontSize: "16px",
                                    color: "#007bff",
                                    marginLeft: "8px",
                                  }}
                                  title="Edit Comment"
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
                                </button>
                              )}
                            {(comment.user?.id === storedUser.id ||
                              storedUser.role === "manager" ||
                              storedUser.role === "librarian") && (
                              <button
                                onClick={() => openDeleteModal(comment)}
                                style={{
                                  border: "none",
                                  background: "none",
                                  cursor: "pointer",
                                  fontSize: "16px",
                                  marginLeft: "8px",
                                }}
                                title="Delete Comment"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="bi bi-trash"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1 1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                </svg>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div>No comments yet.</div>
                  )}
                </div>

                <form
                  className="d-flex align-items-center mt-3"
                  onSubmit={handleCommentSubmit}
                >
                  <textarea
                    placeholder="Add a comment..."
                    className="form-control"
                    style={{
                      flex: 1,
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                    }}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button className="btn btn-primary ml-2" type="submit">
                    Post
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bootstrap Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={cancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this discussion?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {showVoterPopup && (
        <VoterLists
          id={id}
          onClose={() => setShowVoterPopup(false)}
          show={showVoterPopup}
        />
      )}
    </HelmetProvider>
  );
}

export default PostDetail;
