import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Assume these API functions are defined in your API helper file.
import { deletePayment, allPaymentTypes } from "../../../api/paymenttypeApi";

function AllPayment_Types() {
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Function to fetch paginated data
  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const response = await allPaymentTypes(page);
      console.log(response.data);
      // Adjusted for the expected API response structure:
      setPaymentTypes(response.data); // Extract the actual array
      setCurrentPage(response.current_page);
      setLastPage(response.last_page);
    } catch (error) {
      console.error("Error fetching payment types", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  console.log(currentPage);
  // console.log(paymentTypes);

  // Delete a payment type and refresh the data
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this payment type?")) {
      try {
        const response = await deletePayment(id);
        if (response.status === 200) {
          fetchData(currentPage);
        }
      } catch (error) {
        console.error("Delete failed", error);
      }
    }
  };

  // Navigate to the update page for a payment type
  const handleUpdate = (id) => {
    navigate(`/Admin/UpdatePaymentTypes/${id}`);
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
      <h2>Payment Types</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Payment Type Name</th>
                <th>Account Name</th>
                <th>Account Number</th>
                <th>Bank Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paymentTypes.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.id}</td>
                  <td>{payment.PaymentTypeName}</td>
                  <td>{payment.AccountName}</td>
                  <td>{payment.AccountNumber}</td>
                  <td>{payment.BankName}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => handleUpdate(payment.id)}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(payment.id)}
                    >
                      Delete
                    </button>
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

export default AllPayment_Types;
