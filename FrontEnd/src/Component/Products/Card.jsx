// // Card.jsx
// import React from "react";
// import "./card.css";
// import { useNavigate } from "react-router-dom";

// export default function Card({ products }) {
//   const navigate = useNavigate();
//   const openDetails = () => {
//     navigate(`/products/${products._id}`);
//   };

//   return (
//     <div className="product_cards">
//       <div className="product_card_main">
//         <img src={products.image} alt={products.product} />
//         <div className="product_card_tex">
//           <h2>{products.product}</h2>
//           <p>{products.description}</p>
//         </div>
//         <div className="list-info">
//           <ul className="nutrition-info">
//             <li>
//               <strong>Calories:</strong> <span>{products.calories}</span>
//             </li>
//             <li>
//               <strong>Protein:</strong> <span>{products.protein}</span>
//             </li>
//             <li>
//               <strong>Carbs:</strong> <span>{products.carbs}</span>
//             </li>
//             <li>
//               <strong>Fats:</strong> <span>{products.fats}</span>
//             </li>
//           </ul>
//           <button id="btn" onClick={openDetails}>
//             Read More
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
// Card.jsx
import React from "react";
import "./card.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Card({ products }) {
  const navigate = useNavigate();
  const openDetails = () => {
    navigate(`/products/${products._id}`);
  };

  return (
    <motion.div
      className="product_cards w-full"
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.01, y: -3 }}
    >
      <div className="product_card_main grid grid-cols-1 gap-3">
        <img src={products.image} alt={products.product} className="w-full h-48 object-cover rounded-md" />
        <div className="product_card_tex">
          <h2 className="text-lg font-semibold">{products.product}</h2>
          <p className="text-sm text-gray-600 line-clamp-3">{products.description}</p>
        </div>

        <div className="list-info">
          <ul className="nutrition-info">
            <li>
              <strong>Calories:</strong> <span>{products.calories}</span>
            </li>
            <li>
              <strong>Protein:</strong> <span>{products.protein}</span>
            </li>
            <li>
              <strong>Carbs:</strong> <span>{products.carbs}</span>
            </li>
            <li>
              <strong>Fats:</strong> <span>{products.fats}</span>
            </li>
          </ul>

          <motion.button id="btn" onClick={openDetails} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
            Read More
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
