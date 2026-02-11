const feedbackRepo = require("../repository/feedback");
const AppError = require("../util/app-errors");
exports.createFeedback = async (userId, feedbackData) => {
  if (!feedbackData || Object.keys(feedbackData).length === 0) {
    throw new AppError("Please provide feedback data", 400);
  }
  const feedback = await feedbackRepo.create({
    user: userId,
    type: feedbackData.type,
    rating: feedbackData.rating,
    message: feedbackData.message,
  });
  return feedback;
};
exports.getAllFeedback = async () => {
  const feedbacks = await feedbackRepo.findAll();
  if (!feedbacks) {
    throw new AppError("No feedbacks available", 404);
  }
  return feedbacks;
};
exports.getFeedbackById = async (id) => {
  const feedback = await feedbackRepo.findById(id);
  if (!feedback) {
    throw new AppError(`No feedback found with ID ${id}`, 404);
  }
  return feedback;
};
exports.deleteFeedback = async (id) => {
  const feedback = await feedbackRepo.deleteById(id);
  if (!feedback) {
    throw new AppError(`No feedback found with ID ${id}`, 404);
  }
  return feedback;
};
