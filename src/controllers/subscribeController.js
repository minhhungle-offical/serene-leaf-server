import Subscribe from "../models/Subscribe.js";

// POST /api/subscribe
export const createSubscription = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required." });
    }

    const existing = await Subscribe.findOne({
      email: email.toLowerCase().trim(),
    });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "Email is already subscribed." });
    }

    const subscription = new Subscribe({ email });
    await subscription.save();

    res.status(201).json({
      success: true,
      message: "Subscription successful!",
      data: subscription,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/subscribe
export const getSubscriptions = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page)) || 1;
    const limit = Math.min(100, parseInt(req.query.limit)) || 10; // max limit 100
    const skip = (page - 1) * limit;

    const total = await Subscribe.countDocuments();

    const totalPages = Math.ceil(total / limit);

    const subscriptions = await Subscribe.find()
      .sort({ subscribedAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: {
        items: subscriptions,
        meta: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching subscriptions",
      error: error.message,
    });
  }
};
