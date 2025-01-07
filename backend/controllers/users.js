const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer'); 

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    // const transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     user: process.env.EMAIL,
    //     pass: process.env.EMAIL_PASSWORD,
    //   },
    //   tls: {
    //     rejectUnauthorized: false, // Can help if there are issues with SSL certificates
    //   },
    // });
    // // Setup email data
    // const emailData = {
    //   from: process.env.EMAIL, // Sender's email
    //   to: "princeprincess1222@gmail.com", 
    //   subject: "Welcome to Our Platform!",
    //   text: `Hello ${name},\n\nWelcome to our platform. Your account has been successfully created.\n\nBest regards,\nTeam`,
    // };

    // // Send the email
    // transporter.sendMail(emailData, (error, info) => {
    //   if (error) {
    //     console.error("Error sending email:", error);
    //   } else {
    //     console.log("Email sent successfully:", info.response);
    //   }
    // });

    const token = jwt.sign({ id: user._id }, process.env.SECRET);
    res.status(201).json({
      message: "User created successfully",
      token,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: `Error creating user` });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.id;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: `Error deleting user` });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json({ users });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error getting all users" });
  }
};
const updateUser = async (req, res) => {
  try {
    const { name } = req.body;
    const id = req.id;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User updated successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: `Error updating user` });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const samePassword = await bcrypt.compare(password, user.password);

    if (!samePassword) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.SECRET
    );

    res.status(200).json({ message: "Login successfully", token: token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error logging in user" });
  }
};

module.exports = { createUser, updateUser, deleteUser, loginUser, getAllUsers };
