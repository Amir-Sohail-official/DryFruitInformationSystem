import React, { useState } from "react";
import styles from "./UploadDryFruitImage.module.css";
import { Modal, Button } from "react-bootstrap";
import api from "../../api";

export default function FancyUploadCard() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  const [detectedFruit, setDetectedFruit] = useState("");

  const handleClose = () => setShowModal(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setMessage("");
      setDetectedFruit("");
    }
  };
  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const predictApi = process.env.REACT_APP_PREDICT_API;
      const response = await fetch(predictApi, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      const predictedName = data.message;
      setDetectedFruit(predictedName);

      // --- CASE 1: UNKNOWN FRUIT ---
      if (predictedName === "unknown") {
        setMessage("Outside model’s knowledge.");
        setProductDetails(null);
        return;
      }

      setMessage(`Predicted Fruit: ${predictedName}`);
      fetchProductDetails(predictedName);
    } catch (error) {
      console.error("Upload failed:", error);
      setMessage("Upload failed. Check console.");
    }
  };

  const fetchProductDetails = async (fruitName) => {
    try {
      const response = await api.get(`/products/by-name/${fruitName}`);

      if (response.data.data.product) {
        setProductDetails(response.data.data.product);
      } else {
        setMessage("No details found.");
      }
    } catch (error) {
      console.error("Backend error:", error);
      setMessage("Cannot fetch product details.");
    }
  };

  return (
    <div className={styles.uploadContainer}>
      <div className={styles.uploadCard}>
        <h2 className={styles.title}>Upload Dry Fruit Image</h2>

        {/* Custom File Upload Button */}
        <label className={styles.customFileUpload}>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          Choose Image
        </label>

        {preview && (
          <img src={preview} alt="Preview" className={styles.previewImage} />
        )}

        <button onClick={handleUpload} className={styles.uploadButton}>
          Upload
        </button>

        {message && (
          <p
            style={{
              color: message.includes("Outside") ? "red" : "#28a745",
              fontWeight: "600",
              marginTop: "10px",
            }}
          >
            {message}
          </p>
        )}

        {detectedFruit && productDetails && (
          <button
            onClick={() => setShowModal(true)}
            className={styles.uploadButton}
            style={{ marginTop: "10px" }}
          >
            Read More
          </button>
        )}
      </div>

      {/* MODAL */}
      <Modal show={showModal} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold fs-3 text-primary">
            {productDetails?.product}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="px-4 pt-4 pb-4">
          {/* IMAGE */}
          <div className="text-center mb-4">
            <img
              src={productDetails?.image}
              alt=""
              style={{
                width: "85%",
                maxHeight: "320px",
                objectFit: "cover",
                borderRadius: "14px",
                boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
              }}
            />
          </div>

          {/* DESCRIPTION */}
          <div
            className="p-3 rounded mb-4"
            style={{ background: "#f9fafc", border: "1px solid #eef1f5" }}
          >
            <h5 className="fw-semibold text-dark mb-2">Description</h5>
            <p className="text-muted lh-lg mb-0">
              {productDetails?.description}
            </p>
          </div>

          {/* NUTRITION */}
          <div
            className="p-3 rounded mb-4"
            style={{ background: "#f9fbff", border: "1px solid #e6ebf5" }}
          >
            <h5 className="fw-semibold text-dark mb-2">Nutrition</h5>
            <div className="d-flex flex-wrap gap-2 mt-2">
              <span className="nutrition-chip">
                Calories: {productDetails?.calories}
              </span>
              <span className="nutrition-chip">
                Protein: {productDetails?.protein}g
              </span>
              <span className="nutrition-chip">
                Carbs: {productDetails?.carbs}g
              </span>
              <span className="nutrition-chip">
                Fats: {productDetails?.fats}g
              </span>
            </div>
          </div>

          {/* VITAMINS */}
          <div
            className="p-3 rounded mb-4"
            style={{ background: "#fffaf3", border: "1px solid #ffeccc" }}
          >
            <h5 className="fw-semibold text-dark mb-2">Vitamins</h5>
            <div className="d-flex flex-wrap gap-2 mt-2">
              <span className="vitamin-chip">
                Vitamin E: {productDetails?.vitamins?.vitaminE}
              </span>
              <span className="vitamin-chip">
                Vitamin B6: {productDetails?.vitamins?.vitaminB6}
              </span>
              <span className="vitamin-chip">
                Vitamin K: {productDetails?.vitamins?.vitaminK}
              </span>
            </div>
          </div>

          {/* MINERALS */}
          <div
            className="p-3 rounded mb-4"
            style={{ background: "#f3fbff", border: "1px solid #d8f0ff" }}
          >
            <h5 className="fw-semibold text-dark mb-2">Minerals</h5>
            <div className="d-flex flex-wrap gap-2 mt-2">
              <span className="mineral-chip">
                Magnesium: {productDetails?.minerals?.magnesium}mg
              </span>
              <span className="mineral-chip">
                Potassium: {productDetails?.minerals?.potassium}mg
              </span>
              <span className="mineral-chip">
                Iron: {productDetails?.minerals?.iron}mg
              </span>
              <span className="mineral-chip">
                Calcium: {productDetails?.minerals?.calcium}mg
              </span>
            </div>
          </div>

          {/* BENEFITS */}
          <div
            className="p-3 rounded mb-4"
            style={{ background: "#f8fff8", border: "1px solid #d8f5d8" }}
          >
            <h5 className="fw-semibold text-dark mb-2">Benefits</h5>
            <p className="text-muted lh-lg mb-0">{productDetails?.benefits}</p>
          </div>

          {/* SIDE EFFECTS */}
          <div
            className="p-3 rounded mb-4"
            style={{ background: "#fff8f8", border: "1px solid #ffdede" }}
          >
            <h5 className="fw-semibold text-dark mb-2">
              Possible Side Effects
            </h5>
            <p className="text-muted lh-lg mb-0">
              {productDetails?.unbenefits}
            </p>
          </div>
        </Modal.Body>

        <Modal.Footer className="border-0 pt-0">
          <Button variant="secondary" onClick={handleClose} className="px-4">
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
