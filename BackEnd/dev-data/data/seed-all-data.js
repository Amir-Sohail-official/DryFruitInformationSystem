/**
 * Complete Database Seeding Script
 * This script populates ALL data needed for the dashboard:
 * - 7 Dry Fruits with images (base64)
 * - Provinces (Pakistan & Afghanistan)
 * - Cities (famous cities in those provinces)
 * - Shops (in Islamabad and Rawalpindi)
 * - Seasons (with proper date ranges and dry fruits)
 * - Health Information
 * - Links products to provinces and shops
 * 
 * Usage: node dev-data/data/seed-all-data.js
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const Product = require("../../models/product.model");
const HealthInfo = require("../../models/health");
const Province = require("../../models/province");
const City = require("../../models/city");
const Shop = require("../../models/shop");
const Season = require("../../models/season");

// Load environment variables
dotenv.config({ path: "./config.env" });

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI ||
      process.env.DATABASE_URL ||
      process.env.DATABASE_LOCAL
  )
  .then(() => console.log("✅ Database connected successfully"))
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });

/**
 * Convert image file to base64 string
 */
function imageToBase64(imagePath) {
  try {
    if (fs.existsSync(imagePath)) {
      const imageBuffer = fs.readFileSync(imagePath);
      const imageBase64 = imageBuffer.toString("base64");
      const ext = path.extname(imagePath).toLowerCase();
      let mimeType = "image/jpeg";
      
      if (ext === ".png") mimeType = "image/png";
      else if (ext === ".webp") mimeType = "image/webp";
      else if (ext === ".jpg" || ext === ".jpeg") mimeType = "image/jpeg";
      
      return `data:${mimeType};base64,${imageBase64}`;
    }
    return null;
  } catch (error) {
    console.error(`Error reading image ${imagePath}:`, error.message);
    return null;
  }
}

/**
 * Find image file for a product
 */
function findProductImage(productName) {
  const uploadsDir = path.join(__dirname, "../../uploads/products");
  const files = fs.readdirSync(uploadsDir);
  
  const searchTerms = productName.toLowerCase().split(" ");
  for (const file of files) {
    const fileName = file.toLowerCase();
    if (searchTerms.some(term => fileName.includes(term))) {
      return path.join(uploadsDir, file);
    }
  }
  
  if (files.length > 0) {
    return path.join(uploadsDir, files[0]);
  }
  return null;
}

/**
 * Dry Fruits Data
 */
