const jwt = require('jsonwebtoken');
const pool = require('../../config/dbConfig');


const authenticate = async (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    // Verificar si el token está en la lista negra
    const isBlacklisted = await pool.query('SELECT * FROM blacklisted_tokens WHERE token = $1', [token]);
    if (isBlacklisted.rows.length > 0) return res.status(401).json({ msg: 'Token is blacklisted' });

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = authenticate;