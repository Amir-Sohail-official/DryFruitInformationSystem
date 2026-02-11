import React from "react";
import styles from "./TermsAndConditions.module.css";
import Footer from "../Navbar/Footer/footer";

const TermsAndConditions = () => {
  return (
    <>
      <div className={styles["tc-wrapper"]}>
        <div className={styles["tc-breadcrumb"]}></div>
        <div className={styles["tc-card"]}>
          <h1 className={styles["tc-heading"]}>Terms and Conditions</h1>
          <p className={styles["tc-date"]}>Effective Date: May 14, 2025</p>

          <div className={styles["tc-section"]}>
            <div className={styles["tc-number"]}>1</div>
            <div>
              <h2 className={styles["tc-title"]}>Acceptance of Terms</h2>
              <p>
                By accessing or using our Dry Fruit Detection System, you agree
                to be bound by these Terms and Conditions. If you do not agree,
                please do not use the service.
              </p>
            </div>
          </div>

          <div className={styles["tc-section"]}>
            <div className={styles["tc-number"]}>2</div>
            <div>
              <h2 className={styles["tc-title"]}>User Responsibilities</h2>
              <ul className={styles["tc-list"]}>
                <li>
                  You must provide accurate information during registration.
                </li>
                <li>
                  You are responsible for maintaining the confidentiality of
                  your account.
                </li>
                <li>
                  You agree not to misuse the system or upload harmful content.
                </li>
              </ul>
            </div>
          </div>

          <div className={styles["tc-section"]}>
            <div className={styles["tc-number"]}>3</div>
            <div>
              <h2 className={styles["tc-title"]}>Intellectual Property</h2>
              <p>
                All content and materials on this system, including the AI
                model, design, and data, are owned by the development team and
                protected by copyright laws.
              </p>
            </div>
          </div>

          <div className={styles["tc-section"]}>
            <div className={styles["tc-number"]}>4</div>
            <div>
              <h2 className={styles["tc-title"]}>Limitations of Liability</h2>
              <p>
                We are not liable for any direct or indirect damage resulting
                from the use of our system, including inaccurate detections or
                data delays.
              </p>
            </div>
          </div>

          <div className={styles["tc-section"]}>
            <div className={styles["tc-number"]}>5</div>
            <div>
              <h2 className={styles["tc-title"]}>Account Suspension</h2>
              <p>
                We reserve the right to suspend or terminate accounts that
                violate these terms or are involved in suspicious activities.
              </p>
            </div>
          </div>

          <div className={styles["tc-section"]}>
            <div className={styles["tc-number"]}>6</div>
            <div>
              <h2 className={styles["tc-title"]}>Changes to Terms</h2>
              <p>
                These terms may be updated from time to time. Continued use of
                the system after changes means you accept the updated terms.
              </p>
            </div>
          </div>

          <div className={styles["tc-section"]}>
            <div className={styles["tc-number"]}>7</div>
            <div>
              <h2 className={styles["tc-title"]}>Contact</h2>
              <p>
                If you have any questions about these Terms and Conditions,
                contact us at:{" "}
                <strong className={styles.termpa}>
                  <a href="mailto:amirsohailkhattak@gmail.com">
                    {" "}
                    amirsohailkhattak@gmail.com
                  </a>
                </strong>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TermsAndConditions;
