import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./SearchResult.module.css";

export default function SearchResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const results = location.state?.results || [];

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles["search-result-page"]}>
      <div className={styles["header-section"]}>
        <button className={styles["back-button"]} onClick={handleBack}>
          ← Back
        </button>
        <h2>Search Results</h2>
      </div>
      {results.length === 0 ? (
        <div className={styles["no-results-container"]}>
          <div className={styles["no-results-icon"]}>🔍</div>
          <p className={styles["no-results"]}>No products found.</p>
          <p className={styles["no-results-subtitle"]}>Try adjusting your search terms or browse our categories.</p>
        </div>
      ) : (
        <>
          <p className={styles["results-count"]}>
            Found <strong>{results.length}</strong> product{results.length !== 1 ? 's' : ''}
          </p>
          <div className={styles["result-grid"]}>
            {results.map((item, index) => (
              <div key={index} className={styles["result-card"]}>
                <div className={styles["card-header"]}>
                  <h3>{item.product}</h3>
                </div>
                <p className={styles["description"]}>{item.description}</p>
                <div className={styles["card-details"]}>
                  <div className={styles["detail-row"]}>
                    <span className={styles["detail-label"]}>Price:</span>
                    <span className={styles["detail-value"]}>PKR {item.price}</span>
                  </div>
                  <div className={styles["detail-row"]}>
                    <span className={styles["detail-label"]}>Shop:</span>
                    <span className={styles["detail-value"]}>{item.shop?.name || 'N/A'}</span>
                  </div>
                  <div className={styles["detail-row"]}>
                    <span className={styles["detail-label"]}>Province:</span>
                    <span className={styles["detail-value"]}>{item.province?.name || 'Not available'}</span>
                  </div>
                  <div className={styles["detail-row"]}>
                    <span className={styles["detail-label"]}>City:</span>
                    <span className={styles["detail-value"]}>{item.city?.name || 'Not available'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
