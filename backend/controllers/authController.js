// backend/controllers/authcontroller.js
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user
    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    // Save the user to the database
    await user.save();

    // Generate a JWT token
    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET, // Use your JWT secret from environment variables
      { expiresIn: '1h' } // Set the token to expire in 1 hour
    );

    // Send response with token and user data (excluding password)
    const { password: _, ...userData } = user._doc;
    res.status(201).json({
      message: 'Registration successful',
      token,  // Send the JWT token to the frontend
      user: userData
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// backend/controllers/authcontroller.js
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate JWT token
    const token = jwt.sign(
      { _id: user._id, email: user.email, role: user.role }, // Add role in JWT payload
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { name: user.name, email: user.email, role: user.role }  // Send the role
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { register, login };
