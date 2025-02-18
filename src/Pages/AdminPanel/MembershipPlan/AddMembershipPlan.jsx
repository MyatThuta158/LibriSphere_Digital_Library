import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { createMembership } from "../../../api/membershipApi";

function AddMembershipPlan() {
  const [message, setMessage] = useState(""); // State for feedback message
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    const submit = async () => {
      try {
        console.log(data);
        const response = await createMembership(data);
        if (response.status == 200) {
          setMessage("Data submitted successfully!"); // Success message
          reset();
        } else {
          setMessage("Failed to submit data. Please try again."); // Failure message
        }
      } catch (error) {
        setMessage("An error occurred. Please try again."); // Error message if the API call fails
      }
    };

    submit();
  };

  const handleCloseMessage = () => {
    setMessage(""); // Close the message by clearing the state
  };
  return (
    <div>
      <div className="container w-50 mx-auto mt-5">
        <h2 className="text-center">Subscription Plan Form</h2>
        {message && (
          <div
            className="mt-3 alert alert-info alert-dismissible fade show"
            role="alert"
          >
            {message}
            <button
              type="button"
              className="close"
              data-dismiss="alert"
              aria-label="Close"
              onClick={handleCloseMessage}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-md-6 form-group">
              <label htmlFor="planName">Plan Name</label>

              <input
                type="text"
                className={`form-control ${
                  errors.PlanName ? "is-invalid" : ""
                }`}
                id="planName"
                {...register("PlanName", { required: "Plan Name is required" })}
                placeholder="Enter the name of the plan."
              />
              {errors.PlanName && (
                <div className="invalid-feedback">
                  {errors.PlanName.message}
                </div>
              )}
            </div>
            <div className="col-md-6 form-group">
              <label htmlFor="duration">Duration</label>
              <input
                type="text"
                className={`form-control ${
                  errors.Duration ? "is-invalid" : ""
                }`}
                id="duration"
                {...register("Duration", { required: "Duration is required" })}
                placeholder="Enter the duration."
              />
              {errors.Duration && (
                <div className="invalid-feedback">
                  {errors.Duration.message}
                </div>
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 form-group">
              <label htmlFor="price">Price ($)</label>
              <input
                type="number"
                className={`form-control ${errors.Price ? "is-invalid" : ""}`}
                id="price"
                {...register("Price", { required: "Price is required" })}
                step="0.01"
                placeholder="Enter the price in decimal format"
              />
              {errors.Price && (
                <div className="invalid-feedback">{errors.Price.message}</div>
              )}
            </div>
            <div className="col-md-6 form-group">
              <label htmlFor="description">Description</label>
              <textarea
                className={`form-control ${
                  errors.Description ? "is-invalid" : ""
                }`}
                id="description"
                {...register("Description", {
                  required: "Description is required",
                })}
                rows="3"
                placeholder="Enter a brief description of the plan."
              ></textarea>
              {errors.Description && (
                <div className="invalid-feedback">
                  {errors.Description.message}
                </div>
              )}
            </div>
          </div>
          <button type="submit" className="btn btn-primary mt-3">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddMembershipPlan;
