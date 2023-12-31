const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../../config/dbConfig');
const { config } = require('../../config/envConfig');
const router = express.Router();

const authenticate = require('../middlewares/auth');

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const estate = 'active';
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1 AND estate = $2',
      [username, estate]
    );
    const user = result.rows[0];
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, config.jwt_secret, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, role: user.role });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/verify-token
// @desc    Verify if the token is still valid
// @access  Public
router.post('/logout', authenticate, async (req, res) => {
  try {
    const bearerHeader = req.header('Authorization');
    if (!bearerHeader)
      return res.status(401).json({ msg: 'No token, authorization denied' });

    const token = bearerHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwt_secret);

    const expiryDate = new Date(decoded.exp * 1000);
    await pool.query(
      'INSERT INTO blacklisted_tokens (token, expiry_date) VALUES ($1, $2)',
      [token, expiryDate]
    );

    res.json({ msg: 'Logged out successfully' });
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ msg: 'Token has expired' });
    } else if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ msg: 'Invalid token' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET api/auth/verify-token
// @desc    Verify if the token is still valid
// @access  Public
router.get('/verify-token', async (req, res) => {
  try {
    const bearerHeader = req.header('Authorization');
    if (!bearerHeader)
      return res.status(401).json({ msg: 'No token, authorization denied' });

    const token = bearerHeader.split(' ')[1];
    const isBlacklisted = await pool.query(
      'SELECT * FROM blacklisted_tokens WHERE token = $1',
      [token]
    );
    if (isBlacklisted.rows.length > 0)
      return res.status(401).json({ msg: 'Token is blacklisted' });

    jwt.verify(token, config.jwt_secret);

    res.json({ msg: 'Token is valid' }).status(200);
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ msg: 'Token has expired' });
    } else if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ msg: 'Invalid token' });
    }
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
