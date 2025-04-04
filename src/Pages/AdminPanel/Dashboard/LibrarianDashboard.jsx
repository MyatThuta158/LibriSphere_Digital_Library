import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLibrarian } from "../../../api/dashboardApi"; // your promise-based API call

function LibrarianDashboard() {
  const [dashboardData, setDashboardData] = useState({
    pendingSubscriptions: 0,
    totalResources: 0,
    pendingBookRequests: 0,
    subscriptions: [],
  });
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Adjust items per page as needed
  const navigate = useNavigate();

  // Fetch the dashboard data when the component mounts
  useEffect(() => {
    getLibrarian()
      .then((data) => {
        setDashboardData(data);
      })
      .catch((error) => {
        console.error("Error fetching librarian dashboard data:", error);
      });
  }, []);

  // Filter the subscriptions based on PaymentStatus
  const filteredSubscriptions = dashboardData.subscriptions.filter((sub) =>
    statusFilter
      ? sub.PaymentStatus?.toLowerCase() === statusFilter.toLowerCase()
      : true
  );

  // Calculate total pages and slice current subscriptions for client-side pagination
  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);
  const currentSubscriptions = filteredSubscriptions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Update filter and reset pagination to page 1
  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  // Handle the "Detail" action button click based on PaymentStatus
  const handleAction = (sub) => {
    if (sub.PaymentStatus === "Rejected") {
      navigate(`/Admin/RejectDetailSubscriptions/${sub.id}`);
    } else if (sub.PaymentStatus === "Approved") {
      navigate(`/Admin/AcceptDetailSubscriptions/${sub.id}`);
    } else if (sub.PaymentStatus === "Resubmit") {
      navigate(`/Admin/Subscription/Resubmit/${sub.id}`);
    } else {
      // For pending, active, or any other status
      navigate(`/Admin/DetailSubscriptions/${sub.id}`);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Librarian Dashboard
      </h2>

      {/* 
        --- BEGIN Count Boxes Section ---
        Replace your existing "d-flex justify-center space-x-6 mb-6" 
        section with the following:
      */}
      <div className="d-flex w-100 justify-content-center ">
        {/* Pending Subscriptions */}
        <div
          className=" shadow px-5 rounded-md flex flex-col  w-full md:w-1/3 mx-1 my-2 py-5 bg-warning"
          style={{ width: "20vw", borderRadius: "15px" }}
        >
          <span
            className="fw-bold fs-5 text-white"
            style={{ textAlign: "left" }}
          >
            Pending Subscriptions
          </span>
          <div
            className="text-blue-600 text-2xl font-bold text-white"
            style={{ fontSize: "2rem" }}
          >
            {dashboardData.pendingSubscriptions}
          </div>
        </div>

        <div
          className=" shadow px-5 rounded-md flex flex-col  w-full md:w-1/3  my-2 py-5 bg-primary"
          style={{ width: "20vw", borderRadius: "15px" }}
        >
          <span
            className="fw-bold fs-5 text-white"
            style={{ textAlign: "left" }}
          >
            Total users
          </span>
          <div
            className="text-blue-600 font-bold text-white"
            style={{ fontSize: "2rem" }}
          >
            {dashboardData.totalUsers}
          </div>
        </div>

        {/* Total Resources */}
        <div
          className=" shadow rounded-md p-5 flex flex-col items-center justify-center w-full md:w-1/3 mx-1 my-2 p-4"
          style={{
            width: "20vw",
            backgroundColor: "#4e73df",
            borderRadius: "15px",
          }}
        >
          <span className="text-gray-700 text-sm text-white">
            Total Resources
          </span>
          <div
            className="text-blue-600 text-2xl font-bold text-white"
            style={{ fontSize: "2rem" }}
          >
            {dashboardData.totalResources}
          </div>
        </div>

        {/* Pending Book Requests */}
        <div
          className="bg-info shadow rounded-md p-5 flex flex-col items-center justify-center w-full md:w-1/3 mx-1 my-2 p-4"
          style={{ width: "20vw", borderRadius: "15px" }}
        >
          <span className="text-gray-700 text-sm text-white">
            Pending Book Requests
          </span>
          <div
            className="text-blue-600 text-2xl font-bold text-white"
            style={{ fontSize: "2rem" }}
          >
            {dashboardData.pendingBookRequests}
          </div>
        </div>
      </div>
      {/* 
        --- END Count Boxes Section ---
      */}

      {/* Filter Dropdown */}
      <div className="mb-4">
        <label className="mr-2 font-medium">Filter by Payment Status:</label>
        <select
          className="form-select w-auto inline-block"
          value={statusFilter}
          onChange={handleFilterChange}
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Resubmit">Resubmit</option>
          <option value="active">Active</option>
        </select>
      </div>

      {/* Subscription Data Table */}
      {filteredSubscriptions.length === 0 ? (
        <div className="text-center text-gray-500 py-4">
          {statusFilter
            ? `No subscriptions found for "${statusFilter}" status.`
            : "No subscriptions found."}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full w-full px-5 mx-auto bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">ID Invoice</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Member</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Payment Type</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentSubscriptions.map((sub) => (
                  <tr key={sub.id} className="border-b border-gray-200">
                    <td className="px-4 py-3">{`#${sub.id}`}</td>
                    <td className="px-4 py-3">{sub.PaymentDate || "N/A"}</td>
                    <td className="px-4 py-3 flex items-center">
                      <img
                        src={sub.user?.ProfilePic || "/Customer/pic.jpg"}
                        alt="Profile"
                        style={{ width: "5vw", height: "10vh" }}
                        className="rounded-full mr-3"
                      />
                      <div>
                        <p className="font-medium">{sub.user?.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">{sub.user?.email || "N/A"}</td>
                    <td className="px-4 py-3">
                      {sub.payment_type?.PaymentTypeName || "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 badge rounded-full text-sm ${
                          sub.PaymentStatus === "pending"
                            ? "bg-yellow-200 text-yellow-800"
                            : sub.PaymentStatus === "Approved"
                            ? "bg-green-200 text-green-800"
                            : sub.PaymentStatus === "Rejected"
                            ? "bg-red-200 text-red-800"
                            : sub.PaymentStatus === "Resubmit"
                            ? "bg-blue-200 text-blue-800"
                            : sub.PaymentStatus === "active"
                            ? "bg-purple-200 text-purple-800"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {sub.PaymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {sub.PaymentStatus === "Rejected" ? (
                        <button
                          className="btn btn-danger px-4"
                          onClick={() => handleAction(sub)}
                        >
                          Reject Detail
                        </button>
                      ) : sub.PaymentStatus === "Approved" ? (
                        <button
                          className="btn btn-success px-4"
                          onClick={() => handleAction(sub)}
                        >
                          Accept Detail
                        </button>
                      ) : sub.PaymentStatus === "Resubmit" ? (
                        <button
                          className="btn btn-info px-4"
                          onClick={() => handleAction(sub)}
                        >
                          Resubmit Detail
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary px-4"
                          onClick={() => handleAction(sub)}
                        >
                          Detail
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div
            className="flex justify-center mt-4"
            style={{ width: "30%", margin: "0 auto" }}
          >
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 mx-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 mx-1">
              {`Page ${currentPage} of ${totalPages}`}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 mx-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default LibrarianDashboard;
