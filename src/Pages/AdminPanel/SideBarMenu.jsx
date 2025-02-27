import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

function SideBarMenu() {
  const navigate = useNavigate();

  // Toggle states for each dropdown group
  const [authorsOpen, setAuthorsOpen] = useState(false);
  const [genreOpen, setGenreOpen] = useState(false);
  const [membershipOpen, setMembershipOpen] = useState(false);
  const [resourceOpen, setResourceOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);
  const [requestResourceOpen, setRequestResourceOpen] = useState(false);
  const [paymentType, setPaymenttype] = useState(false);

  return (
    <>
      {/* Inline CSS */}
      <style>{`
        /* Fixed and scrollable sidebar */
        .navbar-nav.sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 250px;
          overflow-y: auto;
          overflow-x: hidden;
          background: #4e73df; /* Example background matching "bg-gradient-primary" */
        }
        /* Ensure the main content is shifted to the right */
        #content-wrapper {
          margin-left: 250px;
        }
        /* Dropdown Button styling */
        .dropdown-btn {
          background: none;
          border: none;
          color: inherit;
          width: 100%;
          text-align: left;
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
        }
        .dropdown-btn:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        .dropdown-container {
          list-style: none;
          padding-left: 1.5rem;
        }
        .dropdown-item {
          background: none;
          border: none;
          color: #fff;
          text-align: left;
          padding: 0.5rem 0;
          width: 100%;
          cursor: pointer;
        }
        .dropdown-item:hover {
          text-decoration: underline;
        }
        .sidebar-heading {
          padding: 0.75rem 1rem;
          font-size: 0.85rem;
          text-transform: uppercase;
          color: #ced4da;
        }
        /* Dropdown icon styling */
        .dropdown-icon {
          margin-left: auto;
        }
      `}</style>

      <div id="wrapper">
        {/* Sidebar */}
        <ul
          className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
          id="accordionSidebar"
        >
          {/* Sidebar Brand */}
          <li className="nav-item">
            <a
              className="sidebar-brand d-flex align-items-center justify-content-center"
              href="index.html"
            >
              <div className="sidebar-brand-icon rotate-n-15">
                <i className="fas fa-laugh-wink"></i>
              </div>
              <div className="sidebar-brand-text mx-3">
                LibriSphere <sup>Admin Panel</sup>
              </div>
            </a>
          </li>

          <hr className="sidebar-divider my-0" />

          {/* Dashboard */}
          <li className="nav-item active">
            <a className="nav-link" href="index.html">
              <i className="fas fa-fw fa-tachometer-alt"></i>
              <span>Dashboard</span>
            </a>
          </li>

          <hr className="sidebar-divider" />

          {/* ======= Author Dropdown ======= */}
          <div className="sidebar-heading">Author</div>
          <li className="nav-item">
            <button
              className="nav-link dropdown-btn"
              onClick={() => setAuthorsOpen(!authorsOpen)}
            >
              <i className="fas fa-fw fa-cog"></i>
              <span>
                Authors{" "}
                {authorsOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi float-end me-4 bi-caret-up-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi float-end me-4 bi-caret-down-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                  </svg>
                )}
              </span>
            </button>
            {authorsOpen && (
              <ul className="dropdown-container">
                <li>
                  <button
                    className="dropdown-item p-2"
                    onClick={() => navigate("/Admin/ViewAuthors")}
                  >
                    View Authors
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item p-2"
                    onClick={() => navigate("/Admin/AddAuthors")}
                  >
                    Add Authors
                  </button>
                </li>
              </ul>
            )}
          </li>

          <hr className="sidebar-divider" />

          {/* ======= Genre Dropdown ======= */}
          <div className="sidebar-heading">Genre</div>
          <li className="nav-item">
            <button
              className="nav-link dropdown-btn"
              onClick={() => setGenreOpen(!genreOpen)}
            >
              <i className="fas fa-fw fa-book"></i>
              <span>
                Genre
                {genreOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi float-end me-4 bi-caret-up-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi float-end me-4 bi-caret-down-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                  </svg>
                )}
              </span>
            </button>
            {genreOpen && (
              <ul className="dropdown-container">
                <li>
                  <button
                    className="dropdown-item p-2"
                    onClick={() => navigate("/Admin/AddGenre")}
                  >
                    Add Genre
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item p-2"
                    onClick={() => navigate("/Admin/ViewGenre")}
                  >
                    View Genre
                  </button>
                </li>
              </ul>
            )}
          </li>

          <hr className="sidebar-divider" />

          {/* ======= Resource Dropdown ======= */}
          <div className="sidebar-heading">Resource</div>
          <li className="nav-item">
            <button
              className="nav-link dropdown-btn "
              onClick={() => setResourceOpen(!resourceOpen)}
            >
              <i className="fas fa-fw fa-folder"></i>
              <span>
                Resource{" "}
                {resourceOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi float-end me-4 bi-caret-up-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi float-end me-4 bi-caret-down-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                  </svg>
                )}
              </span>
            </button>
            {resourceOpen && (
              <ul className="dropdown-container">
                <li>
                  <button
                    className="dropdown-item p-2"
                    onClick={() => navigate("/Admin/ViewResource")}
                  >
                    View Resources
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item p-2"
                    onClick={() => navigate("/Admin/AddResource")}
                  >
                    Add Resources
                  </button>
                </li>
              </ul>
            )}
          </li>

          <hr className="sidebar-divider" />

          {/* ======= Membership Dropdown ======= */}
          <div className="sidebar-heading">Membership</div>
          <li className="nav-item">
            <button
              className="nav-link dropdown-btn"
              onClick={() => setMembershipOpen(!membershipOpen)}
            >
              <i className="fas fa-fw fa-user-check"></i>
              <span>
                Membership
                {membershipOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi float-end me-4 bi-caret-up-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi float-end me-4 bi-caret-down-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                  </svg>
                )}
              </span>
            </button>

            {membershipOpen && (
              <ul className="dropdown-container">
                <li>
                  <button
                    className="dropdown-item p-2"
                    onClick={() => navigate("/Admin/AddMemberships")}
                  >
                    Add Membership
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item p-2"
                    onClick={() => navigate("/Admin/AllMemberships")}
                  >
                    All Memberships
                  </button>
                </li>
              </ul>
            )}
          </li>

          <hr className="sidebar-divider" />

          {/* ======= Admin Dropdown ======= */}
          <div className="sidebar-heading">Admin</div>
          <li className="nav-item">
            <button
              className="nav-link dropdown-btn"
              onClick={() => setAdminOpen(!adminOpen)}
            >
              <i className="fas fa-fw fa-user-shield"></i>
              <span>
                Admin{" "}
                {adminOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi float-end me-4 bi-caret-up-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi float-end me-4 bi-caret-down-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                  </svg>
                )}
              </span>
            </button>
            {adminOpen && (
              <ul className="dropdown-container">
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/Admin/RegisterAdmin")}
                  >
                    Register Admin
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/Admin/ViewAdmins")}
                  >
                    View Admins
                  </button>
                </li>
              </ul>
            )}
          </li>

          <hr className="sidebar-divider" />

          {/* ======= Report Dropdown ======= */}
          <div className="sidebar-heading">Report</div>
          <li className="nav-item">
            <button
              className="nav-link dropdown-btn"
              onClick={() => setReportOpen(!reportOpen)}
            >
              <i className="fas fa-fw fa-chart-area"></i>
              <span>
                Report{" "}
                {reportOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi float-end me-4 bi-caret-up-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi float-end me-4 bi-caret-down-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                  </svg>
                )}
              </span>
            </button>
            {reportOpen && (
              <ul className="dropdown-container">
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/Admin/NewMemberReport")}
                  >
                    New Member
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/Admin/MembershipRevenue")}
                  >
                    Membership Revenue
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/Admin/SubscriptionReport")}
                  >
                    SubscriptioinReport
                  </button>
                </li>
              </ul>
            )}
          </li>

          <hr className="sidebar-divider" />

          {/* ======= Subscription Dropdown ======= */}
          <div className="sidebar-heading">Subscription</div>
          <li className="nav-item">
            <button
              className="nav-link dropdown-btn"
              onClick={() => setSubscriptionOpen(!subscriptionOpen)}
            >
              <i className="fas fa-fw fa-money-check-alt"></i>
              <span>
                Subscription{" "}
                {subscriptionOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi float-end me-4 bi-caret-up-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi float-end me-4 bi-caret-down-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                  </svg>
                )}
              </span>
            </button>
            {subscriptionOpen && (
              <ul className="dropdown-container">
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/Admin/ViewPayments")}
                  >
                    View Payments
                  </button>
                </li>
              </ul>
            )}
          </li>

          <hr className="sidebar-divider" />

          {/* ======= Payment type Dropdown ======= */}
          <div className="sidebar-heading">Payment Type</div>
          <li className="nav-item">
            <button
              className="nav-link dropdown-btn"
              onClick={() => setPaymenttype(!paymentType)}
            >
              <i className="fas fa-fw fa-envelope"></i>
              <span>
                Payment Type{" "}
                {paymentType ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi float-end me-4 bi-caret-up-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi float-end me-4 bi-caret-down-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                  </svg>
                )}
              </span>
            </button>
            {paymentType && (
              <ul className="dropdown-container">
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/Admin/AddPaymentTypes")}
                  >
                    Add Payment Type
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/Admin/AllPaymentTypes")}
                  >
                    All PaymentTypes
                  </button>
                </li>
              </ul>
            )}
          </li>

          <hr className="sidebar-divider" />

          {/* ======= Request Resource Dropdown ======= */}
          <div className="sidebar-heading">Request Resource</div>
          <li className="nav-item">
            <button
              className="nav-link dropdown-btn"
              onClick={() => setRequestResourceOpen(!requestResourceOpen)}
            >
              <i className="fas fa-fw fa-envelope"></i>
              <span>
                Request Resource{" "}
                {requestResourceOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi float-end me-4 bi-caret-up-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi float-end me-4 bi-caret-down-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                  </svg>
                )}
              </span>
            </button>
            {requestResourceOpen && (
              <ul className="dropdown-container">
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/Admin/ViewResourceRequest")}
                  >
                    Requests
                  </button>
                </li>
              </ul>
            )}
          </li>
        </ul>
        {/* End Sidebar */}

        {/* Main Content Wrapper */}
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            {/* Topbar */}
            <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
              <button
                id="sidebarToggleTop"
                className="btn btn-link d-md-none rounded-circle mr-3"
              >
                <i className="fa fa-bars"></i>
              </button>
            </nav>
            {/* Main Page Content */}
            <div className="container-fluid">
              <Outlet />
            </div>
          </div>
          {/* Footer */}
          <footer className="sticky-footer bg-white">
            <div className="container my-auto">
              <div className="copyright text-center my-auto">
                <span>Copyright &copy; LibriSphere 2025</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}

export default SideBarMenu;
