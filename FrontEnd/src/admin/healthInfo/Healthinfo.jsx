// import React, { useEffect, useState, useCallback } from "react";
// import {
//   Table,
//   Button,
//   Modal,
//   Form,
//   Spinner,
//   Alert,
//   Row,
//   Col,
// } from "react-bootstrap";
// import api from "../../api";

// export default function HealthList() {
//   const [healthInfo, setHealthInfo] = useState([]);
//   const [dryFruits, setDryFruits] = useState([]);
//   const [selectedHealth, setSelectedHealth] = useState({
//     diseaseName: "",
//     description: "",
//     recommendedDryFruits: [], // [{ product: id, quantity: "", reason: "" }]
//     avoidDryFruits: [], // [{ product: id, reason: "" }]
//   });
//   const [loading, setLoading] = useState(false);
//   const [originalHealth, setOriginalHealth] = useState(null);
//   const [modalMessage, setModalMessage] = useState({
//     show: false,
//     type: "",
//     message: "",
//   });
//   const [alert, setAlert] = useState({ show: false, message: "", type: "" });
//   const [showModal, setShowModal] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [deleteId, setDeleteId] = useState(null);

//   const showAlert = useCallback((message, type = "success") => {
//     setAlert({ show: true, message, type });
//     setTimeout(() => setAlert({ show: false, message: "", type: "" }), 1000);
//   }, []);

//   const fetchHealthInfo = useCallback(async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("/health");
//       // adapt to your API: either res.data.data.healthInfo or res.data.data
//       const list = res.data.data?.healthInfo || res.data.data || [];
//       setHealthInfo(list);
//     } catch (err) {
//       showAlert("Failed to fetch health information", "danger");
//     } finally {
//       setLoading(false);
//     }
//   }, [showAlert]);

//   const fetchDryFruits = useCallback(async () => {
//     try {
//       const res = await api.get("/products");
//       setDryFruits(res.data.data?.products || res.data.data || []);
//     } catch {
//       showAlert("Failed to fetch dry fruits", "danger");
//     }
//   }, [showAlert]);

//   useEffect(() => {
//     fetchHealthInfo();
//     fetchDryFruits();
//   }, [fetchHealthInfo, fetchDryFruits]);

//   // ---------- helpers to manage dynamic entries ----------
//   const addRecommended = () =>
//     setSelectedHealth((s) => ({
//       ...s,
//       recommendedDryFruits: [
//         ...(s.recommendedDryFruits || []),
//         { product: "", quantity: "", reason: "" },
//       ],
//     }));

//   const updateRecommended = (idx, field, value) =>
//     setSelectedHealth((s) => {
//       const arr = [...(s.recommendedDryFruits || [])];
//       arr[idx] = { ...arr[idx], [field]: value };
//       return { ...s, recommendedDryFruits: arr };
//     });

//   const removeRecommended = (idx) =>
//     setSelectedHealth((s) => {
//       const arr = [...(s.recommendedDryFruits || [])];
//       arr.splice(idx, 1);
//       return { ...s, recommendedDryFruits: arr };
//     });

//   const addAvoid = () =>
//     setSelectedHealth((s) => ({
//       ...s,
//       avoidDryFruits: [
//         ...(s.avoidDryFruits || []),
//         { product: "", reason: "" },
//       ],
//     }));

//   const updateAvoid = (idx, field, value) =>
//     setSelectedHealth((s) => {
//       const arr = [...(s.avoidDryFruits || [])];
//       arr[idx] = { ...arr[idx], [field]: value };
//       return { ...s, avoidDryFruits: arr };
//     });

//   const removeAvoid = (idx) =>
//     setSelectedHealth((s) => {
//       const arr = [...(s.avoidDryFruits || [])];
//       arr.splice(idx, 1);
//       return { ...s, avoidDryFruits: arr };
//     });

