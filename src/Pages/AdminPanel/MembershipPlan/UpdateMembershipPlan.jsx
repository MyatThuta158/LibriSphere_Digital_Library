import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import {
  getMembershipPlan,
  updateMembershipPlan,
} from "../../../api/membershipApi";

function UpdateMembershipPlan() {
  const { id } = useParams();
  console.log(id);
  const navigate = useNavigate();
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
    async function fetchMembershipPlan() {
      try {
        const response = await getMembershipPlan(id);
        console.log("Member", response);
        if (response.status === 200) {
          const data = response.data;
          setValue("PlanName", data.PlanName);
          setValue("Duration", data.Duration);
          setValue("Price", data.Price);
          setValue("Description", data.Description);
        } else {
          setAlertType("danger");
          setAlertMessage("Unable to fetch membership plan data.");
        }
      } catch (error) {
        setAlertType("danger");
        setAlertMessage(
          "An error occurred while fetching membership plan data."
        );
      } finally {
        setLoading(false);
      }
    }
    fetchMembershipPlan();
  }, [id, setValue]);

  const onSubmit = (data) => {
    const submit = async () => {
      const formData = new FormData();
      formData.append("PlanName", data.PlanName);
      formData.append("Duration", data.Duration);
      formData.append("Price", data.Price);
      formData.append("Description", data.Description);

      try {
        const response = await updateMembershipPlan(id, formData);
        if (response.status === 200) {
          setAlertType("success");
          setAlertMessage(
            response.message || "Membership plan updated successfully."
          );

          // Wait 5 seconds before navigating back
          setTimeout(() => {
            navigate(-1);
          }, 900);
        } else {
          setAlertType("danger");
          setAlertMessage(
            response.message ||
              "An error occurred while updating the membership plan."
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
      <h2 className="text-center mb-4">Update Membership Plan Form</h2>

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
            <label htmlFor="planName">Plan Name</label>
            <input
              type="text"
              id="planName"
              placeholder="Enter the plan name."
              className={`form-control ${errors.PlanName ? "is-invalid" : ""}`}
              {...register("PlanName", { required: "Plan Name is required" })}
            />
            {errors.PlanName && (
              <div className="invalid-feedback">{errors.PlanName.message}</div>
            )}
          </div>

          <div className="form-group col-md-6">
            <label htmlFor="duration">Duration</label>
            <input
              type="text"
              id="duration"
              placeholder="Enter the duration."
              className={`form-control ${errors.Duration ? "is-invalid" : ""}`}
              {...register("Duration", { required: "Duration is required" })}
            />
            {errors.Duration && (
              <div className="invalid-feedback">{errors.Duration.message}</div>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              step="0.01"
              id="price"
              placeholder="Enter the price."
              className={`form-control ${errors.Price ? "is-invalid" : ""}`}
              {...register("Price", { required: "Price is required" })}
            />
            {errors.Price && (
              <div className="invalid-feedback">{errors.Price.message}</div>
            )}
          </div>

          <div className="form-group col-md-6">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              placeholder="Enter the description."
              className={`form-control ${
                errors.Description ? "is-invalid" : ""
              }`}
              {...register("Description", {
                required: "Description is required",
              })}
            />
            {errors.Description && (
              <div className="invalid-feedback">
                {errors.Description.message}
              </div>
            )}
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-block">
          Update
        </button>
      </form>
    </div>
  );
}

export default UpdateMembershipPlan;
