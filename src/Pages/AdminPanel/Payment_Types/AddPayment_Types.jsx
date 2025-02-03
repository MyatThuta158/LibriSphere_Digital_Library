import React from "react";
import { useForm } from "react-hook-form";
import { createPayment } from "../../../api/paymenttypeApi";

function AddPayment_Type() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const onSubmit = (data) => {
    const submit = async () => {
      // Create a FormData object to handle the file upload
      const formData = new FormData();

      // Append all other form data
      formData.append("PaymentTypeName", data.PaymentTypeName);
      formData.append("AccountName", data.AccountName);
      formData.append("AccountNumber", data.AccountNumber);
      formData.append("BankName", data.BankName);

      // Append the QR Scan file
      if (data.QR_Scan[0]) {
        formData.append("QR_Scan", data.QR_Scan[0]);
      }

      // Call the API with the form data
      const response = await createPayment(formData);
      console.log(response.message);

      if (response.status == 200) {
        reset();
      }
    };

    submit();
  };

  return (
    <div>
      <div className="container w-50 mx-auto mt-5">
        <h2 className="text-center">Payment Type Form</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="paymentTypeName">Payment Type Name</label>
            <input
              type="text"
              className={`form-control ${
                errors.PaymentTypeName ? "is-invalid" : ""
              }`}
              id="paymentTypeName"
              {...register("PaymentTypeName", {
                required: "Payment Type Name is required",
              })}
              placeholder="Enter the payment type name."
            />
            {errors.PaymentTypeName && (
              <div className="invalid-feedback">
                {errors.PaymentTypeName.message}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="accountName">Account Name</label>
            <input
              type="text"
              className={`form-control ${
                errors.AccountName ? "is-invalid" : ""
              }`}
              id="accountName"
              {...register("AccountName", {
                required: "Account Name is required",
              })}
              placeholder="Enter the account name."
            />
            {errors.AccountName && (
              <div className="invalid-feedback">
                {errors.AccountName.message}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="accountNumber">Account Number</label>
            <input
              type="text"
              className={`form-control ${
                errors.AccountNumber ? "is-invalid" : ""
              }`}
              id="accountNumber"
              {...register("AccountNumber", {
                required: "Account Number is required",
              })}
              placeholder="Enter the account number."
            />
            {errors.AccountNumber && (
              <div className="invalid-feedback">
                {errors.AccountNumber.message}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="bankName">Bank Name</label>
            <input
              type="text"
              className={`form-control ${errors.BankName ? "is-invalid" : ""}`}
              id="bankName"
              {...register("BankName", { required: "Bank Name is required" })}
              placeholder="Enter the bank name."
            />
            {errors.BankName && (
              <div className="invalid-feedback">{errors.BankName.message}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="qrScan">QR Code Image</label>
            <input
              type="file"
              className={`form-control ${errors.QR_Scan ? "is-invalid" : ""}`}
              id="qrScan"
              {...register("QR_Scan", {
                required: "QR Code Image is required",
              })}
            />
            {errors.QR_Scan && (
              <div className="invalid-feedback">{errors.QR_Scan.message}</div>
            )}
          </div>

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddPayment_Type;
