const UserModel = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config(); 

const JWT_SECRET = process.env.SECRET_KEY; 

console.log('DEBUG (userController.js): JWT_SECRET loaded:', JWT_SECRET ? 'Loaded (Length: ' + JWT_SECRET.length + ')' : 'NOT LOADED or EMPTY');

const userController = {
  async login(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
      const user = await UserModel.authenticate(username, password);
      if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      console.log('DEBUG (userController.js): User authenticated:', user);

      const token = jwt.sign(
        { id: user.id, username: user.username }, 
        JWT_SECRET, 
        { expiresIn: '2h' } 
      );
      
      console.log('DEBUG (userController.js): Token generated for user:', user.username, 'Token starts with:', token.substring(0, 20) + '...');

      res.json({ message: 'Login successful', token });
    } catch (err) {
      console.error('ERROR (userController.js): Login error:', err);
      res.status(500).json({ message: 'Internal server error during login' });
    }
  },

  async register(req, res) {
    const { username, password, confirmPassword } = req.body;

    // Validasi input
    if (!username || !password || !confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Validasi panjang username
    if (username.length < 3) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username must be at least 3 characters long' 
      });
    }

    // Validasi panjang password
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters long' 
      });
    }

    // Validasi password match
    if (password !== confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Passwords do not match' 
      });
    }

    try {
      // Cek apakah username sudah ada
      const userExists = await UserModel.usernameExists(username);
      if (userExists) {
        return res.status(409).json({ 
          success: false, 
          message: 'Username already exists' 
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Simpan user baru
      const newUser = await UserModel.createUser(username, hashedPassword);

      console.log('DEBUG (userController.js): New user registered:', username);

      // Generate token untuk auto-login setelah register
      const token = jwt.sign(
        { id: newUser.id, username: newUser.username }, 
        JWT_SECRET, 
        { expiresIn: '2h' } 
      );

      res.status(201).json({ 
        success: true, 
        message: 'Registration successful', 
        token,
        user: {
          id: newUser.id,
          username: newUser.username
        }
      });
    } catch (err) {
      console.error('ERROR (userController.js): Registration error:', err);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error during registration' 
      });
    }
  },

  logout(req, res) {
    res.json({ message: 'Logged out (client-side only)' });
  }
};

module.exports = userController;