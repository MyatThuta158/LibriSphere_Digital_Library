import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getSinglePosts } from "../../api/forumpostApi";
import { uploadDiscussion, showAlldiscussions } from "../../api/discussionApi";
import SideBar from "./Layout/SideBar";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Slider from "react-slick"; // slider library

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]); // list of discussion comments
  const [newComment, setNewComment] = useState(""); // new comment input
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [flag, setFlag] = useState(false);

  // Get current user from localStorage (ensure it’s available throughout the component)
  const storedUser = JSON.parse(localStorage.getItem("user"));

  // Fetch the post data
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

  // Fetch all discussions related to the forum post using your showAlldiscussions function
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await showAlldiscussions(id);
        // Assume your response is like { discussions: [...] }
        if (res.discussions) {
          setComments(res.discussions);
        } else {
          setComments([]);
        }
      } catch (err) {
        console.error("Error fetching discussions:", err);
      }
    };

    fetchComments();
  }, [id, flag, comments]);

  // Process to upload discussion (comment)
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return;
    try {
      // Data to send with the discussion upload
      const data = {
        ForumPostId: id,
        Content: newComment,
        UserId: storedUser.id,
      };

      // Await the response from the promise-based uploadDiscussion
      const response = await uploadDiscussion(data);
      console.log(response);

      // Get the new discussion from the response
      const newDiscussion = response.discussion;

      if (newDiscussion) {
        // If the discussion doesn't include a user object, add one using the current user's info.
        if (!newDiscussion.user) {
          newDiscussion.user = {
            name: storedUser.name || "Unknown",
            ProfilePic: storedUser.ProfilePic || null,
          };
        }
        // Update the comment list with the new discussion
        setComments((prevComments) => [...prevComments, newDiscussion]);
        setFlag(true);
      }
      // Clear the comment input field
      setNewComment("");
    } catch (err) {
      console.error("Error uploading discussion:", err);
    }
  };

  if (loading) {
    return <div>Loading post...</div>;
  }

  if (error) {
    return <div>Error loading post: {error.message}</div>;
  }

  // Build an array of photos if available
  const photos = [];
  if (post.Photo1) photos.push(post.Photo1);
  if (post.Photo2) photos.push(post.Photo2);
  if (post.Photo3) photos.push(post.Photo3);

  // Format the creation date for display in the post header
  const formattedDate = new Date(post.created_at).toLocaleDateString();

  // Slider settings for react-slick
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  // Inline styles for layout and design (omitted for brevity)
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
    justifyContent: "space-around",
    padding: "12px 16px",
    borderTop: "1px solid #ddd",
  };
  const actionButtonStyle = {
    border: "none",
    background: "none",
    cursor: "pointer",
    fontSize: "16px",
    color: "#555",
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
    maxHeight: "300px", // adjust the height as needed
    overflowY: "auto",
  };

  return (
    <HelmetProvider>
      <Helmet>
        {/* Include react-slick styles */}
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
        {/* Sidebar remains on the left */}
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
              <button style={actionButtonStyle}>
                <i className="fas fa-heart"></i> Like
              </button>
              <button style={actionButtonStyle}>
                <i className="fas fa-comment"></i> Comment
              </button>
              <button style={actionButtonStyle}>
                <i className="fas fa-share"></i> Share
              </button>
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

                      {/* Show icons if logged-in user owns the comment */}
                      {storedUser?.id === comment.user?.id && (
                        <div style={{ marginLeft: "auto" }}>
                          <button
                            style={actionButtonStyle}
                            onClick={() => handleUpdateComment(comment.id)}
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
                          <button
                            style={actionButtonStyle}
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-trash3"
                              viewBox="0 0 16 16"
                            >
                              <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                            </svg>
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
