import React, { useState, useEffect } from "react";
import Logo from "../../images/food-logo.png";
import { FaSearch, FaBell } from "react-icons/fa";
import "./navbar.css";
import { NavLink, useNavigate } from "react-router-dom";
import Alert from "../seasonalAlerts/Alert";
import { useAuth } from "../../AuthContext";
import api from "../../api";

export default function Navbar() {
  const [alertOpen, setAlertOpen] = useState(false);
  const [seasonData, setSeasonData] = useState(null);
  const [hasAlert, setHasAlert] = useState(false);
  const [diseases, setDiseases] = useState([]);
  const [searchInput, setSearchInput] = useState();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Fetch alert status
    const fetchAlert = async () => {
      try {
        const res = await api.get("/seasons/alert/today");
        const json = res.data;
        console.log("Season alert response:", json);
        // Check if data exists and is not null
        if (json?.data && json.data !== null && Object.keys(json.data).length > 0) {
          setSeasonData(json.data);
          setHasAlert(true);
          console.log("Season alert set:", json.data);
        } else {
          console.log("No active season found for today");
          setHasAlert(false);
          setSeasonData(null);
        }
      } catch (e) {
        console.error("Failed to fetch alert", e);
        setHasAlert(false);
        setSeasonData(null);
      }
    };

    // 🆕 Fetch diseases for dropdown
    const fetchDiseases = async () => {
      try {
        const res = await api.get("/health");
        const json = res.data;
        setDiseases(json.data.healthInfo || []);
      } catch (e) {
        console.error("Failed to fetch health info", e);
      }
    };

    fetchAlert();
    fetchDiseases();
  }, []);

  const openSeasonAlert = () => {
    setAlertOpen(true);
    setHasAlert(false);
  };
  console.log(seasonData);

  // 🆕 When user selects a disease
  const handleDiseaseSelect = (e) => {
    const selectedId = e.target.value;
    if (selectedId) {
      navigate(`/healthinfo/${selectedId}`);
    }
  };

  const handleSearch = async (e) => {
    if (e.key === "Enter" && searchInput.trim()) {
      try {
        const searchTerm = searchInput.trim().toLowerCase();
        const words = searchTerm.split(" ");
        const filters = {};

        words.forEach((word) => {
          // Check if it's a number (price)
          if (!isNaN(word) && word !== "") {
            filters.price = parseInt(word);
          } 
          // Check for trending keywords
          else if (word.includes("trend") || word === "trending") {
            filters.trending = "true";
          } 
          // Otherwise treat as province name
          else if (word.length > 0) {
            // If province filter doesn't exist, create it, otherwise append
            if (!filters.province) {
              filters.province = word;
            } else {
              // If multiple words, use the first one as province
              filters.province = filters.province || word;
            }
          }
        });

        console.log("Search filters:", filters);

        const res = await api.get("/products/search", {
          params: filters,
        });

        console.log("Search results:", res.data);

        const products = res.data?.data?.products || res.data?.products || [];
        
        navigate("/search-result", {
          state: { results: products },
        });

        setSearchInput("");
      } catch (e) {
        console.error("Search error:", e);
        alert(`Search failed: ${e.response?.data?.message || e.message}`);
      }
    }
  };

  return (
    <>
      <div className="main-nav flex items-center gap-4 justify-between px-4 py-2">
        <div className="logo-div flex items-center">
          <img src={Logo} alt="logo" className="logo-img w-10 h-10 md:w-12 md:h-12" />
        </div>
        <div className="text-div flex items-center gap-3 flex-1 min-w-0 overflow-x-auto">
          <NavLink className="nav-link" to="/">
            Home
          </NavLink>
          <NavLink className="nav-link" to="/upload">
            Upload
          </NavLink>
          <NavLink className="nav-link" to="/Feedback">
            Feedback
          </NavLink>
          <NavLink className="nav-link" to="/Aboutus">
            About Us
          </NavLink>

          {!user && (
            <>
              <NavLink className="nav-link" to="/signup">
                Sign up
              </NavLink>
              <NavLink className="nav-link" to="/signin">
                Sign in
              </NavLink>
            </>
          )}

          {user && (
            <>
              <NavLink className="nav-link" to="/profile">
                Profile
              </NavLink>
              {user.role === "admin" && (
                <NavLink className="nav-link" to="/admin/dashboard">
                  Dashboard
                </NavLink>
              )}
            </>
          )}

          {/* 🆕 Dropdown for health info */}
          <div className="nav-link dropdown">
            <select
              onChange={handleDiseaseSelect}
              className="health-dropdown rounded-md border border-gray-300 px-2 py-1 text-sm"
              value=""
            >
              <option value="">Health Info</option>
              {diseases.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.diseaseName}
                </option>
              ))}
            </select>
          </div>

          {/* Notification Bell */}
          <div className="nav-link notification-wrapper relative" onClick={openSeasonAlert}>
            <FaBell className="bell-icon" />
            {hasAlert && <span className="notification-badge"></span>}
          </div>
        </div>

        <div className="input-search flex items-center gap-2 ml-auto flex-shrink-0">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search (e.g. punjab 500 trending)"
            value={searchInput}
            className="search-input flex-1 rounded-md border border-gray-300 px-3 py-2"
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
      </div>

      {/* Seasonal Alert Modal */}
      <Alert
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        seasonData={seasonData}
      />
    </>
  );
}
