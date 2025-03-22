import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "../../main.css";
import { Ability } from "../../Authentication/PermissionForUser";

function Menu() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userName = user.name || "User Name";
  const userRole = user.role || "Admin";
  const userPic = user.profilePhoto;
  const isMember = user !== null;
  const ability = Ability();

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
            onClick={() => navigate("/")} // Example: go home on logo click
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
              {/* Example links; update them as you need */}
              <li className="nav-item">
                <a
                  className="nav-link text-white"
                  onClick={() => navigate("/Home")}
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
                      onClick={() => navigate("/Resources")}
                    >
                      RESOURCES
                    </a>
                  </li>
                  {ability.can("make", "request") && (
                    <li className="nav-item">
                      <a
                        className="nav-link text-white"
                        onClick={() => navigate("/ResourceRequest")}
                      >
                        RESOURCE REQUEST
                      </a>
                    </li>
                  )}
                  <li className="nav-item">
                    <a
                      className="nav-link text-white"
                      onClick={() => navigate("/Contact")}
                    >
                      CONTACT
                    </a>
                  </li>

                  <li>
                    {" "}
                    <div className="flex-grow-1 d-flex flex-column">
                      {/* TOP NAVBAR */}

                      {/* Expand to fill space if needed */}
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

                            {/* <li>
                              <a
                                className="dropdown-item"
                                style={{ color: "black" }}
                                onClick={() => navigate("/library/Home1")}
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
                                Go to Library
                              </a>
                            </li> */}

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
                              >
                                Log Out
                                <i className="bi bi-box-arrow-right ms-2"></i>
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </li>
                </>
              )}
              {!isMember && (
                <>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      onClick={() => navigate("/MemberRegister")}
                    >
                      REGISTER
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" onClick={() => navigate("/")}>
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
    </div>
  );
}

export default Menu;
