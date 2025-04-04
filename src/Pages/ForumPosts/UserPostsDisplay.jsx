import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { showUseruploadedPost } from "../../api/forumpostApi"; // Adjust the import path as needed
import { getSubscriptionDate } from "../../api/subscriptionApi"; // Import your subscription API call

function UserPostsDisplay() {
  const [userPosts, setUserPosts] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [loading, setLoading] = useState(true);

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
    const fetchData = async () => {
      // Retrieve user from local storage first
      const localUser = JSON.parse(localStorage.getItem("user"));
      if (localUser) {
        setUserInfo(localUser);
      }

      // If no user info is found, stop further API calls
      if (!localUser || !localUser.id) {
        setLoading(false);
        return;
      }

      const userId = localUser.id;

      // console.log("Role".localUser.role);
      // Fetch subscription information only if the user role is "member"
      if (localUser.role === "member") {
        console.log("enter");
        const subscriptionResponse = await getSubscriptionDate(userId);

        console.log(subscriptionResponse);
        setSubscriptionInfo(subscriptionResponse.data);
      }

      try {
        // Fetch user posts
        const postsResponse = await showUseruploadedPost(userId);
        if (postsResponse.success) {
          setUserPosts(postsResponse.data);
        } else {
          setUserPosts([]);
        }
      } catch (err) {
        // On error, simply set posts as empty without displaying an error message.
        setUserPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handler for updating profile (for demonstration purposes)
  const handleProfileUpdate = () => {
    console.log("Update Profile Clicked");
    // Insert your profile update logic here (e.g., open a modal)
  };

  // Render the user profile card (inspired by your AdminProfile design)
  const renderProfileCard = () => {
    if (!userInfo) return null;
    return (
      <div className="card shadow mx-auto mb-4" style={{ maxWidth: "600px" }}>
        <div className="card-header text-center">
          <h4>User Profile</h4>
        </div>
        <div className="card-body">
          <div className="d-flex align-items-center mb-3">
            <img
              src={
                userInfo.ProfilePic
                  ? `http://127.0.0.1:8000/storage/${userInfo.ProfilePic}`
                  : "/Customer/pic.jpg"
              }
              alt="Profile"
              className="rounded-circle me-3"
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
              }}
            />
            <div>
              <h5 className="mb-0">{userInfo.name}</h5>
              <small className="text-muted">{userInfo.role}</small>
            </div>
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <strong>Email:</strong> {userInfo.email}
            </li>
            <li className="list-group-item">
              <strong>Phone:</strong> {userInfo.phone_number}
            </li>
            <li className="list-group-item">
              <strong>DOB:</strong> {userInfo.DateOfBirth}
            </li>
          </ul>
        </div>
        <div className="card-footer d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleProfileUpdate}
          >
            Update Profile
          </button>
        </div>
      </div>
    );
  };

  // Render the subscription information card
  const renderSubscriptionCard = () => {
    if (!subscriptionInfo) return null;
    return (
      <div className="card shadow mx-auto mb-4" style={{ maxWidth: "600px" }}>
        <div className="card-header text-center">
          <h4>Subscription Details</h4>
        </div>
        <div className="card-body text-center">
          <p className="card-text">
            <strong>Subscription ID:</strong> {subscriptionInfo.subscription_id}{" "}
            <br />
            <strong>Membership Plan:</strong>{" "}
            {subscriptionInfo.membership_plan_name} <br />
            <strong>Start Date:</strong> {subscriptionInfo.subscribed_date}{" "}
            <br />
            <strong>End Date:</strong> {subscriptionInfo.subscription_end_date}{" "}
            <br />
            <strong>Days Left:</strong> {subscriptionInfo.days_left}{" "}
            {subscriptionInfo.days_left > 0 ? "days" : "day"}
          </p>
        </div>
      </div>
    );
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container my-5">
      {/* Always render the profile card */}
      {renderProfileCard()}

      {/* Display subscription card only for members */}
      {userInfo && userInfo.role === "member" && renderSubscriptionCard()}

      {/* User Posts Section */}
      <div className="row">
        {userPosts.length > 0 ? (
          userPosts.map((post) => (
            <div key={post.ForumPostId} className="col-md-6 mb-4">
              <div className="card h-100 shadow">
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
                    Posted on: {new Date(post.created_at).toLocaleDateString()}
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
                            vote.vote_type.VoteType.toLowerCase() === "downvote"
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
          ))
        ) : (
          <div className="col-12 text-center">
            <h5>No uploaded posts</h5>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserPostsDisplay;
