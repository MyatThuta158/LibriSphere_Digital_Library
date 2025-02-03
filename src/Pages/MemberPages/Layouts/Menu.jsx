import React from "react";
import "../../../main.css";
import { useNavigate } from "react-router-dom";

function Menu() {
  const navigate = useNavigate();
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
                  href="#hero"
                  className="active"
                  onClick={() => {
                    navigate("/customer/home");
                  }}
                >
                  Home
                </a>
              </li>
              <li>
                <a href="#about">About</a>
              </li>
              <li>
                <a
                  href="#services"
                  onClick={() => {
                    navigate("/Customer/Membership");
                  }}
                >
                  Membership
                </a>
              </li>
              <li>
                <a
                  href="#portfolio"
                  onClick={() => {
                    navigate("/customer/resource");
                  }}
                >
                  Resources
                </a>
              </li>
              <li>
                <a href="#team">Announcement</a>
              </li>
              {/* <li className="dropdown">
                <a href="#">
                  <span>Dropdown</span>{" "}
                  <i className="bi bi-chevron-down toggle-dropdown"></i>
                </a>
                <ul>
                  <li>
                    <a href="#">Dropdown 1</a>
                  </li>
                  <li className="dropdown">
                    <a href="#">
                      <span>Deep Dropdown</span>{" "}
                      <i className="bi bi-chevron-down toggle-dropdown"></i>
                    </a>
                    <ul>
                      <li>
                        <a href="#">Deep Dropdown 1</a>
                      </li>
                      <li>
                        <a href="#">Deep Dropdown 2</a>
                      </li>
                      <li>
                        <a href="#">Deep Dropdown 3</a>
                      </li>
                      <li>
                        <a href="#">Deep Dropdown 4</a>
                      </li>
                      <li>
                        <a href="#">Deep Dropdown 5</a>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a href="#">Dropdown 2</a>
                  </li>
                  <li>
                    <a href="#">Dropdown 3</a>
                  </li>
                  <li>
                    <a href="#">Dropdown 4</a>
                  </li>
                </ul>
              </li> */}
              <li>
                <a href="#contact">Contact</a>
              </li>
            </ul>
            <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
          </nav>

          {/* <a className="cta-btn" href="index.html#about">
            Change Forum
          </a> */}
          <div
            onClick={() => {
              navigate("/Customer/MemberRegister");
            }}
            className="cta-btn"
            href="index.html#about"
            style={{ cursor: "pointer" }}
          >
            Register Member
          </div>
        </div>
      </header>
    </div>
  );
}

export default Menu;
