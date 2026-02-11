import React from "react";
import "./alert.css";

export default function Alert({ open, onClose, seasonData }) {
  if (!open) return null;

  return (
    <div className="alert-modal-overlay" onClick={onClose}>
      <div className="alert-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-content">
            <div className="title-section">
              <div className="title-main">Seasonal Availability</div>
              <div className="title-subtitle">
                Current Harvest Period Information
              </div>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-content">
          {!seasonData ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading seasonal data...</p>
            </div>
          ) : (
            <>
              <div className="season-highlight">
                <div className="season-badge">
                  <span className="badge-text">{seasonData.name} Season</span>
                </div>
                <div className="season-dates">
                  <div className="date-item">
                    <span className="date-label">STARTS</span>
                    <span className="date-value">
                      {new Date(seasonData.startDate).toLocaleDateString(
                        "en-US",
                        { month: "long", day: "numeric", year: "numeric" }
                      )}
                    </span>
                  </div>
                  <div className="date-separator">→</div>
                  <div className="date-item">
                    <span className="date-label">ENDS</span>
                    <span className="date-value">
                      {new Date(seasonData.endDate).toLocaleDateString(
                        "en-US",
                        { month: "long", day: "numeric", year: "numeric" }
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="fruits-section">
                <div className="section-header">
                  <h3>Available Fruits</h3>
                  <span className="fruits-count">
                    {seasonData.dryFruits && seasonData.dryFruits.length > 0 
                      ? `${seasonData.dryFruits.length} items` 
                      : "No items"}
                  </span>
                </div>
                {seasonData.dryFruits && seasonData.dryFruits.length > 0 ? (
                  <div className="fruits-list">
                    {seasonData.dryFruits.map((fruit, index) => (
                      <div key={index} className="fruit-item">
                        <span className="fruit-name">
                          {fruit.product || fruit.name || "Unknown"}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-fruits-message">
                    <p>No dry fruits available for this season.</p>
                  </div>
                )}
              </div>

              <div className="modal-actions">
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
