import { useEffect, useState } from "react";
import api from "../api";
import Hero from "./Herosection/Hero";
import Background from "./Background/Background";
import Card from "./Products/Card";
import Choseus from "./WhyChooseUs/Choseus";
import Footer from "./Navbar/Footer/footer";
import "./Products/card.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const NextArrow = ({ onClick }) => (
  <div className="next-arrow" onClick={onClick}>
    <i className="fas fa-chevron-right arrow-icon"></i>
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div className="prev-arrow" onClick={onClick}>
    <i className="fas fa-chevron-left arrow-icon"></i>
  </div>
);

export default function Home() {
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        console.log("Full API response:", res.data);
        
        // Handle different response structures
        const productsData = res.data?.data?.products || res.data?.products || [];
        
        if (productsData && productsData.length > 0) {
          setProducts(productsData);
          console.log("Products loaded:", productsData.length);
        } else {
          setErrorMessage("No products found in database.");
          console.warn("No products in response:", res.data);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        const errorMsg = err.response?.data?.message || 
                        err.message || 
                        "Failed to load products. Make sure the backend server is running on http://localhost:3000";
        setErrorMessage(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <>
      <Hero />
      <Background />

      <div className="product_cards">
        {loading ? (
          <p>Loading products...</p>
        ) : errorMessage ? (
          <p style={{ color: "red", textAlign: "center" }}>{errorMessage}</p>
        ) : (
          <Slider {...settings}>
            {products.map((item) => (
              <Card key={item._id} products={item} />
            ))}
          </Slider>
        )}
      </div>

      <Choseus />
      <Footer />
    </>
  );
}
