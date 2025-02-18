import React, { useEffect, useState, useContext } from "react";
import Menu from "./Layouts/Menu";
import { useForm } from "react-hook-form";
import { MembershipContext } from "./Context/MembershipContext";
import { getPayment } from "../../api/paymenttypeApi";
import { changeRole, createMember } from "../../api/memberApi";
import { createSubscription } from "../../api/subscriptionApi";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import IsSystemUser from "../../CustomHook/IsSystemUser";

function Payment() {
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [selectedPaymentType, setSelectedPaymentType] = useState(null);
  const baseUrl = import.meta.env.VITE_API_URL;
  const { userId, membershipPlan } = useContext(MembershipContext);
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

    const { isMember } = IsSystemUser();

    if (!isMember) {
      navigate("/Customer/MemberRegister");
    }
  }, []);

  const onSelectPayment = (paymentType) => {
    setSelectedPaymentType(paymentType);
  };

  const onCancel = () => {
    setSelectedPaymentType(null); // Reset selected payment type
  };

  const onSubmit = (data) => {
    const memberRegister = async () => {
      const getStorageId = JSON.parse(localStorage.getItem("user"));

      const idMember = getStorageId.id;

      // console.log("Storage Id", idMember);
      // console.log("User Id", userId);

      const memberId = userId ? userId : idMember;

      // console.log("Member Id", memberId);
      const subscription = new FormData();

      // Get current date for MemberStartDate
      const currentDate = new Date();
      const formattedStartDate = currentDate.toISOString().split("T")[0];

      // Calculate MemberEndDate by adding membershipPlan duration (in months)
      const endDate = new Date(currentDate);
      endDate.setMonth(endDate.getMonth() + parseInt(membershipPlan.duration));
      const formattedEndDate = endDate.toISOString().split("T")[0];

      subscription.append("membership_plans_id", membershipPlan.id);
      subscription.append("payment__types_id", selectedPaymentType.id);
      // subscription.append("admin_id", null);
      subscription.append("users_id", memberId); // Hardcoded for now
      subscription.append("PaymentScreenShot", data.PaymentScreenShot[0]); // File input
      subscription.append("PaymentAccountName", data.PaymentAccountName);
      subscription.append("PaymentAccountNumber", data.PaymentAccountNumber);
      subscription.append("PaymentDate", formattedStartDate);
      subscription.append("MemberstartDate", formattedStartDate);
      subscription.append("MemberEndDate", formattedEndDate);

      const res = await createSubscription(subscription);

      if (res.status == 200) {
        const updateMember = {
          role: "member",
          userId: memberId,
        };

        // Update User's Role after successful payment
        const updateRoleRes = await changeRole(updateMember);

        if (updateRoleRes.status === 200) {
          setMessage("Account Register and subscription successfully!");
          console.log("User role updated successfully!");
          navigate("/Customer/Home");
        } else {
          console.error("Failed to update user role");
        }
      }

      console.log(res);
      console.log(res.status);
    };

    memberRegister();
  };

  return (
    <div>
      <Menu />
      <div className="container py-5 mt-5">
        <div className="row g-4 align-items-center">
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
          <div className="mt-5">
            <div className="row justify-content-center">
              <div className="col-md-6 col-12">
                <div className="card p-3">
                  <h3 className="text-center">Payment Details</h3>
                  <p>
                    <strong>Account Name:</strong>{" "}
                    {selectedPaymentType.AccountName}
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
                        className="img-fluid"
                        style={{ maxWidth: "200px" }}
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