const dryFruitsData = [
  {
    product: "Almond",
    description: "Almonds are nutrient-dense nuts rich in healthy fats, protein, fiber, and various vitamins and minerals. They are excellent for heart health, brain function, and weight management.",
    calories: 579,
    protein: 21.2,
    carbs: 21.6,
    fats: 49.9,
    price: 1500,
    dietInfo: "Rich in vitamin E, magnesium, and healthy monounsaturated fats. Excellent for heart health, brain development, and maintaining healthy cholesterol levels.",
    vitamins: { vitaminE: 25.6, vitaminB6: 0.1, vitaminK: 0 },
    minerals: { magnesium: 270, potassium: 733, iron: 3.7, calcium: 269 },
    benefits: "Supports heart health, brain function, weight management, bone health, and skin health. Rich in antioxidants and helps control blood sugar levels.",
    unbenefits: "Overconsumption may cause digestive issues, weight gain, or allergic reactions in sensitive individuals. High in calories, so moderation is key.",
    trending: true,
    imageFile: "almond",
    famousProvinces: ["Balochistan", "KPK", "Bamyan", "Nangarhar"]
  },
  {
    product: "Pistachio",
    description: "Pistachios are delicious green nuts packed with protein, fiber, and antioxidants. They support heart health, eye health, and weight management.",
    calories: 560,
    protein: 20.2,
    carbs: 27.2,
    fats: 45.3,
    price: 2400,
    dietInfo: "High in protein, fiber, and healthy fats. Contains lutein and zeaxanthin for eye health. Good source of B vitamins and minerals.",
    vitamins: { vitaminE: 2.3, vitaminB6: 1.7, vitaminK: 0 },
    minerals: { magnesium: 121, potassium: 1025, iron: 3.9, calcium: 105 },
    benefits: "Promotes heart health, supports eye health, aids weight management, improves gut health, and helps control blood sugar. Rich in antioxidants.",
    unbenefits: "High in calories, so overeating can lead to weight gain. May cause digestive issues if consumed in excess. Some people may be allergic.",
    trending: true,
    imageFile: "pistachio",
    famousProvinces: ["Balochistan", "KPK", "Herat", "Badghis"]
  },
  {
    product: "Cashew",
    description: "Cashews are creamy, kidney-shaped nuts rich in healthy fats, protein, and essential minerals. They support heart health, bone strength, and immune function.",
    calories: 553,
    protein: 18.2,
    carbs: 30.2,
    fats: 43.9,
    price: 2100,
    dietInfo: "Excellent source of copper, magnesium, and zinc. Contains healthy monounsaturated and polyunsaturated fats. Good for heart and bone health.",
    vitamins: { vitaminE: 0.9, vitaminB6: 0.4, vitaminK: 34.1 },
    minerals: { magnesium: 292, potassium: 660, iron: 6.7, calcium: 37 },
    benefits: "Supports heart health, strengthens bones, boosts immune system, promotes healthy brain function, and helps maintain healthy weight.",
    unbenefits: "High in calories and fats, so moderation is important. Overconsumption may cause weight gain. Raw cashews contain urushiol which can be toxic.",
    trending: false,
    imageFile: "cashew",
    famousProvinces: ["Sindh", "Balochistan", "Kandahar"]
  },
  {
    product: "Walnut",
    description: "Walnuts are brain-shaped nuts known for their high omega-3 fatty acid content. They support brain health, heart health, and reduce inflammation.",
    calories: 654,
    protein: 15.2,
    carbs: 13.7,
    fats: 65.2,
    price: 1700,
    dietInfo: "Rich in omega-3 fatty acids (ALA), antioxidants, and polyphenols. Excellent for brain and heart health. High in healthy polyunsaturated fats.",
    vitamins: { vitaminE: 0.7, vitaminB6: 0.5, vitaminK: 2.7 },
    minerals: { magnesium: 158, potassium: 441, iron: 2.9, calcium: 98 },
    benefits: "Supports brain health and cognitive function, promotes heart health, reduces inflammation, supports healthy aging, and may help prevent certain cancers.",
    unbenefits: "Very high in calories and fats, so overeating can lead to weight gain. May cause digestive issues if consumed in large quantities.",
    trending: true,
    imageFile: "walnuts",
    famousProvinces: ["Balochistan", "KPK", "Bamyan", "Parwan"]
  },
  {
    product: "Raisin",
    description: "Raisins are dried grapes packed with natural sugars, fiber, and antioxidants. They provide quick energy, support digestion, and promote bone health.",
    calories: 299,
    protein: 3.1,
    carbs: 79.2,
    fats: 0.5,
    price: 1100,
    dietInfo: "High in natural sugars for quick energy. Rich in fiber, iron, and potassium. Contains antioxidants and polyphenols. Good for digestive health.",
    vitamins: { vitaminE: 0.1, vitaminB6: 0.2, vitaminK: 3.5 },
    minerals: { magnesium: 32, potassium: 749, iron: 1.9, calcium: 50 },
    benefits: "Provides quick energy, supports digestive health, promotes bone health, helps maintain healthy blood pressure, and contains antioxidants.",
    unbenefits: "High in natural sugars, so overconsumption can spike blood sugar levels. May cause digestive issues if eaten in excess. Sticky texture can promote tooth decay.",
    trending: false,
    imageFile: "rasin",
    famousProvinces: ["Punjab", "Sindh", "Kandahar", "Herat"]
  },
  {
    product: "Peanut",
    description: "Peanuts are actually legumes but commonly consumed as nuts. They are rich in protein, healthy fats, and various vitamins and minerals. Great for heart health and weight management.",
    calories: 567,
    protein: 25.8,
    carbs: 16.1,
    fats: 49.2,
    price: 850,
    dietInfo: "Excellent source of plant-based protein. Rich in healthy monounsaturated and polyunsaturated fats. Contains resveratrol and other antioxidants.",
    vitamins: { vitaminE: 8.3, vitaminB6: 0.3, vitaminK: 0 },
    minerals: { magnesium: 168, potassium: 705, iron: 4.6, calcium: 92 },
    benefits: "Supports heart health, aids weight management, provides plant-based protein, supports brain health, and helps control blood sugar levels.",
    unbenefits: "High in calories, so overeating can lead to weight gain. Common allergen. May contain aflatoxins if not stored properly. High in omega-6 which should be balanced.",
    trending: false,
    imageFile: "peanut",
    famousProvinces: ["Punjab", "Sindh", "Helmand", "Kandahar"]
  },
  {
    product: "Fig",
    description: "Figs are sweet, chewy dried fruits rich in fiber, calcium, and antioxidants. They support digestive health, bone strength, and heart health.",
    calories: 249,
    protein: 3.3,
    carbs: 63.9,
    fats: 0.9,
    price: 1400,
    dietInfo: "High in dietary fiber, calcium, and potassium. Contains antioxidants and polyphenols. Natural source of prebiotics for gut health.",
    vitamins: { vitaminE: 0.4, vitaminB6: 0.1, vitaminK: 15.6 },
    minerals: { magnesium: 68, potassium: 680, iron: 2.0, calcium: 162 },
    benefits: "Promotes digestive health, supports bone health, helps maintain healthy blood pressure, provides natural energy, and contains antioxidants.",
    unbenefits: "High in natural sugars, so overconsumption can affect blood sugar levels. May cause digestive discomfort if eaten in excess. Sticky texture can promote tooth decay.",
    trending: false,
    imageFile: "figs",
    famousProvinces: ["Punjab", "Balochistan"]
  }
];

