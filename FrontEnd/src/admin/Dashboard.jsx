import React from "react";
import { NavLink, Routes, Route } from "react-router-dom";
import DashboardNavbar from "./DashboardNavbar";
import User from "./users/UserList";
import "./dashboard.css";
import ProductsList from "./product/Product";
import CityList from "./city/City";
import ProvinceList from "./province/Province";
import ShopList from "./shop/Shop";
import SeasonList from "./season/Season";
import FeedbackList from "./feedback/Feedback";
import ContactList from "./contacts/Contact";
import Home from "./DashboardHome";
import AdminProfile from "./profile/AdminProfile";

export default function Dashboard() {
  return (
    <>
      <DashboardNavbar />

      <div className="container-fluid" style={{ marginTop: "4rem" }}>
        <div className="row">
          <div
            className="col-md-3 col-lg-2 vh-100 p-3 position-fixed admin-sidebar d-md-block"
            id="dashboardSidebar"
            style={{
              top: "4rem",
              overflowY: "auto",
              backgroundColor: "var(--sidebar-bg, #f8f9fa)",
            }}
          >
            <h6 className="sidebar-title">Admin Menu</h6>

            <nav className="nav flex-column gap-1 text-decoration-none">
              <NavLink
                to="/admin/dashboard/users"
                className="nav-link d-flex align-items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-4.337 0-8 2.239-8 5v1h16v-1c0-2.761-3.663-5-8-5z" />
                </svg>
                <span>Users</span>
              </NavLink>

              <NavLink
                to="/admin/dashboard/products"
                className="nav-link d-flex align-items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M21 16V8a1 1 0 0 0-.553-.894l-8-4a1 1 0 0 0-.894 0l-8 4A1 1 0 0 0 3 8v8a1 1 0 0 0 .553.894l8 4a1 1 0 0 0 .894 0l8-4A1 1 0 0 0 21 16zM12 5.236 18.764 8.5 12 11.764 5.236 8.5 12 5.236zM5 10.236 11 13.5v5.264L5 15.5v-5.264zM13 18.764V13.5l6-3.264V15.5l-6 3.264z" />
                </svg>
                <span>Products</span>
              </NavLink>

              <NavLink
                to="/admin/dashboard/cities"
                className="nav-link d-flex align-items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3 22h18v-2H3v2zm16-4V8h-5V4h-4v4H5v10h14z" />
                </svg>
                <span>Cities</span>
              </NavLink>

              <NavLink
                to="/admin/dashboard/provinces"
                className="nav-link d-flex align-items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zm0 7L2 4v13l10 5 10-5V4l-10 5z" />
                </svg>
                <span>Provinces</span>
              </NavLink>

              <NavLink
                to="/admin/dashboard/shops"
                className="nav-link d-flex align-items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M4 4h16l-1 6H5L4 4zm1 8h14v8H5v-8z" />
                </svg>
                <span>Shops</span>
              </NavLink>

              <NavLink
                to="/admin/dashboard/seasonal"
                className="nav-link d-flex align-items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M6 2l6 6 6-6-6 16-6-16z" />
                </svg>
                <span>Seasonal</span>
              </NavLink>

              <NavLink
                to="/admin/dashboard/feedback"
                className="nav-link d-flex align-items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
                </svg>
                <span>Feedback</span>
              </NavLink>

              <NavLink
                to="/admin/dashboard/contact"
                className="nav-link d-flex align-items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M21 8V7l-3 2-2-1-3 2-3-2-2 1-3-2v1l3 2v5l5 3 5-3V10l3-2z" />
                </svg>
                <span>Contact</span>
              </NavLink>
            </nav>
          </div>

          <div
            className="col-md-9 col-lg-10 offset-md-3 offset-lg-2 p-4"
            style={{ marginLeft: "16.6%" }}
          >
            <Routes>
              <Route index element={<Home />} />
              <Route path="users" element={<User />} />
              <Route path="products" element={<ProductsList />} />
              <Route path="cities" element={<CityList />} />
              <Route path="provinces" element={<ProvinceList />} />
              <Route path="shops" element={<ShopList />} />
              <Route path="seasonal" element={<SeasonList />} />
              <Route path="feedback" element={<FeedbackList />} />
              <Route path="contact" element={<ContactList />} />
              <Route path="profile" element={<AdminProfile />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}
