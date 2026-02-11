// import React, { useState, useEffect } from "react";
// import "./Contactus.css";
// import Footer from "../Navbar/Footer/footer";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useAuth } from "../../AuthContext";

// export default function Contactus() {
//   const { user } = useAuth();
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     subject: "",
//     message: "",
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     if (user) {
//       setFormData((prev) => ({
//         ...prev,
//         firstName: user.firstName || "",
//         lastName: user.lastName || "",
//         email: user.email || "",
//       }));
//     }
//   }, [user]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     // if user is logged in, don’t allow editing name/email
//     if (user && ["firstName", "lastName", "email"].includes(name)) return;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const token = localStorage.getItem("token");

//       await axios.post("http://localhost:3000/api/v1/contacts", formData, {
//         headers: token ? { Authorization: `Bearer ${token}` } : {},
//       });

//       toast.success("Message sent successfully!");
//       setFormData({
//         firstName: user?.firstName || "",
//         lastName: user?.lastName || "",
//         email: user?.email || "",
//         subject: "",
//         message: "",
//       });
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message || "Failed to send message. Try again!"
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <>
//       <div className="main-content">
//         <div className="heading-sec">
//           <div className="head-tex">
//             <h2>Contact Us</h2>
//             <p>Reach out to us to accomplish the extraordinary</p>
//           </div>
//         </div>

//         <div className="title-text">
//           <h2>We’d Love to Hear from You</h2>
//           <p>
//             Get in touch to explore dry fruits, ask questions, or discuss how we
//             can help you find the best options across Pakistan.
//           </p>
//         </div>

//         {/* Contact Info */}
//         <section className="contact-section">
//           <div className="contact-card">
//             <h3>Phone</h3>
//             <p>571-777-9955</p>
//           </div>
//           <div className="contact-card">
//             <h3>Fax</h3>
//             <p>571-446-5049</p>
//           </div>
//           <div className="contact-card">
//             <h3>Email</h3>
//             <p>
//               <a href="mailto:asmatullah6090@gmail.com">
//                 asmatullah6090@gmail.com
//               </a>
//             </p>
//           </div>
//           <div className="contact-card">
//             <h3>Location</h3>
//             <p>
//               <a
//                 target="_blank"
//                 href="https://maps.app.goo.gl/nJDUjzRq6Cwx5WdQA"
//                 rel="noopener noreferrer"
//               >
//                 H-9, Islamabad
//                 <br />
//                 NUML University
//               </a>
//             </p>
//           </div>
//         </section>

//         {/* Contact Form */}
//         <section className="contact-form-section">
//           <h2 className="form-heading">Got a Query? Leave Us a Message!</h2>
//           <form className="contact-form" onSubmit={handleSubmit}>
//             <div className="form-row">
//               <input
//                 type="text"
//                 name="firstName"
//                 placeholder="First Name"
//                 value={formData.firstName}
//                 onChange={handleChange}
//                 className="form-input"
//                 readOnly={!!user}
//                 required
//               />
//               <input
//                 type="text"
//                 name="lastName"
//                 placeholder="Last Name"
//                 value={formData.lastName}
//                 onChange={handleChange}
//                 className="form-input"
//                 readOnly={!!user}
//                 required
//               />
//             </div>
//             <input
//               type="email"
//               name="email"
//               placeholder="Email Address"
//               value={formData.email}
//               onChange={handleChange}
//               className="form-input full-width"
//               readOnly={!!user}
//               required
//             />
//             <input
//               type="text"
//               name="subject"
//               placeholder="Subject"
//               value={formData.subject}
//               onChange={handleChange}
//               className="form-input full-width"
//               required
//             />
//             <textarea
//               name="message"
//               placeholder="Your Message"
//               value={formData.message}
//               onChange={handleChange}
//               className="form-textarea full-width"
//               required
//             ></textarea>
//             <button
//               type="submit"
//               className="submit-button"
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? "Query Sending..." : "Submit Form"}
//             </button>
//           </form>
//         </section>

//         <Footer />
//       </div>
//     </>
//   );
// }
import React, { useState, useEffect } from "react";
import "./Contactus.css";
import Footer from "../Navbar/Footer/footer";
import api from "../../api";
import { toast } from "react-toastify";
import { useAuth } from "../../AuthContext";

// ⬇⬇ ADD THIS
import { motion } from "framer-motion";

export default function Contactus() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (user && ["firstName", "lastName", "email"].includes(name)) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      await api.post("/contacts", formData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      toast.success("Message sent successfully!");
      setFormData({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send message. Try again!"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="main-content">
        {/* Heading Section */}
        <motion.div
          className="heading-sec"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="head-tex">
            <h2>Contact Us</h2>
            <p>Reach out to us to accomplish the extraordinary</p>
          </div>
        </motion.div>

        {/* Title Text */}
        <motion.div
          className="title-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h2>We’d Love to Hear from You</h2>
          <p>
            Get in touch to explore dry fruits, ask questions, or discuss how we
            can help you find the best options across Pakistan.
          </p>
        </motion.div>

        {/* Contact Info */}
        <section className="contact-section">
          {["Phone", "Fax", "Email", "Location"].map((title, index) => (
            <motion.div
              key={index}
              className="contact-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <h3>{title}</h3>
              {title === "Phone" && <p>03351946509</p>}
              {title === "Fax" && <p>571-446-5049</p>}
              {title === "Email" && (
                <p>
                  <a href="mailto:amirsohailkhattak@gmail.com">
                    amirsohailkhattak@gmail.com
                  </a>
                </p>
              )}
              {title === "Location" && (
                <p>
                  <a
                    target="_blank"
                    href="https://maps.app.goo.gl/nJDUjzRq6Cwx5WdQA"
                    rel="noopener noreferrer"
                  >
                    H-9, Islamabad <br /> NUML University
                  </a>
                </p>
              )}
            </motion.div>
          ))}
        </section>

        {/* Contact Form */}
        <motion.section
          className="contact-form-section"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="form-heading">Got a Query? Leave Us a Message!</h2>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="form-input"
                readOnly={!!user}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="form-input"
                readOnly={!!user}
                required
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="form-input full-width"
              readOnly={!!user}
              required
            />

            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              className="form-input full-width"
              required
            />

            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              className="form-textarea full-width"
              required
            ></textarea>

            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Query Sending..." : "Submit Form"}
            </button>
          </form>
        </motion.section>

        <Footer />
      </div>
    </>
  );
}