/**
 * Provinces Data - Pakistan & Afghanistan
 */
const provincesData = [
  // Pakistan Provinces
  { name: "Punjab" },
  { name: "Sindh" },
  { name: "Balochistan" },
  { name: "KPK" },
  { name: "Islamabad" },
  // Afghanistan Provinces
  { name: "Kabul" },
  { name: "Herat" },
  { name: "Kandahar" },
  { name: "Bamyan" },
  { name: "Nangarhar" },
  { name: "Badghis" },
  { name: "Parwan" },
  { name: "Helmand" }
];

/**
 * Cities Data - Famous cities in provinces
 */
const citiesData = [
  // Punjab Cities
  { name: "Lahore", provinceName: "Punjab" },
  { name: "Faisalabad", provinceName: "Punjab" },
  { name: "Rawalpindi", provinceName: "Punjab" },
  { name: "Multan", provinceName: "Punjab" },
  { name: "Gujranwala", provinceName: "Punjab" },
  // Sindh Cities
  { name: "Karachi", provinceName: "Sindh" },
  { name: "Hyderabad", provinceName: "Sindh" },
  { name: "Sukkur", provinceName: "Sindh" },
  // Balochistan Cities
  { name: "Quetta", provinceName: "Balochistan" },
  { name: "Turbat", provinceName: "Balochistan" },
  // KPK Cities
  { name: "Peshawar", provinceName: "KPK" },
  { name: "Mardan", provinceName: "KPK" },
  { name: "Abbottabad", provinceName: "KPK" },
  // Islamabad
  { name: "Islamabad", provinceName: "Islamabad" },
  // Afghanistan Cities
  { name: "Kabul City", provinceName: "Kabul" },
  { name: "Herat City", provinceName: "Herat" },
  { name: "Kandahar City", provinceName: "Kandahar" },
  { name: "Bamyan City", provinceName: "Bamyan" },
  { name: "Jalalabad", provinceName: "Nangarhar" }
];

/**
 * Shops Data - Islamabad and Rawalpindi
 */
