import React, { useState, useEffect } from "react";
import { Form, Button, Card, Modal, Spinner } from "react-bootstrap";
import { useAuth } from "../../AuthContext";
import { toast } from "react-toastify";
import api from "../../api"; // <- your axios instance

export default function AdminProfile() {
  const { user, setUser } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    profileImage: "",
  });
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [pw, setPw] = useState({
    currentPassword: "",
    password: "",
    passwordConfirm: "",
  });

  // Prefill profile data
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

  // Update profile
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
      setLoading(true);
      const res = await api.patch("/users/updateMe", data); // <- using api instance
      setUser(res.data.data.user);
      setForm((prev) => ({
        ...prev,
        profileImage: res.data.data.user.profileImage,
      }));
      setNewProfileImage(null);
      toast.success("Profile updated successfully");
    } catch (e) {
      toast.error(e.response?.data?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const handleChangePassword = async () => {
    if (!pw.currentPassword || !pw.password || !pw.passwordConfirm) {
      toast.error("Please fill all fields!");
      return;
    }
    try {
      setLoading(true);
      await api.patch("/users/updateMyPassword", pw); // <- using api instance
      toast.success("Password changed successfully");
      setPw({ currentPassword: "", password: "", passwordConfirm: "" });
      setShowPasswordModal(false);
    } catch (e) {
      toast.error(e.response?.data?.message || "Password change failed");
    } finally {
      setLoading(false);
    }
  };

  const getProfileImageUrl = () => {
    if (newProfileImage) return URL.createObjectURL(newProfileImage);
    return user?.profileImage || form.profileImage || "/default-avatar.png";
  };

  return (
    <div className="d-flex justify-content-center mt-4">
      <Card style={{ width: "30rem" }} className="shadow-lg p-3">
        <h3 className="text-center mb-3">Admin Profile</h3>

        <div className="text-center mb-3">
          <img
            src={getProfileImageUrl()}
            alt="Profile"
            width="120"
            height="120"
            className="rounded-circle mb-2"
          />
          <Form.Group controlId="profilePic" className="mt-2">
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => setNewProfileImage(e.target.files[0])}
            />
          </Form.Group>
        </div>

        <Form onSubmit={handleUpdate}>
          <Form.Group className="mb-3">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="tel"
              maxLength="11"
              value={form.phoneNumber}
              onChange={(e) =>
                setForm({ ...form, phoneNumber: e.target.value })
              }
            />
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-100"
          >
            {loading ? <Spinner size="sm" /> : "Update Profile"}
          </Button>
        </Form>

        <div className="mt-4 d-flex flex-column gap-2">
          <Button
            variant="warning"
            className="w-100"
            onClick={() => setShowPasswordModal(true)}
          >
            Change Password
          </Button>
        </div>
      </Card>

      {/* Password Change Modal */}
      <Modal
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                value={pw.currentPassword}
                onChange={(e) =>
                  setPw({ ...pw, currentPassword: e.target.value })
                }
                placeholder="Enter current password"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={pw.password}
                onChange={(e) => setPw({ ...pw, password: e.target.value })}
                placeholder="Enter new password"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                value={pw.passwordConfirm}
                onChange={(e) =>
                  setPw({ ...pw, passwordConfirm: e.target.value })
                }
                placeholder="Confirm new password"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowPasswordModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleChangePassword}>
            {loading ? <Spinner size="sm" /> : "Update Password"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
