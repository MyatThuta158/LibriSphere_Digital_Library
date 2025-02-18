import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { getEachPayment, updatePaymentType } from "../../../api/paymenttypeApi";

function UpdatePayment_Type() {
  const { id } = useParams();
  const navigate = useNavigate(); // Initialize navigation
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState("");

  useEffect(() => {
    async function fetchPayment() {
      try {
        const response = await getEachPayment(id);
        if (response.status === 200) {
          const data = response.data;
          setValue("PaymentTypeName", data.PaymentTypeName);
          setValue("AccountName", data.AccountName);
          setValue("AccountNumber", data.AccountNumber);
          setValue("BankName", data.BankName);
        } else {
          setAlertType("danger");
          setAlertMessage("Unable to fetch payment type data.");
        }
      } catch (error) {
        setAlertType("danger");
        setAlertMessage("An error occurred while fetching payment type data.");
      } finally {
        setLoading(false);
      }
    }
    fetchPayment();
  }, [id, setValue]);

  const onSubmit = (data) => {
    const submit = async () => {
      const formData = new FormData();
      formData.append("PaymentTypeName", data.PaymentTypeName);
      formData.append("AccountName", data.AccountName);
      formData.append("AccountNumber", data.AccountNumber);
      formData.append("BankName", data.BankName);

      if (data.QR_Scan && data.QR_Scan[0]) {
        formData.append("QR_Scan", data.QR_Scan[0]);
      }
      if (data.BankLogo && data.BankLogo[0]) {
        formData.append("BankLogo", data.BankLogo[0]);
      }

      try {
        const response = await updatePaymentType(id, formData);
        if (response.status === 200) {
          setAlertType("success");
          setAlertMessage(
            response.message || "Payment type updated successfully."
          );

          // Wait 5 seconds before navigating back
          setTimeout(() => {
            navigate(-1);
          }, 900);
        } else {
          setAlertType("danger");
          setAlertMessage(
            response.message ||
              "An error occurred while updating the payment type."
          );
        }
      } catch (error) {
        setAlertType("danger");
        setAlertMessage(error.message || "An unexpected error occurred.");
      }
    };

    submit();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container w-75 mx-auto mt-5">
      <h2 className="text-center mb-4">Update Payment Type Form</h2>

      {alertMessage && (
        <div
          className={`alert alert-${alertType} alert-dismissible fade show`}
          role="alert"
        >
          {alertMessage}
          <button
            type="button"
            className="close"
            onClick={() => setAlertMessage(null)}
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="paymentTypeName">Payment Type Name</label>
            <input
              type="text"
              id="paymentTypeName"
              placeholder="Enter the payment type name."
              className={`form-control ${
                errors.PaymentTypeName ? "is-invalid" : ""
              }`}
              {...register("PaymentTypeName", {
                required: "Payment Type Name is required",
              })}
            />
            {errors.PaymentTypeName && (
              <div className="invalid-feedback">
                {errors.PaymentTypeName.message}
              </div>
            )}
          </div>

          <div className="form-group col-md-6">
            <label htmlFor="accountName">Account Name</label>
            <input
              type="text"
              id="accountName"
              placeholder="Enter the account name."
              className={`form-control ${
                errors.AccountName ? "is-invalid" : ""
              }`}
              {...register("AccountName", {
                required: "Account Name is required",
              })}
            />
            {errors.AccountName && (
              <div className="invalid-feedback">
                {errors.AccountName.message}
              </div>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="accountNumber">Account Number</label>
            <input
              type="text"
              id="accountNumber"
              placeholder="Enter the account number."
              className={`form-control ${
                errors.AccountNumber ? "is-invalid" : ""
              }`}
              {...register("AccountNumber", {
                required: "Account Number is required",
              })}
            />
            {errors.AccountNumber && (
              <div className="invalid-feedback">
                {errors.AccountNumber.message}
              </div>
            )}
          </div>

          <div className="form-group col-md-6">
            <label htmlFor="bankName">Bank Name</label>
            <input
              type="text"
              id="bankName"
              placeholder="Enter the bank name."
              className={`form-control ${errors.BankName ? "is-invalid" : ""}`}
              {...register("BankName", { required: "Bank Name is required" })}
            />
            {errors.BankName && (
              <div className="invalid-feedback">{errors.BankName.message}</div>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="qrScan">QR Code Image</label>
            <input
              type="file"
              id="qrScan"
              className={`form-control ${errors.QR_Scan ? "is-invalid" : ""}`}
              {...register("QR_Scan")}
            />
          </div>

          <div className="form-group col-md-6">
            <label htmlFor="bankLogo">Bank Logo Image</label>
            <input
              type="file"
              id="bankLogo"
              className={`form-control ${errors.BankLogo ? "is-invalid" : ""}`}
              {...register("BankLogo")}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-block">
          Update
        </button>
      </form>
    </div>
  );
}

export default UpdatePayment_Type;
