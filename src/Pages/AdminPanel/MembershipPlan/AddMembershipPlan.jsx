import React from "react";
import { useForm } from "react-hook-form";
import { createMembership } from "../../../api/membershipApi";

function AddMembershipPlan() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    const submit = async () => {
      const response = await createMembership(data);
      console.log(response.message);
    };

    submit();

    // reset();
  };

  return (
    <div>
      <div className="container w-50 mx-auto mt-5">
        <h2 className="text-center">Subscription Plan Form</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="planName">Plan Name</label>
            <input
              type="text"
              className={`form-control ${errors.PlanName ? "is-invalid" : ""}`}
              id="planName"
              {...register("PlanName", { required: "Plan Name is required" })}
              placeholder="Enter the name of the plan."
            />
            {errors.PlanName && (
              <div className="invalid-feedback">{errors.PlanName.message}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="duration">Duration</label>
            <input
              type="text"
              className={`form-control ${errors.Duration ? "is-invalid" : ""}`}
              id="duration"
              {...register("Duration", { required: "Duration is required" })}
              placeholder="Enter the duration."
            />
            {errors.Duration && (
              <div className="invalid-feedback">{errors.Duration.message}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="price">Price</label>
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

          <div className="form-group">
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

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddMembershipPlan;
