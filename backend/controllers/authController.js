import User from '../models/User.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Notification from "../models/Notification.js";


// REGISTER USER
export const registerUser = async (req, res) => {
  try {

    console.log("📩 Register request body:", req.body);

    const { name, email, password, role } = req.body;

    // VALIDATION
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    // CHECK EXISTING USER
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // HASH PASSWORD
    const hashedPassword = await bcryptjs.hash(password, 10);

    // CREATE USER
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "client"
    });

    // CREATE NOTIFICATION
    await Notification.create({
      message: `🎉 New user registered: ${newUser.name}`
    });

    // GENERATE TOKEN
    const token = jwt.sign(
      {
        id: newUser._id,
        role: newUser.role
      },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "7d"
      }
    );

    // RESPONSE
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {

    console.error("❌ Register error:", error);

    res.status(500).json({
      message: error.message
    });
  }
};


// LOGIN USER
export const loginUser = async (req, res) => {
  try {

    console.log("📩 Login request body:", req.body);

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const isPasswordValid = await bcryptjs.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid password'
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET || 'secret',
      {
        expiresIn: '7d'
      }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {

    console.error("❌ Login error:", error);

    res.status(500).json({
      message: error.message
    });
  }
};

// change Password

export const changePassword = async (req, res) => {

  try {

    const { oldPassword, newPassword } = req.body;

    const userId = req.body.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const isMatch = await bcryptjs.compare(
      oldPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Old password incorrect"
      });
    }

    const hashedPassword =
      await bcryptjs.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    res.json({
      success: true,
      message: "Password updated"
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });
  }
};

export const forgotPassword = async (req, res) => {

  try {

    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {

      return res.status(404).json({
        message: "User not found"
      });
    }

    const hashedPassword =
      await bcryptjs.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    res.json({
      success: true,
      message: "Password reset successful"
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });
  }
};
