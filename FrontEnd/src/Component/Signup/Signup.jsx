import { useState } from "react";
import Footer from "../Navbar/Footer/footer";
import styles from "./Signup.module.css";
import { useNavigate } from "react-router-dom";
import React from "react";
import api from "../../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [error, setError] = useState({});
  const [formData, setformData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
    phoneNumber: "",
    role: "user", // Default role
    profilePic: null, // for profile picture
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profilePic") {
      setformData({
        ...formData,
        profilePic: files[0],
      });
      setError({
        ...error,
        profilePic: "",
      });
    } else {
      setformData({
        ...formData,
        [name]: value,
      });
      setError({
        ...error,
        [name]: "",
      });
    }
  };

  const handleForm = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validationerrors = {};

    if (!formData.firstName.trim())
      validationerrors.firstName = "First name is required";
    if (!formData.lastName.trim())
      validationerrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      validationerrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      validationerrors.email = "Email is not valid";
    }
    if (!formData.password.trim()) {
      validationerrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      validationerrors.password = "Password should be at least 8 characters";
    }
    if (!formData.passwordConfirm.trim()) {
      validationerrors.passwordConfirm = "Confirm password is required";
    } else if (formData.passwordConfirm !== formData.password) {
      validationerrors.passwordConfirm = "Passwords do not match";
    }
    if (!formData.phoneNumber.trim()) {
      validationerrors.phoneNumber = "Phone number is required";
    }
    if (!formData.profilePic) {
      validationerrors.profilePic = "Profile picture is required";
    }

    setError(validationerrors);

    if (Object.keys(validationerrors).length === 0) {
      try {
        const data = new FormData();
        data.append("firstName", formData.firstName);
        data.append("lastName", formData.lastName);
        data.append("email", formData.email);
        data.append("password", formData.password);
        data.append("passwordConfirm", formData.passwordConfirm);
        data.append("phoneNumber", formData.phoneNumber);
        data.append("role", formData.role); // Add role to form data
        data.append("profilePic", formData.profilePic);

        const res = await api.post("/users/signup", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.data.status === "success") {
          toast.success("Account created successfully!");
          
          // Store token and set user state
          localStorage.setItem("token", res.data.token);
          const userData = res.data.data.user;
          setUser(userData);
          
          setformData({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            passwordConfirm: "",
            phoneNumber: "",
            role: "user",
            profilePic: null,
          });
          
          // Redirect based on role
          if (userData.role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/upload");
          }
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong!");
      }
    }
  };

  return (
    <>
      <div className={styles.maindiv}>
        <div className={styles.maindivform}>
          <h2 className={styles.signupheading}>Signup</h2>

          {/* Profile Picture Upload */}
          <div className={styles.profileUpload}>
            <label htmlFor="profilePic" className={styles.profileLabel}>
              {formData.profilePic ? (
                <img
                  src={URL.createObjectURL(formData.profilePic)}
                  alt="Profile Preview"
                  className={styles.profilePreview}
                />
              ) : (
                <span className={styles.uploadText}>Upload Profile</span>
              )}
            </label>
            <input
              type="file"
              id="profilePic"
              accept="image/*"
              name="profilePic"
              onChange={handleChange}
              className={styles.hiddenFileInput}
            />
          </div>
          {error.profilePic && (
            <span className={styles.error}>{error.profilePic}</span>
          )}

          <form onSubmit={handleForm} className={styles.Signupform}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Enter first name"
                className={styles.inputfields}
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
              {error.firstName && (
                <span className={styles.error}>{error.firstName}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Enter last name"
                name="lastName"
                value={formData.lastName}
                className={styles.inputfields}
                onChange={handleChange}
              />
              {error.lastName && (
                <span className={styles.error}>{error.lastName}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <input
                type="email"
                placeholder="Enter email"
                name="email"
                value={formData.email}
                className={styles.inputfields}
                onChange={handleChange}
              />
              {error.email && (
                <span className={styles.error}>{error.email}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <input
                type="password"
                placeholder="Enter password"
                name="password"
                className={styles.inputfields}
                value={formData.password}
                onChange={handleChange}
              />
              {error.password && (
                <span className={styles.error}>{error.password}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <input
                type="password"
                placeholder="Confirm Password"
                name="passwordConfirm"
                className={styles.inputfields}
                value={formData.passwordConfirm}
                onChange={handleChange}
              />
              {error.passwordConfirm && (
                <span className={styles.error}>{error.passwordConfirm}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Enter phone number"
                name="phoneNumber"
                className={styles.inputfields}
                value={formData.phoneNumber}
                onChange={handleChange}
              />
              {error.phoneNumber && (
                <span className={styles.error}>{error.phoneNumber}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <select
                name="role"
                className={styles.inputfields}
                value={formData.role}
                onChange={handleChange}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              {error.role && (
                <span className={styles.error}>{error.role}</span>
              )}
            </div>

            <button className={styles.submitButton}>Create Account</button>
          </form>
          <ToastContainer
            position="top-center"
            autoClose={3000}
            toastContainerClassName="custom-toast-container"
          />
          <div className={styles.loginRedirect}>
            <span>Already have an account?</span>
            <button
              onClick={() => navigate("/signin")}
              className={styles.loginButton}
            >
              Login
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
