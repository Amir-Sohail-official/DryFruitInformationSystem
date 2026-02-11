import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import styles from "./HealthInfo.module.css";
import { motion } from "framer-motion";

export default function HealthInfo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [healthInfo, setHealthInfo] = useState(null);

  useEffect(() => {
    api
      .get(`/health/${id}`)
      .then((res) => setHealthInfo(res.data.data.healthInfo))
      .catch((err) => console.error(err));
  }, [id]);

  if (!healthInfo) return <p className={styles.loading}>Loading...</p>;

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className={styles.header}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 className={styles.title}>{healthInfo.diseaseName}</h1>
      </motion.div>

      <motion.p
        className={styles.description}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {healthInfo.description}
      </motion.p>

      {/* Recommended Dry Fruits */}
      <motion.h2
        className={`${styles.sectionTitle} ${styles.green}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Recommended Dry Fruits
      </motion.h2>

      <div className={styles.grid}>
        {healthInfo.recommendedDryFruits.map((item, i) => (
          <motion.div
            key={i}
            className={`${styles.card} ${styles.greenCard}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * i }}
          >
            {item.product ? (
              <>
                <img
                  src={item.product.image}
                  alt={item.product.product}
                  className={styles.image}
                />
                <h3 className={styles.name}>{item.product.product}</h3>
              </>
            ) : (
              <p className={styles.missing}>Product not found</p>
            )}
            <p className={styles.quantity}>{item.quantity}</p>
            <p className={styles.reason}>{item.reason}</p>
          </motion.div>
        ))}
      </div>

      {/* Avoid Dry Fruits */}
      {healthInfo.avoidDryFruits && healthInfo.avoidDryFruits.length > 0 ? (
        <>
          <motion.h2
            className={`${styles.sectionTitle} ${styles.red}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Avoid Dry Fruits
          </motion.h2>

          <div className={styles.grid}>
            {healthInfo.avoidDryFruits.map((item, i) => (
              <motion.div
                key={i}
                className={`${styles.card} ${styles.redCard}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * i }}
              >
                {item.product ? (
                  <>
                    <img
                      src={item.product.image}
                      alt={item.product.product}
                      className={styles.image}
                    />
                    <h3 className={styles.name}>{item.product.product}</h3>
                    {item.reason && (
                      <p className={styles.reason}>{item.reason}</p>
                    )}
                  </>
                ) : (
                  <div className={styles.noProductCard}>
                    <p className={styles.reason}>{item.reason || "No specific dry fruits to avoid"}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={styles.noAvoidSection}
        >
          <motion.h2
            className={`${styles.sectionTitle} ${styles.green}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Avoid Dry Fruits
          </motion.h2>
          <motion.p
            className={styles.noAvoidMessage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            No specific dry fruits to avoid. All dry fruits can be consumed in moderation for this condition.
          </motion.p>
        </motion.div>
      )}
    </motion.div>
  );
}
