import React, { useState, useEffect } from "react";
import { showAdmin, updateAdmin } from "../../../api/adminApi"; // Adjust the import path as needed

const AdminProfile = () => {
  const [adminData, setAdminData] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [globalError, setGlobalError] = useState("");

  // Errors for each input field
  const [errors, setErrors] = useState({});

  // Form state for updating profile
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  // profilePicture stores the file object; preview stores a URL for preview
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState("");

  // Form state for resetting password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [flag, setFlag] = useState(false);

  // Load admin data from localStorage on mount
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));
    if (data) {
      setAdminData(data);
      setName(data.Name);
      setEmail(data.Email);
      setGender(data.Gender); // Pre-populate gender from local storage
      setPhoneNumber(data.PhoneNumber);
      // Use the stored image URL as the preview (if available)
      setProfilePicturePreview(data.ProfilePicture);
    }
  }, [flag]);

  // Handle update profile form submission using async/await
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setGlobalError("");
    setErrors({});

    // Validate required fields
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    if (!gender.trim()) newErrors.gender = "Gender is required.";
    if (!phoneNumber.trim())
      newErrors.phoneNumber = "Phone Number is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Create a FormData object and append fields
    const formData = new FormData();
    formData.append("Name", name);
    formData.append("Email", email);
    formData.append("Gender", gender);
    formData.append("PhoneNumber", phoneNumber);
    if (profilePicture) {
      formData.append("PicImg", profilePicture);
    }

    try {
      // Call updateAdmin using async/await. Make sure updateAdmin is configured to handle FormData.
      await updateAdmin(formData);
      // After updating, fetch the updated admin data
      const updatedAdminResponse = await showAdmin();
      const updatedAdminData = updatedAdminResponse.data;

      // Update state and local storage with returned data
      setAdminData(updatedAdminData);
      localStorage.setItem("user", JSON.stringify(updatedAdminData));

      setShowUpdateModal(false);
      setFlag(true);
      // Show success dialog when update is successful
      setShowSuccessDialog(true);
    } catch (error) {
      console.error("Error updating admin:", error);
      setGlobalError("Error updating profile. Please try again later.");
    }
  };

  // Handle reset password form submission
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    // Implement your reset password logic here (e.g., API call)
    console.log("Reset Password:", {
      currentPassword,
      newPassword,
      confirmNewPassword,
    });
    setShowResetModal(false);
  };

  if (!adminData) {
    return (
      <div className="container my-5">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      {/* Profile Card */}
      <div className="card mx-auto shadow" style={{ maxWidth: "600px" }}>
        <div className="card-header text-center">
          <h4>Admin Profile</h4>
        </div>
        <div className="card-body">
          <div className="d-flex align-items-center mb-3">
            <img
              src={
                // If a new file is selected, use its preview; otherwise, use the stored URL
                profilePicturePreview
                  ? `http://127.0.0.1:8000/storage/${profilePicturePreview}`
                  : "/Customer/pic.jpg"
              }
              alt="Profile"
              className="rounded-circle me-3"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
            <div>
              <h5 className="mb-0">{name}</h5>
              <small className="text-muted">{adminData.role}</small>
            </div>
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <strong>Email:</strong> {email}
            </li>
            <li className="list-group-item">
              <strong>Gender:</strong> {gender}
            </li>
            <li className="list-group-item">
              <strong>Phone Number:</strong> {phoneNumber}
            </li>
          </ul>
        </div>
        <div className="card-footer d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-primary me-2"
            onClick={() => {
              setErrors({});
              setGlobalError("");
              setShowUpdateModal(true);
            }}
          >
            Update Profile
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowResetModal(true)}
          >
            Reset Password
          </button>
        </div>
      </div>

      {/* Update Profile Modal */}
      {showUpdateModal && (
        <div className="modal show fade d-block" tabIndex="-1">
          <div className="modal-dialog">
            <form onSubmit={handleUpdateSubmit}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Update Profile</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setErrors({});
                      setGlobalError("");
                      setShowUpdateModal(false);
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  {globalError && (
                    <div className="alert alert-warning" role="alert">
                      {globalError}
                    </div>
                  )}
                  <div className="mb-3">
                    <label htmlFor="adminName" className="form-label">
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="adminName"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    {errors.name && (
                      <div className="text-danger small">{errors.name}</div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="adminEmail" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="adminEmail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && (
                      <div className="text-danger small">{errors.email}</div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="adminGender" className="form-label">
                      Gender
                    </label>
                    <select
                      className="form-select"
                      id="adminGender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="">Select Gender</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                    </select>
                    {errors.gender && (
                      <div className="text-danger small">{errors.gender}</div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="adminPhone" className="form-label">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="adminPhone"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    {errors.phoneNumber && (
                      <div className="text-danger small">
                        {errors.phoneNumber}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="adminProfilePicture" className="form-label">
                      Profile Picture
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      id="adminProfilePicture"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setProfilePicture(file);
                          setProfilePicturePreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setErrors({});
                      setGlobalError("");
                      setShowUpdateModal(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="modal show fade d-block" tabIndex="-1">
          <div className="modal-dialog">
            <form onSubmit={handleResetSubmit}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Reset Password</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowResetModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="currentPassword" className="form-label">
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="currentPassword"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="confirmNewPassword" className="form-label">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmNewPassword"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowResetModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Reset Password
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Dialog Modal */}
      {showSuccessDialog && (
        <div className="modal show fade d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Success</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowSuccessDialog(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Your profile has been updated successfully!</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setShowSuccessDialog(false)}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
