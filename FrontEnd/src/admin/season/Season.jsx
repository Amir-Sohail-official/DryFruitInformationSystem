import React, { useEffect, useState, useCallback } from "react";
import { Table, Button, Modal, Form, Spinner, Alert } from "react-bootstrap";
import api from "../../api";

export default function SeasonList() {
  const [seasons, setSeasons] = useState([]);
  const [dryFruits, setDryFruits] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState({
    name: "",
    startDate: "",
    endDate: "",
    dryFruits: [],
  });
  const [loading, setLoading] = useState(false);
  const [originalSeason, setOriginalSeason] = useState(null);
  const [modalMessage, setModalMessage] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const showAlert = useCallback((message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 1000);
  }, []);

  const fetchSeasons = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/seasons");
      setSeasons(res.data.data || []);
    } catch {
      showAlert("Failed to fetch seasons", "danger");
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  const fetchDryFruits = useCallback(async () => {
    try {
      const res = await api.get("/products");
      setDryFruits(res.data.data.products || []);
    } catch {
      showAlert("Failed to fetch dry fruits", "danger");
    }
  }, [showAlert]);

  useEffect(() => {
    fetchSeasons();
    fetchDryFruits();
  }, [fetchSeasons, fetchDryFruits]);

  const handleSave = async () => {
    if (!selectedSeason.name.trim()) {
      setModalMessage({
        show: true,
        type: "warning",
        message: "Please select the season name.",
      });
      return;
    }
    if (!selectedSeason.startDate) {
      setModalMessage({
        show: true,
        type: "warning",
        message: "Please select start date.",
      });
      return;
    }
    if (!selectedSeason.endDate) {
      setModalMessage({
        show: true,
        type: "warning",
        message: "Please select end date.",
      });
      return;
    }
    if (!selectedSeason.dryFruits.length) {
      setModalMessage({
        show: true,
        type: "warning",
        message: "Please select at least one dry fruit.",
      });
      return;
    }

    try {
      if (
        selectedSeason._id &&
        JSON.stringify(selectedSeason) === JSON.stringify(originalSeason)
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
      if (selectedSeason._id) {
        res = await api.patch(`/seasons/${selectedSeason._id}`, selectedSeason);
      } else {
        res = await api.post("/seasons", selectedSeason);
      }

      const message =
        res.data.message ||
        (selectedSeason._id
          ? "Season updated successfully!"
          : "Season added successfully!");

      setModalMessage({ show: true, type: "success", message });

      setTimeout(() => {
        setShowModal(false);
        fetchSeasons();
      }, 1000);
    } catch (err) {
      const backendMsg =
        err.response?.data?.message ||
        "Failed to save season. Please try again.";
      setModalMessage({ show: true, type: "danger", message: backendMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/seasons/${deleteId}`);
      showAlert("Season deleted successfully!", "success");
      setShowConfirm(false);
      fetchSeasons();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete season";
      showAlert(msg, "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (season) => {
    // Extract only the valid dry fruit IDs
    const dryFruitIds = season.dryFruits
      .map((d) => {
        if (d._id) return d._id; // direct ID
        if (d.product?._id) return d.product._id; // nested product ID
        return null;
      })
      .filter(Boolean);

    const seasonData = {
      _id: season._id,
      name: season.name,
      startDate: season.startDate?.slice(0, 10),
      endDate: season.endDate?.slice(0, 10),
      dryFruits: dryFruitIds,
    };

    setSelectedSeason(seasonData);
    setOriginalSeason(seasonData);
    setModalMessage({ show: false, message: "", type: "" });
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedSeason({
      name: "",
      startDate: "",
      endDate: "",
      dryFruits: [],
    });
    setModalMessage({ show: false, message: "", type: "" });
    setShowModal(true);
  };

  return (
    <div className="container mt-4">
      {alert.show && (
        <Alert variant={alert.type} className="text-center fw-semibold">
          {alert.message}
        </Alert>
      )}

      <div className="d-flex justify-content-end mb-3">
        <Button variant="success" onClick={handleAdd}>
          + Add Season
        </Button>
      </div>

      <h4 className="mb-3">Season Management</h4>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead className="text-center">
            <tr>
              <th>#</th>
              <th>Season Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Dry Fruits</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {seasons.length > 0 ? (
              seasons.map((season, index) => (
                <tr key={season._id}>
                  <td>{index + 1}</td>
                  <td>{season.name}</td>
                  <td>{new Date(season.startDate).toLocaleDateString()}</td>
                  <td>{new Date(season.endDate).toLocaleDateString()}</td>
                  <td>
                    {season.dryFruits
                      .map((d) => (d.product ? d.product : d.name))
                      .join(", ") || "N/A"}
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(season)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => {
                        setDeleteId(season._id);
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
                <td colSpan={6} className="text-center">
                  No seasons found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedSeason._id ? "Edit Season" : "Add Season"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalMessage.show && (
            <Alert variant={modalMessage.type}>{modalMessage.message}</Alert>
          )}

          <Form>
            <Form.Group>
              <Form.Label>Season Name</Form.Label>
              <Form.Select
                value={selectedSeason.name}
                onChange={(e) =>
                  setSelectedSeason({ ...selectedSeason, name: e.target.value })
                }
              >
                <option value="">Select Season</option>
                <option value="Winter">Winter</option>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
                <option value="Autumn">Autumn</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={selectedSeason.startDate}
                onChange={(e) =>
                  setSelectedSeason({
                    ...selectedSeason,
                    startDate: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={selectedSeason.endDate}
                onChange={(e) =>
                  setSelectedSeason({
                    ...selectedSeason,
                    endDate: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Dry Fruits</Form.Label>
              <Form.Select
                multiple
                value={selectedSeason?.dryFruits || []}
                onChange={(e) => {
                  const values = Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  );
                  setSelectedSeason((prev) => ({ ...prev, dryFruits: values }));
                }}
              >
                {dryFruits.map((fruit) => (
                  <option key={fruit._id} value={fruit._id}>
                    {fruit.product}
                  </option>
                ))}
              </Form.Select>
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
        <Modal.Body>Are you sure you want to delete this season?</Modal.Body>
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
