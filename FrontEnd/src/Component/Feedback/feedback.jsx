import styles from "./FeedbackForm.module.css";
import { useState } from "react";
import Footer from "../../Component/Navbar/Footer/footer";
import api from "../../api";
import { toast } from "react-toastify";

export default function FeedbackForm() {
  const [feedback, setFeedBack] = useState(false);
  const [formData, setFormData] = useState({
    rating: "",
    feedbackType: "",
    message: "",
    allowContact: false,
  });

  const BASE_URL = "/feedbacks";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedBack(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to submit feedback!");
        return;
      }

      const feedbackData = {
        type: formData.feedbackType,
        rating: formData.rating,
        message: formData.message,
      };

      await api.post(BASE_URL, feedbackData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Feedback submitted successfully!");
      setFormData({
        rating: "",
        feedbackType: "",
        message: "",
        allowContact: false,
      });
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to submit feedback!"
      );
    } finally {
      setFeedBack(false);
    }
  };

  return (
    <>
      <div className={styles.feedbackWrapper}>
        <h2 className={styles.feedbackTitle}>We Value Your Feedback</h2>
        <form className={styles.feedbackForm} onSubmit={handleSubmit}>
          <select
            name="rating"
            required
            className={styles.feedbackSelect}
            value={formData.rating}
            onChange={handleChange}
          >
            <option value="">Rate our System</option>
            <option value="Excellent">1 - Excellent</option>
            <option value="Good">2 - Good</option>
            <option value="Average">3 - Average</option>
            <option value="Poor">4 - Poor</option>
            <option value="Very Poor">5 - Very Poor</option>
          </select>
          <select
            name="feedbackType"
            required
            className={styles.feedbackSelect}
            onChange={handleChange}
            value={formData.feedbackType}
          >
            <option value="">Select Feedback Type</option>
            <option value="Bug">Bug</option>
            <option value="Suggestion">Suggestion</option>
            <option value="Complaint">Complaint</option>
            <option value="Other">Other</option>
          </select>
          <textarea
            name="message"
            placeholder="Enter your feedback here..."
            required
            className={styles.feedbackTextarea}
            onChange={handleChange}
            value={formData.message}
          ></textarea>
          <div className={styles.feedbackCheckboxRow}>
            <input
              type="checkbox"
              name="allowContact"
              checked={formData.allowContact}
              onChange={handleChange}
            />
            <label>Allow us to contact you for follow-up</label>
          </div>
          <button
            type="submit"
            className={styles.feedbackBtn}
            disabled={feedback}
          >
            {feedback ? " Submiting....." : " Submit Feedback"}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}
