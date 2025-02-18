import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllMembership } from "../../../api/membershipApi"; // Assume this API function is defined in your API helper file.

function AllMembershipPlan() {
  const [membershipPlans, setMembershipPlans] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Function to fetch paginated data
  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const response = await getAllMembership(page);
      console.log(response.data);
      setMembershipPlans(response.data); // Extract the actual array
      setCurrentPage(response.current_page);
      setLastPage(response.last_page);
    } catch (error) {
      console.error("Error fetching membership plans", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  // Navigate to the update page for a membership plan
  const handleUpdate = (id) => {
    navigate(`/Admin/UpdateMemberships/${id}`);
  };

  // Pagination controls
  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < lastPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Membership Plans</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Plan Name</th>
                <th>Duration</th>
                <th>Price</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {membershipPlans.map((plan) => (
                <tr key={plan.id}>
                  <td>{plan.id}</td>
                  <td>{plan.PlanName}</td>
                  <td>{plan.Duration}</td>
                  <td>{plan.Price}</td>
                  <td>{plan.Description}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => handleUpdate(plan.id)}
                    >
                      Update
                    </button>
                    {/* Add any delete functionality as needed */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="d-flex w-50 mx-auto justify-content-center align-items-center">
            <button
              className="btn btn-secondary"
              onClick={goToPrevious}
              disabled={currentPage <= 1}
            >
              Previous
            </button>
            <span>
              {currentPage} of {lastPage}
            </span>

            <button
              className="btn btn-secondary"
              onClick={goToNext}
              disabled={currentPage >= lastPage}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default AllMembershipPlan;
