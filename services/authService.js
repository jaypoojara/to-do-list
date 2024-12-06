import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../models/index.js';

const { User } = db;

/**
 * Registers a new user.
 * @param {Object} userData - The user data for registration.
 * @returns {Object} - The newly created user.
 * @throws {Error} - If the username already exists or there is another issue.
 */
export const registerUser = async (userData) => {
  const { username, password } = userData;

  const existingUser = await User.findOne({ where: { username } });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return await User.create({ username, password: hashedPassword });
};

/**
 * Logs in a user by validating credentials and generating a JWT.
 * @param {Object} credentials - The username and password.
 * @returns {Object} - The JWT token.
 * @throws {Error} - If the username or password is incorrect.
 */
export const loginUser = async (credentials) => {
  const { username, password } = credentials;

  const user = await User.findOne({ where: { username } });
  if (!user) {
    throw new Error('Invalid username or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid username or password');
  }

  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_TOKEN_SECRET, {
    expiresIn: '1h',
  });

  return { token, user: {
      username: user.username
    }
  };
};
