import { useNavigate } from "react-router-dom";
import Footer from "../Navbar/Footer/footer";
import styles from "./Signin.module.css";
import { useState } from "react";
import React from "react";
import api from "../../api";
import { toast } from "react-toastify";
import { useAuth } from "../../AuthContext";

export default function Signin() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const intitialvalues = {
    email: "",
    password: "",
  };
  const [loginData, setLoginData] = useState(intitialvalues);
  const [errors, setErrors] = useState({});
  // Forgot/Reset password states
  const [showForgot, setShowForgot] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetData, setResetData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [restToken, setResetToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };
  const handlesubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};
    if (!loginData.email.trim()) {
      validationErrors.email = "Email is required";
    }

    if (!loginData.password.trim()) {
      validationErrors.password = "Password is required";
    }
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      try {
        setIsLoading(true);
        const res = await api.post("/users/login", loginData);
        localStorage.setItem("token", res.data.token);
        const userData = res.data.data.user;
        setUser(userData);

        // Handle redirect immediately after setting user state
        if (userData.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/upload");
        }

        toast.success("Login successful!");
      } catch (error) {
        console.error("Login error:", error.response?.data);
        toast.error(error.response?.data?.message || "Login failed!");
      } finally {
        setIsLoading(false);
      }
    }
  };
  // Handlers for Forgot Password flow
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!forgotEmail.trim()) {
      errs.forgotEmail = "email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      errs.forgotEmail = "invalid email";
    }
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      try {
        setIsLoading(true);
        const res = await api.post("/users/forgotpassword", {
          email: forgotEmail,
        });
        const token = res.data.resetToken;
        if (token) {
          setResetToken(token);
        }
        toast.success(res.data.message || `Reset link sent to ${forgotEmail}`);
        setShowReset(true);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to send reset email"
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleResetChange = (e) => {
    const { name, value } = e.target;
    setResetData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!resetData.newPassword.trim())
      errs.newPassword = "Password is required";
    else if (resetData.newPassword.length < 8)
      errs.newPassword = "Min  8 characters";

    if (!resetData.confirmPassword.trim())
      errs.confirmPassword = "Confirm your password";
    else if (resetData.newPassword !== resetData.confirmPassword)
      errs.confirmPassword = "Passwords do not match";

    setErrors(errs);

    if (Object.keys(errs).length === 0) {
      try {
        setIsLoading(true);
        if (!restToken) {
          toast.error(
            "Reset token not found. Please request a new reset link."
          );
          return;
        }

        const res = await api.patch(`/users/resetpassword/${restToken}`, {
          password: resetData.newPassword,
          passwordConfirm: resetData.confirmPassword,
        });
        toast.success(res.data.message || "Password updated successfully!");
        // Reset flow
        setShowForgot(false);
        setShowReset(false);
        setForgotEmail("");
        setResetData({ newPassword: "", confirmPassword: "" });
        setResetToken("");
        setErrors("");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to reset password");
        // If token is invalid/expired, clear it from state
        if (err.response?.status === 400 || err.response?.status === 401) {
          setResetToken(""); // Clear the invalid token
          setShowReset(false);
          setShowForgot(true);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <div className={styles.signicontainr}>
        <div className={styles.siginmaindiv}>
          {!showForgot && !showReset && (
            <>
              <h2>Login</h2>
              <form className={styles.signinform} onSubmit={handlesubmit}>
                <div className={styles.inputgroup}>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className={styles.sigininput}
                    value={loginData.email}
                    name="email"
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <p className={styles.error}>{errors.email}</p>
                  )}
                </div>

                <div className={styles.inputgroup}>
                  <input
                    type="password"
                    placeholder="Enter your Password"
                    className={styles.sigininput}
                    value={loginData.password}
                    onChange={handleChange}
                    name="password"
                  />
                  {errors.password && (
                    <p className={styles.error}>{errors.password}</p>
                  )}
                </div>
                <div className={styles.mydiv}>
                  <button
                    type="submit"
                    className={styles.signinbutton}
                    disabled={isLoading}
                  >
                    {isLoading ? "logging..." : "login"}
                  </button>
                </div>
              </form>

              <span className={styles.nothaveaccount}>
                Not have any account
              </span>
              <button
                onClick={() => {
                  navigate("/signup");
                }}
                className={styles.signupbtn}
              >
                Signup
              </button>
              <div style={{ marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#ff7f50",
                    cursor: "pointer",
                    textDecoration: "underline",
                    fontWeight: 600,
                  }}
                >
                  Forgot Password?
                </button>
              </div>
            </>
          )}

          {showForgot && !showReset && (
            <>
              <h2>Forgot Password</h2>
              <form className={styles.signinform} onSubmit={handleForgotSubmit}>
                <div className={styles.inputgroup}>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className={styles.sigininput}
                    value={forgotEmail}
                    name="forgotEmail"
                    onChange={(e) => setForgotEmail(e.target.value)}
                    disabled={isLoading}
                  />
                  {errors.forgotEmail && (
                    <p className={styles.error}>{errors.forgotEmail}</p>
                  )}
                </div>
                <div className={styles.mydiv}>
                  <button
                    type="submit"
                    className={styles.signinbutton}
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Reset Email"}
                  </button>
                </div>
              </form>
              <div style={{ marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgot(false);
                    setShowReset(false);
                    setForgotEmail("");
                    setErrors({});
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#555",
                    cursor: "pointer",
                    textDecoration: "underline",
                    fontWeight: 600,
                  }}
                >
                  Back to Login
                </button>
              </div>
            </>
          )}

          {showReset && (
            <>
              <h2>Set New Password</h2>
              <form className={styles.signinform} onSubmit={handleResetSubmit}>
                <div className={styles.inputgroup}>
                  <input
                    type="password"
                    placeholder="New Password"
                    className={styles.sigininput}
                    value={resetData.newPassword}
                    name="newPassword"
                    onChange={handleResetChange}
                    disabled={isLoading}
                  />
                  {errors.newPassword && (
                    <p className={styles.error}>{errors.newPassword}</p>
                  )}
                </div>
                <div className={styles.inputgroup}>
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    className={styles.sigininput}
                    value={resetData.confirmPassword}
                    name="confirmPassword"
                    onChange={handleResetChange}
                    disabled={isLoading}
                  />
                  {errors.confirmPassword && (
                    <p className={styles.error}>{errors.confirmPassword}</p>
                  )}
                </div>
                <div className={styles.mydiv}>
                  <button
                    type="submit"
                    className={styles.signinbutton}
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Update Password"}
                  </button>
                </div>
              </form>
              <div style={{ marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgot(false);
                    setShowReset(false);
                    setForgotEmail("");
                    setResetData({ newPassword: "", confirmPassword: "" });
                    setErrors({});
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#555",
                    cursor: "pointer",
                    textDecoration: "underline",
                    fontWeight: 600,
                  }}
                >
                  Back to Login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
