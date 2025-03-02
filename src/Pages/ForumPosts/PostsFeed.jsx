import React, { useEffect, useState } from "react";
import SideBar from "./Layout/SideBar";
import { Helmet, HelmetProvider } from "react-helmet-async";
import InfiniteScroll from "react-infinite-scroll-component";
import { getPosts, uploadPost } from "../../api/forumpostApi";
import { useNavigate } from "react-router-dom";

function PostsFeed() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;
  const navigate = useNavigate();

  // Use a refresh counter to trigger a re-fetch when a new post is created
  const [refreshCount, setRefreshCount] = useState(0);

  // Modal state for creating a post
  const [showModal, setShowModal] = useState(false);
  const [postForm, setPostForm] = useState({
    Title: "",
    Description: "",
    Photo1: null,
    Photo2: null,
    Photo3: null,
  });

  // Upload status messages
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState("");

  // Simulated current user; replace with actual auth data as needed
  const currentUser = {
    name: "John Doe",
    ProfilePic: null,
  };

  // When refreshCount changes, reset posts & pagination and fetch posts
  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshCount]);

  const fetchPosts = async () => {
    try {
      const response = await getPosts({ page, limit });
      if (response.success) {
        const paginatedData = response.data;
        const newPosts = paginatedData.data.filter((post) => post.user); // Filter out posts without a user

        setPosts((prevPosts) => [...prevPosts, ...newPosts]);

        if (paginatedData.current_page < paginatedData.last_page) {
          setPage(paginatedData.current_page + 1);
        } else {
          setHasMore(true);
        }
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // Modal handlers
  const openModal = () => {
    setUploadMessage("");
    setUploadError("");
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setPostForm((prev) => ({ ...prev, [name]: files[0] }));
  };

  // Retrieve user info from local storage
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user.id;

  const handleFormSubmit = async (e) => {
    setRefreshCount(0);
    e.preventDefault();
    setUploadMessage("");
    setUploadError("");

    const formData = new FormData();
    formData.append("UserId", userId);
    formData.append("Title", postForm.Title);
    formData.append("Description", postForm.Description);
    if (postForm.Photo1) formData.append("Photo1", postForm.Photo1);
    if (postForm.Photo2) formData.append("Photo2", postForm.Photo2);
    if (postForm.Photo3) formData.append("Photo3", postForm.Photo3);

    try {
      const response = await uploadPost(formData);
      console.log(response);
      if (response.success) {
        // Increment the refresh counter to trigger the useEffect to re-fetch posts
        setRefreshCount(1);
        setUploadMessage("Post uploaded successfully!");

        // Reset form state
        setPostForm({
          Title: "",
          Description: "",
          Photo1: null,
          Photo2: null,
          Photo3: null,
        });

        // Optionally close the modal after a short delay
        setTimeout(() => {
          closeModal();
          setUploadMessage("");
        }, 1500);
      } else {
        setUploadError("Failed to upload post.");
      }
    } catch (error) {
      console.error("Error uploading post:", error);
      setUploadError("Error uploading post.");
    }
  };

  const baseStorageUrl = "http://127.0.0.1:8000/storage";

  const styles = {
    pageSection: {
      display: "flex",
      background: "#f0f2f5",
      minHeight: "100vh",
    },
    mainContent: {
      flex: 1,
      padding: "20px",
      marginLeft: "20px",
    },
    container: {
      maxWidth: "800px",
      margin: "0 auto",
    },
    // Facebook-style Create Post Box
    createPostButton: {
      width: "100%",
      padding: "14px 20px",
      background: "#fff",
      borderRadius: "8px",
      boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
      border: "1px solid #ddd",
      cursor: "pointer",
      marginBottom: "20px",
      textAlign: "left",
      fontSize: "1rem",
      color: "#65676b",
      display: "flex",
      alignItems: "center",
    },
    // Modal overlay
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0,0,0,0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      padding: "20px",
    },
    modalContainer: {
      background: "#fff",
      borderRadius: "10px",
      width: "100%",
      maxWidth: "600px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
      overflow: "hidden",
    },
    modalHeader: {
      padding: "16px",
      borderBottom: "1px solid #ddd",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    modalHeaderTitle: {
      fontSize: "1.25rem",
      fontWeight: "bold",
      color: "#050505",
    },
    modalCloseButton: {
      background: "none",
      border: "none",
      fontSize: "1.5rem",
      cursor: "pointer",
      color: "#65676b",
    },
    modalBody: {
      padding: "16px",
    },
    modalUserSection: {
      display: "flex",
      alignItems: "center",
      marginBottom: "16px",
    },
    modalUserAvatar: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      objectFit: "cover",
      marginRight: "10px",
    },
    modalTextArea: {
      width: "100%",
      border: "none",
      resize: "none",
      fontSize: "1rem",
      outline: "none",
    },
    // Additional file inputs styling
    fileInputGroup: {
      marginBottom: "16px",
    },
    fileInputLabel: {
      display: "block",
      marginBottom: "8px",
      fontWeight: "600",
      color: "#555",
    },
    fileInput: {
      width: "100%",
      padding: "8px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      fontSize: "1rem",
    },
    modalFooter: {
      padding: "16px",
      borderTop: "1px solid #ddd",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    modalFooterButton: {
      background: "#1877f2",
      border: "none",
      color: "#fff",
      padding: "10px 20px",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold",
    },
    // Photo upload label style
    photoUploadLabel: {
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      color: "#1877f2",
      fontSize: "0.9rem",
    },
    photoUploadInput: {
      display: "none",
    },
    // Styles for post cards (existing feed)
    postCard: {
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      marginBottom: "20px",
      overflow: "hidden",
      border: "1px solid #ddd",
    },
    postHeader: {
      display: "flex",
      alignItems: "center",
      padding: "16px",
    },
    avatar: {
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      marginRight: "10px",
      objectFit: "cover",
    },
    userInfo: {
      display: "flex",
      flexDirection: "column",
    },
    userName: {
      fontWeight: "bold",
      fontSize: "1rem",
      marginBottom: "4px",
    },
    date: {
      fontSize: "0.8rem",
      color: "#666",
    },
    bannerImage: {
      width: "100%",
      height: "300px",
      objectFit: "cover",
    },
    postContent: {
      padding: "16px",
    },
    postTitle: {
      fontSize: "1.25rem",
      fontWeight: "bold",
      marginBottom: "8px",
      cursor: "pointer",
    },
    postDescription: {
      fontSize: "1rem",
      lineHeight: "1.5",
      color: "#555",
      marginBottom: "16px",
    },
    readMore: {
      fontSize: "0.9rem",
      color: "#1877f2",
      cursor: "pointer",
      textDecoration: "none",
      fontWeight: "bold",
    },
    // Message styles
    messageSuccess: {
      color: "green",
      marginBottom: "16px",
      fontWeight: "bold",
    },
    messageError: {
      color: "red",
      marginBottom: "16px",
      fontWeight: "bold",
    },
  };

  // Function to truncate post descriptions
  const truncateDescription = (description, postId) => {
    const words = description.split(" ");
    if (words.length > 20) {
      return (
        <>
          {words.slice(0, 20).join(" ")}...{" "}
          <span
            style={styles.readMore}
            onClick={() => navigate(`/community/postdetail/${postId}`)}
          >
            See More
          </span>
        </>
      );
    }
    return description;
  };

  return (
    <HelmetProvider>
      
      <section style={styles.pageSection}>
        <SideBar />
        <div style={styles.mainContent} className="main-content">
          <div style={styles.container} className="container">
            {/* Facebook-style Create Post Box */}
            <div style={styles.createPostButton} onClick={openModal}>
              <img
                src={
                  currentUser.ProfilePic
                    ? `${baseStorageUrl}/${currentUser.ProfilePic}`
                    : "/Customer/pic.jpg"
                }
                alt="User Avatar"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  marginRight: "10px",
                  objectFit: "cover",
                }}
              />
              What's on your mind, {currentUser.name}?
            </div>

            {/* Modal for Creating a Post */}
            {showModal && (
              <div style={styles.modalOverlay}>
                <div style={styles.modalContainer}>
                  <div style={styles.modalHeader}>
                    <span style={styles.modalHeaderTitle}>Create Post</span>
                    <button
                      style={styles.modalCloseButton}
                      onClick={closeModal}
                    >
                      &times;
                    </button>
                  </div>
                  <div style={styles.modalBody}>
                    <div style={styles.modalUserSection}>
                      <img
                        src={
                          currentUser.ProfilePic
                            ? `${baseStorageUrl}/${currentUser.ProfilePic}`
                            : "/Customer/pic.jpg"
                        }
                        alt="User Avatar"
                        style={styles.modalUserAvatar}
                      />
                      <textarea
                        style={styles.modalTextArea}
                        placeholder={`What's on your mind, ${currentUser.name}?`}
                        name="Description"
                        value={postForm.Description}
                        onChange={handleInputChange}
                      />
                    </div>
                    {/* Optional Title Input */}
                    <div style={{ marginBottom: "16px" }}>
                      <input
                        type="text"
                        placeholder="Title (optional)"
                        name="Title"
                        value={postForm.Title}
                        onChange={handleInputChange}
                        style={{
                          width: "100%",
                          padding: "10px",
                          border: "1px solid #ddd",
                          borderRadius: "6px",
                          fontSize: "1rem",
                        }}
                      />
                    </div>
                    {/* File inputs */}
                    <div style={styles.fileInputGroup}>
                      <label style={styles.fileInputLabel}>
                        Upload Photo 1
                      </label>
                      <input
                        type="file"
                        name="Photo1"
                        accept="image/*"
                        style={styles.fileInput}
                        onChange={handleFileChange}
                      />
                    </div>
                    <div style={styles.fileInputGroup}>
                      <label style={styles.fileInputLabel}>
                        Upload Photo 2
                      </label>
                      <input
                        type="file"
                        name="Photo2"
                        accept="image/*"
                        style={styles.fileInput}
                        onChange={handleFileChange}
                      />
                    </div>
                    <div style={styles.fileInputGroup}>
                      <label style={styles.fileInputLabel}>
                        Upload Photo 3
                      </label>
                      <input
                        type="file"
                        name="Photo3"
                        accept="image/*"
                        style={styles.fileInput}
                        onChange={handleFileChange}
                      />
                    </div>
                    {/* Display messages */}
                    {uploadMessage && (
                      <div style={styles.messageSuccess}>{uploadMessage}</div>
                    )}
                    {uploadError && (
                      <div style={styles.messageError}>{uploadError}</div>
                    )}
                    <div style={styles.modalFooter}>
                      <button
                        style={styles.modalFooterButton}
                        onClick={handleFormSubmit}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <InfiniteScroll
              dataLength={posts.length}
              next={fetchPosts}
              hasMore={hasMore}
              loader={<h4>Loading...</h4>}
              endMessage={
                <p style={{ textAlign: "center" }}>
                  <b>No more posts</b>
                </p>
              }
            >
              {posts.map((post, index) => {
                const postImage = post.Photo1
                  ? `${baseStorageUrl}/${post.Photo1}`
                  : "https://via.placeholder.com/800x300/cccccc/000000?text=No+Image";
                return (
                  <div
                    key={`${post.ForumPostId}-${index}`}
                    style={styles.postCard}
                  >
                    <div style={styles.postHeader}>
                      <img
                        src={
                          post.user.ProfilePic
                            ? `${baseStorageUrl}/${post.user.ProfilePic}`
                            : "/Customer/pic.jpg"
                        }
                        alt="User Avatar"
                        style={styles.avatar}
                      />
                      <div style={styles.userInfo}>
                        <div style={styles.userName}>
                          {post.user.name || "Anonymous"}
                        </div>
                        <div style={styles.date}>
                          {new Date(post.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <img
                      src={postImage}
                      alt={post.Title}
                      style={styles.bannerImage}
                    />
                    <div style={styles.postContent}>
                      <h2
                        style={styles.postTitle}
                        onClick={() =>
                          navigate(`/community/postdetail/${post.ForumPostId}`)
                        }
                      >
                        {post.Title}
                      </h2>
                      <p style={styles.postDescription}>
                        {truncateDescription(
                          post.Description,
                          post.ForumPostId
                        )}
                      </p>
                    </div>
                    <div style={{ padding: "0 16px 16px" }}>
                      <span
                        style={styles.readMore}
                        onClick={() =>
                          navigate(`/community/postdetail/${post.ForumPostId}`)
                        }
                      >
                        Read More →
                      </span>
                    </div>
                  </div>
                );
              })}
            </InfiniteScroll>
          </div>
        </div>
      </section>
    </HelmetProvider>
  );
}

export default PostsFeed;
