import React from "react";
import "../Footer/footer.css";
import Logo from "../../../images/food-logo.png";
import { FaEnvelope, FaPhone, FaHome } from "react-icons/fa";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <>
      <div className="Main-footer">
        <div className="logo-footer">
          <h1>Dry Fruit Detector</h1>
          <div className="footer-img">
            <img src={Logo} alt="log" height="80px" width="80px" />
            <p className="project-by">
              Project by: Amir Sohail, Asmat, Saifullah <br />
              Dept. of Software Engineering, NUML Islamabad.
            </p>
          </div>
        </div>
        <div className="Quick-Links">
          <h1>QUICK lINKS</h1>
          <div>
            <Link to="/Contactus" className="qli">
              Contact Us
            </Link>
          </div>
          <div>
            <Link to="/privacy-policy" className="qli">
              Privacy Policy
            </Link>
          </div>
          <div>
            <Link to="/terms-conditions" className="qli">
              Terms & Conditions
            </Link>
          </div>
        </div>
        <div className="Contat-us">
          <h1>Contact us</h1>
          <div>
            <span>
              <FaEnvelope
                style={{
                  color: "#1E40AF",
                  fontSize: "20px",
                }}
              />
              <a
                href="mailto:amirsohailkhattak@gmail.com"
                style={{ color: "#f3f4f6" }}
                className="groa"
              >
                amirsohailkhattak@gmail.com
              </a>
            </span>
          </div>
          <div>
            <span>
              <FaPhone style={{ color: "#16A34A", fontSize: "20px" }} />{" "}
              03351946509
            </span>
          </div>
          <div>
            <span>
              {" "}
              <FaHome style={{ color: "#7C3AED", fontSize: "20px" }} />
              <a
                target="_blank "
                href="https://maps.app.goo.gl/nJDUjzRq6Cwx5WdQA"
                style={{ color: "#f3f4f6" }}
                className="groa"
              >
                h/9 NUML islamabad
              </a>
            </span>
          </div>
        </div>
        <div className="follow-us">
          <h1>FOLLOW US</h1>
          <div className="socail-item">
            <div className="face-book">
              <FaFacebook style={{ color: "#1877F2", fontSize: "24px" }} />
              <span>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.facebook.com/asmatulla.asmatullah.9?mibextid=ZbWKwL"
                >
                  Facebook
                </a>
              </span>
            </div>
            <div className="LinkedIn">
              <FaLinkedin style={{ color: "#0077B5", fontSize: "24px" }} />
              <span>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.linkedin.com/in/asmat-ullah-b39018293?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                >
                  LinkedIn
                </a>
              </span>
            </div>
            <div className="Instagram">
              <FaInstagram style={{ color: "#E1306C", fontSize: "24px" }} />
              <span>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.instagram.com/asmat_khan7?igsh=YzdvODczZjV6ZW8x"
                >
                  Instagram
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Dry Fruit Finder. All rights reserved.
        </p>
      </div>
    </>
  );
}
