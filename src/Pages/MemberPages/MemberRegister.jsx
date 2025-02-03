import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { MembershipContext } from "./Context/MembershipContext";
import { useNavigate } from "react-router-dom";
import Menu from "./Layouts/Menu";

function MemberRegister() {
  const { userData, setUserData } = useContext(MembershipContext);
  const [formData, setFormData] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const formattedData = {
      ...data,
      // profilePic: data.profilePic[0], // Extract File object
    };

    setUserData(formattedData);

    navigate("/Customer/Membership");
  };

  useEffect(() => {
    if (formData) {
      console.log("Form Data Stored:", formData);
    }
  }, [formData]);

  return (
    <div>
      <Menu />
      <section className="h-100 ">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col">
              <div className="card card-registration my-4">
                <div className="row g-0">
                  <div className="col-xl-6 d-none d-xl-block">
                    <img
                      src="../Customer/memberRegister.jpg"
                      alt="Sample"
                      className="img-fluid h-100"
                    />
                  </div>
                  <div className="col-xl-6">
                    <div className="card-body p-md-5 text-black">
                      <h3 className="mb-5 text-uppercase">
                        Member Registration Form
                      </h3>

                      <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Name Field */}
                        <div className="mb-3">
                          <label className="form-label" htmlFor="name">
                            Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            className="form-control"
                            {...register("name", {
                              required: "Name is required",
                            })}
                          />
                          {errors.name && (
                            <span className="text-danger">
                              {errors.name.message}
                            </span>
                          )}
                        </div>

                        {/* Email Field */}
                        <div className="mb-3">
                          <label className="form-label" htmlFor="email">
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            className="form-control"
                            {...register("email", {
                              required: "Email is required",
                              pattern: {
                                value: /^[^@]+@[^@]+\.[^@]+$/,
                                message: "Invalid email format",
                              },
                            })}
                          />
                          {errors.email && (
                            <span className="text-danger">
                              {errors.email.message}
                            </span>
                          )}
                        </div>

                        {/* Password Field */}
                        <div className="mb-3">
                          <label className="form-label" htmlFor="password">
                            Password
                          </label>
                          <input
                            type="password"
                            id="password"
                            className="form-control"
                            {...register("password", {
                              required: "Password is required",
                              minLength: {
                                value: 6,
                                message:
                                  "Password must be at least 6 characters",
                              },
                            })}
                          />
                          {errors.password && (
                            <span className="text-danger">
                              {errors.password.message}
                            </span>
                          )}
                        </div>

                        {/* Phone Number Field */}
                        <div className="mb-3">
                          <label className="form-label" htmlFor="phone_number">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            id="phone_number"
                            className="form-control"
                            {...register("phone_number", {
                              required: "Phone number is required",
                              pattern: {
                                value: /^[0-9]{10,15}$/,
                                message: "Enter a valid phone number",
                              },
                            })}
                          />
                          {errors.phone_number && (
                            <span className="text-danger">
                              {errors.phone_number.message}
                            </span>
                          )}
                        </div>

                        {/* Gender Field */}
                        <div className="mb-3">
                          <label className="form-label" htmlFor="role">
                            Gender
                          </label>
                          <select
                            id="gender"
                            className="form-select"
                            {...register("gender", {
                              required: "Gender is required",
                            })}
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </select>
                          {errors.gender && (
                            <span className="text-danger">
                              {errors.gender.message}
                            </span>
                          )}
                        </div>

                        {/* Date of Birth Field */}
                        <div className="mb-3">
                          <label className="form-label" htmlFor="DateOfBirth">
                            Date of Birth
                          </label>
                          <input
                            type="date"
                            id="DateOfBirth"
                            className="form-control"
                            {...register("DateOfBirth", {
                              required: "Date of birth is required",
                            })}
                          />
                          {errors.DateOfBirth && (
                            <span className="text-danger">
                              {errors.DateOfBirth.message}
                            </span>
                          )}
                        </div>

                        {/* Profile Picture Upload */}
                        {/* <div className="mb-3">
                          <label className="form-label" htmlFor="profilePic">
                            Profile Picture
                          </label>
                          <input
                            type="file"
                            id="profilePic"
                            className="form-control"
                            {...register("profilePic", {
                              required: "Profile picture is required",
                            })}
                          />
                          {errors.profilePic && (
                            <span className="text-danger">
                              {errors.profilePic.message}
                            </span>
                          )}
                        </div> */}

                        {/* Submit Button */}
                        <div className="d-flex justify-content-end pt-3">
                          <button
                            type="submit"
                            className="btn btn-warning btn-lg ms-2"
                          >
                            Submit Form
                          </button>
                        </div>
                      </form>

                      {/* Pass Form Data to Payment Component if Needed */}
                      {/* {formData && <Payment data={formData} />} */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default MemberRegister;