//   // ---------- save add/update ----------
//   const handleSave = async () => {
//     if (!selectedHealth.diseaseName?.trim()) {
//       setModalMessage({
//         show: true,
//         type: "warning",
//         message: "Please enter the disease name.",
//       });
//       return;
//     }

//     // ✅ Filter out empty product selections
//     const filteredRecommended = (
//       selectedHealth.recommendedDryFruits || []
//     ).filter((r) => r.product && r.product.trim() !== "");
//     const filteredAvoid = (selectedHealth.avoidDryFruits || []).filter(
//       (a) => a.product && a.product.trim() !== ""
//     );

//     // ✅ Update selectedHealth before sending
//     const updatedHealth = {
//       ...selectedHealth,
//       recommendedDryFruits: filteredRecommended,
//       avoidDryFruits: filteredAvoid,
//     };

//     // If nothing left after filtering
//     if (filteredRecommended.length === 0 && filteredAvoid.length === 0) {
//       setModalMessage({
//         show: true,
//         type: "warning",
//         message: "Please select at least one valid product.",
//       });
//       return;
//     }

//     try {
//       if (
//         updatedHealth._id &&
//         JSON.stringify(updatedHealth) === JSON.stringify(originalHealth)
//       ) {
//         setModalMessage({
//           show: true,
//           type: "warning",
//           message: "No changes detected!",
//         });
//         return;
//       }

//       setLoading(true);
//       setModalMessage({ show: false, type: "", message: "" });

//       let res;
//       if (updatedHealth._id) {
//         res = await api.patch(`/health/${updatedHealth._id}`, updatedHealth);
//       } else {
//         res = await api.post("/health", updatedHealth);
//       }

//       const message =
//         res.data.message ||
//         (updatedHealth._id ? "Health info updated!" : "Health info added!");
//       setModalMessage({ show: true, type: "success", message });

//       setTimeout(() => {
//         setShowModal(false);
//         fetchHealthInfo();
//       }, 800);
//     } catch (err) {
//       const backendMsg =
//         err.response?.data?.message || "Failed to save health info.";
//       setModalMessage({ show: true, type: "danger", message: backendMsg });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------- delete ----------
//   const handleDelete = async () => {
//     try {
//       setLoading(true);
//       await api.delete(`/health/${deleteId}`);
//       showAlert("Health info deleted!", "success");
//       setShowConfirm(false);
//       fetchHealthInfo();
//     } catch (err) {
//       const msg = err.response?.data?.message || "Failed to delete";
//       showAlert(msg, "danger");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------- edit/load ----------
//   const handleEdit = (health) => {
//     // normalize incoming data. if products are populated objects, get their _id; otherwise assume it's id
//     const recommended = (health.recommendedDryFruits || []).map((r) => ({
//       product: r.product?._id || r.product || "",
//       quantity: r.quantity || "",
//       reason: r.reason || "",
//     }));
//     const avoid = (health.avoidDryFruits || []).map((a) => ({
//       product: a.product?._id || a.product || "",
//       reason: a.reason || "",
//     }));

//     const h = {
//       _id: health._id,
//       diseaseName: health.diseaseName || "",
//       description: health.description || "",
//       recommendedDryFruits: recommended,
//       avoidDryFruits: avoid,
//     };
//     setSelectedHealth(h);
//     setOriginalHealth(h);
//     setModalMessage({ show: false, type: "", message: "" });
//     setShowModal(true);
//   };

//   const handleAdd = () => {
//     setSelectedHealth({
//       diseaseName: "",
//       description: "",
//       recommendedDryFruits: [],
//       avoidDryFruits: [],
//     });
//     setModalMessage({ show: false, type: "", message: "" });
//     setShowModal(true);
//   };

