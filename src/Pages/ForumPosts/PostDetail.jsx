import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getSinglePosts } from "../../api/forumpostApi";
import {
  uploadDiscussion,
  showAlldiscussions,
  updateComments,
} from "../../api/discussionApi";
import {
  postVote,
  viewVote,
  updateVote,
  getVoters,
  deleteVote,
} from "../../api/voteApi";
import SideBar from "./Layout/SideBar";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Slider from "react-slick";
import VoterLists from "./Layout/VoterLists"; // adjust the path as needed

// Helper component to dismiss <img> tag if the image fails to load.
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

  // State to track the current user's vote on this post.
  const [userVote, setUserVote] = useState(null);
  // State to store vote counts: upvotes and downvotes.
  const [voteCounts, setVoteCounts] = useState({ upvotes: 0, downvotes: 0 });
  // State to store all voters (vote records) for this post.
  const [voters, setVoters] = useState([]);
  // State to toggle the voter popup modal.
  const [showVoterPopup, setShowVoterPopup] = useState(false);

  // ---- New state for editing comments ----
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");

  const storedUser = JSON.parse(localStorage.getItem("user"));

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

  // Fetch all votes for the post and set both the voters list and the current user's vote.
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

  // When the component mounts or when the post id changes, update the vote counts and votes.
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
    if (!storedUser) return; // Only logged in users can vote

    if (userVote) {
      if (userVote.vote_type_id === voteTypeId) {
        try {
          await deleteVote({
            user_id: storedUser.id,
            ForumPostId: id,
          });
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

  // ----- New functions for updating a comment -----
  const handleEditClick = (comment) => {
    // Only allow editing if the current user is the owner of the comment.
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
      setFlag((prev) => !prev); // trigger re-fetching of discussions
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

  if (loading) return <div>Loading post...</div>;
  if (error) return <div>Error loading post: {error.message}</div>;

  // Collect photos if available.
  const photos = [];
  if (post.Photo1) photos.push(post.Photo1);
  if (post.Photo2) photos.push(post.Photo2);
  if (post.Photo3) photos.push(post.Photo3);

  const formattedDate = new Date(post.created_at).toLocaleDateString();

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  // Inline styles for the component.
  const containerStyle = {
    display: "flex",
    background: "#f0f2f5",
    minHeight: "100vh",
  };
  const mainContentStyle = { flex: 1, padding: "20px" };
  const cardStyle = {
    maxWidth: "600px",
    margin: "20px auto",
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    overflow: "hidden",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };
  const headerStyle = {
    display: "flex",
    alignItems: "center",
    padding: "16px",
    borderBottom: "1px solid #ddd",
  };
  const avatarStyle = {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    marginRight: "12px",
  };
  const titleStyle = { padding: "16px", borderBottom: "1px solid #ddd" };
  const contentStyle = { padding: "16px" };
  const actionsStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "12px 16px",
    borderTop: "1px solid #ddd",
  };
  const voteButtonsContainerStyle = {
    display: "flex",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: "10px",
  };
  const actionButtonStyle = {
    border: "none",
    background: "none",
    cursor: "pointer",
    fontSize: "16px",
    color: "#555",
  };
  const votersStyle = {
    fontSize: "14px",
    color: "#333",
    marginTop: "5px",
    cursor: "pointer",
  };
  const commentSectionStyle = { padding: "16px", borderTop: "1px solid #ddd" };
  const commentHeaderStyle = {
    marginBottom: "12px",
    fontSize: "18px",
    fontWeight: "bold",
  };
  const commentItemStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "12px",
  };
  const commentAvatarStyle = {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    marginRight: "8px",
  };
  const commentInputContainerStyle = {
    display: "flex",
    alignItems: "center",
    marginTop: "16px",
  };
  const commentInputStyle = {
    flex: 1,
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  };
  const commentButtonStyle = {
    marginLeft: "8px",
    padding: "8px 12px",
    borderRadius: "4px",
    border: "none",
    background: "#007bff",
    color: "#fff",
    cursor: "pointer",
  };
  const scrollableStyle = {
    maxHeight: "300px",
    overflowY: "auto",
  };
  const editAreaStyle = {
    display: "flex",
    flexDirection: "column",
    marginTop: "8px",
  };
  const editButtonStyle = {
    marginTop: "4px",
    alignSelf: "flex-end",
    padding: "4px 8px",
    borderRadius: "4px",
    border: "none",
    background: "#28a745",
    color: "#fff",
    cursor: "pointer",
  };
  const cancelButtonStyle = {
    marginTop: "4px",
    alignSelf: "flex-end",
    padding: "4px 8px",
    borderRadius: "4px",
    border: "none",
    background: "#dc3545",
    color: "#fff",
    cursor: "pointer",
  };

  return (
    <HelmetProvider>
      <Helmet>
        <link rel="stylesheet" type="text/css" href="/style/style111.css" />
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
      </Helmet>
      <div style={containerStyle}>
        <SideBar />
        <div style={mainContentStyle}>
          <div style={cardStyle}>
            {photos.length > 0 && (
              <div style={{ maxHeight: "400px", overflow: "hidden" }}>
                <Slider {...sliderSettings}>
                  {photos.map((photo, index) => (
                    <div key={index}>
                      <ImageWithFallback
                        style={{ width: "100%", height: "auto" }}
                        src={`http://127.0.0.1:8000/storage/${photo}`}
                        alt={`${post.Title} - Slide ${index + 1}`}
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            )}
            <div style={headerStyle}>
              <ImageWithFallback
                style={avatarStyle}
                src={
                  post.user?.ProfilePic
                    ? `http://127.0.0.1:8000/storage/${post.user.ProfilePic}`
                    : "/Customer/pic.jpg"
                }
                alt="User Avatar"
              />
              <div style={{ marginLeft: "12px" }}>
                <div style={{ fontWeight: "bold", fontSize: "18px" }}>
                  {post.user?.name || "Unknown"}
                </div>
                <div style={{ fontSize: "14px", color: "#888" }}>
                  {formattedDate}
                </div>
              </div>
            </div>
            <div style={titleStyle}>
              <h2 style={{ margin: 0, fontSize: "22px" }}>{post.Title}</h2>
            </div>
            <div style={contentStyle}>
              <p style={{ lineHeight: "1.6", fontSize: "16px", color: "#333" }}>
                {post.Description}
              </p>
            </div>
            <div style={actionsStyle}>
              <div style={voteButtonsContainerStyle}>
                <button
                  style={{
                    ...actionButtonStyle,
                    color:
                      userVote && userVote.vote_type_id === 1 ? "blue" : "#555",
                  }}
                  onClick={() => handleVote(1)}
                >
                  <i className="fas fa-arrow-up"></i> Upvote (
                  {voteCounts.upvotes})
                </button>
                <button
                  style={{
                    ...actionButtonStyle,
                    color:
                      userVote && userVote.vote_type_id === 2 ? "red" : "#555",
                  }}
                  onClick={() => handleVote(2)}
                >
                  <i className="fas fa-arrow-down"></i> Downvote (
                  {voteCounts.downvotes})
                </button>
              </div>
              <div
                style={votersStyle}
                onClick={() => setShowVoterPopup(true)}
                title="Click to view voter list"
              >
                Voters:{" "}
                {voters && voters.length > 0
                  ? voters.map((vote) => vote.user.name).join(", ")
                  : "No voters yet."}
              </div>
            </div>
            <div style={commentSectionStyle}>
              <div style={commentHeaderStyle}>Discussions</div>
              <div className="h-100" style={scrollableStyle}>
                {comments && comments.length > 0 ? (
                  comments.map((comment, index) => (
                    <div key={index} style={commentItemStyle}>
                      <ImageWithFallback
                        style={commentAvatarStyle}
                        src={
                          comment.user?.ProfilePic
                            ? `http://127.0.0.1:8000/storage/${comment.user.ProfilePic}`
                            : `http://127.0.0.1:8000/storage/default-avatar.png`
                        }
                        alt="Comment User Avatar"
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: "bold", fontSize: "16px" }}>
                          {comment.user?.name || "Unknown"}
                        </div>
                        {editingCommentId === comment.id ? (
                          <div style={editAreaStyle}>
                            <textarea
                              value={editingCommentContent}
                              onChange={(e) =>
                                setEditingCommentContent(e.target.value)
                              }
                              style={{
                                width: "100%",
                                padding: "8px",
                                borderRadius: "4px",
                                border: "1px solid #ccc",
                              }}
                            />
                            <div>
                              <button
                                onClick={handleUpdateComment}
                                style={editButtonStyle}
                              >
                                Update
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                style={cancelButtonStyle}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div style={{ fontSize: "14px", color: "#555" }}>
                              {comment.Content}
                            </div>
                            <div style={{ fontSize: "12px", color: "#888" }}>
                              {new Date(comment.created_at).toLocaleString()}
                            </div>
                          </>
                        )}
                      </div>
                      {storedUser &&
                        comment.user?.id === storedUser.id &&
                        editingCommentId !== comment.id && (
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
                    </div>
                  ))
                ) : (
                  <div>No comments yet.</div>
                )}
              </div>
              <form
                style={commentInputContainerStyle}
                onSubmit={handleCommentSubmit}
              >
                <textarea
                  placeholder="Add a comment..."
                  style={commentInputStyle}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button style={commentButtonStyle} type="submit">
                  Post
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Render the VoterLists popup modal */}
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
