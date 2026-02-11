const feedbackService = require("../services/feedback");
const catchAsync = require("../util/catch-async");

/**
 * @desc    Create feedback
 * @route   POST /api/v1/feedback
 * @access  Private (User)
 */
exports.createFeedback = catchAsync(async (req, res) => {
  const feedback = await feedbackService.createFeedback(req.user.id, req.body);

  res.status(201).json({
    status: "success",
    data: { feedback },
  });
});

/**
 * @desc    Get all feedback
 * @route   GET /api/v1/feedback
 * @access  Public
 */
exports.getAllFeedback = catchAsync(async (req, res) => {
  const feedbacks = await feedbackService.getAllFeedback();

  res.status(200).json({
    status: "success",
    results: feedbacks.length,
    data: { feedbacks },
  });
});

/**
 * @desc    Get feedback by ID
 * @route   GET /api/v1/feedback/:id
 * @access  Public
 */
exports.getFeedbackById = catchAsync(async (req, res) => {
  const feedback = await feedbackService.getFeedbackById(req.params.id);

  res.status(200).json({
    status: "success",
    data: { feedback },
  });
});

/**
 * @desc    Delete feedback by ID
 * @route   DELETE /api/v1/feedback/:id
 * @access  Private (Admin/User who created)
 */
exports.deleteFeedback = catchAsync(async (req, res) => {
  await feedbackService.deleteFeedback(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});
