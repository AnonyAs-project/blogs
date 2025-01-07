const express = require("express");

const router = express.Router();

const {
    getUserNotifications,
    updateNotification
} = require("../controllers/notifications");

router.get("/", getUserNotifications);
router.put("/:id", updateNotification);


module.exports = router;
