import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getSinglePosts } from "../../api/forumpostApi";
import { uploadDiscussion, showAlldiscussions } from "../../api/discussionApi";
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
      // Assuming your votes are inside the 'voters' property:
      const votesArray = votersData.voters;
      console.log("Voter array", votesArray);

      // Log each vote's user id.
      votesArray.forEach((vote, index) => {
        console.log(`User Vote ${index + 1}:`, vote.user.id);
      });

      // Set the voters state with the array.
      setVoters(votesArray);

      if (storedUser) {
        // Find the vote record for the current user using the nested user.id.
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

  // Handle vote actions: voteTypeId should be 1 (upvote) or 2 (downvote).
  const handleVote = async (voteTypeId) => {
    if (!storedUser) return; // Only logged in users can vote

    if (userVote) {
      if (userVote.vote_type_id === voteTypeId) {
        try {
          const response = await deleteVote({
            user_id: storedUser.id,
            ForumPostId: id,
          });

          console.log(response);
          setUserVote(null);
          updateVoteCounts();
          updateVotes();
        } catch (err) {
          console.error("Error removing vote:", err);
        }
        return;
      } else {
        // Update vote if changing from one type to the other.
        try {
          const response = await updateVote({
            user_id: storedUser.id,
            ForumPostId: id,
            vote_type_id: voteTypeId,
          });
          // Update the current user's vote using the returned vote object.
          setUserVote(response.vote);
          await updateVoteCounts();
          await updateVotes();
        } catch (err) {
          console.error("Error updating vote:", err);
        }
      }
    } else {
      // Post a new vote if none exists.
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
  const votersStyle = { fontSize: "14px", color: "#333", marginTop: "5px" };
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
                      <img
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
              <img
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
              <div style={votersStyle}>
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
                      <img
                        style={commentAvatarStyle}
                        src={
                          comment.user?.ProfilePic
                            ? `http://127.0.0.1:8000/storage/${comment.user.ProfilePic}`
                            : `http://127.0.0.1:8000/storage/default-avatar.png`
                        }
                        alt="Comment User Avatar"
                      />
                      <div>
                        <div style={{ fontWeight: "bold", fontSize: "16px" }}>
                          {comment.user?.name || "Unknown"}
                        </div>
                        <div style={{ fontSize: "14px", color: "#555" }}>
                          {comment.Content}
                        </div>
                        <div style={{ fontSize: "12px", color: "#888" }}>
                          {new Date(comment.created_at).toLocaleString()}
                        </div>
                      </div>
                      {storedUser?.id === comment.user?.id && (
                        <div style={{ marginLeft: "auto" }}>
                          <button
                            style={actionButtonStyle}
                            onClick={() => handleUpdateComment(comment.id)}
                          >
                            {/* TODO: Add edit icon and functionality */}
                          </button>
                          <button
                            style={actionButtonStyle}
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            {/* TODO: Add delete icon and functionality */}
                          </button>
                        </div>
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
    </HelmetProvider>
  );
}

export default PostDetail;
