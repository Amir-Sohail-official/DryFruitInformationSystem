import React, { useEffect, useState, useCallback } from "react";
import { Button, Modal, Form, Spinner, Alert } from "react-bootstrap";
import api from "../../api";

export default function CityList() {
  const [cities, setCities] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [selectedCity, setSelectedCity] = useState({ name: "", province: "" });
  const [loading, setLoading] = useState(false);
  const [originalCity, setOriginalCity] = useState(null);
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

  const fetchCities = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/cities");
      setCities(res.data.data.cities || []);
    } catch {
      showAlert("Failed to fetch cities", "danger");
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  const fetchProvinces = useCallback(async () => {
    try {
      const res = await api.get("/provinces");
      setProvinces(res.data.data.provinces || []);
    } catch {
      showAlert("Failed to fetch provinces", "danger");
    }
  }, [showAlert]);

  useEffect(() => {
    fetchCities();
    fetchProvinces();
  }, [fetchCities, fetchProvinces]);

  const handleSave = async () => {
    try {
      if (
        selectedCity._id &&
        selectedCity.name === originalCity?.name &&
        selectedCity.province === originalCity?.province
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
      if (selectedCity._id) {
        res = await api.patch(`/cities/${selectedCity._id}`, selectedCity);
      } else {
        res = await api.post("/cities", selectedCity);
      }

      const message =
        res.data.message ||
        (selectedCity._id
          ? "City updated successfully!"
          : "City added successfully!");

      setModalMessage({ show: true, type: "success", message });

      setTimeout(() => {
        setShowModal(false);
        fetchCities();
      }, 1000);
    } catch (err) {
      const backendMsg =
        err.response?.data?.message || "Failed to save city. Please try again.";
      setModalMessage({ show: true, type: "danger", message: backendMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/cities/${deleteId}`);
      showAlert("City deleted successfully!", "success");
      setShowConfirm(false);
      fetchCities();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete city";
      showAlert(msg, "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (city) => {
    const cityData = {
      _id: city._id,
      name: city.name,
      province: city.province?._id || "",
    };
    setSelectedCity(cityData);
    setOriginalCity(cityData);
    setModalMessage({ show: false, message: "", type: "" });
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedCity({ name: "", province: "" });
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
        <Button variant="success" onClick={handleAdd}>+ Add City</Button>
      </div>

      <h4 className="mb-3 text-xl font-semibold">City Management</h4>

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
                <th className="px-3 py-2">City Name</th>
                <th className="px-3 py-2">Province</th>
                <th className="px-3 py-2 text-center w-40">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cities.length > 0 ? (
                cities.map((city, index) => (
                  <tr key={city._id} className="border-t">
                    <td className="px-3 py-2">{index + 1}</td>
                    <td className="px-3 py-2">{city.name}</td>
                    <td className="px-3 py-2">{city.province?.name || "N/A"}</td>
                    <td className="px-3 py-2">
                      <div className="flex justify-center gap-2">
                        <Button variant="outline-primary" size="sm" onClick={() => handleEdit(city)}>
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => {
                            setDeleteId(city._id);
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
                  <td className="px-3 py-3 text-gray-500" colSpan={4}>
                    No cities found
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
            {selectedCity._id ? "Edit City" : "Add City"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalMessage.show && (
            <Alert variant={modalMessage.type}>{modalMessage.message}</Alert>
          )}

          <Form>
            <Form.Group>
              <Form.Label>City Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter city name"
                value={selectedCity.name}
                onChange={(e) =>
                  setSelectedCity({ ...selectedCity, name: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Province</Form.Label>
              <Form.Select
                value={selectedCity.province}
                onChange={(e) =>
                  setSelectedCity({ ...selectedCity, province: e.target.value })
                }
              >
                <option value="">Select province</option>
                {provinces.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
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
        <Modal.Body>Are you sure you want to delete this city?</Modal.Body>
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
