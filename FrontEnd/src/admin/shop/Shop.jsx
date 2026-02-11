import React, { useEffect, useState, useCallback } from "react";
import { Button, Modal, Form, Spinner, Alert } from "react-bootstrap";
import api from "../../api";

export default function ShopList() {
  const [shops, setShops] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedShop, setSelectedShop] = useState({
    name: "",
    contact: "",
    address: "",
    city: "",
  });
  const [loading, setLoading] = useState(false);
  const [originalShop, setOriginalShop] = useState(null);
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

  const fetchShops = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/shops");
      setShops(res.data.data.shops || []);
    } catch {
      showAlert("Failed to fetch shops", "danger");
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  const fetchCities = useCallback(async () => {
    try {
      const res = await api.get("/cities");
      setCities(res.data.data.cities || []);
    } catch {
      showAlert("Failed to fetch cities", "danger");
    }
  }, [showAlert]);

  useEffect(() => {
    fetchShops();
    fetchCities();
  }, [fetchShops, fetchCities]);

  const handleSave = async () => {
    if (!selectedShop.name.trim()) {
      setModalMessage({
        show: true,
        type: "warning",
        message: "Please enter the shop name.",
      });
      return;
    }
    if (!selectedShop.contact.trim()) {
      setModalMessage({
        show: true,
        type: "warning",
        message: "Please enter the contact number.",
      });
      return;
    }
    if (!selectedShop.address.trim()) {
      setModalMessage({
        show: true,
        type: "warning",
        message: "Please enter the shop address.",
      });
      return;
    }
    if (!selectedShop.city) {
      setModalMessage({
        show: true,
        type: "warning",
        message: "Please select a city.",
      });
      return;
    }

    try {
      if (
        selectedShop._id &&
        selectedShop.name === originalShop?.name &&
        selectedShop.contact === originalShop?.contact &&
        selectedShop.address === originalShop?.address &&
        selectedShop.city === originalShop?.city
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
      if (selectedShop._id) {
        res = await api.patch(`/shops/${selectedShop._id}`, selectedShop);
      } else {
        res = await api.post("/shops", selectedShop);
      }

      const message =
        res.data.message ||
        (selectedShop._id
          ? "Shop updated successfully!"
          : "Shop added successfully!");

      setModalMessage({ show: true, type: "success", message });

      setTimeout(() => {
        setShowModal(false);
        fetchShops();
      }, 1000);
    } catch (err) {
      const backendMsg =
        err.response?.data?.message || "Failed to save shop. Please try again.";
      setModalMessage({ show: true, type: "danger", message: backendMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/shops/${deleteId}`);
      showAlert("Shop deleted successfully!", "success");
      setShowConfirm(false);
      fetchShops();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete shop";
      showAlert(msg, "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (shop) => {
    const shopData = {
      _id: shop._id,
      name: shop.name,
      contact: shop.contact,
      address: shop.address,
      city: shop.city?._id || "",
    };
    setSelectedShop(shopData);
    setOriginalShop(shopData);
    setModalMessage({ show: false, message: "", type: "" });
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedShop({ name: "", contact: "", address: "", city: "" });
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
        <Button variant="success" onClick={handleAdd}>+ Add Shop</Button>
      </div>

      <h4 className="mb-3 text-xl font-semibold">Shop Management</h4>

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
                <th className="px-3 py-2">Shop Name</th>
                <th className="px-3 py-2">Contact</th>
                <th className="px-3 py-2">Address</th>
                <th className="px-3 py-2">City</th>
                <th className="px-3 py-2 text-center w-40">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shops.length > 0 ? (
                shops.map((shop, index) => (
                  <tr key={shop._id} className="border-t">
                    <td className="px-3 py-2">{index + 1}</td>
                    <td className="px-3 py-2">{shop.name}</td>
                    <td className="px-3 py-2">{shop.contact}</td>
                    <td className="px-3 py-2">{shop.address}</td>
                    <td className="px-3 py-2">{shop.city?.name || "N/A"}</td>
                    <td className="px-3 py-2">
                      <div className="flex justify-center gap-2">
                        <Button variant="outline-primary" size="sm" onClick={() => handleEdit(shop)}>
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => {
                            setDeleteId(shop._id);
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
                  <td className="px-3 py-3 text-gray-500" colSpan={6}>
                    No shops found
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
            {selectedShop._id ? "Edit Shop" : "Add Shop"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalMessage.show && (
            <Alert variant={modalMessage.type}>{modalMessage.message}</Alert>
          )}

          <Form>
            <Form.Group>
              <Form.Label>Shop Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter shop name"
                value={selectedShop.name}
                onChange={(e) =>
                  setSelectedShop({ ...selectedShop, name: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Contact</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter contact number"
                value={selectedShop.contact}
                onChange={(e) =>
                  setSelectedShop({ ...selectedShop, contact: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter address"
                value={selectedShop.address}
                onChange={(e) =>
                  setSelectedShop({ ...selectedShop, address: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>City</Form.Label>
              <Form.Select
                value={selectedShop.city}
                onChange={(e) =>
                  setSelectedShop({ ...selectedShop, city: e.target.value })
                }
              >
                <option value="">Select city</option>
                {cities.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
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
        <Modal.Body>Are you sure you want to delete this shop?</Modal.Body>
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
