const User = require("../models/user");
const Friend = require("../models/friend");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");


// Nodemailer configuration
const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "25bed6a3c8634e",
    pass: "e9a0c129034e01"
  }
});


const createUser = async (req, res) => {
  try {
    const { name, email, password, image } = req.body;

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
    const user = new User({ name, email, password: hashedPassword, image, role: "user" });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.SECRET);

    // Send welcome email
    // await transport.sendMail({
    //   from: '"Your Blog" <no-reply@t67073957@gmail.com>', // Sender address
    //   to: email,
    //   subject: "Welcome to Our Blog!", // Subject
    //   html: `<h2>Hello, ${name}!</h2><p>Welcome to our blog. We're excited to have you here!</p>`, // HTML body
    // });

    res.status(201).json({
      message: "User created successfully, welcome email sent",
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

const userSearch = async (req, res) => {
  try {
    const { searchTerm } = req.query;
    const userId = req.id;

    if (!searchTerm) {
      return res.status(400).json({ message: "Please provide a search term" });
    }

    // Fetch all friend connections (both accepted and pending) in one query
    const friends = await Friend.find({
      users: userId,
      status: { $in: ["pending", "accepted"] },
    }).select("users");

    // Extract unique friend IDs while excluding the current user
    const excludedIds = new Set([
      userId.toString(),
      ...friends.flatMap((friend) =>
        friend.users.filter((id) => id.toString() !== userId.toString())
      ),
    ]);

    // Search for users excluding friends and pending connections
    const users = await User.find(
      {
        _id: { $nin: Array.from(excludedIds) },
        $or: [
          { name: new RegExp(searchTerm, "i") },
          { email: new RegExp(searchTerm, "i") },
        ],
      },
      "name image role"
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found matching the search query" });
    }

    res.status(200).json({ users });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error searching users" });
  }
};





module.exports = {
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  getAllUsers,
  userSearch,
};
