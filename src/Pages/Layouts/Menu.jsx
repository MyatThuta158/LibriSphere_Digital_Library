import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "../../main.css";
import { Ability } from "../../Authentication/PermissionForUser";
// Import API functions (adjust the paths as necessary)
import {
  changeDiscussionNoti,
  getNotification,
} from "../../api/notificationApi";
import { useAuth } from "../../Authentication/Auth";

function Menu() {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userName = user ? user.name : "User Name";
  const userRole = user ? user.role : "Admin";
  const userPic = user ? user.profilePhoto : null;
  const isMember = Boolean(user);
  const ability = Ability();
  const [state, setState] = useState(false);

  const { logoutUser } = useAuth();

  // State for notification count
  const [notificationCount, setNotificationCount] = useState(0);

  // Fetch the total notification count when the component mounts or state changes
  useEffect(() => {
    getNotification()
      .then((data) => {
        setNotificationCount(data.total_notifications);
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
      });
  }, [state]);

  return (
    <div>
      <header
        className="navbar mb-0 navbar-expand-lg navbar-dark"
        style={{ background: "#4e73df" }}
      >
        <div className="container-fluid">
          {/* Logo + Brand name on the left */}
          <div
            className="d-flex align-items-center"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            <img
              src="/logo.png"
              alt="Logo"
              style={{
                height: "10vh",
                marginRight: "10px",
                objectFit: "contain",
              }}
            />
            <h1 className="navbar-brand mb-0" style={{ fontSize: "1.5rem" }}>
              LIBRISPHERE
            </h1>
          </div>

          {/* Mobile toggler button */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Collapsible menu items on the right */}
          <div
            className="collapse navbar-collapse justify-content-end me-5"
            id="navbarNavDropdown"
          >
            <ul className="navbar-nav">
              <li className="nav-item">
                <a
                  className="nav-link text-white"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/library/Home")}
                >
                  HOME
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link text-white"
                  onClick={() => navigate("/About")}
                >
                  ABOUT
                </a>
              </li>
              {isMember && (
                <>
                  <li className="nav-item">
                    <a
                      className="nav-link text-white"
                      onClick={() => navigate("/library/Resource")}
                      style={{ cursor: "pointer" }}
                    >
                      RESOURCES
                    </a>
                  </li>
                  {ability.can("make", "request") && (
                    <li className="nav-item">
                      <a
                        className="nav-link text-white"
                        onClick={() => navigate("/library/ResourceRequest")}
                        style={{ cursor: "pointer" }}
                      >
                        RESOURCE REQUEST
                      </a>
                    </li>
                  )}

                  {user?.role === "community_member" && (
                    <li className="nav-item">
                      <a
                        className="nav-link text-white"
                        style={{ background: "#4e73df", cursor: "pointer" }}
                        onClick={() => navigate("/Membership")}
                      >
                        Subscription plans
                      </a>
                    </li>
                  )}

                  {userRole === "member" ||
                    userRole === "librarian" ||
                    (userRole === "manager" && (
                      <li className="nav-item">
                        <a
                          onClick={() => navigate("/announcement")}
                          className="text-white nav-link"
                          style={{ cursor: "pointer" }}
                        >
                          Announcements
                        </a>
                      </li>
                    ))}

                  {/* Community routes dropdown menu */}
                  {(userRole === "community_member" ||
                    userRole === "member") && (
                    <li className="nav-item dropdown">
                      <a
                        className="nav-link dropdown-toggle text-white"
                        id="communityDropdown"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Community
                      </a>
                      <ul
                        className="dropdown-menu"
                        aria-labelledby="communityDropdown"
                        style={{ background: "#4e73df" }}
                      >
                        <li>
                          <button
                            className="dropdown-item text-white"
                            style={{ background: "#4e73df" }}
                            onClick={() => navigate("/community/posts")}
                          >
                            Post Feed
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item text-white"
                            style={{ background: "#4e73df" }}
                            onClick={() =>
                              navigate("/community/useruploadedpost")
                            }
                          >
                            User Posts
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item text-white"
                            style={{ background: "#4e73df" }}
                            onClick={() => navigate("/community/notification")}
                          >
                            Notifications{" "}
                            {notificationCount > 0 && (
                              <span className="badge bg-danger ms-1">
                                {notificationCount}
                              </span>
                            )}
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item text-white"
                            style={{ background: "#4e73df" }}
                            onClick={() =>
                              navigate("/community/posts/postengagement")
                            }
                          >
                            Post Engagement
                          </button>
                        </li>
                      </ul>
                    </li>
                  )}

                  {/* User dropdown menu */}
                  <li>
                    <div className="flex-grow-1 d-flex flex-column">
                      {user && (
                        <div className="d-flex w-100 justify-content-end align-items-center me-2">
                          <div className="dropdown">
                            <button
                              className="btn dropdown-toggle d-flex align-items-center"
                              type="button"
                              id="userDropdown"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                              style={{
                                background: "transparent",
                                border: "none",
                              }}
                            >
                              <img
                                src={
                                  userPic
                                    ? `http://127.0.0.1:8000/storage/${userPic}`
                                    : "/Customer/pic.jpg"
                                }
                                alt="User"
                                className="img-fluid"
                                style={{
                                  borderRadius: "30px",
                                  border: "1px solid black",
                                  height: "40px",
                                  objectFit: "cover",
                                }}
                              />
                              <div className="ms-2 bg-none text-start">
                                <div
                                  style={{ fontSize: "14px" }}
                                  className="text-white"
                                >
                                  {userName}
                                </div>
                                <div
                                  className="fw-bold text-white"
                                  style={{ fontSize: "12px" }}
                                >
                                  {userRole}
                                </div>
                              </div>
                            </button>

                            {/* Dropdown menu */}
                            <ul
                              className="dropdown-menu dropdown-menu-end text-white"
                              aria-labelledby="userDropdown"
                              style={{ background: "#4e73df" }}
                            >
                              <li>
                                <button
                                  className="dropdown-item text-white"
                                  style={{ background: "#4e73df" }}
                                  onClick={() => navigate("/Admin/Profile")}
                                >
                                  <i className="bi bi-person-circle me-2"></i>
                                  Profile
                                </button>
                              </li>
                              <li>
                                <hr className="dropdown-divider" />
                              </li>
                              {(userRole === "member" ||
                                userRole === "community_member") && (
                                <>
                                  <li>
                                    <button
                                      className="dropdown-item text-white"
                                      style={{ background: "#4e73df" }}
                                      onClick={() => {
                                        changeDiscussionNoti()
                                          .then((data) => {
                                            console.log(
                                              "Notification changed:",
                                              data
                                            );
                                          })
                                          .catch((error) => {
                                            console.error(
                                              "Error changing notification:",
                                              error
                                            );
                                          });
                                        navigate("/community/notification");
                                        setState(!state);
                                      }}
                                    >
                                      <i className="bi bi-bell me-2"></i>
                                      Notifications{" "}
                                      {notificationCount > 0 && (
                                        <span className="badge bg-danger ms-1">
                                          {notificationCount}
                                        </span>
                                      )}
                                    </button>
                                  </li>
                                  <li>
                                    <hr className="dropdown-divider" />
                                  </li>
                                </>
                              )}
                              <li>
                                <a
                                  className="dropdown-item text-white"
                                  style={{ color: "black" }}
                                  onClick={() => navigate("/community/posts")}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-door-closed me-2"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M3 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v13h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3zm1 13h8V2H4z" />
                                    <path d="M9 9a1 1 0 1 0 2 0 1 1 0 0 0-2 0" />
                                  </svg>
                                  Go to Community
                                </a>
                              </li>
                              <li>
                                <hr className="dropdown-divider" />
                              </li>
                              <li>
                                <button
                                  className="dropdown-item text-white"
                                  style={{ background: "#4e73df" }}
                                  onClick={() => logoutUser()}
                                >
                                  Log Out
                                  <i className="bi bi-box-arrow-right ms-2"></i>
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </li>
                </>
              )}
              {!isMember && (
                <>
                  <li className="nav-item">
                    <a
                      style={{ cursor: "pointer" }}
                      className="nav-link"
                      onClick={() => navigate("/UserRegister")}
                    >
                      REGISTER
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate("/")}
                    >
                      LOGIN
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </header>

      {/* Renders whatever nested routes are inside */}
      <Outlet />

      <footer
        id="footer"
        className="footer text-white"
        style={{ backgroundColor: "#4e73df" }}
      >
        <div className="container footer-top">
          <div className="row gy-4">
            {/* About Section */}
            <div className="col-lg-4 col-md-6 footer-about">
              <a
                onClick={() => navigate("/")}
                className="logo d-flex align-items-center"
                style={{ cursor: "pointer" }}
              >
                <span className="sitename text-white">LibriSphere</span>
              </a>
              <div className="footer-contact pt-3">
                <p>Yangon Street</p>
                <p>Myanmar, MY 535022</p>
                <p className="mt-3">
                  <strong>Phone:</strong> <span>09289282782</span>
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  <span>LibriSphere123@example.com</span>
                </p>
              </div>
              <div className="social-links text-white d-flex mt-4">
                <a href="" className="text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-facebook text-white"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
                  </svg>
                </a>

                <a href="" className="text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-twitter-x"
                    viewBox="0 0 16 16"
                  >
                    <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
                  </svg>
                </a>
                <a href="" className="text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-youtube"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z" />
                  </svg>
                </a>
                <a href="" className="text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-instagram text-white"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Navigation Links Column */}
            <div className="col-lg-2 col-md-3 footer-links text-white">
              <h4 className="text-white">Navigation</h4>
              <ul>
                <li>
                  <i className="bi bi-chevron-right"></i>
                  <a
                    onClick={() => navigate("/")}
                    className="text-white"
                    style={{ cursor: "pointer" }}
                  >
                    Home
                  </a>
                </li>

                {(userRole === "community_member" ||
                  userRole === "member" ||
                  ability.can("view", "community")) && (
                  <li>
                    <i className="bi bi-chevron-right"></i>
                    <a
                      onClick={() => navigate("/community/posts")}
                      className="text-white"
                      style={{ cursor: "pointer" }}
                    >
                      Post Feeds
                    </a>
                  </li>
                )}
                {isMember && (
                  <>
                    <li>
                      <i className="bi bi-chevron-right"></i>
                      <a
                        onClick={() => navigate("/Resources")}
                        className="text-white"
                        style={{ cursor: "pointer" }}
                      >
                        Resources
                      </a>
                    </li>
                    {ability.can("make", "request") && (
                      <li>
                        <i className="bi bi-chevron-right"></i>
                        <a
                          onClick={() => navigate("/ResourceRequest")}
                          className="text-white"
                          style={{ cursor: "pointer" }}
                        >
                          Resource Request
                        </a>
                      </li>
                    )}

                    {userRole === "member" ||
                      userRole === "librarian" ||
                      (userRole === "manager" && (
                        <li>
                          <i className="bi bi-chevron-right"></i>
                          <a
                            onClick={() => navigate("/announcement")}
                            className="text-white"
                            style={{ cursor: "pointer" }}
                          >
                            Announcements
                          </a>
                        </li>
                      ))}

                    {userRole === "community_member" && (
                      <li>
                        <i className="bi bi-chevron-right"></i>
                        <a
                          onClick={() => navigate("/Membership")}
                          className="text-white"
                          style={{ cursor: "pointer" }}
                        >
                          Subscription Plans
                        </a>
                      </li>
                    )}
                  </>
                )}
              </ul>
            </div>

            {/* Useful Links Column */}
            <div className="col-lg-2 col-md-3 footer-links">
              <h4 className="text-white">Useful Links</h4>
              <ul>
                <li>
                  <i className="bi bi-chevron-right"></i>
                  <a
                    onClick={() => navigate("/services")}
                    className="text-white"
                    style={{ cursor: "pointer" }}
                  >
                    About us
                  </a>
                </li>
                <li>
                  <i className="bi bi-chevron-right"></i>
                  <a
                    onClick={() => navigate("/terms")}
                    className="text-white"
                    style={{ cursor: "pointer" }}
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <i className="bi bi-chevron-right"></i>
                  <a
                    onClick={() => logoutUser()}
                    className="text-white"
                    style={{ cursor: "pointer" }}
                  >
                    Logout
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter / Info Column */}
            <div className="col-lg-4 col-md-12 footer-newsletter">
              <h4 className="text-white text-uppercase">LibriSphere</h4>
              <p className="text-white">
                LibriSphere is the new digital library platform that connects
                other readers and book lovers. It is a place where you can find
                variety of digital resources and connect with other readers.
              </p>
              {/* Optionally, add your subscription form here */}
            </div>
          </div>
        </div>

        <div className="container copyright text-center mt-4">
          <p>
            © <span>Copyright</span>{" "}
            <strong className="px-1 sitename">LibriSphere</strong>{" "}
            <span>All Rights Reserved</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Menu;