//   // helper to show product name in table when product may be populated object or id
//   const getProductLabel = (productObjOrId) => {
//     if (!productObjOrId) return "N/A";
//     if (typeof productObjOrId === "string") {
//       // fallback: find in dryFruits list
//       const found = dryFruits.find((p) => p._id === productObjOrId);
//       return found ? found.product : productObjOrId;
//     }
//     // object populated
//     return (
//       productObjOrId.product ||
//       productObjOrId.name ||
//       productObjOrId._id ||
//       "N/A"
//     );
//   };

//   return (
//     <div className="container mt-4">
//       {alert.show && (
//         <Alert variant={alert.type} className="text-center fw-semibold">
//           {alert.message}
//         </Alert>
//       )}

//       <div className="d-flex justify-content-end mb-3">
//         <Button variant="success" onClick={handleAdd}>
//           + Add Health Info
//         </Button>
//       </div>

//       <h4 className="mb-3">Health Information Management</h4>

//       {loading ? (
//         <div className="text-center">
//           <Spinner animation="border" />
//         </div>
//       ) : (
//         <Table striped bordered hover responsive>
//           <thead className="text-center">
//             <tr>
//               <th>#</th>
//               <th>Disease</th>
//               <th>Description</th>
//               <th>Recommended (qty / reason)</th>
//               <th>Avoid (reason)</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody className="text-center">
//             {healthInfo.length > 0 ? (
//               healthInfo.map((item, index) => (
//                 <tr key={item._id}>
//                   <td>{index + 1}</td>
//                   <td>{item.diseaseName}</td>
//                   <td
//                     style={{
//                       maxWidth: 250,
//                       whiteSpace: "pre-wrap",
//                       textAlign: "left",
//                     }}
//                   >
//                     {item.description || "—"}
//                   </td>
//                   <td style={{ textAlign: "left" }}>
//                     {(item.recommendedDryFruits || []).length > 0
//                       ? (item.recommendedDryFruits || []).map((r, i) => (
//                           <div key={i}>
//                             {getProductLabel(r.product)}{" "}
//                             {r.quantity ? `(qty: ${r.quantity})` : ""}{" "}
//                             {r.reason ? `- ${r.reason}` : ""}
//                           </div>
//                         ))
//                       : "N/A"}
//                   </td>
//                   <td style={{ textAlign: "left" }}>
//                     {(item.avoidDryFruits || []).length > 0
//                       ? (item.avoidDryFruits || []).map((a, i) => (
//                           <div key={i}>
//                             {getProductLabel(a.product)}{" "}
//                             {a.reason ? `- ${a.reason}` : ""}
//                           </div>
//                         ))
//                       : "N/A"}
//                   </td>
//                   <td>
//                     <Button
//                       variant="outline-primary"
//                       size="sm"
//                       className="mb-2"
//                       onClick={() => handleEdit(item)}
//                     >
//                       Edit
//                     </Button>
//                     <Button
//                       variant="outline-danger"
//                       size="sm"
//                       onClick={() => {
//                         setDeleteId(item._id);
//                         setShowConfirm(true);
//                       }}
//                     >
//                       Delete
//                     </Button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={6} className="text-center">
//                   No health info found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </Table>
//       )}

//       {/* Add / Edit Modal */}
//       <Modal
//         show={showModal}
//         onHide={() => setShowModal(false)}
//         centered
//         size="lg"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>
//             {selectedHealth._id ? "Edit Health Info" : "Add Health Info"}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {modalMessage.show && (
//             <Alert variant={modalMessage.type}>{modalMessage.message}</Alert>
//           )}

//           <Form>
//             <Form.Group>
//               <Form.Label>Disease Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={selectedHealth.diseaseName}
//                 onChange={(e) =>
//                   setSelectedHealth({
//                     ...selectedHealth,
//                     diseaseName: e.target.value,
//                   })
//                 }
//                 placeholder="Enter disease name"
//               />
//             </Form.Group>

