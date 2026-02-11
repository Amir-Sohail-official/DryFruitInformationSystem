import React, { useEffect, useState, useCallback } from "react";
import { Table, Button, Modal, Spinner, Alert } from "react-bootstrap";
import api from "../../api";

export default function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const showAlert = useCallback((message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 1000);
  }, []);

  // Fetch all feedbacks
  const fetchFeedbacks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/feedbacks");
      setFeedbacks(res.data.data.feedbacks || []);
    } catch (err) {
      showAlert("Failed to fetch feedbacks", "danger");
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  // Delete feedback
  const handleDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/feedbacks/${deleteId}`);
      showAlert("Feedback deleted successfully!", "success");
      setShowConfirm(false);
      fetchFeedbacks();
    } catch (err) {
      showAlert("Failed to delete feedback", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      {alert.show && (
        <Alert variant={alert.type} className="text-center fw-semibold">
          {alert.message}
        </Alert>
      )}

      <h4 className="mb-3">Feedback Management</h4>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead className="text-center">
            <tr>
              <th>#</th>
              <th>User Name</th>
              <th>Email</th>
              <th>Type</th>
              <th>Rating</th>
              <th>Message</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {feedbacks.length > 0 ? (
              feedbacks.map((fb, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{fb.user?.firstName || "Anonymous"}</td>
                  <td>{fb.user?.email || "N/A"}</td>
                  <td>{fb.type}</td>
                  <td>{fb.rating}</td>
                  <td>{fb.message}</td>
                  <td>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => {
                        setDeleteId(fb._id);
                        setShowConfirm(true);
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center">
                  No feedback found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this feedback?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
