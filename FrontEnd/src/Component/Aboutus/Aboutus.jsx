import React from "react";
import { Carousel } from "react-bootstrap";
import styles from "./AboutUs.module.css";
import aboutdata from "./aboutdata";
import supervisor from "../../images/WhatsApp Image 2025-12-02 at 00.20.27_abdbcf1c.jpg";
import asmat from "../../images/as2.jpg";
import amir from "../../images/am3.jpg";
import saif from "../../images/Saif.jpg";
import Footer from "../Navbar/Footer/footer";
import team from "../../images/fernando-hernandez-CosHjyONRk8-unsplash.jpg";

// ⬇⬇ ADD THIS
import { motion } from "framer-motion";

export default function AboutUs() {
  return (
    <>
      <div className={styles.aboutusmaincontainer}>
        {/* Top Slider Section */}
        <section className={styles.slideimages}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            <Carousel
              interval={2000}
              controls={false}
              indicators={true}
              fade={false}
              pauseOnHover={false}
              className={styles.customCarousel}
            >
              {aboutdata.map((data) => (
                <Carousel.Item key={data.id}>
                  <div
                    className={styles.backgroundSlide}
                    style={{
                      backgroundImage: `url(${data.image})`,
                    }}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          </motion.div>
        </section>

        {/* About Section */}
        <section className={styles.wrapper}>
          <motion.div
            className={styles.container}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className={styles.titles}>
              About <span className={styles.highlight}>Dry Fruit Finder</span>
            </h2>

            <p className={styles.description}>
              Dry Fruit Finder is a smart platform that helps people easily
              search and learn about dry fruits across Pakistan. From price
              details to shop locations, our system is designed to connect users
              with authentic dry fruit sellers.
            </p>

            <h3 className={styles.missionTitle}>Our Mission</h3>

            <p className={styles.missionDescription}>
              To provide a reliable and simple way for users to discover and
              purchase dry fruits while promoting healthy living and supporting
              local sellers.
            </p>
          </motion.div>
        </section>

        {/* Supervisor Section */}
        <div className={styles.supervisorContainer}>
          <motion.div
            className={styles.container}
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className={styles.textBlock}>
              <h2 className={styles.title}>Dr.Naveed Ahmad</h2>
              <p>
                <strong>Dr. Naveed Ahmad</strong> has guided us in building a
                <em>well-structured</em> and high-performing system through his
                thoughtful feedback. From improving our detection flow to
                shaping the search and result modules, he provides{" "}
                <strong>clear direction</strong> and deep technical insight that
                strengthens every part of the project.
              </p>

              <p>
                Through a few focused sessions, he helped us refine core
                features, compare approaches, and enhance the user experience.
                His mentorship ensures our system becomes{" "}
                <em>smart, efficient,</em> and valuable for all users.
              </p>
            </div>

            <motion.div
              className={styles.imageBlock}
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <img
                src={supervisor}
                alt="Professional working at laptop"
                className={styles.image}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Team Members */}
      <div>
        <h2 className={styles.teamheading}>Team Members</h2>

        <div
          className={styles.teammembercontainer}
          style={{
            backgroundImage: `url(${team})`,
            backgroundSize: "cover",
            backgroundPosition: " top center",
          }}
        >
          {/* Asmat */}
          <motion.div
            className={styles.teammembercard}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.05, y: -8 }}
          >
            <div className={styles.topSection}>
              <img src={asmat} alt="Asmat" />
            </div>
            <div className={styles.bottomSection}>
              <h3>Asmat Ullah</h3>
              <p>
                Asmat Ullah is a Software Engineering student at NUML Islamabad
                with strong skills in frontend development, especially in HTML,
                CSS, and JavaScript.
              </p>
              <div className={styles.socialIcons}>
                <a
                  href="https://github.com/asmatullah"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialIcon}
                >
                  <i className="fab fa-github"></i>
                </a>
                <a
                  href="https://linkedin.com/in/asmatullah"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialIcon}
                >
                  <i className="fab fa-linkedin"></i>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Amir */}
          <motion.div
            className={styles.teammembercard}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.05, y: -8 }}
          >
            <div className={styles.topSection}>
              <img src={amir} alt="Amir" />
            </div>
            <div className={styles.bottomSection}>
              <h3>Amir Sohail</h3>
              <p>
                Amir Sohail studies Software Engineering at NUML Islamabad and
                is skilled in AI and machine learning, working on models for
                intelligent systems.
              </p>
              <div className={styles.socialIcons}>
                <a
                  href="https://github.com/amirsohail"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialIcon}
                >
                  <i className="fab fa-github"></i>
                </a>
                <a
                  href="https://linkedin.com/in/amirsohail"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialIcon}
                >
                  <i className="fab fa-linkedin"></i>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Saif */}
          <motion.div
            className={styles.teammembercard}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.05, y: -8 }}
          >
            <div className={styles.topSection}>
              <img src={saif} alt="Saif" />
            </div>
            <div className={styles.bottomSection}>
              <h3>Saifullah</h3>
              <p>
                Saifullah is a Software Engineering student at NUML Islamabad
                who specializes in backend development, particularly with Java
                and databases.
              </p>
              <div className={styles.socialIcons}>
                <a
                  href="https://github.com/saifullah"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.socialIcon} ${styles.saificon}`}
                >
                  <i className="fab fa-github"></i>
                </a>
                <a
                  href="https://linkedin.com/in/saifullah"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.socialIcon} ${styles.saificon}`}
                >
                  <i className="fab fa-linkedin"></i>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </>
  );
}
