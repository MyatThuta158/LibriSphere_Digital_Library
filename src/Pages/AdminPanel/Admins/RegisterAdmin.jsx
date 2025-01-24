import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { createAdmin } from "../../../api/adminApi";

function RegisterAdmin() {
  ////---This is use form ---//
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  //////---This is for useRef---////
  const fileInput = useRef(null);

  const [imgfile, setImgfile] = useState(); //--This is to store image---//
  const [img, setImg] = useState(); //This is for preview image variable

  const onSubmit = async (data) => {
    console.log(data.gender);
    try {
      const formData = new FormData(); // Create FormData object

      // Append data to FormData
      formData.append("Name", data.name);
      formData.append("Email", data.email);
      formData.append("Password", data.password);
      formData.append("Role", data.role);
      formData.append("phone_number", data.phone_number);
      formData.append("Gender", data.gender);

      // Append the image file only if it exists
      if (imgfile) {
        formData.append("PicImg", imgfile);
      }

      // Call the API
      const result = await createAdmin(formData);

      console.log(result.status);
      if (result.status === 200) {
        console.log(result.message);
        reset();
      } else {
        console.log("error");
        console.log(result.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="container mt-3">
      <h1 className="text-center">Register Form</h1>
      <form
        method="POST"
        action="/register-admin"
        className="mt-4 w-50 mx-auto"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-100 d-flex justify-content-center align-items-center">
          {img ? (
            <div style={{ position: "relative", display: "inline-block" }}>
              <img
                src={img}
                name="image"
                className="mx-auto"
                style={{ borderRadius: "50%", width: "15vw", height: "30vh" }}
              />
              <span
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  cursor: "pointer",
                  background: "white",
                  borderRadius: "50%",
                  padding: "4px",
                  boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
                }}
                onClick={() => setImg(null)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-x-lg"
                  viewBox="0 0 16 16"
                >
                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                </svg>
              </span>
            </div>
          ) : (
            <input
              type="file"
              ref={fileInput}
              name="image"
              style={{ width: "16%" }}
              {...register("image")}
              onChange={(e) => {
                const file = e.target.files[0];
                setImgfile(file);
                setImg(URL.createObjectURL(file));
              }}
            />
          )}
        </div>

        <div className="row">
          {/* Name */}
          <div className="col-md-6 mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              {...register("name", { required: "Name is required" })}
              id="name"
              name="name"
              required
            />
          </div>

          {/* Email */}
          <div className="col-md-6 mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              {...register("email", { required: "Email is required!" })}
              id="email"
              name="email"
              autoComplete="email"
              required
            />
          </div>
        </div>

        <div className="row">
          {/* Password */}
          <div className="col-md-6 mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              {...register("password", { required: "Password is required!" })}
              id="password"
              name="password"
              required
              autoComplete="current-password"
            />
          </div>

          {/* Phone Number */}
          <div className="col-md-6 mb-3">
            <label htmlFor="phone_number" className="form-label">
              Phone Number
            </label>
            <input
              type="text"
              className="form-control"
              {...register("phone_number", {
                required: "Phone number is required",
              })}
              id="phone_number"
              name="phone_number"
              required
            />
          </div>
        </div>

        <div className="row">
          {/* Age */}
          <div className="col-md-6 mb-3">
            <label htmlFor="gender" className="form-label">
              Gender
            </label>
            <select
              className="form-select"
              {...register("gender", { required: "Gender is required!" })}
              id="gender"
              name="gender"
              required
              defaultValue={""}
            >
              <option value="" disabled>
                Select a gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          {/* Role */}
          <div className="col-md-6 mb-3">
            <label htmlFor="role" className="form-label">
              Role
            </label>
            <select
              className="form-select"
              {...register("role", { required: "Role is required!" })}
              id="role"
              name="role"
              required
              defaultValue={""}
            >
              <option value="" disabled>
                Select a role
              </option>
              <option value="manager">Manager</option>
              <option value="librarian">Librarian</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="d-grid mt-3 w-100">
          <button type="submit" className="btn w-25 mx-auto btn-primary">
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegisterAdmin;
