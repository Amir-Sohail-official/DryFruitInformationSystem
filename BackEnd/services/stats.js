const userRepo = require("../repository/user");
const shopRepo = require("../repository/shop");
const productRepo = require("../repository/product");
const cityRepo = require("../repository/city");
const provinceRepo = require("../repository/province");
const feedbackRepo = require("../repository/feedback");
const contactRepo = require("../repository/contact");
const seasonRepo = require("../repository/season");
const Feedback = require("../models/feed-back");

exports.getOverviewStats = async () => {
  const [
    totalUsers,
    totalShops,
    totalProducts,
    totalCities,
    totalProvinces,
    totalFeedback,
    totalContacts,
    totalSeasons,
  ] = await Promise.all([
    userRepo.countDocument(),
    shopRepo.countDocument(),
    productRepo.countDocument(),
    cityRepo.countDocument(),
    provinceRepo.countDocument(),
    feedbackRepo.countDocument(),
    contactRepo.countDocument(),
    seasonRepo.countDocument(),
  ]);

  return {
    totalUsers,
    totalShops,
    totalProducts,
    totalCities,
    totalProvinces,
    totalFeedback,
    totalContacts,
    totalSeasons,
  };
};

/**
 * Get public stats for home page
 * Calculates: verified vendors, cities covered, average rating
 */
exports.getPublicStats = async () => {
  try {
    // Get verified vendors (total shops)
    const verifiedVendors = await shopRepo.countDocument();
    
    // Get cities covered
    const citiesCovered = await cityRepo.countDocument();
    
    // Calculate average rating from feedback
    const allFeedback = await Feedback.find({}, "rating");
    
    // Convert text ratings to numeric values
    const ratingMap = {
      "Excellent": 5,
      "Good": 4,
      "Average": 3,
      "Poor": 2,
      "Very Poor": 1
    };
    
    let totalRating = 0;
    let ratingCount = 0;
    
    allFeedback.forEach(feedback => {
      if (feedback.rating && ratingMap[feedback.rating]) {
        totalRating += ratingMap[feedback.rating];
        ratingCount++;
      }
    });
    
    // Calculate average rating
    let averageRating = "4.9"; // Default if no feedback
    if (ratingCount > 0) {
      const avg = totalRating / ratingCount;
      averageRating = avg.toFixed(1);
    }
    
    // Quality checks - 100% for now, can be customized
    const qualityChecks = "100%";
    
    return {
      verifiedVendors: verifiedVendors || 0,
      citiesCovered: citiesCovered || 0,
      averageRating: averageRating,
      qualityChecks: qualityChecks
    };
  } catch (error) {
    console.error("Error calculating public stats:", error);
    // Return default values on error
    return {
      verifiedVendors: 0,
      citiesCovered: 0,
      averageRating: "4.9",
      qualityChecks: "100%"
    };
  }
};
