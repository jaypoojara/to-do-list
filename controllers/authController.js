const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User} = require('../models');


const createUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Check if username already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await User.create({
      username,
      password: hashedPassword,
    });

    res.status(201).json({
      message: 'User created successfully',
      user: { id: newUser.id, username: newUser.username },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
}

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      'jaypoojara', // Replace with a secure secret key
      { expiresIn: '1h' } // Token expiration time
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        username: user.username,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

module.exports = { createUser, loginUser };