const shopsData = [
  // Islamabad Shops
  { name: "Dry Fruit Paradise", address: "F-7 Markaz, Islamabad", contact: "03001234567", cityName: "Islamabad" },
  { name: "Premium Nuts & Dry Fruits", address: "Blue Area, Islamabad", contact: "03001234568", cityName: "Islamabad" },
  { name: "Healthy Bites Store", address: "G-9 Markaz, Islamabad", contact: "03001234569", cityName: "Islamabad" },
  { name: "Nature's Best Dry Fruits", address: "I-8 Markaz, Islamabad", contact: "03001234570", cityName: "Islamabad" },
  { name: "Royal Dry Fruits", address: "F-10 Markaz, Islamabad", contact: "03001234571", cityName: "Islamabad" },
  // Rawalpindi Shops
  { name: "Almond House", address: "Raja Bazaar, Rawalpindi", contact: "03001234572", cityName: "Rawalpindi" },
  { name: "Quality Dry Fruits", address: "Saddar, Rawalpindi", contact: "03001234573", cityName: "Rawalpindi" },
  { name: "Fresh Nuts Store", address: "Commercial Market, Rawalpindi", contact: "03001234574", cityName: "Rawalpindi" },
  { name: "Premium Dry Fruits", address: "6th Road, Rawalpindi", contact: "03001234575", cityName: "Rawalpindi" },
  { name: "Best Dry Fruits", address: "Bahria Town, Rawalpindi", contact: "03001234576", cityName: "Rawalpindi" }
];

/**
 * Seasons Data with proper date ranges
 */
const getCurrentYear = () => new Date().getFullYear();

const seasonsData = [
  {
    name: "Winter",
    startDate: new Date(getCurrentYear(), 11, 1), // December 1
    endDate: new Date(getCurrentYear() + 1, 1, 28), // February 28
    dryFruits: ["Almond", "Walnut", "Pistachio", "Cashew"]
  },
  {
    name: "Spring",
    startDate: new Date(getCurrentYear(), 2, 1), // March 1
    endDate: new Date(getCurrentYear(), 4, 31), // May 31
    dryFruits: ["Almond", "Pistachio", "Raisin"]
  },
  {
    name: "Summer",
    startDate: new Date(getCurrentYear(), 5, 1), // June 1
    endDate: new Date(getCurrentYear(), 7, 31), // August 31
    dryFruits: ["Raisin", "Fig", "Peanut"]
  },
  {
    name: "Autumn",
    startDate: new Date(getCurrentYear(), 8, 1), // September 1
    endDate: new Date(getCurrentYear(), 10, 30), // November 30
    dryFruits: ["Walnut", "Almond", "Cashew", "Fig"]
  }
];

/**
 * Health Information Data
 */
