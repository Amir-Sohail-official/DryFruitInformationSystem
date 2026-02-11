import React, { useState, useEffect } from "react";
import api from "../../api";
import { useAuth } from "../../AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "./Profile.module.css";
import { toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";
export default function Profile() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    profileImage: "",
  });

  const [pw, setPw] = useState({
    currentPassword: "",
    password: "",
    passwordConfirm: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNumber: user.phoneNumber || "",
        profileImage: user.profileImage || "",
      });
    }
  }, [user]);

  const token = localStorage.getItem("token");
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const hasChanges =
      form.firstName !== user?.firstName ||
      form.lastName !== user?.lastName ||
      form.phoneNumber !== user?.phoneNumber ||
      newProfileImage !== null;

    if (!hasChanges) {
      toast.info("No changes detected in profile");
      return;
    }
    const data = new FormData();
    data.append("firstName", form.firstName);
    data.append("lastName", form.lastName);
    data.append("phoneNumber", form.phoneNumber);
    if (newProfileImage) data.append("profilePic", newProfileImage);

    try {
      const res = await api.patch("/users/updateMe", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setUser(res.data.data.user);
      setForm((prev) => ({
        ...prev,
        profileImage: res.data.data.user.profileImage,
      }));
      setNewProfileImage(null);
      toast.success("profile data is updated successfully");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Data is not updated");
    }
  };

  const handleChangePassword = async () => {
    if (!pw.currentPassword || !pw.password || !pw.passwordConfirm) {
      toast.error("Please fill all password fields!");
      return;
    }
    try {
      await api.patch("/users/updateMyPassword", pw, headers);
      toast.success("Password changed");
      setPw({ currentPassword: "", password: "", passwordConfirm: "" });
      setShowPasswordForm(false);
    } catch (e) {
      toast.error(e.response?.data?.message || "Password change failed");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete("/users/deleteMe", headers);
      logout();
      navigate("/signup");
      toast.success("Account deleted successfully");
    } catch (e) {
      toast.error(e.response?.data?.message || "Delete failed");
    }
  };

  const getProfileImageUrl = () => {
    if (newProfileImage) {
      return URL.createObjectURL(newProfileImage);
    }
    return user?.profileImage || form.profileImage || "/default-avatar.png";
  };

  return (
    <div className={styles.profileWrapper}>
      <div className={styles.profileCard}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          ← Back
        </button>
        <h2 className={styles.welcomeTitle}>
          Welcome, {user?.firstName || "User"}
        </h2>

        <div className={styles.imageContainer}>
          <img
            src={getProfileImageUrl()}
            alt="Profile"
            className={styles.profileImage}
          />
          <input
            type="file"
            id="profilePic"
            accept="image/*"
            onChange={(e) => setNewProfileImage(e.target.files[0])}
            className={styles.hiddenFileInput}
          />
          <label htmlFor="profilePic" className={styles.editIcon}>
            ✏️
          </label>
        </div>

        <form className={styles.form} onSubmit={handleUpdate}>
          <h3 className={styles.sectionTitle}>Profile Information</h3>
          <div className={styles.formGroup}>
            <label>First Name</label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Last Name</label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Phone Number</label>
            <input
              type="tel"
              value={form.phoneNumber}
              onChange={(e) =>
                setForm({ ...form, phoneNumber: e.target.value })
              }
              maxLength="11"
            />
          </div>
          <button type="submit" className={styles.primaryButton}>
            Update Profile
          </button>
        </form>

        <div className={styles.passwordSection}>
          <h3 className={styles.sectionTitle}>Security</h3>
          {!showPasswordForm ? (
            <button
              onClick={() => setShowPasswordForm(true)}
              className={styles.secondaryButton}
            >
              Change Password
            </button>
          ) : (
            <div className={styles.passwordForm}>
              <div className={styles.formGroup}>
                <label>Current Password</label>
                <input
                  type="password"
                  required
                  value={pw.currentPassword}
                  onChange={(e) =>
                    setPw({ ...pw, currentPassword: e.target.value })
                  }
                  placeholder="Enter your current password"
                />
              </div>
              <div className={styles.formGroup}>
                <label>New Password</label>
                <input
                  type="password"
                  required
                  value={pw.password}
                  onChange={(e) => setPw({ ...pw, password: e.target.value })}
                  placeholder="Enter new password"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Confirm Password</label>
                <input
                  required
                  type="password"
                  value={pw.passwordConfirm}
                  onChange={(e) =>
                    setPw({ ...pw, passwordConfirm: e.target.value })
                  }
                  placeholder="Confirm new password"
                />
              </div>
              <div className={styles.passwordFormButtons}>
                <button
                  onClick={handleChangePassword}
                  className={styles.primaryButton}
                >
                  Update Password
                </button>
                <button
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPw({
                      currentPassword: "",
                      password: "",
                      passwordConfirm: "",
                    });
                  }}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <hr className={styles.divider} />

        <div className={styles.actionButtons}>
          <button
            onClick={() => {
              logout();
              navigate("/Sigin");
            }}
            className={`${styles.secondaryButton} ${styles.logoutButton}`}
          >
            Logout
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className={`${styles.secondaryButton} ${styles.deleteButton}`}
          >
            Delete Account
          </button>
        </div>
      </div>

      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Account Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete your account? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setShowDeleteModal(false);
              handleDelete();
            }}
          >
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
