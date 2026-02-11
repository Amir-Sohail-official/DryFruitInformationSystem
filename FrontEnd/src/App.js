import React, { useState } from "react";
import "./app.css";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./Component/Navbar/navbar";
import Contactus from "./Component/Contactus/Contactus";
import Home from "./Component/Home";
import AboutUs from "./Component/Aboutus/Aboutus";
import Signup from "./Component/Signup/Signup";
import Signin from "./Component/Signin/Signin";
import Privacy from "./Component/Privacyandpolicy/Privacy.jsx";
import TermsAndConditions from "./Component/TermsAndConditions/TermsAndConditions.jsx";
import FeedbackForm from "./Component/Feedback/feedback.jsx";
import Upload from "./Component/Upload/Upload.jsx";
import Alert from "./Component/seasonalAlerts/Alert.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductInfo from "./Component/productinformation/ProductInfo.jsx";
import { AuthProvider } from "./AuthContext.jsx";
import Profile from "./Component/Profile/Profile.jsx";
import HealthInfo from "./Component/Healthinfo/HealthInfo.jsx";
import ProtectedRoute from "./ProtectedRoute";
import SearchResult from "./Component/search/SearchResult.jsx";
import Dashboard from "./admin/Dashboard.jsx";
import ChatBoard from "./Component/ChatBoard/ChatBoard.jsx";

function AppContent() {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.includes("/admin");

  const [showChat, setShowChat] = useState(false);

  return (
    <>
      {!isAdminRoute && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Contactus" element={<Contactus />} />
        <Route path="/Aboutus" element={<AboutUs />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/privacy-policy" element={<Privacy />} />
        <Route path="/terms-conditions" element={<TermsAndConditions />} />
        <Route path="/Feedback" element={<FeedbackForm />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/alert" element={<Alert />} />
        <Route path="/products/:id" element={<ProductInfo />} />
        <Route path="/healthinfo/:id" element={<HealthInfo />} />
        <Route path="/search-result" element={<SearchResult />} />
        <Route
          path="/admin/dashboard/*"
          element={
            <ProtectedRoute adminOnly>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>

      {!isAdminRoute && (
        <button className="chatBtn" onClick={() => setShowChat(true)}>
          <svg
            className="chatIcon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}
      <ChatBoard show={showChat} onClose={() => setShowChat(false)} />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