const healthInfoData = [
  {
    diseaseName: "Heart Disease",
    description: "Cardiovascular diseases including high blood pressure, high cholesterol, and heart attacks.",
    recommendedDryFruits: [
      { productName: "Almond", quantity: "20-30 per day", reason: "Rich in monounsaturated fats and vitamin E, helps lower bad cholesterol" },
      { productName: "Walnut", quantity: "4-6 per day", reason: "High in omega-3 fatty acids, reduces inflammation and improves heart health" },
      { productName: "Pistachio", quantity: "30-40 per day", reason: "Contains healthy fats and antioxidants that support cardiovascular health" }
    ],
    avoidDryFruits: [
      { productName: "None", reason: "All dry fruits in moderation are generally safe for heart health" }
    ]
  },
  {
    diseaseName: "Diabetes",
    description: "Type 2 diabetes and blood sugar management.",
    recommendedDryFruits: [
      { productName: "Almond", quantity: "15-20 per day", reason: "Low glycemic index, helps control blood sugar levels" },
      { productName: "Walnut", quantity: "3-4 per day", reason: "Low in carbs, helps improve insulin sensitivity" },
      { productName: "Pistachio", quantity: "20-30 per day", reason: "Helps maintain stable blood sugar levels" }
    ],
    avoidDryFruits: [
      { productName: "Raisin", reason: "High in natural sugars, can spike blood glucose levels" },
      { productName: "Fig", reason: "High sugar content may affect blood sugar control" }
    ]
  },
  {
    diseaseName: "Bone Health",
    description: "Osteoporosis, bone weakness, and calcium deficiency.",
    recommendedDryFruits: [
      { productName: "Almond", quantity: "20-25 per day", reason: "Rich in calcium and magnesium, essential for bone strength" },
      { productName: "Fig", quantity: "3-5 per day", reason: "Excellent source of calcium, supports bone density" },
      { productName: "Walnut", quantity: "4-5 per day", reason: "Contains calcium and omega-3s that support bone health" }
    ],
    avoidDryFruits: [
      { productName: "None", reason: "All dry fruits can contribute to bone health when consumed in moderation" }
    ]
  },
  {
    diseaseName: "Digestive Issues",
    description: "Constipation, irritable bowel syndrome, and digestive discomfort.",
    recommendedDryFruits: [
      { productName: "Fig", quantity: "3-5 per day", reason: "High in fiber, natural laxative properties, promotes regular bowel movements" },
      { productName: "Raisin", quantity: "15-20 per day", reason: "Rich in fiber, helps prevent constipation" },
      { productName: "Almond", quantity: "10-15 per day", reason: "Good source of fiber, supports digestive health" }
    ],
    avoidDryFruits: [
      { productName: "Peanut", reason: "May cause digestive discomfort in some individuals, especially if consumed in large quantities" }
    ]
  },
  {
    diseaseName: "Weight Management",
    description: "Obesity, weight loss, and healthy weight maintenance.",
    recommendedDryFruits: [
      { productName: "Almond", quantity: "15-20 per day", reason: "High in protein and fiber, promotes satiety and helps control appetite" },
      { productName: "Pistachio", quantity: "30-40 per day", reason: "Lower in calories than other nuts, helps with portion control" },
      { productName: "Walnut", quantity: "3-4 per day", reason: "Rich in healthy fats that promote satiety" }
    ],
    avoidDryFruits: [
      { productName: "Raisin", reason: "High in calories and sugars, can contribute to weight gain if overconsumed" },
      { productName: "Fig", reason: "High sugar content may contribute to weight gain" }
    ]
  }
];

/**
 * Main seeding function
 */
