const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../../config/dbConfig')
const { config }= require('../../config/envConfig')
const router = express.Router();

const authenticate = require('../middlewares/auth');


// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
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


router.post('/logout' ,authenticate,async (req, res) => {
  try {
    const bearerHeader = req.header('Authorization');
    if (!bearerHeader) return res.status(401).json({ msg: 'No token, authorization denied' });

    const token = bearerHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwt_secret);

    const expiryDate = new Date(decoded.exp * 1000);
    await pool.query('INSERT INTO blacklisted_tokens (token, expiry_date) VALUES ($1, $2)', [token, expiryDate]);

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


  

module.exports = router;
