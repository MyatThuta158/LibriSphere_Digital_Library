import React from "react";
import { useNavigate } from "react-router-dom";
import "../../main.css";

function Menu() {
  const navigate = useNavigate();

  // Check if user data exists in localStorage
  const user = localStorage.getItem("user"); // Assuming "user" stores member details
  const isMember = user !== null; // If user exists, they are a member

  return (
    <div className="index-page">
      <header
        id="header"
        className="header bg-primary d-flex align-items-center fixed-top"
      >
        <div className="container-fluid container-xl position-relative d-flex align-items-center">
          <a
            href="index.html"
            className="logo d-flex align-items-center me-auto"
          >
            <img src="Customer/libraria-logo-v3.png" alt="" />
            <h1 className="sitename">LibriSphere</h1>
          </a>

          <nav id="navmenu" className="navmenu">
            <ul>
              <li>
                <a
                  className="active"
                  onClick={() => navigate("/customer/home")}
                  style={{ cursor: "pointer" }}
                >
                  Home
                </a>
              </li>
              <li>
                <a href="#about">About</a>
              </li>
              <li>
                <a
                  onClick={() => navigate("/Customer/Membership")}
                  style={{ cursor: "pointer" }}
                >
                  Membership
                </a>
              </li>
              {isMember && (
                <>
                  <li>
                    <a
                      onClick={() => navigate("/customer/resource")}
                      style={{ cursor: "pointer" }}
                    >
                      Resources
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => navigate("/customer/ResourceRequest")}
                      style={{ cursor: "pointer" }}
                    >
                      Resource Request
                    </a>
                  </li>
                  <li>
                    <a href="#contact">Contact</a>
                  </li>

                  {!isMember && (
                    <>
                      <li>
                        <a
                          onClick={() => navigate("/Customer/MemberRegister")}
                          style={{ cursor: "pointer" }}
                        >
                          Register
                        </a>
                      </li>
                      <li>
                        <a
                          onClick={() => navigate("/")}
                          style={{ cursor: "pointer" }}
                        >
                          Login
                        </a>
                      </li>
                    </>
                  )}

                  <li>
                    <a
                      onClick={() => navigate("/")}
                      style={{ cursor: "pointer" }}
                    >
                      LogOut
                    </a>
                  </li>
                </>
              )}
            </ul>
            <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
          </nav>
        </div>
      </header>
    </div>
  );
}

export default Menu;
