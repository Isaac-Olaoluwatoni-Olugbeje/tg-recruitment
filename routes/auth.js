const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/users');
const Admin = require('../models/admins');
const Operator = require('../models/operators');
const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
    const { email, password, authorization_level } = req.body;
  
    try {
      // Check if username already exists
      const existingEmail = await User.getUserByEmail(email);
      if (existingEmail !== null) {
        return res.status(409).send('Email already taken');
      }
  
      // Hash password and create new user
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      const user = await User.createUser(email, hash, authorization_level);
  
      // Generate JWT token for authentication
      const token = jwt.sign({userId: user.id}, 'root', {expiresIn: '1d'});
      res.json({user, token});
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    }
  });
  

// Login route for users
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists and password is correct
    const user = await User.getUserByEmail(email);
    if (!user) {
      return res.status(401).send('Invalid email or password');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send('Invalid username or password');
    }

    // Generate and send new token
    const token = jwt.sign({ userId: user.id }, 'root', { expiresIn: '1d' });
    res.json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
  });

// Login route for operators
router.post('/operator/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if user exists and password is correct
    const user = await Operator.getOperatorByEmail(email);
    if (!user) {
      return res.status(401).send('Invalid email or password');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send('Invalid username or password');
    }

    operator = {id: user.id, email: user.email, auth_level: user.auth_level}

    // Generate and send new token
    const token = jwt.sign({ userId: user.id, authorizationLevel: user.auth_level }, 'root', { expiresIn: '1d' });
    res.json({ operator, token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

// Login route for admins
router.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if user exists and password is correct
    const user = await Admin.getAdminByEmail(email);
    if (!user) {
      return res.status(401).send('Invalid email or password');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send('Invalid username or password');
    }

    admin = {id: user.id, email: user.email, auth_level: user.auth_level}

    // Generate and send new token
    const token = jwt.sign({ userId: user.id, authorizationLevel: user.auth_level }, 'root', { expiresIn: '1d' });
    res.json({ admin, token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

// Logout route
router.get('/logout', (req, res) => {
  req.logout();
  res.send('Logged out successfully');
});
  
  
module.exports = router;