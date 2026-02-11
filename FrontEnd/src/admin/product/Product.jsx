import React, { useEffect, useState, useCallback } from "react";
import api from "../../api";
import { Button, Modal, Form, Alert, Spinner } from "react-bootstrap";

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [imageFile, setImageFile] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [originalProduct, setOriginalProduct] = useState(null);
  const [modalMessage, setModalMessage] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [deleteMessage, setDeleteMessage] = useState({
    show: false,
    message: "",
    type: "",
  });
  const limit = 2;

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
  };

  const getToken = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      return user.token || user.accessToken;
    }
    return localStorage.getItem("token");
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const token = getToken();
    if (!token) {
      showAlert("Authentication required. Please log in.", "danger");
      setLoading(false);
      return;
    }

    try {
      const response = await api.get(`/products?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data?.data?.products || []);
      setTotalPages(response.data?.totalPages || 1);
    } catch (err) {
      showAlert("Failed to fetch products", "danger");
    } finally {
      setLoading(false);
    }
  }, [page]);

  const fetchShopsAndProvinces = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    try {
      const [shopRes, provinceRes] = await Promise.all([
        api.get("/shops", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/provinces", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setShops(shopRes.data?.data?.shops || []);
      setProvinces(provinceRes.data?.data?.provinces || []);
    } catch (err) {
      console.error("Error fetching shops/provinces:", err);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchShopsAndProvinces();
  }, [fetchProducts, fetchShopsAndProvinces]);

  const handleCreate = () => {
    setSelectedProduct({
      product: "",
      description: "",
      dietInfo: "",
      calories: "",
      protein: "",
      carbs: "",
      fats: "",
      price: "",
      trending: false,
      shop: null,
      province: null,
      vitamins: { vitaminE: "", vitaminB6: "", vitaminK: "" },
      minerals: { magnesium: "", potassium: "", iron: "", calcium: "" },
    });
    setOriginalProduct(null);
    setImageFile(null);
    setModalMessage({ show: false, message: "", type: "" });
    setShowModal(true);
  };

  const handleUpdate = (product) => {
    // Normalize product data for form (ensure all fields have default values)
    const productData = {
      ...product,
      shop: product.shop || null,
      province: product.province || null,
      dietInfo: product.dietInfo || "",
      vitamins: product.vitamins || {
        vitaminE: "",
        vitaminB6: "",
        vitaminK: "",
      },
      minerals: product.minerals || {
        magnesium: "",
        potassium: "",
        iron: "",
        calcium: "",
      },
    };

    setSelectedProduct(productData);

    // Store original product data in the same format for accurate comparison
    // Use deep clone to ensure we have an independent copy
    setOriginalProduct(JSON.parse(JSON.stringify(productData)));

    setImageFile(null);
    setModalMessage({ show: false, message: "", type: "" });
    setShowModal(true);
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setDeleteMessage({ show: false, message: "", type: "" });
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    const token = getToken();
    if (!token) {
      showAlert("Authentication required.", "danger");
      setShowConfirm(false);
      return;
    }
    try {
      await api.delete(`/products/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteMessage({
        show: true,
        message: "Product deleted successfully",
        type: "success",
      });
      setTimeout(() => {
        setDeleteMessage({ show: false, message: "", type: "" });
        setShowConfirm(false);
        setProducts(products.filter((p) => p._id !== deleteId));
      }, 1000);
    } catch (err) {
      setDeleteMessage({
        show: true,
        message: "Failed to delete product",
        type: "danger",
      });
      setTimeout(() => {
        setDeleteMessage({ show: false, message: "", type: "" });
        setShowConfirm(false);
      }, 1000);
    }
  };

  const handleSave = async () => {
    const token = getToken();
    if (!token) {
      showAlert("Authentication required.", "danger");
      return;
    }

    const shopId = selectedProduct.shop?._id || null;
    const provinceId = selectedProduct.province?._id || null;

    if (!shopId) return showAlert("Please select a valid shop", "danger");
    if (!provinceId)
      return showAlert("Please select a valid province", "danger");

    if (
      selectedProduct._id &&
      originalProduct &&
      selectedProduct._id === originalProduct._id
    ) {
      // Normalize values for comparison (handle string/number conversion, null/undefined)
      const normalizeValue = (val) => {
        if (val === null || val === undefined) return "";
        return String(val).trim();
      };

      const normalizeNumValue = (val) => {
        if (val === null || val === undefined || val === "") return "";
        // Convert to string and remove any whitespace
        const strVal = String(val).trim();
        return strVal === "" ? "" : strVal;
      };

      // Get values safely with defaults
      const currentVitamins = selectedProduct.vitamins || {};
      const originalVitamins = originalProduct.vitamins || {};
      const currentMinerals = selectedProduct.minerals || {};
      const originalMinerals = originalProduct.minerals || {};

      // Compare shop and province IDs
      const currentShopId =
        selectedProduct.shop?._id || selectedProduct.shop || "";
      const originalShopId =
        originalProduct.shop?._id || originalProduct.shop || "";
      const currentProvinceId =
        selectedProduct.province?._id || selectedProduct.province || "";
      const originalProvinceId =
        originalProduct.province?._id || originalProduct.province || "";

      const hasChanges =
        normalizeValue(selectedProduct.product || "") !==
          normalizeValue(originalProduct.product || "") ||
        normalizeValue(selectedProduct.description || "") !==
          normalizeValue(originalProduct.description || "") ||
        normalizeValue(selectedProduct.dietInfo || "") !==
          normalizeValue(originalProduct.dietInfo || "") ||
        normalizeNumValue(selectedProduct.calories) !==
          normalizeNumValue(originalProduct.calories) ||
        normalizeNumValue(selectedProduct.protein) !==
          normalizeNumValue(originalProduct.protein) ||
        normalizeNumValue(selectedProduct.carbs) !==
          normalizeNumValue(originalProduct.carbs) ||
        normalizeNumValue(selectedProduct.fats) !==
          normalizeNumValue(originalProduct.fats) ||
        normalizeNumValue(selectedProduct.price) !==
          normalizeNumValue(originalProduct.price) ||
        Boolean(selectedProduct.trending) !==
          Boolean(originalProduct.trending) ||
        normalizeValue(currentShopId) !== normalizeValue(originalShopId) ||
        normalizeValue(currentProvinceId) !==
          normalizeValue(originalProvinceId) ||
        normalizeNumValue(currentVitamins.vitaminE) !==
          normalizeNumValue(originalVitamins.vitaminE) ||
        normalizeNumValue(currentVitamins.vitaminB6) !==
          normalizeNumValue(originalVitamins.vitaminB6) ||
        normalizeNumValue(currentVitamins.vitaminK) !==
          normalizeNumValue(originalVitamins.vitaminK) ||
        normalizeNumValue(currentMinerals.magnesium) !==
          normalizeNumValue(originalMinerals.magnesium) ||
        normalizeNumValue(currentMinerals.potassium) !==
          normalizeNumValue(originalMinerals.potassium) ||
        normalizeNumValue(currentMinerals.iron) !==
          normalizeNumValue(originalMinerals.iron) ||
        normalizeNumValue(currentMinerals.calcium) !==
          normalizeNumValue(originalMinerals.calcium) ||
        imageFile !== null;

      if (!hasChanges) {
        setModalMessage({
          show: true,
          message: "No changes detected",
          type: "warning",
        });
        setTimeout(() => {
          setModalMessage({ show: false, message: "", type: "" });
        }, 1000);
        return;
      }
    }

    try {
      const formData = new FormData();
      formData.append("product", selectedProduct.product);
      formData.append("description", selectedProduct.description);
      formData.append("dietInfo", selectedProduct.dietInfo || "");
      formData.append("calories", selectedProduct.calories);
      formData.append("protein", selectedProduct.protein);
      formData.append("carbs", selectedProduct.carbs);
      formData.append("fats", selectedProduct.fats);
      formData.append("price", selectedProduct.price);
      formData.append("trending", selectedProduct.trending);
      formData.append("shop", shopId);
      formData.append("province", provinceId);

      formData.append("vitamins[vitaminE]", selectedProduct.vitamins.vitaminE);
      formData.append(
        "vitamins[vitaminB6]",
        selectedProduct.vitamins.vitaminB6
      );
      formData.append("vitamins[vitaminK]", selectedProduct.vitamins.vitaminK);
      formData.append(
        "minerals[magnesium]",
        selectedProduct.minerals.magnesium
      );
      formData.append(
        "minerals[potassium]",
        selectedProduct.minerals.potassium
      );
      formData.append("minerals[iron]", selectedProduct.minerals.iron);
      formData.append("minerals[calcium]", selectedProduct.minerals.calcium);

      if (imageFile) formData.append("image", imageFile);

      if (selectedProduct._id) {
        await api.patch(`/products/${selectedProduct._id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setModalMessage({
          show: true,
          message: "Product updated successfully",
          type: "success",
        });
        setTimeout(() => {
          setModalMessage({ show: false, message: "", type: "" });
          setShowModal(false);
          fetchProducts();
        }, 1000);
      } else {
        await api.post(`/products`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setModalMessage({
          show: true,
          message: "Product created successfully",
          type: "success",
        });
        setTimeout(() => {
          setModalMessage({ show: false, message: "", type: "" });
          setShowModal(false);
          fetchProducts();
        }, 1000);
      }
    } catch (err) {
      const backendMessage = err.response.message || "Failed to save product";
      showAlert(backendMessage, "danger");
    }
  };

  const handlePrevPage = () => page > 1 && setPage(page - 1);
  const handleNextPage = () => page < totalPages && setPage(page + 1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      {alert.show && (
        <Alert
          variant={alert.type}
          className="text-center fw-bold position-fixed top-0 start-50 translate-middle-x mt-3 shadow"
          style={{ zIndex: 2000, width: "fit-content", minWidth: "300px" }}
        >
          {alert.message}
        </Alert>
      )}

      <div className="flex items-center justify-between mb-4 pb-4 border-b">
        <h4 className="m-0 font-semibold">Product Management</h4>
        <Button variant="success" onClick={handleCreate}>+ Add Product</Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-xl shadow">
            <div className="min-w-[1600px]">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-3 py-2 w-14 text-center">#</th>
                    <th className="px-3 py-2 w-20 text-center">Image</th>
                    <th className="px-3 py-2 w-32">Product</th>
                    <th className="px-3 py-2 w-52">Description</th>
                    <th className="px-3 py-2 w-52">Diet Info</th>
                    <th className="px-3 py-2 w-20 text-center">Cal</th>
                    <th className="px-3 py-2 w-20 text-center">Prot</th>
                    <th className="px-3 py-2 w-20 text-center">Carb</th>
                    <th className="px-3 py-2 w-20 text-center">Fats</th>
                    <th className="px-3 py-2 w-36">Vitamins</th>
                    <th className="px-3 py-2 w-36">Minerals</th>
                    <th className="px-3 py-2 w-24 text-center">Price</th>
                    <th className="px-3 py-2 w-28">Shop</th>
                    <th className="px-3 py-2 w-28">Province</th>
                    <th className="px-3 py-2 w-24 text-center">Trending</th>
                    <th className="px-3 py-2 w-36 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={product._id} className="border-t">
                      <td className="px-3 py-2 text-center">
                        {(page - 1) * limit + index + 1}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <img
                          src={product.image}
                          alt={product.product}
                          className="w-12 h-12 object-cover rounded-md border"
                        />
                      </td>
                      <td className="px-3 py-2 font-medium">{product.product}</td>
                      <td className="px-3 py-2">
                        <span className="block truncate" title={product.description}>
                          {product.description || "N/A"}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <span className="block truncate" title={product.dietInfo}>
                          {product.dietInfo || "N/A"}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center text-gray-700">
                        {product.calories || "-"}
                      </td>
                      <td className="px-3 py-2 text-center text-gray-700">
                        {product.protein || "-"}
                      </td>
                      <td className="px-3 py-2 text-center text-gray-700">
                        {product.carbs || "-"}
                      </td>
                      <td className="px-3 py-2 text-center text-gray-700">
                        {product.fats || "-"}
                      </td>
                      <td className="px-3 py-2">
                        <div className="text-xs">
                          {product.vitamins?.vitaminE && (
                            <span className="inline-block px-2 py-1 m-1 rounded bg-blue-50 text-blue-700">
                              E: {product.vitamins.vitaminE}
                            </span>
                          )}
                          {product.vitamins?.vitaminB6 && (
                            <span className="inline-block px-2 py-1 m-1 rounded bg-blue-50 text-blue-700">
                              B6: {product.vitamins.vitaminB6}
                            </span>
                          )}
                          {product.vitamins?.vitaminK && (
                            <span className="inline-block px-2 py-1 m-1 rounded bg-blue-50 text-blue-700">
                              K: {product.vitamins.vitaminK}
                            </span>
                          )}
                          {!product.vitamins?.vitaminE &&
                            !product.vitamins?.vitaminB6 &&
                            !product.vitamins?.vitaminK && (
                              <span className="text-gray-400">-</span>
                            )}
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="text-xs">
                          {product.minerals?.magnesium && (
                            <span className="inline-block px-2 py-1 m-1 rounded bg-amber-50 text-amber-700">
                              Mg: {product.minerals.magnesium}
                            </span>
                          )}
                          {product.minerals?.potassium && (
                            <span className="inline-block px-2 py-1 m-1 rounded bg-amber-50 text-amber-700">
                              K: {product.minerals.potassium}
                            </span>
                          )}
                          {product.minerals?.iron && (
                            <span className="inline-block px-2 py-1 m-1 rounded bg-amber-50 text-amber-700">
                              Fe: {product.minerals.iron}
                            </span>
                          )}
                          {product.minerals?.calcium && (
                            <span className="inline-block px-2 py-1 m-1 rounded bg-amber-50 text-amber-700">
                              Ca: {product.minerals.calcium}
                            </span>
                          )}
                          {!product.minerals?.magnesium &&
                            !product.minerals?.potassium &&
                            !product.minerals?.iron &&
                            !product.minerals?.calcium && (
                              <span className="text-gray-400">-</span>
                            )}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-center font-semibold text-green-600">
                        {product.price || "0.00"}
                      </td>
                      <td className="px-3 py-2">
                        <span className="block truncate" title={product.shop?.name || "N/A"}>
                          {product.shop?.name || "N/A"}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <span className="block truncate" title={product.province?.name || "N/A"}>
                          {product.province?.name || "N/A"}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span className={`inline-block px-2 py-1 rounded text-xs ${product.trending ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                          {product.trending ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button variant="outline-primary" size="sm" onClick={() => handleUpdate(product)}>
                            Edit
                          </Button>
                          <Button variant="outline-danger" size="sm" onClick={() => confirmDelete(product._id)}>
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {products.length === 0 && !loading && (
            <div className="py-16 text-center text-gray-500">
              <div className="text-4xl mb-2 opacity-60">📦</div>
              <p>No products found</p>
            </div>
          )}
          <div className="flex items-center justify-between mt-3">
            <button
              className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
              disabled={page === 1}
              onClick={handlePrevPage}
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
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

      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setModalMessage({ show: false, message: "", type: "" });
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedProduct?._id ? "Edit Product" : "Add Product"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalMessage.show && (
            <Alert variant={modalMessage.type} className="mb-3">
              {modalMessage.message}
            </Alert>
          )}
          {selectedProduct && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedProduct.product}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      product: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={selectedProduct.description}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      description: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Diet Info</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={selectedProduct.dietInfo || ""}
                  placeholder="Enter diet information (e.g., health benefits, nutritional benefits)"
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      dietInfo: e.target.value,
                    })
                  }
                />
              </Form.Group>

              <h6 className="mt-3">Vitamins</h6>
              <div className="d-flex gap-2">
                <Form.Control
                  type="number"
                  placeholder="Vitamin E"
                  value={selectedProduct.vitamins.vitaminE}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      vitamins: {
                        ...selectedProduct.vitamins,
                        vitaminE: e.target.value,
                      },
                    })
                  }
                />
                <Form.Control
                  type="number"
                  placeholder="Vitamin B6"
                  value={selectedProduct.vitamins.vitaminB6}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      vitamins: {
                        ...selectedProduct.vitamins,
                        vitaminB6: e.target.value,
                      },
                    })
                  }
                />
                <Form.Control
                  type="number"
                  placeholder="Vitamin K"
                  value={selectedProduct.vitamins.vitaminK}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      vitamins: {
                        ...selectedProduct.vitamins,
                        vitaminK: e.target.value,
                      },
                    })
                  }
                />
              </div>

              <h6 className="mt-3">Minerals</h6>
              <div className="d-flex gap-2">
                <Form.Control
                  type="number"
                  placeholder="Magnesium"
                  value={selectedProduct.minerals.magnesium}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      minerals: {
                        ...selectedProduct.minerals,
                        magnesium: e.target.value,
                      },
                    })
                  }
                />
                <Form.Control
                  type="number"
                  placeholder="Potassium"
                  value={selectedProduct.minerals.potassium}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      minerals: {
                        ...selectedProduct.minerals,
                        potassium: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="d-flex gap-2 mt-2">
                <Form.Control
                  type="number"
                  placeholder="Iron"
                  value={selectedProduct.minerals.iron}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      minerals: {
                        ...selectedProduct.minerals,
                        iron: e.target.value,
                      },
                    })
                  }
                />
                <Form.Control
                  type="number"
                  placeholder="Calcium"
                  value={selectedProduct.minerals.calcium}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      minerals: {
                        ...selectedProduct.minerals,
                        calcium: e.target.value,
                      },
                    })
                  }
                />
              </div>

              <Form.Group className="mb-3 mt-3">
                <Form.Label>Calories</Form.Label>
                <Form.Control
                  type="number"
                  value={selectedProduct.calories}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      calories: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Protein</Form.Label>
                <Form.Control
                  type="number"
                  value={selectedProduct.protein}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      protein: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Carbs</Form.Label>
                <Form.Control
                  type="number"
                  value={selectedProduct.carbs}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      carbs: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Fats</Form.Label>
                <Form.Control
                  type="number"
                  value={selectedProduct.fats}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      fats: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  value={selectedProduct.price}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      price: e.target.value,
                    })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Select Province</Form.Label>
                <Form.Select
                  value={selectedProduct.province?._id || ""}
                  onChange={(e) => {
                    const prov = provinces.find(
                      (p) => p._id === e.target.value
                    );
                    setSelectedProduct({
                      ...selectedProduct,
                      province: prov || null,
                    });
                  }}
                >
                  <option value="">-- Select Province --</option>
                  {provinces.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Select Shop</Form.Label>
                <Form.Select
                  value={selectedProduct.shop?._id || ""}
                  onChange={(e) => {
                    const shopObj = shops.find((s) => s._id === e.target.value);
                    setSelectedProduct({
                      ...selectedProduct,
                      shop: shopObj || null,
                    });
                  }}
                >
                  <option value="">-- Select Shop --</option>
                  {shops.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
                {(imageFile || selectedProduct.image) && (
                  <div className="mt-3 text-center">
                    <img
                      src={
                        imageFile
                          ? URL.createObjectURL(imageFile)
                          : selectedProduct.image
                      }
                      alt="Preview"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Trending</Form.Label>
                <Form.Select
                  value={selectedProduct.trending ? "yes" : "no"}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      trending: e.target.value === "yes",
                    })
                  }
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </Form.Select>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowModal(false);
              setModalMessage({ show: false, message: "", type: "" });
            }}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {selectedProduct?._id ? "Save Changes" : "Create Product"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        show={showConfirm}
        onHide={() => {
          setShowConfirm(false);
          setDeleteMessage({ show: false, message: "", type: "" });
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deleteMessage.show && (
            <Alert variant={deleteMessage.type} className="mb-3">
              {deleteMessage.message}
            </Alert>
          )}
          {!deleteMessage.show && (
            <p>Are you sure you want to delete this product?</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowConfirm(false);
              setDeleteMessage({ show: false, message: "", type: "" });
            }}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={deleteMessage.show}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
