const cron = require("node-cron");
const User = require("../models/user"); 
const Notification = require("../models/notifications"); 

// Schedule a job every 2 minutes
cron.schedule("*/2 * * * *", async () => {
    console.log("Running notification job...");

    try {
        // Find specific users by email
        const users = await User.find({
            email: { $in: ["princeprincess1222@gmail.com", "t67073957@gmail.com"] }
        });

        for (let user of users) {
            // Create a notification
            await Notification.create({
                userId: user._id,
                message: "This is a test notification from the cron job!",
            });

            console.log(`Notification sent to ${user.email}`);
        }
    } catch (error) {
        console.error("Error sending notifications:", error);
    }
});
