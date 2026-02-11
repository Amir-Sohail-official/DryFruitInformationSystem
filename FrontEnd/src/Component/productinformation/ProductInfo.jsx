import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import styles from "./ProductInfo.module.css";
import Footer from "../Navbar/Footer/footer";
export default function ProductInfo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('product');
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.data.product);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);
  if (loading) {
    return (
      <div className={styles.centerLoader}>
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading product...</p>
      </div>
    );
  }
  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
        <div className="text-center mt-3">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            ⬅ Go Back
          </Button>
        </div>
      </Container>
    );
  }
  if (!product) {
    return (
      <Container className="mt-5">
        <Alert variant="warning" className="text-center">
          No product found.
        </Alert>
      </Container>
    );
  }
  const shop = product.shop || {};
  const city = shop.city || {};
  const province = city.province || {};
  return (
    <>
      <Container className={styles.pageContainer}>
        <div className={styles.pageInner}>
          <div className={styles.heroSection}>
            <h1 className={styles.pageTitle}>{product.product}</h1>
            <p className={styles.pageSubtitle}>
              {product.dietInfo || "Premium, handpicked nutritious dry fruit"}
            </p>
            <div className={styles.heroImageWrapper}>
              <div className={styles.imageBox}>
                <img
                  src={product.image}
                  alt={product.product}
                  className={styles.mainImage}
                />
              </div>
            </div>
          </div>
          <Card className={`${styles.infoCard} ${styles.mainInfoCard} mb-4`}>
            <Card.Body>
              <div className={styles.tabHeader}>
                <button
                  type="button"
                  className={`${styles.tabButton} ${activeTab === 'product' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab('product')}
                >
                  Product Info
                </button>
                <button
                  type="button"
                  className={`${styles.tabButton} ${activeTab === 'shop' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab('shop')}
                >
                  Shop Info
                </button>
              </div>
              {activeTab === 'product' ? (
                <div className={styles.tabContent}>
                  <div className={styles.infoItem}>
                    <span>Price</span>
                    <strong>{product.price ? `PKR ${product.price}` : "—"}</strong>
                  </div>
                  <div className={styles.infoItem}>
                    <span>Diet Info</span>
                    <strong>{product.dietInfo || "General"}</strong>
                  </div>
                  {product.benefits && (
                    <div className={styles.infoSection}>
                      <h6 className={styles.infoSectionTitle}>Benefits</h6>
                      <p className={styles.infoSectionText}>{product.benefits}</p>
                    </div>
                  )}
                  {product.unbenefits && (
                    <div className={styles.infoSection}>
                      <h6 className={styles.infoSectionTitle}>Disadvantages</h6>
                      <p className={styles.infoSectionText}>{product.unbenefits}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.tabContent}>
                  <div className={styles.infoItem}>
                    <span>Name</span>
                    <strong>{shop.name || "—"}</strong>
                  </div>
                  <div className={styles.infoItem}>
                    <span>Contact</span>
                    <strong>{shop.contact || "—"}</strong>
                  </div>
                  <div className={styles.infoItem}>
                    <span>Address</span>
                    <strong>{shop.address || "—"}</strong>
                  </div>
                  <div className={styles.infoItem}>
                    <span>City</span>
                    <strong>{city.name || "—"}</strong>
                  </div>
                  <div className={styles.infoItem}>
                    <span>Province</span>
                    <strong>{province.name || "—"}</strong>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
          <Card className={`${styles.nutritionCard} mb-4`}>
            <Card.Body>
              <Card.Title>Nutritional Information</Card.Title>
              <Row className="g-4">
                <Col md={6}>
                  <h6 className={styles.nutrientGroupTitle}>Vitamins</h6>
                  <div className={styles.nutrientList}>
                    <div className={styles.nutrientItem}>
                      <span>Vitamin E</span>
                      <strong>{product.vitamins?.vitaminE || "—"} mg</strong>
                    </div>
                    <div className={styles.nutrientItem}>
                      <span>Vitamin B6</span>
                      <strong>{product.vitamins?.vitaminB6 || "—"} mg</strong>
                    </div>
                    <div className={styles.nutrientItem}>
                      <span>Vitamin K</span>
                      <strong>{product.vitamins?.vitaminK || "—"} mcg</strong>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <h6 className={styles.nutrientGroupTitle}>Minerals</h6>
                  <div className={styles.nutrientList}>
                    <div className={styles.nutrientItem}>
                      <span>Magnesium</span>
                      <strong>{product.minerals?.magnesium || "—"} mg</strong>
                    </div>
                    <div className={styles.nutrientItem}>
                      <span>Potassium</span>
                      <strong>{product.minerals?.potassium || "—"} mg</strong>
                    </div>
                    <div className={styles.nutrientItem}>
                      <span>Iron</span>
                      <strong>{product.minerals?.iron || "—"} mg</strong>
                    </div>
                    <div className={styles.nutrientItem}>
                      <span>Calcium</span>
                      <strong>{product.minerals?.calcium || "—"} mg</strong>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          {/* BUTTONS */}
          <div className={styles.buttonRow}>
            <Button variant="secondary" onClick={() => navigate(-1)}>
              ⬅ Back
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                const el =
                  document.querySelector('input[type="search"]') ||
                  document.querySelector('input[placeholder*="Search" i]');
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "center" });
                  el.focus();
                } else {
                  navigate("/search");
                }
              }}
            >
              🔍 Search
            </Button>
          </div>
        </div>
      </Container>
      <Footer />
    </>
  );
}
