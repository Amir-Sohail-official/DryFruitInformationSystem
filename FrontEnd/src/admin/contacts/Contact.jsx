import { useCallback, useEffect, useState } from "react";
import { Table, Button, Modal, Spinner, Alert } from "react-bootstrap";
import api from "../../api";

export default function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [deleteId, setDeleteId] = useState(null);

  const showAlert = useCallback((message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 1500);
  }, []);

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/contacts");
      setContacts(res.data.data || []);
    } catch (err) {
      const backendMessage =
        err.response?.data?.message || "Failed to fetch contacts";
      showAlert(backendMessage, "danger");
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/contacts/${deleteId}`);
      showAlert("Contact deleted successfully!", "success");
      setShowConfirm(false);
      fetchContacts();
    } catch (err) {
      const backendMessage =
        err.response?.data?.message || "Failed to delete contact";
      showAlert(backendMessage, "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-3">
      {alert.show && (
        <Alert variant={alert.type} className="text-center fw-semibold">
          {alert.message}
        </Alert>
      )}

      <h4 className="mb-3">Contact Management</h4>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr className="text-center">
              <th>#</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {contacts.length > 0 ? (
              contacts.map((contact, index) => (
                <tr key={contact._id}>
                  <td>{index + 1}</td>
                  <td>
                    {contact.firstName} {contact.lastName}
                  </td>
                  <td>{contact.email}</td>
                  <td>{contact.subject}</td>
                  <td>{contact.message}</td>
                  <td className="text-center">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => {
                        setDeleteId(contact._id);
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
                <td colSpan="6" className="text-center">
                  No contacts found
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
        <Modal.Body>Are you sure you want to delete this contact?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
