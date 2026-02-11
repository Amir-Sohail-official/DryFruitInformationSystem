import React, { useEffect, useState, useCallback } from "react";
import api from "../../api";
import { Button, Modal, Form, Alert, Spinner } from "react-bootstrap";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [modalMessage, setModalMessage] = useState(null); // now object {text, type}
  const limit = 4;

  const getToken = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      return user.token || user.accessToken;
    }
    return localStorage.getItem("token");
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    const token = getToken();

    if (!token) {
      setError("Authentication required. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.get(`/users?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const usersData = response.data?.data?.users || [];
      const totalUsers = response.data?.totalUsers || 0;

      setUsers(usersData);
      setTotalPages(Math.ceil(totalUsers / limit));
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch users";
      setError(errorMessage);

      if (err.response?.status === 401) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleUpdate = (user) => {
    setSelectedUser(user);
    setModalMessage(null);
    setShowModal(true);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setModalMessage(null);
    setShowDeleteModal(true);
  };

  // DELETE USER
  const handleConfirmDelete = async () => {
    const id = userToDelete._id;
    const token = getToken();
    if (!token) {
      setError("Authentication required.");
      return;
    }

    try {
      await api.delete(`/users/deleteUser/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(
        users.map((user) =>
          user._id === id ? { ...user, active: false } : user
        )
      );

      setModalMessage({ text: "User deleted successfully!", type: "danger" });

      setTimeout(() => {
        setModalMessage(null);
        setShowDeleteModal(false);
      }, 1000);
    } catch (err) {
      setModalMessage({
        text: err.response?.data?.message || "Failed to delete user",
        type: "danger",
      });
      setTimeout(() => setModalMessage(null), 1000);
    }
  };

  // EDIT USER
  const handleSave = async () => {
    const token = getToken();
    if (!token) {
      setError("Authentication required.");
      return;
    }

    const originalUser = users.find((u) => u._id === selectedUser._id);
    if (
      originalUser.role === selectedUser.role &&
      originalUser.active === selectedUser.active
    ) {
      setModalMessage({ text: "No changes detected.", type: "warning" });
      setTimeout(() => setModalMessage(null), 1000);
      return;
    }

    try {
      await api.patch(
        `/users/${selectedUser._id}`,
        {
          role: selectedUser.role,
          active: selectedUser.active,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers(
        users.map((user) =>
          user._id === selectedUser._id ? selectedUser : user
        )
      );

      setModalMessage({ text: "User updated successfully!", type: "success" });
      setTimeout(() => {
        setModalMessage(null);
        setShowModal(false);
      }, 1000);
    } catch (err) {
      setModalMessage({
        text: err.response?.data?.message || "Failed to update user",
        type: "danger",
      });
      setTimeout(() => setModalMessage(null), 1000);
    }
  };

  const handlePrevPage = () => page > 1 && setPage(page - 1);
  const handleNextPage = () => page < totalPages && setPage(page + 1);

  return (
    <div className="max-w-6xl mx-auto mt-6 px-4">
      <h4 className="mb-3 text-xl font-semibold">User Management</h4>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left bg-gray-50">
                  <th className="px-3 py-2">#</th>
                  <th className="px-3 py-2">Full Name</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Contact</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Role</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id} className="border-t">
                    <td className="px-3 py-2">{(page - 1) * limit + index + 1}</td>
                    <td className="px-3 py-2">{`${user.firstName} ${user.lastName}`}</td>
                    <td className="px-3 py-2">{user.email}</td>
                    <td className="px-3 py-2">{user.phoneNumber}</td>
                    <td className="px-3 py-2">
                      <span className={`inline-block px-2 py-1 rounded text-xs ${user.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                        {user.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-3 py-2">{user.role}</td>
                    <td className="px-3 py-2">
                      <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleUpdate(user)}>
                        Edit
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDeleteClick(user)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td className="px-3 py-3 text-gray-500" colSpan={7}>No users found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-3">
            <button
              className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
              disabled={page === 1}
              onClick={handlePrevPage}
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
            <button
              className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
              disabled={page === totalPages}
              onClick={handleNextPage}
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalMessage && (
            <Alert variant={modalMessage.type}>{modalMessage.text}</Alert>
          )}
          {selectedUser && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Select
                  value={selectedUser.role}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      role: e.target.value,
                    })
                  }
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={selectedUser.active ? "active" : "inactive"}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      active: e.target.value === "active",
                    })
                  }
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Form.Select>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalMessage ? (
            <Alert variant={modalMessage.type}>{modalMessage.text}</Alert>
          ) : (
            "Are you really sure you want to delete this user?"
          )}
        </Modal.Body>
        <Modal.Footer>
          {!modalMessage && (
            <>
              <Button
                variant="secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button variant="danger" onClick={handleConfirmDelete}>
                Yes, Delete
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}
