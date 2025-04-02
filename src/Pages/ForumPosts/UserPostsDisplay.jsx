import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Ensure you have react-router-dom installed
import { showUseruploadedPost } from "../../api/forumpostApi"; // Adjust the import path as needed

function UserPostsDisplay() {
  const [userPosts, setUserPosts] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to render truncated text with a clickable "see more" link if needed
  const renderTruncatedText = (text, postId, wordLimit = 20) => {
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    return (
      <>
        {words.slice(0, wordLimit).join(" ")}{" "}
        <Link to={`/community/postdetail/${postId}`} style={{ color: "blue" }}>
          see more
        </Link>
      </>
    );
  };

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        // Retrieve user from local storage and get the user id
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user.id;
        if (!userId) throw new Error("User id not found in local storage");

        // Await the API call and store the result in a variable
        const data = await showUseruploadedPost(userId);
        if (data.success) {
          const posts = data.data;
          setUserPosts(posts);
          // Use the first post's user info (assuming they're all the same)
          if (posts.length > 0) setUserInfo(posts[0].user);
        } else {
          throw new Error("Failed to fetch posts");
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, []);

  const handleProfileUpdate = () => {
    console.log("Update Profile Clicked");
    // Insert your profile update logic here (e.g., open a modal)
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error)
    return (
      <div className="alert alert-danger text-center mt-5">
        Error: {error.message}
      </div>
    );

  return (
    <div>
      <div className="d-flex">
        {/* <SideBar /> */}
        <div className="container mt-5">
          {userInfo && (
            <div className="card w-50 mx-auto p-5 mb-4">
              <div className="card-body text-center">
                <img
                  src={`http://127.0.0.1:8000/storage/${userInfo.ProfilePic}`}
                  alt={userInfo.name}
                  className="rounded-circle mb-3"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
                <h4 className="card-title">{userInfo.name}</h4>
                <p className="card-text">
                  Email: {userInfo.email} <br />
                  Phone: {userInfo.phone_number} <br />
                  DOB: {userInfo.DateOfBirth}
                </p>
                <button
                  onClick={handleProfileUpdate}
                  className="btn btn-primary"
                >
                  Update Profile
                </button>
              </div>
            </div>
          )}

          <div className="row">
            {userPosts.map((post) => (
              <div key={post.ForumPostId} className="col-md-6 mb-4">
                <div className="card h-100">
                  {post.Photo1 && (
                    <img
                      src={`http://127.0.0.1:8000/storage/${post.Photo1}`}
                      alt={post.Title}
                      className="card-img-top"
                      style={{ maxHeight: "300px", objectFit: "cover" }}
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{post.Title}</h5>
                    <p className="card-text">
                      {renderTruncatedText(post.Description, post.ForumPostId)}
                    </p>
                    <small className="text-muted">
                      Posted on:{" "}
                      {new Date(post.created_at).toLocaleDateString()}
                    </small>
                  </div>

                  <div className="card-footer d-flex justify-content-between align-items-center">
                    <div>
                      <span className="me-3">
                        <i className="fas fa-thumbs-up"></i> Upvotes:{" "}
                        {
                          post.votes.filter(
                            (vote) =>
                              vote.vote_type &&
                              vote.vote_type.VoteType.toLowerCase() === "upvote"
                          ).length
                        }
                      </span>
                      <span className="me-3">
                        <i className="fas fa-thumbs-down"></i> Downvotes:{" "}
                        {
                          post.votes.filter(
                            (vote) =>
                              vote.vote_type &&
                              vote.vote_type.VoteType.toLowerCase() ===
                                "downvote"
                          ).length
                        }
                      </span>
                      <span className="me-3">
                        <i className="fas fa-comments"></i> Discussions:{" "}
                        {post.discussions_count || 0}
                      </span>
                    </div>
                    <div className="text-end">
                      <Link
                        to={`/community/postdetail/${post.ForumPostId}`}
                        className="btn btn-primary"
                      >
                        Detail
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPostsDisplay;
