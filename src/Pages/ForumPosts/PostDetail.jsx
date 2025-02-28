import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getSinglePosts } from "../../api/forumpostApi";
import SideBar from "./Layout/SideBar";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Slider from "react-slick"; // slider library

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Format the creation date for display
  const formattedDate = new Date(post.created_at).toLocaleDateString();

  // Slider settings for react-slick
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  // Inline styles for layout and design
  const containerStyle = {
    display: "flex",
    background: "#f0f2f5",
    minHeight: "100vh",
  };

  const mainContentStyle = {
    flex: 1,
    padding: "20px",
  };

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

  const titleStyle = {
    padding: "16px",
    borderBottom: "1px solid #ddd",
  };

  const contentStyle = {
    padding: "16px",
  };

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

  const commentSectionStyle = {
    padding: "16px",
    borderTop: "1px solid #ddd",
  };

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
                  post.user.ProfilePic
                    ? `http://127.0.0.1:8000/storage/${post.user.ProfilePic}`
                    : "/Customer/pic.jpg"
                }
                alt="User Avatar"
              />
              <div style={{ marginLeft: "12px" }}>
                <div style={{ fontWeight: "bold", fontSize: "18px" }}>
                  {post.user.name}
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
              <div style={commentHeaderStyle}>Comments</div>
              {/* Sample comment item */}
              <div style={commentItemStyle}>
                <img
                  style={commentAvatarStyle}
                  src={`http://127.0.0.1:8000/storage/default-avatar.png`}
                  alt="Comment User Avatar"
                />
                <div>
                  <div style={{ fontWeight: "bold", fontSize: "16px" }}>
                    Jane Doe
                  </div>
                  <div style={{ fontSize: "14px", color: "#555" }}>
                    This is a sample comment.
                  </div>
                </div>
              </div>
              {/* Comment input */}
              <div style={commentInputContainerStyle}>
                <input
                  type="text"
                  placeholder="Add a comment..."
                  style={commentInputStyle}
                />
                <button style={commentButtonStyle}>Post</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
}

export default PostDetail;
