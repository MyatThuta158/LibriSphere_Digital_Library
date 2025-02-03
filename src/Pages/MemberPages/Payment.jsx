import React, { useEffect, useState, useContext } from "react";
import Menu from "./Layouts/Menu";
import { useForm } from "react-hook-form";
import { MembershipContext } from "./Context/MembershipContext";
import { getPayment } from "../../api/paymenttypeApi";
import { createMember } from "../../api/memberApi";
import { createSubscription } from "../../api/subscriptionApi";
import { useNavigate } from "react-router-dom";

function Payment() {
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [selectedPaymentType, setSelectedPaymentType] = useState(null);
  const baseUrl = import.meta.env.VITE_API_URL;
  const { userData, membershipPlan } = useContext(MembershipContext);
  const [message, setMessage] = useState();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    getPayment()
      .then((data) => {
        setPaymentTypes(data.data);
      })
      .catch((error) => {
        console.error("Error fetching payment types:", error);
      });
  }, []);

  const onSelectPayment = (paymentType) => {
    setSelectedPaymentType(paymentType);
  };

  const onCancel = () => {
    setSelectedPaymentType(null); // Reset selected payment type
  };

  const onSubmit = (data) => {
    const memberRegister = async () => {
      const memberData = new FormData();

      memberData.append("name", userData.name);
      memberData.append("email", userData.email);
      memberData.append("gender", userData.gender);
      memberData.append("password", userData.password);
      memberData.append("DateOfBirth", userData.DateOfBirth);
      memberData.append("role", "member");
      memberData.append("phone_number", userData.phone_number);

      const response = await createMember(memberData);

      if (response.status === 200) {
        const subscription = new FormData();

        // Get current date for MemberStartDate
        const currentDate = new Date();
        const formattedStartDate = currentDate.toISOString().split("T")[0];

        // Calculate MemberEndDate by adding membershipPlan duration (in months)
        const endDate = new Date(currentDate);
        endDate.setMonth(
          endDate.getMonth() + parseInt(membershipPlan.duration)
        );
        const formattedEndDate = endDate.toISOString().split("T")[0];

        subscription.append("membership_plans_id", membershipPlan.id);
        subscription.append("payment__types_id", selectedPaymentType.id);
        subscription.append("admin_id", 1);
        subscription.append("users_id", 3); // Hardcoded for now
        subscription.append("PaymentScreenShot", data.PaymentScreenShot[0]); // File input
        subscription.append("PaymentAccountName", data.PaymentAccountName);
        subscription.append("PaymentAccountNumber", data.PaymentAccountNumber);
        subscription.append("PaymentDate", formattedStartDate);
        subscription.append("MemberstartDate", formattedStartDate);
        subscription.append("MemberEndDate", formattedEndDate);

        const res = await createSubscription(subscription);

        if (res.status == 200) {
          setMessage("Account Register and subscription successfully!");
          navigate("/Customer/Home");
        }
      }

      console.log(response.status);
    };

    memberRegister();
  };

  return (
    <div>
      <Menu />
      <div className="container py-5 h-100" style={{ marginTop: "5%" }}>
        <div className="row g-4 align-item-center">
          {/* Show payment types only if none is selected */}
          {!selectedPaymentType &&
            paymentTypes.map((paymentType, index) => (
              <div
                key={index}
                className="col-md-4 col-12"
                onClick={() => onSelectPayment(paymentType)}
              >
                <div
                  className={`payment-card card text-center ${
                    selectedPaymentType?.id === paymentType.id
                      ? "border border-warning"
                      : ""
                  }`}
                  style={{ height: "20vh", cursor: "pointer" }}
                >
                  <div className="card-body d-flex align-items-center justify-content-center">
                    <h5 className="card-title">
                      {paymentType.PaymentTypeName}
                    </h5>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Payment Details (Only show if selected) */}
        {selectedPaymentType && (
          <div className="mt-5 d-flex justify-content-center">
            <div className="card p-3" style={{ width: "30vw" }}>
              <h3 className="text-center">Payment Details</h3>
              <p>
                <strong>Account Name:</strong> {selectedPaymentType.AccountName}
              </p>
              <p>
                <strong>Account Number:</strong>{" "}
                {selectedPaymentType.AccountNumber}
              </p>
              <p>
                <strong>Bank Name:</strong> {selectedPaymentType.BankName}
              </p>
              {selectedPaymentType.QR_Scan && (
                <div className="text-center">
                  <p>
                    <strong>QR Code:</strong>
                  </p>
                  <img
                    src={`${baseUrl}storage/${selectedPaymentType.QR_Scan}`}
                    alt="QR Code"
                    style={{ maxWidth: "200px", height: "auto" }}
                  />
                </div>
              )}
              {/* Cancel Button */}
              <div className="text-center mt-3">
                <button className="btn btn-danger" onClick={onCancel}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Message Alert */}
        {message && (
          <div className="alert alert-success mt-3" role="alert">
            {message}
          </div>
        )}

        {/* Form will only be shown after selecting a payment type */}
        {selectedPaymentType && (
          <div className="mt-3">
            <h3>Submit Your Payment</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label htmlFor="PaymentScreenShot" className="form-label">
                  Payment Screenshot
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="PaymentScreenShot"
                  {...register("PaymentScreenShot", {
                    required: "Screenshot is required",
                  })}
                />
                {errors.PaymentScreenShot && (
                  <span className="text-danger">
                    {errors.PaymentScreenShot.message}
                  </span>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="PaymentAccountName" className="form-label">
                  Account Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="PaymentAccountName"
                  {...register("PaymentAccountName", {
                    required: "Account Name is required",
                  })}
                />
                {errors.PaymentAccountName && (
                  <span className="text-danger">
                    {errors.PaymentAccountName.message}
                  </span>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="PaymentAccountNumber" className="form-label">
                  Account Number
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="PaymentAccountNumber"
                  {...register("PaymentAccountNumber", {
                    required: "Account Number is required",
                  })}
                />
                {errors.PaymentAccountNumber && (
                  <span className="text-danger">
                    {errors.PaymentAccountNumber.message}
                  </span>
                )}
              </div>

              <button type="submit" className="btn btn-primary">
                Submit Payment
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Payment;
