const Notification = require("../models/notifications");

const getUserNotifications = async (req, res) => {
  try {
    const userId = req.id;
    const notifications = await Notification.find({
      receiver: userId,
      deleted: { $ne: true },
    })
      .populate("sender")
      .sort({ createdAt: -1 });

    res.status(200).json({ notifications });
  } catch (err) {
    console.error(err); // Log any errors
    res.status(500).json({ message: "Error getting notifications" });
  }
};

const updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { read } = req.body;

    if (read === undefined) {
      return res
        .status(400)
        .json({ message: "No valid fields provided to update." });
    }

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    if (notification.receiver.toString() !== req.id) {
      return res.status(403).json({
        message: "You are not authorized to update this notification.",
      });
    }

    notification.read = read !== undefined ? read : notification.read;

    await notification.save();

    res
      .status(200)
      .json({ message: "Notification updated successfully.", notification });
  } catch (err) {
    console.error("Error updating notification:", err);
    res.status(500).json({ message: "Error updating notification." });
  }
};

module.exports = {
  getUserNotifications,
  updateNotification,
};
