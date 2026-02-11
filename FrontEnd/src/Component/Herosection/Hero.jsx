import React from "react";
import "./hero.css";
import Image from "../../images/dryfruti.jpg";
export default function Hero() {
  return (
    <>
      <div className="Hero-main">
        <div className="hero-text">
          <h2>Discover Pakistan's Finest Dry Fruits with Ease </h2>
          <p>
            At <b>Dry Fruit Finder</b>, we help you locate the
            <em>best quality</em> dry fruits from across Pakistan, right from
            almonds in Balochistan to raisins in Punjab. Whether you're a{" "}
            <b>health enthusiast</b> or a local vendor, our system connects you
            with <i>trusted suppliers</i> and provides in-depth nutritional
            insights to guide your purchase. With just a few clicks, explore dry
            fruits by region, compare prices, and even find nearby shops. Let us
            make healthy living more accessible for everyone
          </p>
          <button>Start Exploring </button>
        </div>
        <div className="image-hero">
          <img src={Image} alt="imag" />
        </div>
      </div>
    </>
  );
}
