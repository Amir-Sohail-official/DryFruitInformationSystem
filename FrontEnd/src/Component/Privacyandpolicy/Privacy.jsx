import React from "react";
import styles from "./PrivacyPolicy.module.css";
import {
  FaLock,
  FaInfoCircle,
  FaUserShield,
  FaDatabase,
  FaRegEnvelope,
} from "react-icons/fa";
import Footer from "../Navbar/Footer/footer";

const PrivacyPolicy = () => {
  return (
    <>
      <div className={styles["pp-container"]}>
        <h1 className={styles["pp-heading"]}>Privacy Policy</h1>
        <p className={styles["pp-date"]}>Effective Date: May 14, 2025</p>

        <section className={styles["pp-section"]}>
          <h2>
            <FaUserShield className={styles["pp-icon"]} /> Your Privacy Matters
          </h2>
          <p>
            Our system is committed to protecting your privacy. This Privacy
            Policy outlines how we collect, use, and protect your personal data.
          </p>
        </section>

        <section className={styles["pp-section"]}>
          <h2>
            <FaInfoCircle className={styles["pp-icon"]} /> Information We
            Collect
          </h2>
          <ul>
            <li>User details: name, email, and region</li>
            <li>Search history and detection logs</li>
            <li>Uploaded dry fruit images</li>
          </ul>
        </section>

        <section className={styles["pp-section"]}>
          <h2>
            <FaDatabase className={styles["pp-icon"]} /> How We Use Your Data
          </h2>
          <ul>
            <li>To display accurate dry fruit information</li>
            <li>To enhance user experience based on usage</li>
            <li>To keep records of trending searches and statistics</li>
          </ul>
        </section>

        <section className={styles["pp-section"]}>
          <h2>
            <FaLock className={styles["pp-icon"]} /> Data Security
          </h2>
          <p>
            We implement strong security measures to protect your information
            from unauthorized access, disclosure, or destruction.
          </p>
        </section>

        <section className={styles["pp-section"]}>
          <h2>Consent</h2>
          <p>
            By using our system, you agree to our Privacy Policy and terms of
            service.
          </p>
        </section>

        <section className={styles["pp-section"]}>
          <h2>
            <FaRegEnvelope className={styles["pp-icon"]} /> Contact Us
          </h2>
          <p>
            If you have any questions or concerns regarding this policy, feel
            free to contact us at:{" "}
            <strong className={styles.ppa}>
              <a href="mailto:asmatullah6090@gmail.com">
                {" "}
                asmatullah6090@gmail.com
              </a>
            </strong>
          </p>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