const seedDatabase = async () => {
  try {
    console.log("🌱 Starting complete database seeding...\n");

    // Clear all existing data
    console.log("🗑️  Clearing existing data...");
    await Product.deleteMany({});
    await HealthInfo.deleteMany({});
    await Province.deleteMany({});
    await City.deleteMany({});
    await Shop.deleteMany({});
    await Season.deleteMany({});
    console.log("✅ All data cleared\n");

    // 1. Insert Provinces
    console.log("📍 Inserting provinces...");
    const insertedProvinces = await Province.insertMany(provincesData);
    const provinceMap = {};
    insertedProvinces.forEach(p => {
      provinceMap[p.name] = p._id;
    });
    console.log(`✅ Inserted ${insertedProvinces.length} provinces\n`);

    // 2. Insert Cities
    console.log("🏙️  Inserting cities...");
    const citiesToInsert = citiesData.map(city => ({
      name: city.name,
      province: provinceMap[city.provinceName]
    }));
    const insertedCities = await City.insertMany(citiesToInsert);
    const cityMap = {};
    insertedCities.forEach(c => {
      cityMap[c.name] = c._id;
    });
    console.log(`✅ Inserted ${insertedCities.length} cities\n`);

    // 3. Insert Shops
    console.log("🏪 Inserting shops...");
    const shopsToInsert = shopsData.map(shop => ({
      name: shop.name,
      address: shop.address,
      contact: shop.contact,
      city: cityMap[shop.cityName]
    }));
    const insertedShops = await Shop.insertMany(shopsToInsert);
    const shopMap = {};
    insertedShops.forEach(s => {
      shopMap[s.name] = s._id;
    });
    console.log(`✅ Inserted ${insertedShops.length} shops\n`);

    // 4. Insert Products with images and links
    console.log("📦 Inserting dry fruits with images...");
    const insertedProducts = [];
    
    for (const fruit of dryFruitsData) {
      const imagePath = findProductImage(fruit.imageFile);
      let imageBase64 = null;
      
      if (imagePath) {
        imageBase64 = imageToBase64(imagePath);
        if (imageBase64) {
          console.log(`  ✅ Found image for ${fruit.product}`);
        }
      }

      // Get first famous province for this product
      const productProvince = fruit.famousProvinces[0];
      const provinceId = provinceMap[productProvince] || insertedProvinces[0]._id;
      
      // Get a random shop from Islamabad or Rawalpindi
      const isbShops = insertedShops.filter(s => 
        shopsData.find(sh => sh.name === s.name && (sh.cityName === "Islamabad" || sh.cityName === "Rawalpindi"))
      );
      const shopId = isbShops.length > 0 ? isbShops[Math.floor(Math.random() * isbShops.length)]._id : insertedShops[0]._id;

      const productData = {
        product: fruit.product,
        description: fruit.description,
        calories: fruit.calories,
        protein: fruit.protein,
        carbs: fruit.carbs,
        fats: fruit.fats,
        price: fruit.price,
        dietInfo: fruit.dietInfo,
        vitamins: fruit.vitamins,
        minerals: fruit.minerals,
        benefits: fruit.benefits,
        unbenefits: fruit.unbenefits,
        trending: fruit.trending,
        image: imageBase64 || `data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==`,
        province: provinceId,
        shop: shopId
      };
      
      const product = await Product.create(productData);
      insertedProducts.push(product);
      console.log(`  ✅ Created: ${fruit.product} (Province: ${productProvince})`);
    }
    
    console.log(`\n✅ Successfully inserted ${insertedProducts.length} products\n`);

    // 5. Insert Seasons
    console.log("🍂 Inserting seasons...");
    const productMap = {};
    insertedProducts.forEach(p => {
      productMap[p.product] = p._id;
    });

    for (const season of seasonsData) {
      const dryFruitIds = season.dryFruits
        .map(name => productMap[name])
        .filter(Boolean);

      await Season.create({
        name: season.name,
        startDate: season.startDate,
        endDate: season.endDate,
        dryFruits: dryFruitIds
      });
      console.log(`  ✅ Created: ${season.name} season (${dryFruitIds.length} dry fruits)`);
    }
    console.log(`\n✅ Successfully inserted ${seasonsData.length} seasons\n`);

    // 6. Insert Health Information
    console.log("🏥 Inserting health information...");
    
    for (const healthInfo of healthInfoData) {
      const recommended = [];
      const avoid = [];
      
      for (const rec of healthInfo.recommendedDryFruits) {
        const product = insertedProducts.find(p => 
          p.product.toLowerCase() === rec.productName.toLowerCase()
        );
        if (product) {
          recommended.push({
            product: product._id,
            quantity: rec.quantity,
            reason: rec.reason
          });
        }
      }
      
      for (const av of healthInfo.avoidDryFruits) {
        if (av.productName !== "None") {
          const product = insertedProducts.find(p => 
            p.product.toLowerCase() === av.productName.toLowerCase()
          );
          if (product) {
            avoid.push({
              product: product._id,
              reason: av.reason
            });
          }
        }
      }
      
      await HealthInfo.create({
        diseaseName: healthInfo.diseaseName,
        description: healthInfo.description,
        recommendedDryFruits: recommended,
        avoidDryFruits: avoid
      });
      
      console.log(`  ✅ Created health info for: ${healthInfo.diseaseName}`);
    }
    
    console.log(`\n✅ Successfully inserted ${healthInfoData.length} health information entries\n`);

    // Summary
    console.log("🎉 Complete database seeding finished successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - Provinces: ${insertedProvinces.length}`);
    console.log(`   - Cities: ${insertedCities.length}`);
    console.log(`   - Shops: ${insertedShops.length}`);
    console.log(`   - Products: ${insertedProducts.length}`);
    console.log(`   - Seasons: ${seasonsData.length}`);
    console.log(`   - Health Info: ${healthInfoData.length}`);
    console.log("\n✨ Your dashboard is now fully populated!");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Run the seeding function
seedDatabase();





