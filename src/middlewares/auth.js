const jwt = require('jsonwebtoken');
const pool = require('../../config/dbConfig');


const authenticate = async (req, res, next) => {
  const bearerHeader = req.header('Authorization');
    
  if (!bearerHeader) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    // Verificar si el token está en la lista negra
    const token = bearerHeader.split(' ')[1];
    const isBlacklisted = await pool.query('SELECT * FROM blacklisted_tokens WHERE token = $1', [token]);
    if (isBlacklisted.rows.length > 0) return res.status(401).json({ msg: 'Token is blacklisted' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = authenticate;