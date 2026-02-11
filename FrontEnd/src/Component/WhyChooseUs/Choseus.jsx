import React, { useState, useEffect } from "react";
import "./Choseus.css";
import { motion } from "framer-motion";
import api from "../../api";

const features = [
  {
    title: "Trusted Suppliers",
    description:
      "Only verified and reliable dry fruit sellers across Pakistan.",
    icon: "🤝",
  },
  {
    title: "Easy Search",
    description: "Filter by province, fruit type, or nearby shops in seconds.",
    icon: "🧭",
  },
  {
    title: "Secure Platform",
    description: "Your information and searches stay encrypted and protected.",
    icon: "🔒",
  },
  {
    title: "Freshness Guaranteed",
    description:
      "Partner stores follow strict freshness and storage protocols.",
    icon: "🌿",
  },
  {
    title: "Best Price Comparison",
    description: "Compare suppliers side-by-side to secure the best deal.",
    icon: "💸",
  },
  {
    title: "Province-Based Insights",
    description:
      "Access nutrition, advantages, and top growers for every province.",
    icon: "📍",
  },
];

export default function Choseus() {
  const [stats, setStats] = useState([
    { value: "0+", label: "Verified vendors" },
    { value: "0+", label: "Cities covered" },
    { value: "0.0/5", label: "Average user rating" },
    { value: "100%", label: "Quality checks" },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/stats/public");
        const data = res.data.data;
        
        // Format stats for display
        const formattedStats = [
          { 
            value: `${data.verifiedVendors || 0}+`, 
            label: "Verified vendors" 
          },
          { 
            value: `${data.citiesCovered || 0}+`, 
            label: "Cities covered" 
          },
          { 
            value: `${data.averageRating || "4.9"}/5`, 
            label: "Average user rating" 
          },
          { 
            value: data.qualityChecks || "100%", 
            label: "Quality checks" 
          },
        ];
        
        setStats(formattedStats);
      } catch (error) {
        console.error("Error fetching stats:", error);
        // Keep default values on error
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);
  return (
    <section className="why-choose-section">
      <div className="why-choose-container">
        {/* HEADER */}
        <motion.div
          className="why-choose-header"
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="section-eyebrow">Premium marketplace experience</p>
          <h2 id="chose-heading">Why Choose Dry Fruit Finder?</h2>
          <p className="section-description">
            Discover curated listings, price transparency, and province-based
            expertise that make sourcing premium dry fruits effortless.
          </p>
        </motion.div>

        {/* FEATURES LEFT SIDE ANIMATION */}
        <div className="why-choose-grid">
          {features.map((feature, index) => (
            <motion.article
              className="feature-card"
              key={feature.title}
              initial={{ opacity: 0, x: -50 }} // 👈 comes from left
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <span className="feature-icon" aria-hidden="true">
                {feature.icon}
              </span>
              <div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </motion.article>
          ))}
        </div>

        {/* STATS RIGHT SIDE ANIMATION */}
        <div className="why-choose-stats">
          {stats.map((stat, index) => (
            <motion.div
              className="stat-card"
              key={stat.label}
              initial={{ opacity: 0, x: 60 }} // 👈 comes from right
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <span className="stat-value">
                {loading ? "..." : stat.value}
              </span>
              <span className="stat-label">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