//             <Form.Group className="mt-3">
//               <Form.Label>Description</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={2}
//                 value={selectedHealth.description}
//                 onChange={(e) =>
//                   setSelectedHealth({
//                     ...selectedHealth,
//                     description: e.target.value,
//                   })
//                 }
//                 placeholder="Short description (optional)"
//               />
//             </Form.Group>

//             {/* Recommended */}
//             <div className="mt-3">
//               <div className="d-flex justify-content-between align-items-center">
//                 <Form.Label>Recommended Dry Fruits</Form.Label>
//                 <Button size="sm" onClick={addRecommended}>
//                   + Add Recommended
//                 </Button>
//               </div>

//               {(selectedHealth.recommendedDryFruits || []).map((r, idx) => (
//                 <Row key={idx} className="g-2 align-items-center mb-2">
//                   <Col md={5}>
//                     <Form.Select
//                       value={r.product}
//                       onChange={(e) =>
//                         updateRecommended(idx, "product", e.target.value)
//                       }
//                     >
//                       <option value="">Select product</option>
//                       {dryFruits.map((p) => (
//                         <option key={p._id} value={p._id}>
//                           {p.product}
//                         </option>
//                       ))}
//                     </Form.Select>
//                   </Col>
//                   <Col md={3}>
//                     <Form.Control
//                       placeholder="Quantity (e.g. 2 pcs/day)"
//                       value={r.quantity}
//                       onChange={(e) =>
//                         updateRecommended(idx, "quantity", e.target.value)
//                       }
//                     />
//                   </Col>
//                   <Col md={3}>
//                     <Form.Control
//                       placeholder="Reason (optional)"
//                       value={r.reason}
//                       onChange={(e) =>
//                         updateRecommended(idx, "reason", e.target.value)
//                       }
//                     />
//                   </Col>
//                   <Col md={1}>
//                     <Button
//                       variant="danger"
//                       size="sm"
//                       onClick={() => removeRecommended(idx)}
//                     >
//                       x
//                     </Button>
//                   </Col>
//                 </Row>
//               ))}
//             </div>

//             {/* Avoid */}
//             <div className="mt-3">
//               <div className="d-flex justify-content-between align-items-center">
//                 <Form.Label>Avoid Dry Fruits</Form.Label>
//                 <Button size="sm" onClick={addAvoid}>
//                   + Add Avoid
//                 </Button>
//               </div>

//               {(selectedHealth.avoidDryFruits || []).map((a, idx) => (
//                 <Row key={idx} className="g-2 align-items-center mb-2">
//                   <Col md={6}>
//                     <Form.Select
//                       value={a.product}
//                       onChange={(e) =>
//                         updateAvoid(idx, "product", e.target.value)
//                       }
//                     >
//                       <option value="">Select product</option>
//                       {dryFruits.map((p) => (
//                         <option key={p._id} value={p._id}>
//                           {p.product}
//                         </option>
//                       ))}
//                     </Form.Select>
//                   </Col>
//                   <Col md={5}>
//                     <Form.Control
//                       placeholder="Reason (optional)"
//                       value={a.reason}
//                       onChange={(e) =>
//                         updateAvoid(idx, "reason", e.target.value)
//                       }
//                     />
//                   </Col>
//                   <Col md={1}>
//                     <Button
//                       variant="danger"
//                       size="sm"
//                       onClick={() => removeAvoid(idx)}
//                     >
//                       x
//                     </Button>
//                   </Col>
//                 </Row>
//               ))}
//             </div>
//           </Form>
//         </Modal.Body>

//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Cancel
//           </Button>
//           <Button variant="primary" onClick={handleSave} disabled={loading}>
//             {loading ? <Spinner animation="border" size="sm" /> : "Save"}
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Delete Confirmation */}
//       <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm Delete</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           Are you sure you want to delete this health information?
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowConfirm(false)}>
//             Cancel
//           </Button>
//           <Button variant="danger" onClick={handleDelete} disabled={loading}>
//             {loading ? <Spinner animation="border" size="sm" /> : "Delete"}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// }
