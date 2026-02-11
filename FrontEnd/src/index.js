import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./tailwind.css";
import "./app.css"; // Import our design system FIRST
import "bootstrap/dist/css/bootstrap.min.css";
import "./force-styles.css"; // Force our styles to override Bootstrap
import "./fix-layout.css"; // Fix layout issues (cards, navbar alignment)
import "./slick-override.css"; // Override slick-carousel for proper card spacing
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const container = document.getElementById("root");

if (!container) {
  throw new Error(
    "Failed to find the root element. Make sure you have a <div id='root'></div> in your index.html"
  );
}

const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
