import React, { useEffect, useState, useCallback } from "react";
import { Button, Modal, Form, Spinner, Alert } from "react-bootstrap";
import api from "../../api";

export default function ProvinceList() {
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState({ name: "" });
  const [loading, setLoading] = useState(false);
  const [originalProvince, setOriginalProvince] = useState(null);
  const [modalMessage, setModalMessage] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // ✅ Alert message for top success/error
  const showAlert = useCallback((message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 1000);
  }, []);

  // ✅ Fetch all provinces
  const fetchProvinces = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/provinces");
      setProvinces(res.data.data.provinces || []);
    } catch {
      showAlert("Failed to fetch provinces", "danger");
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    fetchProvinces();
  }, [fetchProvinces]);

  // ✅ Save (Add/Edit) province
  const handleSave = async () => {
    try {
      if (
        selectedProvince._id &&
        selectedProvince.name === originalProvince?.name
      ) {
        setModalMessage({
          show: true,
          type: "warning",
          message: "No changes detected!",
        });
        return;
      }

      setLoading(true);
      setModalMessage({ show: false, message: "", type: "" });

      let res;
      if (selectedProvince._id) {
        res = await api.patch(
          `/provinces/${selectedProvince._id}`,
          selectedProvince
        );
      } else {
        res = await api.post("/provinces", selectedProvince);
      }

      const message =
        res.data.message ||
        (selectedProvince._id
          ? "Province updated successfully!"
          : "Province added successfully!");

      setModalMessage({ show: true, type: "success", message });

      setTimeout(() => {
        setShowModal(false);
        fetchProvinces();
      }, 1000);
    } catch (err) {
      const backendMsg =
        err.response?.data?.message ||
        "Failed to save province. Please try again.";
      setModalMessage({ show: true, type: "danger", message: backendMsg });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete province
  const handleDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/provinces/${deleteId}`);
      showAlert("Province deleted successfully!", "success");
      setShowConfirm(false);
      fetchProvinces();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete province";
      showAlert(msg, "danger");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Edit province
  const handleEdit = (province) => {
    const data = { _id: province._id, name: province.name };
    setSelectedProvince(data);
    setOriginalProvince(data);
    setModalMessage({ show: false, message: "", type: "" });
    setShowModal(true);
  };

  // ✅ Add province
  const handleAdd = () => {
    setSelectedProvince({ name: "" });
    setModalMessage({ show: false, message: "", type: "" });
    setShowModal(true);
  };

  return (
    <div className="max-w-6xl mx-auto mt-6 px-4">
      {alert.show && (
        <Alert variant={alert.type} className="text-center fw-semibold">
          {alert.message}
        </Alert>
      )}

      <div className="flex justify-end mb-3">
        <Button variant="success" onClick={handleAdd}>+ Add Province</Button>
      </div>

      <h4 className="mb-3 text-xl font-semibold">Province Management</h4>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left bg-gray-50">
                <th className="px-3 py-2 w-12">#</th>
                <th className="px-3 py-2">Province Name</th>
                <th className="px-3 py-2 text-center w-40">Actions</th>
              </tr>
            </thead>
            <tbody>
              {provinces.length > 0 ? (
                provinces.map((province, index) => (
                  <tr key={province._id} className="border-t">
                    <td className="px-3 py-2">{index + 1}</td>
                    <td className="px-3 py-2">{province.name}</td>
                    <td className="px-3 py-2">
                      <div className="flex justify-center gap-2">
                        <Button variant="outline-primary" size="sm" onClick={() => handleEdit(province)}>
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => {
                            setDeleteId(province._id);
                            setShowConfirm(true);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-3 py-3 text-gray-500" colSpan={3}>
                    No provinces found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedProvince._id ? "Edit Province" : "Add Province"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalMessage.show && (
            <Alert variant={modalMessage.type}>{modalMessage.message}</Alert>
          )}

          <Form>
            <Form.Group>
              <Form.Label>Province Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter province name"
                value={selectedProvince.name}
                onChange={(e) =>
                  setSelectedProvince({
                    ...selectedProvince,
                    name: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this province?</Modal.Body>
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
