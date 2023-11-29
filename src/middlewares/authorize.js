const pool = require('../../config/dbConfig');

const authorize = (roles) => {
  return async (req, res, next) => {
    try {
      // Obtener el usuario del token
      const userId = req.user.id;
      const result = await pool.query('SELECT role FROM users WHERE id = $1', [
        userId,
      ]);
      const user = result.rows[0];

      // Verificar si el usuario tiene un rol permitido
      if (!roles.includes(user.role)) {
        return res.status(403).json({
          msg: 'Access Denied: You do not have sufficient permissions',
        });
      }
      next();
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
  };
};

module.exports = authorize;